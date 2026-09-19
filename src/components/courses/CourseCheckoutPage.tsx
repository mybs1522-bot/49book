import React, { useState, useEffect, useRef } from 'react';
import {
  Lock, Check, Loader2, Timer, CreditCard, Mail, ShieldCheck, AlertCircle,
  ArrowLeft, CheckCircle2, Download, Star, Shield, Clock,
  MessageSquare, Sparkles, Box
} from 'lucide-react';
import {
  FRONT_END_COURSES, FRONT_END_PRICE, FRONT_END_ORIGINAL_PRICE,
  AUTOCAD_ADDON_PRICE, AUTOCAD_ADDON_ORIGINAL_PRICE
} from '../../constants-courses';
import { trackMetaEvent } from '../../utils/meta-tracking';
import { sendStageEmail } from '../../services/email';
import { createPaymentIntent } from '../../services/stripe';

const STRIPE_PUBLISHABLE_KEY = "pk_live_51PRJCsGGsoQTkhyv6OrT4zvnaaB5Y0MSSkTXi0ytj33oygsfW3dcu6aOFa9q3dr2mXYTCJErnFQJcOcyuDAsQd4B00lIAdclbB";
const PAYPAL_BUSINESS_EMAIL = "design@avada.in";
const PAYPAL_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg";

interface CourseCheckoutPageProps {
  onSuccess: (data: {
    customerId?: string;
    paymentMethodId?: string;
    paymentIntentId?: string;
    email: string;
    purchased: string[];
  }) => void;
  onBackToLanding: () => void;
}

export const CourseCheckoutPage: React.FC<CourseCheckoutPageProps> = ({ onSuccess, onBackToLanding }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // --- STATE ---
  const [autocadAddon, setAutocadAddon] = useState(false);
  const totalPrice = autocadAddon ? FRONT_END_PRICE + AUTOCAD_ADDON_PRICE : FRONT_END_PRICE;

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 21, s: 45 });
  const [hidePayPal, setHidePayPal] = useState(false);
  const [hasAddedPaymentInfo, setHasAddedPaymentInfo] = useState(false);
  const [cardBrand, setCardBrand] = useState('unknown');
  const [cardComplete, setCardComplete] = useState({ number: false, expiry: false, cvc: false });
  const [showWalletButton, setShowWalletButton] = useState(false);

  const stripeRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);
  const cardNumberRef = useRef<any>(null);
  const cardExpiryRef = useRef<any>(null);
  const cardCvcRef = useRef<any>(null);
  const expressCheckoutRef = useRef<any>(null);

  // Meta InitiateCheckout
  useEffect(() => {
    trackMetaEvent({
      eventName: 'InitiateCheckout',
      value: totalPrice,
      currency: 'USD',
      content_name: '3 Architecture & 3D Visualization Master Courses',
      content_ids: ['courses-sketchup-vray-d5'],
      content_type: 'product'
    });
  }, [totalPrice]);

  // --- TIMER (synced via localStorage key) ---
  useEffect(() => {
    const INITIAL_SECONDS = (3 * 3600) + (45 * 60) + 10;
    const getTarget = () => {
      const stored = localStorage.getItem('course_timer_target');
      const now = Date.now();
      if (stored) {
        const target = parseInt(stored, 10);
        if (target > now) return target;
      }
      const newTarget = now + (INITIAL_SECONDS * 1000);
      localStorage.setItem('course_timer_target', newTarget.toString());
      return newTarget;
    };
    const target = getTarget();
    const calc = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        h: Math.floor(diff / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };
    const t = setInterval(calc, 1000);
    calc();
    return () => clearInterval(t);
  }, []);

  // --- STRIPE INITIALIZATION ---
  useEffect(() => {
    initializeStripeUI();
    return () => {
      if (cardNumberRef.current) { try { cardNumberRef.current.destroy(); } catch (e) {} cardNumberRef.current = null; }
      if (cardExpiryRef.current) { try { cardExpiryRef.current.destroy(); } catch (e) {} cardExpiryRef.current = null; }
      if (cardCvcRef.current) { try { cardCvcRef.current.destroy(); } catch (e) {} cardCvcRef.current = null; }
      if (expressCheckoutRef.current) { try { expressCheckoutRef.current.destroy(); } catch (e) {} expressCheckoutRef.current = null; }
    };
  }, []);

  const initializeStripeUI = async (retry = 0) => {
    try {
      if (!window.Stripe) {
        if (retry < 15) setTimeout(() => initializeStripeUI(retry + 1), 200);
        return;
      }

      const numMount = document.getElementById('course-card-number-element');
      const expMount = document.getElementById('course-card-expiry-element');
      const cvcMount = document.getElementById('course-card-cvc-element');
      const walletMount = document.getElementById('course-wallet-button-element');

      if (!numMount || !expMount || !cvcMount) {
        if (retry < 20) setTimeout(() => initializeStripeUI(retry + 1), 100);
        return;
      }

      // Cleanup prior elements
      if (cardNumberRef.current) { try { cardNumberRef.current.destroy(); } catch (e) {} cardNumberRef.current = null; }
      if (cardExpiryRef.current) { try { cardExpiryRef.current.destroy(); } catch (e) {} cardExpiryRef.current = null; }
      if (cardCvcRef.current) { try { cardCvcRef.current.destroy(); } catch (e) {} cardCvcRef.current = null; }
      if (expressCheckoutRef.current) { try { expressCheckoutRef.current.destroy(); } catch (e) {} expressCheckoutRef.current = null; }

      numMount.innerHTML = '';
      expMount.innerHTML = '';
      cvcMount.innerHTML = '';

      const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
      stripeRef.current = stripe;

      const elements = stripe.elements({
        fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }],
      });
      elementsRef.current = elements;

      const style = {
        base: {
          fontFamily: '"Inter", -apple-system, sans-serif',
          fontSize: '15px',
          fontWeight: '500',
          color: '#09090b',
          letterSpacing: '0.01em',
          lineHeight: '22px',
          '::placeholder': { color: '#71717a', fontWeight: '400' },
          iconColor: '#09090b',
        },
        invalid: { color: '#dc2626', iconColor: '#dc2626' },
        complete: { color: '#09090b', iconColor: '#16a34a' },
      };

      const cardNumber = elements.create('cardNumber', { style, placeholder: '1234 1234 1234 1234' });
      const cardExpiry = elements.create('cardExpiry', { style, placeholder: 'MM / YY' });
      const cardCvc = elements.create('cardCvc', { style, placeholder: 'CVC' });

      cardNumber.mount('#course-card-number-element');
      cardExpiry.mount('#course-card-expiry-element');
      cardCvc.mount('#course-card-cvc-element');

      cardNumberRef.current = cardNumber;
      cardExpiryRef.current = cardExpiry;
      cardCvcRef.current = cardCvc;

      cardNumber.on('change', (e: any) => {
        setCardBrand(e.brand || 'unknown');
        setCardComplete(prev => ({ ...prev, number: e.complete }));
        if (e.error) setErrorMessage(e.error.message);
        else setErrorMessage(null);
        if (!e.empty) {
          setHidePayPal(true);
          if (!hasAddedPaymentInfo) {
            trackMetaEvent({
              eventName: 'AddPaymentInfo',
              content_name: '3 Architecture & 3D Visualization Master Courses',
              content_ids: ['courses-sketchup-vray-d5'],
              content_type: 'product',
              value: totalPrice,
              currency: 'USD'
            });
            setHasAddedPaymentInfo(true);
          }
        }
      });

      cardExpiry.on('change', (e: any) => {
        setCardComplete(prev => ({ ...prev, expiry: e.complete }));
        if (e.error) setErrorMessage(e.error.message);
      });

      cardCvc.on('change', (e: any) => {
        setCardComplete(prev => ({ ...prev, cvc: e.complete }));
        if (e.error) setErrorMessage(e.error.message);
      });

      // Apple Pay / Google Pay / Link via Express Checkout Element
      if (walletMount) {
        walletMount.innerHTML = '';
        const expressElements = stripe.elements({
          mode: 'payment',
          amount: Math.round(totalPrice * 100),
          currency: 'usd',
        });

        const expressCheckout = expressElements.create('expressCheckout', {
          buttonHeight: 48,
          buttonTheme: { applePay: 'black', googlePay: 'black' },
          buttonType: { applePay: 'buy', googlePay: 'buy' },
          layout: { maxColumns: 2, maxRows: 1 },
        });

        expressCheckoutRef.current = expressCheckout;
        expressCheckout.mount('#course-wallet-button-element');

        expressCheckout.on('ready', (event: any) => {
          const methods = event?.availablePaymentMethods;
          if (methods && (methods.applePay || methods.googlePay || methods.link || Object.values(methods).some(Boolean))) {
            setShowWalletButton(true);
          }
        });

        expressCheckout.on('confirm', async (ev: any) => {
          try {
            const payerEmail = ev.billingDetails?.email || email || '';
            const payerName = ev.billingDetails?.name || payerEmail.split('@')[0] || 'Customer';
            const res = await createPaymentIntent(payerEmail, `$${totalPrice}`);
            const clientSecret = res.clientSecret;
            const customerId = res.customerId;

            const { error, paymentIntent } = await stripe.confirmPayment({
              elements: expressElements,
              clientSecret,
              confirmParams: { return_url: window.location.origin + '/courses/thankyou?success=true' },
              redirect: 'if_required',
            });

            if (error) {
              setErrorMessage(error.message || 'Payment failed.');
            } else if (paymentIntent?.status === 'succeeded') {
              sendStageEmail(payerEmail, 'render');
              trackMetaEvent({
                eventName: 'Purchase',
                value: totalPrice,
                currency: 'USD',
                content_name: '3 Architecture & 3D Visualization Master Courses',
                content_ids: ['courses-sketchup-vray-d5'],
                content_type: 'product',
                order_id: paymentIntent.id
              });
              onSuccess({
                customerId,
                paymentMethodId: typeof paymentIntent.payment_method === 'string' ? paymentIntent.payment_method : paymentIntent.payment_method?.id,
                paymentIntentId: paymentIntent.id,
                email: payerEmail,
                purchased: autocadAddon ? ['render', 'autocad'] : ['render']
              });
            }
          } catch (err: any) {
            setErrorMessage(err.message || 'Payment failed.');
          }
        });
      }
    } catch (err: any) {
      console.error("Stripe Course Init Failed:", err);
    }
  };

  // --- CARD PAYMENT HANDLER ---
  const handleCardPay = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!cardComplete.number || !cardComplete.expiry || !cardComplete.cvc) {
      setErrorMessage("Please complete your card details.");
      return;
    }
    if (!stripeRef.current || !cardNumberRef.current) {
      setErrorMessage("Payment gateway loading. Please wait a moment.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const customerName = name.trim() || email.split('@')[0] || 'Customer';

      // 1. Create PaymentIntent on server
      const res = await createPaymentIntent(email, `$${totalPrice}`);
      const clientSecret = res.clientSecret;
      const customerId = res.customerId;

      // 2. Confirm payment
      const result = await stripeRef.current.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberRef.current,
          billing_details: {
            name: customerName,
            email,
          },
        },
        receipt_email: email,
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Payment failed.");
        setIsProcessing(false);
      } else if (result.paymentIntent?.status === 'succeeded') {
        trackMetaEvent({
          eventName: 'Purchase',
          email,
          value: totalPrice,
          currency: 'USD',
          content_name: '3 Architecture & 3D Visualization Master Courses',
          content_ids: ['courses-sketchup-vray-d5'],
          content_type: 'product',
          order_id: result.paymentIntent.id
        });

        sendStageEmail(email, 'render');

        onSuccess({
          customerId,
          paymentMethodId: typeof result.paymentIntent.payment_method === 'string' ? result.paymentIntent.payment_method : result.paymentIntent.payment_method?.id,
          paymentIntentId: result.paymentIntent.id,
          email,
          purchased: autocadAddon ? ['render', 'autocad'] : ['render']
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  // --- PAYPAL SUBMIT HANDLER ---
  const handlePaypalSubmit = (e: React.FormEvent) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.preventDefault();
      setEmailError(true);
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!hasAddedPaymentInfo) {
      trackMetaEvent({
        eventName: 'AddPaymentInfo',
        content_name: '3 Architecture & 3D Visualization Master Courses',
        content_ids: ['courses-sketchup-vray-d5'],
        content_type: 'product',
        value: totalPrice,
        currency: 'USD',
        payment_type: 'paypal'
      });
      setHasAddedPaymentInfo(true);
    }

    try {
      localStorage.setItem('avada_course_order', JSON.stringify({
        email,
        purchased: autocadAddon ? ['render', 'autocad'] : ['render'],
        productTitle: '3 Architecture & 3D Master Courses',
        price: `${totalPrice}.00`,
        timestamp: Date.now()
      }));
    } catch(e) {}
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  const handleBack = () => {
    if (onBackToLanding) {
      onBackToLanding();
    } else {
      window.location.href = '/courses';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .checkout-container * { font-family: 'Inter', -apple-system, sans-serif; }
        #course-card-number-element, #course-card-expiry-element, #course-card-cvc-element { min-height: 24px; width: 100%; }
        .__PrivateStripeElement { width: 100% !important; }
        .__PrivateStripeElement iframe { min-height: 24px !important; }
      `}</style>

      {/* === STICKY TOPBAR === */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
        <header className="max-w-5xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between py-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-800 hover:text-black font-semibold transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-gray-900" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-gray-950 tracking-tight">
              3 Architecture & 3D Master Courses
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-900 font-bold">
            <Lock size={13} className="text-emerald-700" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </header>

        {/* Sticky Timer Bar */}
        <div className="border-t border-gray-100 py-2 bg-white flex items-center justify-center gap-2 text-xs font-semibold text-gray-900">
          <Timer size={13} className="text-gray-900 shrink-0" />
          <span className="text-gray-800 font-semibold tracking-tight">Offer ends in</span>
          <span className="font-mono font-black text-gray-950 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded text-xs tracking-wider">
            {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
          </span>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="checkout-container max-w-5xl mx-auto px-3 sm:px-6 py-2.5 sm:py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-8">

          {/* ========== LEFT COLUMN: ORDER SUMMARY ========== */}
          <div className="flex-1 lg:max-w-[50%]">
            <div className="lg:sticky lg:top-24">

              {/* Callout */}
              <p className="text-[11px] sm:text-xs text-gray-800 font-medium text-center mb-2 sm:mb-4">
                <span className="font-bold text-gray-950">One-time payment.</span> Instant digital access & download immediately after payment.
              </p>

              {/* Premium Movie Ticket Pass */}
              <div className="relative bg-white rounded-xl sm:rounded-2xl border border-gray-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.07)] overflow-hidden">
                {/* Ticket Upper Section */}
                <div className="p-3 sm:p-5 pb-2 sm:pb-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-[15px] sm:text-lg font-black text-gray-950 leading-snug">
                        3 Architecture & 3D Courses
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">SketchUp + V-Ray + D5 Render AI</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-baseline justify-end gap-1 sm:gap-1.5">
                        <span className="text-xs text-gray-500 line-through font-bold">
                          ${autocadAddon ? FRONT_END_ORIGINAL_PRICE + AUTOCAD_ADDON_ORIGINAL_PRICE : FRONT_END_ORIGINAL_PRICE}
                        </span>
                        <span className="text-xl sm:text-3xl font-black text-gray-950 tracking-tight">
                          ${totalPrice}<span className="text-sm sm:text-base font-bold text-gray-600">.00</span>
                        </span>
                      </div>
                      <span className="inline-block mt-0.5 text-[9px] sm:text-[9.5px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                        SAVE 69% ($20 OFF)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Perforated Tear Line with Semicircular Ticket Notches */}
                <div className="relative flex items-center justify-between my-0.5 sm:my-1">
                  <div className="w-2.5 sm:w-3.5 h-5 sm:h-7 bg-gray-50 border-r border-y border-gray-300 rounded-r-full -ml-[1px]" />
                  <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2 relative">
                    <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-2 text-[8.5px] sm:text-[9px] font-mono font-bold text-gray-700 uppercase tracking-widest">
                      Lifetime Access Pass
                    </span>
                  </div>
                  <div className="w-2.5 sm:w-3.5 h-5 sm:h-7 bg-gray-50 border-l border-y border-gray-300 rounded-l-full -mr-[1px]" />
                </div>

                {/* Ticket Lower Section */}
                <div className="p-3 sm:p-5 pt-2 sm:pt-3 bg-gradient-to-b from-stone-50/80 to-white space-y-2">
                  <p className="text-[10px] sm:text-[10.5px] font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-3.5 sm:w-4 h-3.5 sm:h-4 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xs">
                      <Check size={9} className="text-white" strokeWidth={3} />
                    </span>
                    INCLUDED WITH THIS BUNDLE
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 pt-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>10,000+ Textures & PBR</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>2,000+ 3D Assets & Models</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>SketchUp Pro 3D Course</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>V-Ray 6 Photorealism</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>D5 Render AI Mastery</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>Certificate on Completion</span>
                    </div>
                  </div>

                  
                </div>
              </div>

              {/* Order Bump (AutoCAD Mastery) */}
              <div
                id="autocad-order-bump-card"
                onClick={() => setAutocadAddon(!autocadAddon)}
                className={`mt-3 sm:mt-4 border-2 rounded-2xl p-4 cursor-pointer transition-all bg-white shadow-xs ${
                  autocadAddon ? 'border-orange-500 bg-orange-50/40' : 'border-dashed border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      autocadAddon ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-400 bg-white'
                    }`}
                  >
                    {autocadAddon && <Check size={14} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src="/images/autocad-logo.svg" 
                          alt="AutoCAD Logo" 
                          className="w-4 h-4 sm:w-5 sm:h-5 object-contain shrink-0" 
                        />
                        <span className="text-xs font-bold text-gray-950">
                          Add AutoCAD 2D Drafting Mastery (Special Offer)
                        </span>
                      </div>
                      <span className="text-xs font-black text-orange-600 shrink-0 ml-2">+${AUTOCAD_ADDON_PRICE}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                      Master architectural floor plans, electrical layouts, and construction drawings. (Normally ${AUTOCAD_ADDON_ORIGINAL_PRICE})
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing Details divider (mobile only) */}
              <div className="flex items-center gap-3 mt-3 sm:mt-4 lg:hidden">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-600 uppercase tracking-widest">Billing Details</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

            </div>
          </div>

          {/* ========== RIGHT COLUMN: PAYMENT FORM ========== */}
          <div className="flex-1 lg:max-w-[50%]">
            {/* Billing Details divider (desktop / laptop) */}
            <div className="hidden lg:flex items-center gap-3 mb-3 sm:mb-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Billing Details</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.07)] overflow-hidden">

              {/* Apple Pay / Google Pay via Express Checkout Element */}
              <div className={showWalletButton ? "p-4 sm:p-5 pb-0" : "px-4 sm:px-5"}>
                <div id="course-wallet-button-element" className="mb-1" />
                {showWalletButton && (
                  <div className="flex items-center gap-3 my-2 sm:my-3">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="text-[10px] sm:text-[11px] font-bold text-gray-600 uppercase tracking-wider">Or pay with card</span>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">

                {/* Email address */}
                <div>
                  <label className="text-xs font-bold text-gray-950 mb-1.5 block tracking-wide uppercase">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(false); setErrorMessage(null); }}
                    placeholder="you@example.com"
                    className={`block w-full px-4 py-3.5 bg-white border text-[15px] font-medium text-gray-950 rounded-xl transition-all focus:outline-none focus:ring-1 ${
                      emailError
                        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                        : 'border-gray-300 focus:ring-gray-950 focus:border-gray-950 hover:border-gray-400'
                    }`}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Your lifetime access link and invoice will be dispatched here.
                  </p>
                </div>

                {/* Card Number */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-950 tracking-wide uppercase">Card number</label>
                    <div className="flex items-center gap-1.5">
                      {cardBrand === 'visa' && <img src="https://js.stripe.com/v3/fingerprinted/img/visa-365725566f9578a9589553aa9296d178.svg" alt="Visa" className="h-5" />}
                      {cardBrand === 'mastercard' && <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-5" />}
                      {cardBrand === 'amex' && <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-5" />}
                      {cardBrand === 'unknown' && (
                        <div className="flex gap-1 opacity-60">
                          <img src="https://js.stripe.com/v3/fingerprinted/img/visa-365725566f9578a9589553aa9296d178.svg" alt="Visa" className="h-4" />
                          <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="MC" className="h-4" />
                          <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    onClick={() => cardNumberRef.current?.focus()}
                    className="border border-gray-300 rounded-xl px-4 py-3.5 hover:border-gray-400 transition-colors focus-within:border-gray-950 focus-within:ring-1 focus-within:ring-gray-950 bg-white cursor-text min-h-[48px] flex items-center"
                  >
                    <div id="course-card-number-element" className="w-full" />
                  </div>
                </div>

                {/* Expiry + CVC row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-950 mb-1.5 block tracking-wide uppercase">Expiry</label>
                    <div
                      onClick={() => cardExpiryRef.current?.focus()}
                      className="border border-gray-300 rounded-xl px-4 py-3.5 hover:border-gray-400 transition-colors focus-within:border-gray-950 focus-within:ring-1 focus-within:ring-gray-950 bg-white cursor-text min-h-[48px] flex items-center"
                    >
                      <div id="course-card-expiry-element" className="w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-950 mb-1.5 block tracking-wide uppercase">CVC</label>
                    <div
                      onClick={() => cardCvcRef.current?.focus()}
                      className="border border-gray-300 rounded-xl px-4 py-3.5 hover:border-gray-400 transition-colors focus-within:border-gray-950 focus-within:ring-1 focus-within:ring-gray-950 bg-white cursor-text min-h-[48px] flex items-center"
                    >
                      <div id="course-card-cvc-element" className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Error */}
                {errorMessage && (
                  <div className="p-3.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-200">
                    <AlertCircle size={15} className="shrink-0 text-red-600" />
                    {errorMessage}
                  </div>
                )}

                {/* Pay button */}
                <button
                  onClick={handleCardPay}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gray-950 hover:bg-black text-white rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.99] mt-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <><Lock size={15} className="text-emerald-400" /><span>Pay ${totalPrice}.00 & Access Courses</span></>
                  )}
                </button>

                {/* OR divider */}
                {!hidePayPal && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Or</span>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>
                )}

                {/* PayPal button */}
                {!hidePayPal && (
                  <form action="https://www.paypal.com/cgi-bin/webscr" method="post" onSubmit={handlePaypalSubmit}>
                    <input type="hidden" name="cmd" value="_xclick" />
                    <input type="hidden" name="business" value={PAYPAL_BUSINESS_EMAIL} />
                    <input type="hidden" name="item_name" value={autocadAddon ? "AVADA 3 Architecture & 3D Master Courses + AutoCAD Add-on" : "AVADA 3 Architecture & 3D Master Courses"} />
                    <input type="hidden" name="item_number" value={autocadAddon ? "AVADA-COURSES-AUTOCAD" : "AVADA-COURSES-3D"} />
                    <input type="hidden" name="amount" value={totalPrice} />
                    <input type="hidden" name="currency_code" value="USD" />
                    <input type="hidden" name="return" value={`${window.location.origin}/courses/thankyou?email=${encodeURIComponent(email)}&method=paypal`} />
                    <input type="hidden" name="notify_url" value="https://dhufnozehayzjlsmnvdl.supabase.co/functions/v1/paypal-ipn" />
                    <input type="hidden" name="custom" value={email} />
                    <input type="hidden" name="rm" value="2" />
                    <input type="hidden" name="cbr" value="1" />
                    <input type="hidden" name="email" value={email} />
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#ffc439] hover:bg-[#f0b72e] text-gray-950 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer"
                    >
                      Pay with <img src={PAYPAL_LOGO_URL} alt="PayPal" className="h-5 object-contain" />
                    </button>
                  </form>
                )}

                
              </div>
            </div>

            {/* Guarantees & Badges */}
            <div className="mt-4 text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" /> 30-Day Money Back
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Lock size={14} className="text-gray-600" /> 256-Bit SSL Encrypted
                </span>
              </div>
              <p className="text-[10px] text-gray-400">
                Instant Digital Access · Free Future Updates · 24/7 Student Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
