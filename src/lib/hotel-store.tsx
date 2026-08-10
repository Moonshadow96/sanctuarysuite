import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  seedRooms,
  seedReservations,
  seedOrders,
  seedFacilityBookings,
  seedEvents,
  seedStaff,
  seedInventory,
  seedNotifications,
  menuItems as seedMenu,
  roomTypeById,
  type Charge,
  type EventInquiry,
  type EventStatus,
  type FacilityBooking,
  type InventoryItem,
  type MenuItem,
  type Notification,
  type OrderLine,
  type OrderStatus,
  type Reservation,
  type ReservationStatus,
  type RestaurantOrder,
  type Room,
  type RoomStatus,
  type HousekeepingStatus,
  type StaffMember,
} from "./hotel-data";

const STORAGE_KEY = "splendid-sanctuary-state-v1";

export interface StaffSession {
  name: string;
  role: string;
  email: string;
}

interface HotelState {
  rooms: Room[];
  reservations: Reservation[];
  orders: RestaurantOrder[];
  facilityBookings: FacilityBooking[];
  events: EventInquiry[];
  staff: StaffMember[];
  inventory: InventoryItem[];
  notifications: Notification[];
  menu: MenuItem[];
  session: StaffSession | null;
  guestReference: string | null;
}

const initialState: HotelState = {
  rooms: seedRooms,
  reservations: seedReservations,
  orders: seedOrders,
  facilityBookings: seedFacilityBookings,
  events: seedEvents,
  staff: seedStaff,
  inventory: seedInventory,
  notifications: seedNotifications,
  menu: seedMenu,
  session: null,
  guestReference: null,
};

const nowISO = () => new Date().toISOString().slice(0, 10);
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export interface NewReservationInput {
  guestName: string;
  email: string;
  phone: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  extras: string[];
  total: number;
  requests?: string;
}

interface HotelContextValue extends HotelState {
  createReservation: (input: NewReservationInput) => Reservation;
  assignRoom: (reservationId: string, roomNumber: string) => void;
  checkIn: (reservationId: string) => void;
  checkOut: (reservationId: string) => void;
  cancelReservation: (reservationId: string) => void;
  setReservationStatus: (reservationId: string, status: ReservationStatus) => void;
  setRoomStatus: (roomId: string, status: RoomStatus) => void;
  setHousekeeping: (roomId: string, status: HousekeepingStatus, assignedTo?: string) => void;
  placeOrder: (input: {
    source: "room-service" | "restaurant";
    roomNumber?: string;
    table?: string;
    guestName: string;
    lines: OrderLine[];
  }) => RestaurantOrder;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  addFacilityBooking: (input: Omit<FacilityBooking, "id">) => void;
  addEventInquiry: (input: Omit<EventInquiry, "id" | "status">) => EventInquiry;
  setEventStatus: (id: string, status: EventStatus) => void;
  adjustInventory: (id: string, delta: number) => void;
  markNotificationsRead: () => void;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
  setGuestReference: (reference: string | null) => void;
  reset: () => void;
}

const HotelContext = createContext<HotelContextValue | null>(null);

export function HotelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HotelState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as Partial<HotelState>) });
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const notify = (title: string, body: string, audience: "staff" | "guest" = "staff") => ({
    id: uid("n"),
    audience,
    title,
    body,
    at: nowISO(),
    read: false,
  });

  const createReservation = useCallback((input: NewReservationInput) => {
    const reference = `SS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    let created: Reservation | null = null;

    setState((prev) => {
      const room = prev.rooms.find(
        (r) => r.typeId === input.roomTypeId && r.status === "available",
      );
      const reservation: Reservation = {
        id: uid("res"),
        reference,
        guestName: input.guestName,
        email: input.email,
        phone: input.phone,
        roomTypeId: input.roomTypeId,
        roomNumber: room?.number,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
        nights: input.nights,
        extras: input.extras,
        total: input.total,
        status: "confirmed",
        payment: "paid",
        requests: input.requests,
        charges: [
          {
            id: uid("c"),
            label: `Accommodation · ${input.nights} night${input.nights > 1 ? "s" : ""}`,
            category: "room",
            amount: (roomTypeById(input.roomTypeId)?.price ?? 0) * input.nights,
            at: input.checkIn,
          },
        ],
        createdAt: nowISO(),
      };
      created = reservation;

      return {
        ...prev,
        reservations: [reservation, ...prev.reservations],
        rooms: room
          ? prev.rooms.map((r) =>
              r.id === room.id
                ? { ...r, status: "reserved" as RoomStatus, guestName: input.guestName }
                : r,
            )
          : prev.rooms,
        notifications: [
          notify(
            "New reservation",
            `${input.guestName} · ${roomTypeById(input.roomTypeId)?.name ?? "Room"}${room ? ` · Room ${room.number}` : ""}`,
          ),
          ...prev.notifications,
        ],
        guestReference: reference,
      };
    });

    return created as unknown as Reservation;
  }, []);

  const assignRoom = useCallback((reservationId: string, roomNumber: string) => {
    setState((prev) => ({
      ...prev,
      reservations: prev.reservations.map((r) =>
        r.id === reservationId ? { ...r, roomNumber } : r,
      ),
      rooms: prev.rooms.map((r) =>
        r.number === roomNumber
          ? {
              ...r,
              status: "reserved" as RoomStatus,
              guestName: prev.reservations.find((x) => x.id === reservationId)?.guestName,
            }
          : r,
      ),
    }));
  }, []);

  const checkIn = useCallback((reservationId: string) => {
    setState((prev) => {
      const reservation = prev.reservations.find((r) => r.id === reservationId);
      if (!reservation) return prev;
      return {
        ...prev,
        reservations: prev.reservations.map((r) =>
          r.id === reservationId ? { ...r, status: "checked-in" as ReservationStatus } : r,
        ),
        rooms: prev.rooms.map((r) =>
          r.number === reservation.roomNumber
            ? { ...r, status: "occupied" as RoomStatus, guestName: reservation.guestName }
            : r,
        ),
        notifications: [
          notify("Guest checked in", `${reservation.guestName} · Room ${reservation.roomNumber ?? "—"}`),
          ...prev.notifications,
        ],
      };
    });
  }, []);

  const checkOut = useCallback((reservationId: string) => {
    setState((prev) => {
      const reservation = prev.reservations.find((r) => r.id === reservationId);
      if (!reservation) return prev;
      return {
        ...prev,
        reservations: prev.reservations.map((r) =>
          r.id === reservationId
            ? { ...r, status: "checked-out" as ReservationStatus, payment: "paid" as const }
            : r,
        ),
        rooms: prev.rooms.map((r) =>
          r.number === reservation.roomNumber
            ? {
                ...r,
                status: "cleaning" as RoomStatus,
                housekeeping: "dirty" as HousekeepingStatus,
                guestName: undefined,
              }
            : r,
        ),
        notifications: [
          notify("Checkout complete", `${reservation.guestName} · invoice issued`),
          ...prev.notifications,
        ],
      };
    });
  }, []);

  const cancelReservation = useCallback((reservationId: string) => {
    setState((prev) => {
      const reservation = prev.reservations.find((r) => r.id === reservationId);
      return {
        ...prev,
        reservations: prev.reservations.map((r) =>
          r.id === reservationId ? { ...r, status: "cancelled" as ReservationStatus } : r,
        ),
        rooms: prev.rooms.map((r) =>
          r.number === reservation?.roomNumber && r.status === "reserved"
            ? { ...r, status: "available" as RoomStatus, guestName: undefined }
            : r,
        ),
      };
    });
  }, []);

  const setReservationStatus = useCallback((reservationId: string, status: ReservationStatus) => {
    setState((prev) => ({
      ...prev,
      reservations: prev.reservations.map((r) => (r.id === reservationId ? { ...r, status } : r)),
    }));
  }, []);

  const setRoomStatus = useCallback((roomId: string, status: RoomStatus) => {
    setState((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) => (r.id === roomId ? { ...r, status } : r)),
    }));
  }, []);

  const setHousekeeping = useCallback(
    (roomId: string, status: HousekeepingStatus, assignedTo?: string) => {
      setState((prev) => ({
        ...prev,
        rooms: prev.rooms.map((r) => {
          if (r.id !== roomId) return r;
          const roomStatus: RoomStatus =
            status === "ready"
              ? r.status === "occupied"
                ? "occupied"
                : "available"
              : status === "maintenance"
                ? "maintenance"
                : status === "cleaning"
                  ? r.status === "occupied"
                    ? "occupied"
                    : "cleaning"
                  : r.status;
          return {
            ...r,
            housekeeping: status,
            status: roomStatus,
            assignedTo: assignedTo ?? r.assignedTo,
            lastCleaned: status === "ready" ? nowISO() : r.lastCleaned,
          };
        }),
      }));
    },
    [],
  );

  const placeOrder = useCallback(
    (input: {
      source: "room-service" | "restaurant";
      roomNumber?: string;
      table?: string;
      guestName: string;
      lines: OrderLine[];
    }) => {
      const total = input.lines.reduce((sum, l) => sum + l.price * l.qty, 0);
      const order: RestaurantOrder = {
        id: uid("ord"),
        source: input.source,
        roomNumber: input.roomNumber,
        table: input.table,
        guestName: input.guestName,
        lines: input.lines,
        total,
        status: "new",
        placedAt: nowISO(),
      };

      setState((prev) => {
        const reservation = prev.reservations.find(
          (r) => r.roomNumber === input.roomNumber && r.status === "checked-in",
        );
        const charge: Charge = {
          id: uid("c"),
          label: `Room service · ${input.lines.map((l) => l.name).join(", ")}`,
          category: "room-service",
          amount: total,
          at: nowISO(),
        };
        return {
          ...prev,
          orders: [{ ...order, reservationId: reservation?.id }, ...prev.orders],
          reservations: reservation
            ? prev.reservations.map((r) =>
                r.id === reservation.id ? { ...r, charges: [...r.charges, charge] } : r,
              )
            : prev.reservations,
          notifications: [
            notify(
              "New room-service order",
              `${input.roomNumber ? `Room ${input.roomNumber}` : (input.table ?? "Restaurant")} · ${input.lines.length} item(s)`,
            ),
            ...prev.notifications,
          ],
        };
      });

      return order;
    },
    [],
  );

  const setOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  }, []);

  const addFacilityBooking = useCallback((input: Omit<FacilityBooking, "id">) => {
    setState((prev) => {
      const reservation = prev.reservations.find(
        (r) => r.roomNumber === input.roomNumber && r.status === "checked-in",
      );
      const charge: Charge = {
        id: uid("c"),
        label: `${input.facility} · ${input.slot}`,
        category: "facility",
        amount: input.fee,
        at: input.date,
      };
      return {
        ...prev,
        facilityBookings: [{ ...input, id: uid("fb") }, ...prev.facilityBookings],
        reservations:
          reservation && input.fee > 0
            ? prev.reservations.map((r) =>
                r.id === reservation.id ? { ...r, charges: [...r.charges, charge] } : r,
              )
            : prev.reservations,
        notifications: [
          notify("Facility booking", `${input.facility} · ${input.guestName}`),
          ...prev.notifications,
        ],
      };
    });
  }, []);

  const addEventInquiry = useCallback((input: Omit<EventInquiry, "id" | "status">) => {
    const inquiry: EventInquiry = { ...input, id: uid("ev"), status: "new" };
    setState((prev) => ({
      ...prev,
      events: [inquiry, ...prev.events],
      notifications: [
        notify("New event inquiry", `${input.type} · ${input.guests} guests`),
        ...prev.notifications,
      ],
    }));
    return inquiry;
  }, []);

  const setEventStatus = useCallback((id: string, status: EventStatus) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === id ? { ...e, status } : e)),
    }));
  }, []);

  const adjustInventory = useCallback((id: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i,
      ),
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const known = email.trim().toLowerCase();
    if (!known.endsWith("@splendidsanctuary.com")) {
      return { ok: false, error: "Use your Sanctuary staff email address." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }
    const member = seedStaff.find((s) => s.contact.toLowerCase() === known);
    setState((prev) => ({
      ...prev,
      session: {
        name: member?.name ?? "Administrator",
        role: member?.role ?? "Administrator",
        email: known,
      },
    }));
    return { ok: true };
  }, []);

  const signOut = useCallback(() => setState((prev) => ({ ...prev, session: null })), []);

  const setGuestReference = useCallback(
    (reference: string | null) => setState((prev) => ({ ...prev, guestReference: reference })),
    [],
  );

  const reset = useCallback(() => {
    setState(initialState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const value = useMemo<HotelContextValue>(
    () => ({
      ...state,
      createReservation,
      assignRoom,
      checkIn,
      checkOut,
      cancelReservation,
      setReservationStatus,
      setRoomStatus,
      setHousekeeping,
      placeOrder,
      setOrderStatus,
      addFacilityBooking,
      addEventInquiry,
      setEventStatus,
      adjustInventory,
      markNotificationsRead,
      signIn,
      signOut,
      setGuestReference,
      reset,
    }),
    [
      state,
      createReservation,
      assignRoom,
      checkIn,
      checkOut,
      cancelReservation,
      setReservationStatus,
      setRoomStatus,
      setHousekeeping,
      placeOrder,
      setOrderStatus,
      addFacilityBooking,
      addEventInquiry,
      setEventStatus,
      adjustInventory,
      markNotificationsRead,
      signIn,
      signOut,
      setGuestReference,
      reset,
    ],
  );

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
}

export function useHotel() {
  const ctx = useContext(HotelContext);
  if (!ctx) throw new Error("useHotel must be used within HotelProvider");
  return ctx;
}

export function stockStatus(item: InventoryItem) {
  if (item.quantity === 0) return "out-of-stock" as const;
  if (item.quantity <= item.reorderAt) return "low-stock" as const;
  return "in-stock" as const;
}
