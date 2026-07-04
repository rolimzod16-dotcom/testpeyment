import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReceiptPdf } from "@/lib/receipt";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { package: true },
    });

    if (!booking || booking.status !== "paid") {
      return NextResponse.json({ error: "Receipt not available" }, { status: 404 });
    }

    const pdf = await generateReceiptPdf(booking);
    const filename = `receipt-${booking.bookingRef}.pdf`;

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate receipt" }, { status: 500 });
  }
}