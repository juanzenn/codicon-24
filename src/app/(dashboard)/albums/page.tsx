import { AlbumForm } from "@/components/albums/upsert-album-form";
import PageHeader from "@/components/page-header";

import { getCurrentUser } from "@/lib/user";
import { FamilyMember, Memory, Prisma } from "@prisma/client";
import { Session } from "next-auth";
import { db } from "@/lib/db";
import { AlbumsGrid } from "@/components/albums/albums-grid";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export type AlbumWithMemories = Prisma.AlbumGetPayload<{
  include: {
    memories: {
      include: { familyMembers: true };
    };
  };
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

  if (!albums.length) {
    return <EmptyState familyMembers={familyMembers} memories={memories} />;
  }

  return (
    <div className="container">
      <PageHeader
        title="Albums"
        description="Create snapshots of your family for future generations."
      />

      <section className="mt-6">
        <AlbumForm memories={memories} familyMembers={familyMembers}>
          <Button>
            <span>Create album</span>
          </Button>
        </AlbumForm>
      </section>

      <section className="mt-6">
        <AlbumsGrid
          familyMembers={familyMembers}
          memories={memories}
          albums={albums}
        />
      </section>
    </div>
  );
}

type EmptyStateProps = {
  familyMembers: FamilyMember[];
  memories: Memory[];
};

function EmptyState({ familyMembers, memories }: EmptyStateProps) {
  return (
    <div className="w-1/2 mx-auto grid grid-cols-2 justify-center items-center mt-12">
      <Image src={"/panda.png"} alt="Default Panda" width={300} height={300} />
      <div>
        <header className="mt-10">
          <h1 className="font-bold text-4xl mb-2">
            Hmmm, it seems that you don't have any albums at the moment...
          </h1>
          <p className="mb-4">Start by creating your first album!</p>
          <AlbumForm memories={memories} familyMembers={familyMembers}>
            <Button>Create Album</Button>
          </AlbumForm>
        </header>
      </div>
    </div>
  );
}
