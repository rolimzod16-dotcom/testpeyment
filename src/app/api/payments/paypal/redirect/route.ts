import { NextResponse } from "next/server";
import { z } from "zod";
import { startPayPalPayment } from "@/lib/start-paypal-payment";

const schema = z.object({
  bookingId: z.string(),
  paymentType: z.enum(["card", "paypal"]).optional().default("card"),
});

export async function POST(request: Request) {
  try {
    const { bookingId, paymentType } = schema.parse(await request.json());
    const approveUrl = await startPayPalPayment(bookingId, paymentType);
    return NextResponse.json({ approveUrl });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Failed to start PayPal payment";
    const status = message === "Booking not found" ? 404 : message === "Already paid" ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}