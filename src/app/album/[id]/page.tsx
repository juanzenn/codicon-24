import ImageBook from "@/components/image-book";
import { Memory, Prisma } from "@prisma/client";
import React from "react";

const ALBUM_IMAGES: Prisma.MemoryGetPayload<{
  include: {
    familyMembers: { select: { name: true } };
  };
}>[] = [
  {
    date: new Date(),
    fileUrl: "https://source.unsplash.com/random/?Nature&1",
    createdAt: new Date(),
    description: "Nature",
    id: "1",
    isArchived: false,
    ownerId: "1",
    familyMembers: [{ name: "John Doe" }],
  },
  {
    date: new Date(),
    fileUrl: "https://source.unsplash.com/random/?Nature&2",
    createdAt: new Date(),
    description: "Nature",
    id: "2",
    isArchived: false,
    ownerId: "1",
    familyMembers: [{ name: "John Doe" }],
  },
  {
    date: new Date(),
    fileUrl: "https://source.unsplash.com/random/?Nature&3",
    createdAt: new Date(),
    description: "Nature",
    id: "3",
    isArchived: false,
    ownerId: "1",
    familyMembers: [{ name: "John Doe" }],
  },
];

export default async function AlbumPage() {
  return (
    <main className="bg-gray-950 text-gray-100 h-dvh">
      <ImageBook memories={ALBUM_IMAGES} />
    </main>
  );
}
