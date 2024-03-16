import type { MemoryBody } from "@/app/validation/memories";
import { handleApiError } from "@/lib/error.server";
import { getCurrentUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    const body: MemoryBody = await req.json();

    const newMemory = await db.memory.create({
      data: {
        description: body.description,
        date: body.date,
        fileUrl: body.file_url,
        ownerId: user.id,
        familyMembers: {
          connect: body.familyMembers.map((id) => ({ id })),
        },
      },
    });

    return NextResponse.json(newMemory);
  } catch (error) {
    return NextResponse.json({ error: handleApiError(error) }, { status: 500 });
  }
}
