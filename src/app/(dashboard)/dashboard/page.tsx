import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import MemoriesGrid from "../memories/MemoriesGrid";
import MemoryDialog from "../memories/MemoryDialog";

const MAX_ITEMS = 5;

export default async function DashboardPage() {
  const user = (await getCurrentUser()) as Session["user"];

  const promises = [
    db.familyMember.findMany({
      where: { ownerId: user.id },
      include: { _count: { select: { memories: true } } },
      orderBy: { memories: { _count: "desc" } },
    }),
    db.memory.findMany({
      where: { ownerId: user.id },
      include: { familyMembers: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: MAX_ITEMS,
    }),
    db.album.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      take: MAX_ITEMS,
    }),
  ] as const;

  const [familyMembers, memories, albums] = await Promise.all(promises);

  return (
    <>
      <header className="container py-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground text-lg">
          Heritage Keeper will help you save the precious memories you've had
          with your familiy.
        </p>
      </header>

      <section className="grid grid-cols-3 container gap-6">
        <article className="py-6 px-4 border border-border rounded-lg flex flex-col">
          <h2 className="font-semibold text-xl">Your Family</h2>
          <div className="py-6 gap-2 flex flex-col justify-center flex-1">
            {familyMembers.length <= 0 ? (
              <EmptyCardMessage>No family members yet.</EmptyCardMessage>
            ) : (
              familyMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-4">
                  <div className="flex gap-2 w-full items-baseline">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-muted-foreground">
                      ({member.relationship})
                    </p>
                    <p className="text-muted-foreground text-xs ml-auto">
                      {member._count.memories} Memories
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <Button asChild className="ml-auto flex w-40 mt-auto" variant="ghost">
            <Link href="/members">View All</Link>
          </Button>
        </article>

        <article className="py-6 px-4 border border-border rounded-lg flex flex-col">
          <h2 className="font-semibold text-xl">Your Albums</h2>
          <div className="py-6 gap-2 flex flex-col justify-center flex-1">
            {albums.length <= 0 ? (
              <EmptyCardMessage>No albums members yet.</EmptyCardMessage>
            ) : null}
          </div>

          <Button asChild className="ml-auto flex w-40" variant="ghost">
            <Link href="/albums">View All</Link>
          </Button>
        </article>
      </section>

      <section className="container mt-12 pb-24">
        <h2 className="font-semibold text-3xl mb-4">Latest Memories</h2>

        {memories.length <= 0 ? (
          <div>
            <div className="mx-auto flex items-center mt-12 gap-6 w-3/5">
              <Image
                src="/panda.png"
                alt="Default Panda"
                width={200}
                height={200}
                className="flex-shrink-0"
              />

              <header className="flex-1">
                <h2 className="font-bold text-4xl mb-2 text-center">
                  Hmmm, it seems that you don't have any memories at the
                  moment...
                </h2>

                <MemoryDialog familyMembers={familyMembers}>
                  <Button className="flex mx-auto w-fit text-xl mt-6" size="lg">
                    Create Memory
                  </Button>
                </MemoryDialog>
              </header>
            </div>
          </div>
        ) : (
          <MemoriesGrid memories={memories} />
        )}
      </section>
    </>
  );
}

function EmptyCardMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground text-center">{children}</p>;
}
