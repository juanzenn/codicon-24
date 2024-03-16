import { AlbumsTable } from "@/components/albums/albums-table";
import { CreateAlbumForm } from "@/components/albums/create-album-form";
import PageHeader from "@/components/page-header";

import { getCurrentUser } from "@/lib/user";
import { Prisma } from "@prisma/client";
import { Session } from "next-auth";

export type AlbumWithFamilyMembers = Prisma.AlbumGetPayload<{
  include: { memories: { include: { familyMembers: true } } };
}>;

export default async function AlbumsPage() {
  const user = (await getCurrentUser()) as Session["user"];

  const familyMembers = await db.familyMember.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const albums = await db.album.findMany({
    where: { ownerId: user.id },
    orderBy: { date: "desc" },
    include: {
      memories: {
        include: {
          familyMembers: true,
        },
      },
    },
  });

  return (
    <div className="container">
      <PageHeader
        title="Albums"
        description="Create snapshots of your family for future generations."
      />

      <section className="mt-6">
        <CreateAlbumForm familyMembers={familyMembers} />
      </section>

      <section className="mt-6">
        <AlbumsTable albums={albums} familyMembers={familyMembers} />
      </section>
    </div>
  );
}
