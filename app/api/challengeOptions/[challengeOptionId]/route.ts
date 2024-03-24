import db from "@/db/drizzle";
import { challengesOptions } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      challengeOptionId: number;
    };
  }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthoerized", { status: 403 });
  }
  const data = await db.query.challengesOptions.findFirst({
    where: eq(challengesOptions.id, params.challengeOptionId),
  });

  return NextResponse.json(data);
}
export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: {
      challengeOptionId: number;
    };
  }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthoerized", { status: 403 });
  }

  const body = await req.json();

  const data = await db
    .update(challengesOptions)
    .set({
      ...body,
    })
    .where(eq(challengesOptions.id, params.challengeOptionId))
    .returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      challengeOptionId: number;
    };
  }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthoerized", { status: 403 });
  }
  const data = await db
    .delete(challengesOptions)
    .where(eq(challengesOptions.id, params.challengeOptionId))
    .returning();

  return NextResponse.json(data[0]);
}
