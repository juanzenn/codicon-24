import { AlbumForm } from "@/app/validation/albums";
import { handleApiError } from "@/lib/error.server";
import { getCurrentUser } from "@/lib/user";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    const body: AlbumForm = await req.json();

    const MEMORIES_AMOUNT = 5;

    const relatedMemories = await db.memory.findMany({
      where: {
        familyMembers: {
          some: {
            AND: [
              {
                ownerId: user.id,
              },
              {
                id: {
                  in: body.familyMembers,
                },
              },
            ],
          },
        },
      },
      take: MEMORIES_AMOUNT,
    });

    const newAlbum = await db.album.create({
      data: {
        title: body.title,
        description: body.description,
        ownerId: user.id,
        date: body.date,
        memories: {
          connect: relatedMemories.map((memory) => ({ id: memory.id })),
        },
      },
    });

    return NextResponse.json(newAlbum);
  } catch (error) {
    return NextResponse.json({ error: handleApiError(error) }, { status: 500 });
  }
}
