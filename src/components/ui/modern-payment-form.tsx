import React, { useState, useEffect, useRef } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { Appearance } from "@stripe/stripe-js";
import { stripePromise, createPaymentIntent, FALLBACK_STRIPE_LINK, sendAccessEmail } from "../../services/stripe";
import { Card, CardContent } from "./card";
import { Label } from "./label";
import { Lock, ShieldCheck, Loader2, Mail } from "lucide-react";

const PayPalIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.82.801 5.253-.086.415-.205.845-.355 1.285-.815 2.383-2.317 3.867-4.475 4.417 1.76.47 2.76 1.782 2.327 3.968-.456 2.302-1.85 3.51-4.144 3.593-.418.015-.845.015-1.28.015h-1.42a1.328 1.328 0 0 0-1.312 1.135l-.744 4.704a.64.64 0 0 1-.633.541h-2.12a.64.64 0 0 1-.633-.74l.432-2.735a1.328 1.328 0 0 1 1.312-1.135h1.22c3.486 0 5.412-1.298 5.977-4.153.512-2.587-.878-3.923-3.664-3.923H7.553a.64.64 0 0 0-.633.54l-1.954 12.35a.64.64 0 0 0 .633.74h1.477z" />
  </svg>
);

const PAYPAL_CLIENT_ID = 'AWfIxiBeqQ5trh_bHZddIyMxwiXLEfmX0hKQdZfP0SxiupVbbT07-Z9PFihDwcblTUJqF79zs3y8f0eu';

function PayPalButton({ email, onSuccess, amount }: { email: string; onSuccess: () => void; amount: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ppReady, setPpReady] = useState(!!(window as any).paypal);
  const [ppError, setPpError] = useState('');

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const emailRef = useRef(email);
  emailRef.current = email;

  useEffect(() => {
    if (!PAYPAL_CLIENT_ID) { setPpError('not-configured'); return; }
    if ((window as any).paypal) { setPpReady(true); return; }
    const s = document.createElement('script');
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    s.onload = () => setPpReady(true);
    s.onerror = () => setPpError('load-failed');
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (!ppReady || !containerRef.current) return;
    containerRef.current.innerHTML = '';
    const amountVal = amount.replace(/[^\d.]/g, '');
    (window as any).paypal.Buttons({
      fundingSource: (window as any).paypal.FUNDING.PAYPAL,
      style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal', height: 52 },
      createOrder: (_: any, actions: any) =>
        actions.order.create({
          purchase_units: [{ amount: { value: amountVal }, description: 'Avada Design Courses' }],
          payer: { email_address: emailRef.current },
        }),
      onApprove: async (_: any, actions: any) => {
        await actions.order.capture();
        if ((window as any).fbq) (window as any).fbq('track', 'Purchase', { value: 49, currency: 'USD' });
        onSuccessRef.current();
      },
      onError: (e: any) => console.error('[PayPal]', e),
    }).render(containerRef.current);
  }, [ppReady, amount]);

  if (ppError === 'not-configured') return (
    <div className="w-full py-3.5 bg-[#003087] rounded-xl flex items-center justify-center gap-2.5 opacity-40 cursor-not-allowed select-none">
      <PayPalIcon size={22} className="text-white" />
      <span className="text-white font-bold text-base">PayPal</span>
    </div>
  );

  if (ppError === 'load-failed') return null;

  if (!ppReady) return (
    <div className="w-full h-[52px] bg-[#003087]/10 rounded-xl animate-pulse" />
  );

  return (
    <div className="relative w-full">
      <div ref={containerRef} className="w-full min-h-[52px]" />
    </div>
  );
}

const appearance: Appearance = {
  theme: "stripe",
  variables: { colorPrimary: "#111827", fontFamily: "Inter, system-ui, sans-serif" },
};

const CARD_STYLE = {
  style: {
    base: {
      fontSize: "14px",
      color: "#111827",
      fontFamily: "Inter, system-ui, sans-serif",
      fontWeight: "400",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

const StripeInputWrap = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-11 w-full items-center rounded-xl border border-gray-300 bg-white px-3 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-colors shadow-sm">
    <div className="w-full">{children}</div>
  </div>
);

interface CheckoutFormProps {
  email: string;
  setEmail?: (email: string) => void;
  onSuccess: (customerId?: string, paymentMethodId?: string, paymentIntentId?: string) => void;
  onBack?: () => void;
  amount: string;
}

function CheckoutForm({ email, setEmail, onSuccess, onBack, amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cardTyped, setCardTyped] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setMessage("Please enter a valid email address to receive course access.");
      return;
    }
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    if ((window as any).fbq) (window as any).fbq('track', 'AddPaymentInfo');
    setIsLoading(true);
    setMessage("");

    let clientSecret: string;
    let customerId: string | undefined;
    try {
      const res = await createPaymentIntent(email, amount);
      clientSecret = res.clientSecret;
      customerId = res.customerId;
    } catch (err: any) {
      setMessage(err?.message ?? "Failed to initialise payment. Please try again.");
      setIsLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { email: email || undefined },
      },
    });

    if (error) {
      setMessage(error.message ?? "Payment failed. Please try again.");
      setIsLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 9;
      if ((window as any).fbq) (window as any).fbq('track', 'Purchase', { value: numericAmount, currency: 'USD' });
      const paymentMethodId = typeof paymentIntent.payment_method === 'string'
        ? paymentIntent.payment_method
        : paymentIntent.payment_method?.id;
      onSuccess(customerId, paymentMethodId, paymentIntent.id);
    } else {
      setMessage("Unexpected state — please contact support.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email input if setEmail provided */}
      {setEmail && (
        <div className="space-y-1">
          <Label className="text-xs text-gray-700 font-semibold">Email Address for Instant Access</Label>
          <div className="flex h-11 w-full items-center rounded-xl border border-gray-300 bg-white px-3 text-sm focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-colors shadow-sm">
            <Mail size={16} className="text-gray-400 mr-2 shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent border-0 outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      )}

      {/* Card fields */}
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs text-gray-700 font-semibold">Card Details</Label>
          <StripeInputWrap>
            <CardNumberElement
              options={{ ...CARD_STYLE, showIcon: true }}
              onChange={(e) => setCardTyped(!e.empty)}
            />
          </StripeInputWrap>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-gray-700 font-semibold">Expiry Date</Label>
            <StripeInputWrap><CardExpiryElement options={CARD_STYLE} /></StripeInputWrap>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-700 font-semibold">CVC / CVV</Label>
            <StripeInputWrap><CardCvcElement options={CARD_STYLE} /></StripeInputWrap>
          </div>
        </div>
      </div>

      {!setEmail && email && (
        <p className="text-xs text-gray-500 text-center">
          Delivery sent to: <span className="font-semibold text-gray-800">{email}</span>
        </p>
      )}

      {message && (
        <p className="text-red-600 text-xs text-center bg-red-50 p-2.5 rounded-xl border border-red-200">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-98 transition-all"
      >
        {isLoading ? <><Loader2 size={18} className="animate-spin" /> Processing Payment…</> : `Pay ${amount} & Get Instant Access`}
      </button>

      {/* PayPal Option */}
      <div className={`transition-all duration-300 overflow-hidden ${cardTyped ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-24 opacity-100'}`}>
        <div className="flex items-center gap-3 text-gray-600 my-2">
          <hr className="flex-grow border-gray-200" />
          <span className="text-[11px] font-bold whitespace-nowrap text-gray-400 uppercase tracking-wider">or pay with</span>
          <hr className="flex-grow border-gray-200" />
        </div>
        <PayPalButton email={email} onSuccess={() => onSuccess()} amount={amount} />
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-wide">
        <span className="flex items-center gap-1"><Lock size={10} /> SSL Secured</span>
        <span>•</span>
        <span className="flex items-center gap-1"><ShieldCheck size={10} /> 30-Day Guarantee</span>
        <span>•</span>
        <span>Lifetime Access</span>
      </div>
    </form>
  );
}

export interface ModernPaymentFormProps {
  email: string;
  setEmail?: (email: string) => void;
  onSuccess: (customerId?: string, paymentMethodId?: string, paymentIntentId?: string) => void;
  onBack?: () => void;
  amount?: string;
  bare?: boolean;
}

export default function ModernPaymentForm({
  email,
  setEmail,
  onSuccess,
  onBack,
  amount = "$9",
  bare = false,
}: ModernPaymentFormProps) {
  const wrap = (content: React.ReactNode) =>
    bare ? (
      <div className="border-t border-gray-100 mt-3 pt-4">{content}</div>
    ) : (
      <div className="w-full">
        {content}
      </div>
    );

  return wrap(
    <Elements stripe={stripePromise} options={{ appearance }}>
      <CheckoutForm
        email={email}
        setEmail={setEmail}
        onSuccess={onSuccess}
        onBack={onBack}
        amount={amount}
      />
    </Elements>
  );
}
