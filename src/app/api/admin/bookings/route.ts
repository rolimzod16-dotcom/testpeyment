import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";

export async function GET(request: Request) {
  const password = request.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureSchema();
  const bookings = await prisma.booking.findMany({
    include: { package: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}