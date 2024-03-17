import { AlbumForm } from "@/components/albums/create-album-form";
import PageHeader from "@/components/page-header";

import { getCurrentUser } from "@/lib/user";
import { Prisma } from "@prisma/client";
import { Session } from "next-auth";

export type AlbumWithFamilyMembers = Prisma.AlbumGetPayload<{
  include: { memories: { include: { familyMembers: true } } };
}>;

type AlbumPageProps = {
  searchParams: Record<string, string | undefined>;
};

export default async function AlbumsPage({ searchParams }: AlbumPageProps) {
  const user = (await getCurrentUser()) as Session["user"];

  const selectedFamilyMembers = searchParams.familyMembers?.split(",") || [];

  const memories =
    (await db.memory.findMany({
      where: {
        AND: [
          {
            ownerId: user.id,
            familyMembers: {
              some: {
                id: {
                  in: selectedFamilyMembers,
                },
              },
            },
          },
        ],
      },
    })) ?? [];

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
        <AlbumForm memories={memories} familyMembers={familyMembers} />
      </section>

      <section className="mt-6">
        <h1>Work in progress</h1>
      </section>
    </div>
  );
}
