import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  await ensureSchema();
  const bookings = await prisma.booking.findMany({
    include: { package: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}