import { getCurrentUser } from "@/lib/user";
import { Session } from "next-auth";
import React from "react";

type Props = {};

export default async function DashboardPage({}: Props) {
  const user = (await getCurrentUser()) as Session["user"];

  const promises = [
    db.familyMember.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.memory.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.album.findMany({
      where: { ownerId: user.id },
      take: 5,
    }),
  ];

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
        </article>
        <article className="py-6 px-4 border border-border rounded-lg">
          <h2 className="font-semibold text-xl">Latest Memories</h2>
        </article>
        <article className="py-6 px-4 border border-border rounded-lg">
          <h2 className="font-semibold text-xl">Your Albums</h2>
        </article>
      </section>
    </>
  );
}
