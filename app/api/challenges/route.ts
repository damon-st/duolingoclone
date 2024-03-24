import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauhtorized", { status: 401 });
  }
  const data = await db.query.challenges.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauhtorized", { status: 401 });
  }

  const body = await req.json();
  const data = await db
    .insert(challenges)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
}
