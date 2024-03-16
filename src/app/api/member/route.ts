import { handleApiError } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
  } catch (error) {
    return NextResponse.json({ error: handleApiError(error) }, { status: 500 });
  }
}
