import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      challengeId: number;
    };
  }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthoerized", { status: 403 });
  }
  const data = await db.query.challenges.findFirst({
    where: eq(challenges.id, params.challengeId),
  });

  return NextResponse.json(data);
}
export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: {
      challengeId: number;
    };
  }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthoerized", { status: 403 });
  }

  const body = await req.json();

  const data = await db
    .update(challenges)
    .set({
      ...body,
    })
    .where(eq(challenges.id, params.challengeId))
    .returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      challengeId: number;
    };
  }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthoerized", { status: 403 });
  }
  const data = await db
    .delete(challenges)
    .where(eq(challenges.id, params.challengeId))
    .returning();

  return NextResponse.json(data[0]);
}
