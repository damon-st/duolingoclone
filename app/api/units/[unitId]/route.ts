import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      unitId: number;
    };
  }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthoerized", { status: 403 });
  }
  const data = await db.query.units.findFirst({
    where: eq(units.id, params.unitId),
  });

  return NextResponse.json(data);
}
export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: {
      unitId: number;
    };
  }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthoerized", { status: 403 });
  }

  const body = await req.json();

  const data = await db
    .update(units)
    .set({
      ...body,
    })
    .where(eq(units.id, params.unitId))
    .returning();

  return NextResponse.json(data[0]);
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      unitId: number;
    };
  }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthoerized", { status: 403 });
  }
  const data = await db
    .delete(units)
    .where(eq(units.id, params.unitId))
    .returning();

  return NextResponse.json(data[0]);
}
