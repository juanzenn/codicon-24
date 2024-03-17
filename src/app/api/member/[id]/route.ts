import { MemberForm } from "@/app/validation/members";
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

    const body: MemberForm = await req.json();
    const updatedMember = await db.familyMember.update({
      where: { id, ownerId: user.id },
      data: {
        name: body.name,
        relationship: body.relationship,
      },
    });

    if (!updatedMember) throw new Error("Not found");

    return NextResponse.json(updatedMember);
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

    const deletedMember = await db.familyMember.delete({
      where: { id, ownerId: user.id },
    });

    if (!deletedMember) throw new Error("Not found");

    return NextResponse.json(deletedMember);
  } catch (error) {
    return NextResponse.json({ error: handleApiError(error) }, { status: 500 });
  }
}
