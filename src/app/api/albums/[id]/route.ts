import { UpsertAlbumForm } from "@/app/validation/albums";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/error.server";
import { getCurrentUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const user = await getCurrentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    const body: UpsertAlbumForm = await req.json();

    const updatedAlbum = await db.album.update({
      where: {
        id,
        ownerId: user.id,
      },
      data: {
        title: body.details.title,
        description: body.details.description,
        date: body.details.date,
        memories: {
          set: body.selectedMemories.memories.map((id) => ({ id })),
        },
      },
    });

    return NextResponse.json(updatedAlbum);
  } catch (err) {
    return NextResponse.json({ error: handleApiError(err) }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const user = await getCurrentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    const deletedAlbum = await db.album.delete({
      where: {
        id,
        ownerId: user.id,
      },
    });

    if (!deletedAlbum) throw new Error("Not found");

    return NextResponse.json(deletedAlbum);
  } catch (error) {
    return NextResponse.json({ error: handleApiError(error) }, { status: 500 });
  }
}
