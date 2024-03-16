import { AlbumForm } from "@/app/validation/albums";
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

    const body: AlbumForm = await req.json();

    const MEMORIES_AMOUNT = 5;

    const relatedMemories = await db.memory.findMany({
      where: {
        familyMembers: {
          some: {
            ownerId: user.id,
            id: {
              in: body.familyMembers,
            },
          },
        },
      },
      take: MEMORIES_AMOUNT,
    });

    const updatedAlbum = await db.album.update({
      where: { id, ownerId: user.id },
      data: {
        title: body.title,
        date: body.date,
        description: body.description,
        memories: {
          disconnect: { id },
          connect: relatedMemories.map((memory) => ({ id: memory.id })),
        },
      },
    });

    if (!updatedAlbum) throw new Error("Not found");

    return NextResponse.json(updatedAlbum);
  } catch (error) {
    return NextResponse.json({ error: handleApiError(error) }, { status: 500 });
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
