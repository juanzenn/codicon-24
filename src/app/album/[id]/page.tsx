import ImageBook from "@/components/image-book";
import React from "react";
import { db } from "@/lib/db";

type AlbumPageParams = {
  params: {
    id: string;
  };
};

export default async function AlbumPage({ params }: AlbumPageParams) {
  const albumWithMemories = await db.album.findFirst({
    where: {
      id: params.id,
    },
    select: {
      memories: {
        include: {
          familyMembers: true,
        },
      },
    },
  });

  if (!albumWithMemories) return null;

  const { memories } = albumWithMemories;

  return (
    <main className="bg-gray-950 text-gray-100 h-dvh">
      <ImageBook memories={memories} />
    </main>
  );
}
