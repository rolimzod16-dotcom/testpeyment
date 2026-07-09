import PDFDocument from "pdfkit";
import { format } from "date-fns";
import type { Booking, Package } from "@/generated/prisma/client";

type ReceiptData = Booking & { package: Package };

export async function generateReceiptPdf(booking: ReceiptData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "WildFrontier Expeditions";
    const companyEmail = process.env.COMPANY_EMAIL || "bookings@wildfrontier.com";
    const companyAddress = process.env.COMPANY_ADDRESS || "International Tour Operator";

    doc
      .fontSize(22)
      .fillColor("#1a3c2a")
      .text(siteName, { align: "left" });
    doc
      .fontSize(10)
      .fillColor("#555555")
      .text(companyAddress)
      .text(companyEmail)
      .moveDown(1.5);

    doc
      .fontSize(18)
      .fillColor("#111111")
      .text("PAYMENT RECEIPT", { align: "right" });
    doc
      .fontSize(10)
      .fillColor("#555555")
      .text(`Receipt: ${booking.receiptNumber || "N/A"}`, { align: "right" })
      .text(`Booking: ${booking.bookingRef}`, { align: "right" })
      .text(`Date: ${format(booking.paidAt || new Date(), "MMMM d, yyyy HH:mm")}`, {
        align: "right",
      })
      .moveDown(2);

    doc
      .fontSize(12)
      .fillColor("#111111")
      .text("Bill To:", { underline: true })
      .moveDown(0.3);
    doc
      .fontSize(11)
      .fillColor("#333333")
      .text(booking.customerName)
      .text(booking.customerEmail);
    if (booking.customerPhone) doc.text(booking.customerPhone);
    if (booking.country) doc.text(booking.country);
    doc.moveDown(1.5);

    doc
      .fontSize(12)
      .fillColor("#111111")
      .text("Booking Details", { underline: true })
      .moveDown(0.5);

    const rows: [string, string][] = [
      ["Package", booking.package.title],
      ["Category", booking.package.category.toUpperCase()],
      ["Destination", booking.package.destination],
      ["Duration", booking.package.duration],
      ["Start Date", format(booking.startDate, "MMMM d, yyyy")],
      ["Guests", String(booking.guests)],
      ["Total Package Price", `$${booking.totalAmount.toFixed(2)} ${booking.currency}`],
      ["Deposit Paid", `$${booking.depositAmount.toFixed(2)} ${booking.currency}`],
      ["Payment Method", booking.paymentMethod || "Rampex"],
      ["Transaction ID", booking.paymentId || "N/A"],
      ["Status", booking.status.toUpperCase()],
    ];

    rows.forEach(([label, value]) => {
      doc
        .fontSize(10)
        .fillColor("#666666")
        .text(label, { continued: true, width: 180 })
        .fillColor("#111111")
        .text(value, { align: "left" });
    });

    if (booking.specialRequests) {
      doc.moveDown(0.8);
      doc
        .fontSize(10)
        .fillColor("#666666")
        .text("Special Requests:")
        .fillColor("#111111")
        .text(booking.specialRequests);
    }

    doc.moveDown(2);
    doc
      .rect(50, doc.y, 495, 40)
      .fill("#1a3c2a");
    doc
      .fillColor("#ffffff")
      .fontSize(14)
      .text(
        `Amount Received: $${booking.depositAmount.toFixed(2)} ${booking.currency}`,
        60,
        doc.y - 28,
        { width: 475, align: "center" }
      );

    doc.moveDown(3);
    doc
      .fontSize(9)
      .fillColor("#888888")
      .text(
        "This receipt confirms your deposit payment. Remaining balance is due before departure as per booking terms.",
        { align: "center" }
      );
    doc.text("Thank you for booking with us.", { align: "center" });

    doc.end();
  });
}