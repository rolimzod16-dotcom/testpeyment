import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import { formatCurrency, formatDate } from "@/lib/utils";

type Props = { params: Promise<{ locale: string; bookingId: string }> };

export default async function ConfirmationPage({ params }: Props) {
  const { locale, bookingId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("confirmation");

  await ensureSchema();
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { package: true },
  });

  if (!booking) notFound();

  if (booking.status !== "paid") {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-foreground">{t("pendingTitle")}</h1>
        <p className="mt-4 text-muted">{t("pendingDesc")}</p>
        <Link
          href={`/payment/${bookingId}`}
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-white"
        >
          {t("continuePayment")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-foreground">{t("confirmedTitle")}</h1>
        <p className="mt-3 text-muted">
          {t("confirmedDesc", { name: booking.customerName })}
        </p>
      </div>

      <div className="mt-8 space-y-4 rounded-2xl border border-black/[0.06] bg-white p-6 text-sm shadow-sm">
        <div className="flex justify-between">
          <span className="text-muted">{t("bookingRef")}</span>
          <span className="font-mono text-foreground">{booking.bookingRef}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">{t("receiptNumber")}</span>
          <span className="font-mono text-foreground">{booking.receiptNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">{t("package")}</span>
          <span className="text-foreground">{booking.package.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">{t("startDate")}</span>
          <span className="text-foreground">{formatDate(booking.startDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">{t("depositPaid")}</span>
          <span className="font-semibold text-emerald-700">
            {formatCurrency(booking.depositAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">{t("transactionId")}</span>
          <span className="font-mono text-xs text-muted">{booking.paymentId}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <a
          href={`/api/receipts/${bookingId}`}
          className="rounded-full bg-foreground px-6 py-3 text-center text-sm font-medium text-white hover:bg-foreground/90"
        >
          {t("downloadReceipt")}
        </a>
        <Link
          href="/"
          className="rounded-full border border-black/[0.12] px-6 py-3 text-center text-sm font-medium text-foreground hover:bg-surface"
        >
          {t("backHome")}
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        {t("emailNote", { email: booking.customerEmail })}
      </p>
    </div>
  );
}