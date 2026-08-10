import heroImg from "@/assets/hero.jpg";
import welcomeImg from "@/assets/welcome.jpg";
import luxuryImg from "@/assets/room-luxury.jpg";
import deluxeImg from "@/assets/room-deluxe.jpg";
import executiveImg from "@/assets/room-executive.jpg";
import presidentialImg from "@/assets/room-presidential.jpg";

export const HOTEL = {
  name: "The Splendid Sanctuary",
  tagline: "Where Luxury Meets Tranquility",
  address: "22 Sanctuary Crescent, Park View Estate, Ikoyi, Lagos, Nigeria",
  phone: "+234 816 952 6523",
  email: "reservations@splendidsanctuary.com",
  hours: "Reception open 24 hours · Restaurant 07:00 – 23:00",
  currency: "₦",
};

export const images = {
  hero: heroImg,
  welcome: welcomeImg,
  luxury: luxuryImg,
  deluxe: deluxeImg,
  executive: executiveImg,
  presidential: presidentialImg,
};

export function money(amount: number) {
  return `${HOTEL.currency}${amount.toLocaleString("en-NG")}`;
}

/* ---------------------------------- types --------------------------------- */

export type RoomStatus = "available" | "reserved" | "occupied" | "cleaning" | "maintenance";
export type HousekeepingStatus = "ready" | "dirty" | "cleaning" | "inspected" | "maintenance";
export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "checked-in"
  | "checked-out"
  | "cancelled";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type OrderStatus = "new" | "preparing" | "ready" | "delivered";
export type EventStatus = "new" | "reviewing" | "confirmed" | "completed" | "cancelled";
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface RoomType {
  id: string;
  name: string;
  slug: string;
  short: string;
  description: string;
  price: number;
  capacity: number;
  size: string;
  bed: string;
  image: string;
  amenities: string[];
}

export interface Room {
  id: string;
  number: string;
  typeId: string;
  floor: number;
  rate: number;
  status: RoomStatus;
  housekeeping: HousekeepingStatus;
  guestName?: string | undefined;
  lastCleaned: string;
  assignedTo?: string | undefined;
}

export interface Charge {
  id: string;
  label: string;
  category: "room" | "restaurant" | "room-service" | "facility" | "other";
  amount: number;
  at: string;
}

export interface Reservation {
  id: string;
  reference: string;
  guestName: string;
  email: string;
  phone: string;
  roomTypeId: string;
  roomNumber?: string | undefined;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  extras: string[];
  total: number;
  status: ReservationStatus;
  payment: PaymentStatus;
  requests?: string | undefined;
  charges: Charge[];
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: "Breakfast" | "Mains" | "Small Plates" | "Desserts" | "Beverages";
  description: string;
  price: number;
  available: boolean;
}

export interface OrderLine {
  itemId: string;
  name: string;
  qty: number;
  price: number;
}

export interface RestaurantOrder {
  id: string;
  source: "room-service" | "restaurant";
  roomNumber?: string | undefined;
  table?: string | undefined;
  reservationId?: string | undefined;
  guestName: string;
  lines: OrderLine[];
  total: number;
  status: OrderStatus;
  placedAt: string;
}

export interface FacilityBooking {
  id: string;
  facility: string;
  guestName: string;
  roomNumber?: string | undefined;
  date: string;
  slot: string;
  guests: number;
  fee: number;
}

export interface EventInquiry {
  id: string;
  client: string;
  email: string;
  phone: string;
  type: string;
  date: string;
  guests: number;
  space: string;
  catering: string;
  services?: string | undefined;
  message?: string | undefined;
  status: EventStatus;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  contact: string;
  shift: string;
  status: "active" | "off-duty" | "leave";
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Housekeeping" | "Restaurant" | "Beverages" | "Wine";
  quantity: number;
  reorderAt: number;
  unitPrice: number;
  supplier: string;
}

export interface Notification {
  id: string;
  audience: "staff" | "guest";
  title: string;
  body: string;
  at: string;
  read: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  stayType: string;
  body: string;
}

export interface Offer {
  id: string;
  title: string;
  strapline: string;
  description: string;
  eligibility: string;
  validity: string;
  discount: string;
  image: string;
}

/* ---------------------------------- seed ---------------------------------- */

export const roomTypes: RoomType[] = [
  {
    id: "luxury",
    slug: "luxury-room",
    name: "Luxury Room",
    short: "Comfortable and elegant accommodation for a restful stay.",
    description:
      "A serene, softly lit retreat finished in warm neutrals with generous natural light. Designed for guests who want calm, comfort and everything close at hand.",
    price: 185000,
    capacity: 2,
    size: "32 m²",
    bed: "Queen bed",
    image: luxuryImg,
    amenities: [
      "Comfortable bed",
      "Ensuite bathroom",
      "Air conditioning",
      "Wi-Fi",
      "Smart TV",
      "Daily housekeeping",
      "Room service",
    ],
  },
  {
    id: "deluxe",
    slug: "deluxe-room",
    name: "Deluxe Room",
    short: "More spacious accommodation with enhanced amenities.",
    description:
      "Additional space, a reading corner and elevated finishes. The Deluxe Room suits longer stays and guests who appreciate a little more room to breathe.",
    price: 275000,
    capacity: 3,
    size: "44 m²",
    bed: "King bed",
    image: deluxeImg,
    amenities: [
      "Premium interior",
      "Comfortable bed",
      "Ensuite bathroom",
      "Wi-Fi",
      "Smart TV",
      "Mini refrigerator",
      "Air conditioning",
    ],
  },
  {
    id: "executive",
    slug: "executive-suite",
    name: "Executive Suite",
    short: "A spacious suite with separate living and sleeping areas.",
    description:
      "A suite arranged as two distinct spaces — a private bedroom and a lounge with a dedicated workspace — for guests balancing business and rest.",
    price: 425000,
    capacity: 3,
    size: "68 m²",
    bed: "King bed",
    image: executiveImg,
    amenities: [
      "King-size bed",
      "Living area",
      "Premium bathroom",
      "Smart TV",
      "Wi-Fi",
      "Room service",
      "Workspace",
    ],
  },
  {
    id: "presidential",
    slug: "presidential-suite",
    name: "Presidential Suite",
    short: "The highest level of accommodation at the Sanctuary.",
    description:
      "Our signature residence: a private lounge, dining area and expansive bathroom, with dedicated service arranged around your preferences.",
    price: 750000,
    capacity: 4,
    size: "112 m²",
    bed: "King bed + daybed",
    image: presidentialImg,
    amenities: [
      "Premium bedroom",
      "Spacious living area",
      "Luxury bathroom",
      "Private lounge",
      "Dining area",
      "Premium amenities",
      "Dedicated service",
    ],
  },
];

export const roomTypeById = (id: string) => roomTypes.find((t) => t.id === id);

const today = new Date();
const iso = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};
export const todayISO = iso(0);

export const seedRooms: Room[] = [
  { id: "r101", number: "101", typeId: "luxury", floor: 1, rate: 185000, status: "available", housekeeping: "ready", lastCleaned: iso(0) },
  { id: "r102", number: "102", typeId: "luxury", floor: 1, rate: 185000, status: "occupied", housekeeping: "dirty", guestName: "Adaeze Okonkwo", lastCleaned: iso(-1) },
  { id: "r103", number: "103", typeId: "luxury", floor: 1, rate: 185000, status: "cleaning", housekeeping: "cleaning", lastCleaned: iso(-1), assignedTo: "Grace Umeh" },
  { id: "r201", number: "201", typeId: "deluxe", floor: 2, rate: 275000, status: "available", housekeeping: "ready", lastCleaned: iso(0) },
  { id: "r202", number: "202", typeId: "deluxe", floor: 2, rate: 275000, status: "reserved", housekeeping: "ready", guestName: "Tunde Bakare", lastCleaned: iso(0) },
  { id: "r204", number: "204", typeId: "executive", floor: 2, rate: 425000, status: "available", housekeeping: "ready", lastCleaned: iso(0) },
  { id: "r301", number: "301", typeId: "executive", floor: 3, rate: 425000, status: "occupied", housekeeping: "dirty", guestName: "Helena Marsh", lastCleaned: iso(-2) },
  { id: "r401", number: "401", typeId: "presidential", floor: 4, rate: 750000, status: "maintenance", housekeeping: "maintenance", lastCleaned: iso(-3) },
];

export const seedReservations: Reservation[] = [
  {
    id: "res-1",
    reference: "SS-2026-00842",
    guestName: "Adaeze Okonkwo",
    email: "adaeze.okonkwo@example.com",
    phone: "+234 801 234 5678",
    roomTypeId: "luxury",
    roomNumber: "102",
    checkIn: iso(-1),
    checkOut: iso(2),
    guests: 2,
    nights: 3,
    extras: ["Breakfast"],
    total: 465000,
    status: "checked-in",
    payment: "paid",
    charges: [
      { id: "c1", label: "Accommodation · 3 nights", category: "room", amount: 435000, at: iso(-1) },
      { id: "c2", label: "Breakfast package", category: "other", amount: 30000, at: iso(-1) },
      { id: "c3", label: "Room service · Club sandwich", category: "room-service", amount: 12500, at: iso(0) },
    ],
    createdAt: iso(-8),
  },
  {
    id: "res-2",
    reference: "SS-2026-00851",
    guestName: "Tunde Bakare",
    email: "tunde.bakare@example.com",
    phone: "+234 802 987 6543",
    roomTypeId: "deluxe",
    roomNumber: "202",
    checkIn: iso(0),
    checkOut: iso(3),
    guests: 2,
    nights: 3,
    extras: ["Airport transfer"],
    total: 675000,
    status: "confirmed",
    payment: "paid",
    charges: [{ id: "c4", label: "Accommodation · 3 nights", category: "room", amount: 630000, at: iso(0) }],
    createdAt: iso(-5),
  },
  {
    id: "res-3",
    reference: "SS-2026-00857",
    guestName: "Helena Marsh",
    email: "helena.marsh@example.com",
    phone: "+44 7700 900123",
    roomTypeId: "executive",
    roomNumber: "301",
    checkIn: iso(-2),
    checkOut: iso(1),
    guests: 1,
    nights: 3,
    extras: [],
    total: 1020000,
    status: "checked-in",
    payment: "paid",
    charges: [
      { id: "c5", label: "Accommodation · 3 nights", category: "room", amount: 1020000, at: iso(-2) },
      { id: "c6", label: "Snooker lounge · 1 hour", category: "facility", amount: 8000, at: iso(-1) },
    ],
    createdAt: iso(-14),
  },
  {
    id: "res-4",
    reference: "SS-2026-00861",
    guestName: "Chidi Nwosu",
    email: "chidi.nwosu@example.com",
    phone: "+234 803 111 2222",
    roomTypeId: "presidential",
    checkIn: iso(4),
    checkOut: iso(7),
    guests: 3,
    nights: 3,
    extras: ["Celebration package"],
    total: 1935000,
    status: "pending",
    payment: "pending",
    charges: [],
    createdAt: iso(-1),
  },
  {
    id: "res-5",
    reference: "SS-2026-00833",
    guestName: "Marina Alvarez",
    email: "marina.alvarez@example.com",
    phone: "+34 600 111 222",
    roomTypeId: "deluxe",
    roomNumber: "201",
    checkIn: iso(-6),
    checkOut: iso(-3),
    guests: 2,
    nights: 3,
    extras: ["Breakfast"],
    total: 660000,
    status: "checked-out",
    payment: "paid",
    charges: [{ id: "c7", label: "Accommodation · 3 nights", category: "room", amount: 630000, at: iso(-6) }],
    createdAt: iso(-20),
  },
];

export const menuItems: MenuItem[] = [
  { id: "m1", name: "Sanctuary Breakfast", category: "Breakfast", description: "Eggs your way, seasonal fruit, pastries and fresh juice.", price: 15000, available: true },
  { id: "m2", name: "Spiced Yam & Pepper Sauce", category: "Breakfast", description: "Roasted yam with slow-cooked pepper sauce.", price: 9500, available: true },
  { id: "m3", name: "Grilled Sea Bass", category: "Mains", description: "Citrus butter, charred greens, herbed potatoes.", price: 28000, available: true },
  { id: "m4", name: "Jollof & Suya Beef", category: "Mains", description: "Smoky jollof rice with spiced grilled beef.", price: 24000, available: true },
  { id: "m5", name: "Club Sandwich", category: "Small Plates", description: "Triple-stacked with fries — a room service favourite.", price: 12500, available: true },
  { id: "m6", name: "Chef's Salad", category: "Small Plates", description: "Garden leaves, avocado, toasted seeds.", price: 11000, available: true },
  { id: "m7", name: "Vanilla Custard Tart", category: "Desserts", description: "Butter pastry, burnt vanilla cream.", price: 8500, available: true },
  { id: "m8", name: "Sanctuary Mocktail", category: "Beverages", description: "Hibiscus, ginger, citrus and mint.", price: 6500, available: true },
  { id: "m9", name: "Reserve Red Wine (glass)", category: "Beverages", description: "From our curated cellar selection.", price: 9000, available: true },
  { id: "m10", name: "Fresh Pressed Juice", category: "Beverages", description: "Pineapple, orange or watermelon.", price: 5000, available: true },
];

export const seedOrders: RestaurantOrder[] = [
  {
    id: "ord-1",
    source: "room-service",
    roomNumber: "102",
    reservationId: "res-1",
    guestName: "Adaeze Okonkwo",
    lines: [{ itemId: "m5", name: "Club Sandwich", qty: 1, price: 12500 }],
    total: 12500,
    status: "delivered",
    placedAt: iso(0),
  },
  {
    id: "ord-2",
    source: "restaurant",
    table: "T4",
    guestName: "Walk-in guest",
    lines: [
      { itemId: "m3", name: "Grilled Sea Bass", qty: 2, price: 28000 },
      { itemId: "m8", name: "Sanctuary Mocktail", qty: 2, price: 6500 },
    ],
    total: 69000,
    status: "preparing",
    placedAt: iso(0),
  },
];

export const facilities = [
  {
    id: "pool",
    name: "Swimming Pool",
    blurb: "Take a refreshing break in our peaceful pool environment, designed for relaxation and leisure.",
    hours: "06:00 – 21:00",
    capacity: 40,
    fee: 0,
    details: ["Poolside seating", "Towel service", "Poolside dining", "Complimentary for in-house guests"],
  },
  {
    id: "snooker",
    name: "Snooker Lounge",
    blurb: "Unwind, challenge your friends and enjoy a relaxed game in our dedicated snooker lounge.",
    hours: "10:00 – 23:00",
    capacity: 12,
    fee: 8000,
    details: ["Two tournament tables", "Lounge seating", "Beverage service", "Hourly reservations"],
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    blurb: "Enjoy an energetic and entertaining game in our dedicated recreation area.",
    hours: "08:00 – 22:00",
    capacity: 8,
    fee: 4000,
    details: ["Bats and balls provided", "Two tables", "Open play and reservations"],
  },
  {
    id: "fitness",
    name: "Fitness & Wellness",
    blurb: "A calm, well-equipped space to keep your routine while you travel.",
    hours: "05:30 – 22:00",
    capacity: 15,
    fee: 0,
    details: ["Cardio and strength equipment", "Wellness corner", "Complimentary for guests"],
  },
];

export const seedFacilityBookings: FacilityBooking[] = [
  { id: "fb-1", facility: "Snooker Lounge", guestName: "Helena Marsh", roomNumber: "301", date: iso(-1), slot: "19:00 – 20:00", guests: 2, fee: 8000 },
  { id: "fb-2", facility: "Swimming Pool", guestName: "Adaeze Okonkwo", roomNumber: "102", date: iso(0), slot: "08:00 – 09:00", guests: 2, fee: 0 },
];

export const seedEvents: EventInquiry[] = [
  { id: "ev-1", client: "Ngozi Eze", email: "ngozi.eze@example.com", phone: "+234 805 222 3333", type: "Wedding reception", date: iso(35), guests: 180, space: "Sanctuary Garden", catering: "Full service", status: "reviewing" },
  { id: "ev-2", client: "Meridian Partners", email: "events@meridian.example", phone: "+234 806 444 5555", type: "Corporate conference", date: iso(12), guests: 60, space: "Crescent Hall", catering: "Buffet lunch", status: "confirmed" },
  { id: "ev-3", client: "Daniel Oyelaran", email: "d.oyelaran@example.com", phone: "+234 807 666 7777", type: "Anniversary dinner", date: iso(6), guests: 20, space: "Private Dining Room", catering: "Set menu", status: "new" },
];

export const seedStaff: StaffMember[] = [
  { id: "s1", name: "Ifeoma Balogun", role: "Administrator", department: "Management", contact: "ifeoma@splendidsanctuary.com", shift: "08:00 – 17:00", status: "active" },
  { id: "s2", name: "Samuel Adeyemi", role: "Manager", department: "Front Office", contact: "samuel@splendidsanctuary.com", shift: "07:00 – 16:00", status: "active" },
  { id: "s3", name: "Kemi Lawal", role: "Receptionist", department: "Front Office", contact: "kemi@splendidsanctuary.com", shift: "14:00 – 22:00", status: "active" },
  { id: "s4", name: "Grace Umeh", role: "Housekeeping", department: "Housekeeping", contact: "grace@splendidsanctuary.com", shift: "06:00 – 14:00", status: "active" },
  { id: "s5", name: "Chef Marcel Idowu", role: "Kitchen", department: "Restaurant", contact: "marcel@splendidsanctuary.com", shift: "10:00 – 23:00", status: "active" },
  { id: "s6", name: "Bola Ajayi", role: "Finance", department: "Business", contact: "bola@splendidsanctuary.com", shift: "09:00 – 17:00", status: "off-duty" },
  { id: "s7", name: "Peter Nnaji", role: "Maintenance", department: "Facilities", contact: "peter@splendidsanctuary.com", shift: "08:00 – 18:00", status: "active" },
];

export const seedInventory: InventoryItem[] = [
  { id: "i1", name: "Bath towels", category: "Housekeeping", quantity: 240, reorderAt: 100, unitPrice: 4500, supplier: "Linen House" },
  { id: "i2", name: "Bed sheets (king)", category: "Housekeeping", quantity: 82, reorderAt: 90, unitPrice: 12000, supplier: "Linen House" },
  { id: "i3", name: "Toiletry sets", category: "Housekeeping", quantity: 34, reorderAt: 60, unitPrice: 3200, supplier: "Aurea Amenities" },
  { id: "i4", name: "Cleaning supplies", category: "Housekeeping", quantity: 120, reorderAt: 50, unitPrice: 2500, supplier: "ProClean" },
  { id: "i5", name: "Fresh produce (kg)", category: "Restaurant", quantity: 65, reorderAt: 40, unitPrice: 1800, supplier: "Green Market" },
  { id: "i6", name: "Kitchen packaging", category: "Restaurant", quantity: 0, reorderAt: 30, unitPrice: 900, supplier: "PackRight" },
  { id: "i7", name: "Reserve red wine", category: "Wine", quantity: 48, reorderAt: 24, unitPrice: 32000, supplier: "Cellar Nine" },
  { id: "i8", name: "Sparkling water", category: "Beverages", quantity: 18, reorderAt: 40, unitPrice: 1200, supplier: "AquaVista" },
];

export const seedNotifications: Notification[] = [
  { id: "n1", audience: "staff", title: "New room-service order", body: "Room 102 · Club Sandwich", at: iso(0), read: false },
  { id: "n2", audience: "staff", title: "Low inventory", body: "Toiletry sets below reorder level", at: iso(0), read: false },
  { id: "n3", audience: "staff", title: "New event inquiry", body: "Anniversary dinner · 20 guests", at: iso(-1), read: true },
];

export const reviews: Review[] = [
  { id: "rv1", name: "Amaka O.", rating: 5, stayType: "Executive Suite · 3 nights", body: "The calmest three days I've had in a long time. The suite was immaculate and the team anticipated everything before I asked." },
  { id: "rv2", name: "James & Lara T.", rating: 5, stayType: "Romantic Getaway", body: "We came for an anniversary and left planning our next visit. Dinner by the pool was the highlight." },
  { id: "rv3", name: "Obinna E.", rating: 4, stayType: "Deluxe Room · Business trip", body: "Excellent workspace, fast Wi-Fi and the best jollof I've had in a hotel restaurant." },
  { id: "rv4", name: "Sarah M.", rating: 5, stayType: "Family Retreat", body: "The children lived in the pool and the snooker lounge. Genuinely warm, unhurried service throughout." },
];

export const offers: Offer[] = [
  { id: "o1", title: "Weekend Escape", strapline: "Stay · Dine · Relax", description: "Two nights with breakfast for two and a late 14:00 checkout.", eligibility: "Friday to Sunday arrivals", validity: "Valid through 31 December 2026", discount: "15% off best rate", image: welcomeImg },
  { id: "o2", title: "Romantic Getaway", strapline: "Stay · Celebrate · Experience", description: "Suite stay with a private dinner, room decoration and a celebration amenity.", eligibility: "Couples, minimum two nights", validity: "Year-round", discount: "Dinner included", image: presidentialImg },
  { id: "o3", title: "Family Retreat", strapline: "Stay · Play · Enjoy", description: "Connecting rooms, family breakfast and complimentary recreation access.", eligibility: "2 adults + up to 2 children", validity: "School holidays", discount: "20% off second room", image: deluxeImg },
  { id: "o4", title: "Extended Stay", strapline: "Stay Longer · Experience More", description: "Five nights or more with daily breakfast, laundry and one facility session per day.", eligibility: "Stays of 5+ nights", validity: "Year-round", discount: "25% off from night five", image: executiveImg },
];

export const galleryItems = [
  { id: "g1", category: "Property", src: heroImg, alt: "The Splendid Sanctuary at dusk with reflecting pool" },
  { id: "g2", category: "Property", src: welcomeImg, alt: "Hotel lobby lounge with linen seating" },
  { id: "g3", category: "Rooms", src: luxuryImg, alt: "Luxury Room interior with queen bed" },
  { id: "g4", category: "Rooms", src: deluxeImg, alt: "Deluxe Room with reading corner" },
  { id: "g5", category: "Suites", src: executiveImg, alt: "Executive Suite lounge area" },
  { id: "g6", category: "Suites", src: presidentialImg, alt: "Presidential Suite living and dining space" },
  { id: "g7", category: "Dining", src: welcomeImg, alt: "The Sanctuary Restaurant dining room" },
  { id: "g8", category: "Events", src: heroImg, alt: "Evening event setting in the garden" },
];

export const bookingExtras = [
  { id: "breakfast", label: "Daily breakfast for two", price: 15000 },
  { id: "transfer", label: "Airport transfer (return)", price: 40000 },
  { id: "room-service", label: "Room service package", price: 25000 },
  { id: "celebration", label: "Celebration package", price: 55000 },
  { id: "spa", label: "Wellness session", price: 30000 },
];
