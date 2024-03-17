import { db } from "@/lib/db";
import { handleApiError } from "@/lib/error.server";
import { getCurrentUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const user = await getCurrentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    const deletedMemory = await db.memory.delete({
      where: { id },
    });

    if (!deletedMemory) throw new Error("Not found");

    return NextResponse.json(deletedMemory);
  } catch (error) {
    return NextResponse.json({ error: handleApiError(error) }, { status: 500 });
  }
}
