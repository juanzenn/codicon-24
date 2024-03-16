import { MemberForm } from "@/app/validation/members";
import { handleApiError } from "@/lib/error";
import { getCurrentUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    const body: MemberForm = await req.json();

    const newMember = await db.familyMember.create({
      data: {
        name: body.name,
        relationship: body.relationship,
        ownerId: user.id,
      },
    });

    return NextResponse.json(newMember);
  } catch (error) {
    return NextResponse.json({ error: handleApiError(error) }, { status: 500 });
  }
}
