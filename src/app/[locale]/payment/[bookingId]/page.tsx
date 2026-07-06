import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { PayPalPaymentOptions } from "@/components/PayPalPaymentOptions";
import { validatePayPalEnv } from "@/lib/paypal-config";
import { getSiteUrl } from "@/lib/site-url";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; bookingId: string }>;
  searchParams: Promise<{ cancelled?: string; error?: string }>;
};

export default async function PaymentPage({ params, searchParams }: Props) {
  const { locale, bookingId } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("payment");
  const query = await searchParams;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { package: true },
  });

  if (!booking) notFound();
  if (booking.status === "paid") {
    redirect({ href: `/confirmation/${bookingId}`, locale });
  }

  const chargeAmount =
    booking.currency === "USD" && booking.depositAmount < 1 ? 1 : booking.depositAmount;
  const amountLabel = formatCurrency(chargeAmount, booking.currency);
  const paypalConfig = validatePayPalEnv();

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-8">
        <p className="text-sm font-medium text-link">{t("step")}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-muted">
          {t("bookingRef")}:{" "}
          <span className="font-mono text-foreground">{booking.bookingRef}</span>
        </p>
        <p className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
          {t("livePaypal")}
        </p>

        {query.cancelled && (
          <p className="mt-4 rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
            {t("cancelled")}
          </p>
        )}
        {query.error && (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
            <p className="font-semibold">{t("failedTitle")}</p>
            <p className="mt-1">{t("failedDesc")}</p>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">{t("summary")}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">{t("package")}</dt>
              <dd className="text-foreground">{booking.package.title}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{t("guest")}</dt>
              <dd className="text-foreground">{booking.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{t("startDate")}</dt>
              <dd className="text-foreground">{formatDate(booking.startDate)}</dd>
            </div>
            <div className="flex justify-between border-t border-black/[0.06] pt-2 font-semibold">
              <dt className="text-foreground">{t("depositDue")}</dt>
              <dd className="text-foreground">{amountLabel}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">{t("chooseMethod")}</h2>
          <p className="mt-1 text-sm text-muted">
            {booking.package.title} — {amountLabel}
          </p>

          {!paypalConfig.ok ? (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
              <p className="font-semibold">{t("notConfigured", { mode: paypalConfig.mode })}</p>
              <ul className="mt-2 list-disc pl-5">
                {paypalConfig.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : (
            <PayPalPaymentOptions
              bookingId={booking.id}
              amount={chargeAmount}
              currency={booking.currency}
              amountLabel={amountLabel}
            />
          )}
        </div>

        {process.env.NODE_ENV === "development" && (
          <p className="mt-4 text-xs text-muted">Return URL: {getSiteUrl()}</p>
        )}
      </div>
    </div>
  );
}