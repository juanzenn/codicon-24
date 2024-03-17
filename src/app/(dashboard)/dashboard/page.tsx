import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/user";
import { ArrowDownWideNarrow } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";
import MemoriesGrid from "../memories/MemoriesGrid";

const MAX_ITEMS = 5;

export default async function DashboardPage() {
  const user = (await getCurrentUser()) as Session["user"];

  const promises = [
    db.familyMember.findMany({
      where: { ownerId: user.id },
      include: { _count: { select: { memories: true } } },
      orderBy: { createdAt: "desc" },
      take: MAX_ITEMS,
    }),
    db.memory.findMany({
      where: { ownerId: user.id },
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
        <article className="py-6 px-4 border border-border rounded-lg">
          <h2 className="font-semibold text-xl">Your Family</h2>
          <div className="py-12">
            {familyMembers.length <= 0 ? (
              <EmptyCardMessage>No family members yet.</EmptyCardMessage>
            ) : (
              familyMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-4">
                  <div className="flex gap-2 w-full items-baseline text-sm">
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

          <Button asChild className="ml-auto flex w-40" variant="ghost">
            <Link href="/members">View All</Link>
          </Button>
        </article>

        <article className="py-6 px-4 border border-border rounded-lg">
          <h2 className="font-semibold text-xl">Your Albums</h2>
          <div className="py-12">
            {albums.length <= 0 ? (
              <EmptyCardMessage>No albums members yet.</EmptyCardMessage>
            ) : null}
          </div>

          <Button asChild className="ml-auto flex w-40" variant="ghost">
            <Link href="/albums">View All</Link>
          </Button>
        </article>
      </section>

      <section className="container mt-12">
        <h2 className="font-semibold text-3xl mb-4">Latest Memories</h2>

        {memories.length <= 0 ? (
          <div className="py-28">
            <EmptyCardMessage>
              You don't have any memories. Click bellow to create one.
            </EmptyCardMessage>
            <Button
              asChild
              className="flex mx-auto w-fit text-xl mt-3"
              size="lg"
            >
              <Link href="/memories">Create Memories</Link>
            </Button>
          </div>
        ) : <MemoriesGrid memories={memories} />}
      </section>
    </>
  );
}

function EmptyCardMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground text-center">{children}</p>;
}
