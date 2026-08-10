import { createFileRoute } from "@tanstack/react-router";

import { RoomCard } from "@/components/site/RoomCard";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { images, roomTypes } from "@/lib/hotel-data";

export const Route = createFileRoute("/_site/stay")({
  head: () => ({
    meta: [
      { title: "Rooms & Suites — The Splendid Sanctuary" },
      {
        name: "description",
        content:
          "Luxury Rooms, Deluxe Rooms, Executive and Presidential Suites at The Splendid Sanctuary. Compare rates, amenities and book direct.",
      },
      { property: "og:title", content: "Rooms & Suites — The Splendid Sanctuary" },
      {
        property: "og:description",
        content: "Thoughtfully designed rooms and suites offering comfort, privacy and calm.",
      },
    ],
  }),
  component: StayPage,
});

function StayPage() {
  return (
    <>
      <PageHero
        eyebrow="Accommodation"
        title="Find your perfect stay"
        copy="Thoughtfully designed rooms and suites offering comfort, privacy and everything you need for a memorable stay."
        image={images.deluxe}
      />
      <Section>
        <SectionHeading
          eyebrow="Four ways to stay"
          title="Rooms & suites"
          copy="Every room includes daily housekeeping, high-speed Wi-Fi, air conditioning and 24-hour room service."
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {roomTypes.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </Section>
    </>
  );
}
