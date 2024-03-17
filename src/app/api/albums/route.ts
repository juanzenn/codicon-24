import { CreateAlbumForm } from "@/app/validation/albums";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/error.server";
import { getCurrentUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    const body: CreateAlbumForm = await req.json();

    const newAlbum = await db.album.create({
      data: {
        title: body.details.title,
        description: body.details.description,
        ownerId: user.id,
        date: body.details.date,
        memories: {
          connect: body.selectedMemories.memories.map((id) => ({ id })),
        },
      },
    });

    return NextResponse.json(newAlbum);
  } catch (error) {
    return NextResponse.json({ error: handleApiError(error) }, { status: 500 });
  }
}
