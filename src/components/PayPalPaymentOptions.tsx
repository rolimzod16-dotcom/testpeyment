import { isPayPalLive } from "@/lib/paypal-config";

type Props = {
  bookingId: string;
  amountLabel: string;
};

export function PayPalPaymentOptions({ bookingId, amountLabel }: Props) {
  const live = isPayPalLive();
  const paypalUrl = `/api/payments/paypal/start?bookingId=${bookingId}&type=paypal`;
  const cardUrl = `/api/payments/paypal/start?bookingId=${bookingId}&type=card`;

  return (
    <div className="mt-4 space-y-4">
      {live ? (
        <div className="rounded-lg border border-emerald-800/40 bg-emerald-950/20 p-4 text-sm text-emerald-200">
          <p className="font-semibold">Secure live payment</p>
          <p className="mt-1 text-emerald-200/90">
            Pay with your PayPal account or debit/credit card. Funds go to the merchant PayPal
            business account.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-amber-700/40 bg-amber-950/20 p-4 text-sm text-amber-100">
          <p className="font-semibold">Sandbox test mode</p>
          <p className="mt-1 text-amber-100/90">
            Use a Sandbox Personal buyer from developer.paypal.com, or guest card checkout.
          </p>
        </div>
      )}

      <a
        href={paypalUrl}
        className="flex w-full items-center justify-center rounded-full bg-[#ffc439] py-4 text-lg font-bold text-[#003087] transition hover:bg-[#f5ba2e]"
      >
        Pay with PayPal — {amountLabel}
      </a>

      <a
        href={cardUrl}
        className="flex w-full items-center justify-center rounded-full border border-stone-600 bg-stone-800 py-4 text-lg font-semibold text-stone-100 transition hover:bg-stone-700"
      >
        Pay with Debit or Credit Card — {amountLabel}
      </a>

      <p className="text-center text-xs text-stone-500">
        {live
          ? "You will be redirected to PayPal to complete payment securely."
          : "Sandbox: do not use your real PayPal account on sandbox.paypal.com."}
      </p>
    </div>
  );
}