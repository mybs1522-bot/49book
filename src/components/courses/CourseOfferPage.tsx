import React, { useState, useEffect } from "react";
import { RAW_BOOKS, UPSELL2_PRICE, UPSELL2_ORIGINAL_PRICE, DOWNSELL_BOOKS_PRICE } from "../../constants-courses";
import { Sparkles, Timer, CheckCircle2, Mail, Lock, Check, ArrowRight, Gift, Zap, Star, ShieldCheck, BookOpen, X } from "lucide-react";
import ModernPaymentForm from "../ui/modern-payment-form";
import { chargeSavedCardUpsell } from "../../services/stripe";
import { sendStageEmail } from "../../services/email";
import FunnelProgressBar from "./FunnelProgressBar";
import { trackMetaEvent } from "../../utils/meta-tracking";

interface CourseOfferPageProps {
  orderState: {
    customerId?: string;
    paymentMethodId?: string;
    paymentIntentId?: string;
    email: string;
    purchased: string[];
  };
  onProceed: (nextState: {
    customerId?: string;
    paymentMethodId?: string;
    paymentIntentId?: string;
    email: string;
    purchased: string[];
  }) => void;
}

export const CourseOfferPage: React.FC<CourseOfferPageProps> = ({ orderState, onProceed }) => {
  const { customerId, paymentMethodId, paymentIntentId, email = '', purchased = ['render'] } = orderState;
  const [timeLeft, setTimeLeft] = useState({ m: 14, s: 59 });
  const [userEmail, setUserEmail] = useState(email);
  const [showPayment, setShowPayment] = useState<false | 'books' | 'downsell'>(false);
  const [isProcessingUpSell, setIsProcessingUpSell] = useState(false);
  const [isProcessingDownsell, setIsProcessingDownsell] = useState(false);
  const [isConfirmingSkip, setIsConfirmingSkip] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackMetaEvent({
      eventName: "ViewContent",
      content_name: "6 Books Design Library Upsell",
      value: UPSELL2_PRICE,
      currency: "USD"
    });
  }, []);

  // 10-minute timer
  useEffect(() => {
    const start = Date.now();
    const duration = 10 * 60 * 1000;
    const calc = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft({
        m: Math.floor((remaining / 60000) % 60),
        s: Math.floor((remaining / 1000) % 60),
      });
    };
    const t = setInterval(calc, 1000);
    calc();
    return () => clearInterval(t);
  }, []);

  const f = (v: number) => v.toString().padStart(2, "0");

  const handleSuccess = (productMode: 'books' | 'downsell') => {
    trackMetaEvent({
      eventName: "Purchase",
      value: productMode === 'downsell' ? DOWNSELL_BOOKS_PRICE : UPSELL2_PRICE,
      currency: "USD",
      content_name: "6 Books Design Library",
      content_ids: ["6-books-upsell"],
      content_type: "product"
    });
    sendStageEmail(userEmail, productMode);
    onProceed({
      customerId,
      paymentMethodId,
      paymentIntentId,
      email: userEmail,
      purchased: [...purchased, productMode]
    });
  };

  const handleSkip = () => {
    onProceed({
      customerId,
      paymentMethodId,
      paymentIntentId,
      email: userEmail,
      purchased
    });
  };

  const executeUpsell = async () => {
    if (customerId) {
      setIsProcessingUpSell(true);
      try {
        await chargeSavedCardUpsell(customerId, `$${UPSELL2_PRICE}`, paymentMethodId, paymentIntentId);
        handleSuccess('books');
      } catch (err) {
        console.error("One-click upsell failed", err);
        setIsProcessingUpSell(false);
        setShowPayment('books');
        setIsConfirmingSkip(false);
      }
    } else {
      setShowPayment('books');
      setIsConfirmingSkip(false);
    }
  };

  const executeDownsell = async () => {
    if (customerId) {
      setIsProcessingDownsell(true);
      try {
        await chargeSavedCardUpsell(customerId, `$${DOWNSELL_BOOKS_PRICE}`, paymentMethodId, paymentIntentId);
        handleSuccess('downsell');
      } catch (err) {
        console.error("One-click downsell failed", err);
        setIsProcessingDownsell(false);
        setShowPayment('downsell');
        setIsConfirmingSkip(false);
      }
    } else {
      setShowPayment('downsell');
      setIsConfirmingSkip(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white text-gray-900 font-sans">
      {/* Funnel Progress Bar */}
      <FunnelProgressBar step={3} />

      {/* Top Banner */}
      <div className="sticky top-0 z-50 bg-amber-500 text-white text-center py-2 px-4 shadow-md">
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold">
          <Timer size={14} className="animate-pulse" />
          <span>FINAL STEP: Exclusive Design Library Add-On — Expires in {f(timeLeft.m)}:{f(timeLeft.s)}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-4">
            <BookOpen size={14} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
              Architectural Dimension Manuals
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black mb-3 leading-tight text-gray-900">
            Add the Complete <span className="text-orange-600">6-Book Home Design Library</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-lg mx-auto">
            800+ handmade diagrams covering exact clearances, room dimensions & layout rules for living rooms, kitchens, bedrooms, and washrooms.
          </p>
        </div>

        {/* Price Card */}
        <div className="bg-white shadow-xl shadow-gray-200/50 border border-gray-200 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">
                6-Book E-Book Collection
              </p>
              <p className="text-gray-500 text-sm">800+ Pages of Architectural Rules</p>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-lg line-through mr-2">${UPSELL2_ORIGINAL_PRICE}</span>
              <span className="text-4xl font-display font-black text-gray-900">${UPSELL2_PRICE}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            <Zap size={14} className="text-emerald-500" />
            <span className="text-xs md:text-sm font-semibold text-emerald-700">
              One-time special price: Save ${UPSELL2_ORIGINAL_PRICE - UPSELL2_PRICE} today
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mb-8 w-full max-w-xl mx-auto">
          {!showPayment ? (
            <div className="space-y-3">
              <button
                disabled={isProcessingUpSell}
                onClick={executeUpsell}
                className="w-full py-4 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait shadow-xl shadow-orange-500/25"
                style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
              >
                <BookOpen size={20} />
                {isProcessingUpSell ? "Processing Add-on..." : `Yes! Add All 6 Books ($${UPSELL2_PRICE})`}
                {!isProcessingUpSell && <ArrowRight size={20} />}
              </button>

              <button
                onClick={() => setIsConfirmingSkip(true)}
                className="block w-full text-center text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors py-2"
              >
                No thanks, take me to my course downloads →
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
              <p className="text-sm font-bold text-gray-900 mb-3">
                Complete your {showPayment === 'downsell' ? `$${DOWNSELL_BOOKS_PRICE}` : `$${UPSELL2_PRICE}`} addition:
              </p>
              <ModernPaymentForm
                amount={showPayment === 'downsell' ? `$${DOWNSELL_BOOKS_PRICE}` : `$${UPSELL2_PRICE}`}
                onSuccess={() => handleSuccess(showPayment as any)}
                email={userEmail}
                setEmail={setUserEmail}
              />
              <button
                onClick={handleSkip}
                className="mt-3 block w-full text-center text-gray-400 hover:text-gray-600 text-xs py-1"
              >
                Skip this offer →
              </button>
            </div>
          )}
        </div>

        {/* 6 Books Showcase Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {RAW_BOOKS.map((book) => (
            <div key={book.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden p-3 shadow-sm">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-2">
                <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{book.title}</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">{book.software}</p>
            </div>
          ))}
        </div>

        {/* Skip Confirmation Modal / Downsell Offer */}
        {isConfirmingSkip && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative">
              <button
                onClick={() => setIsConfirmingSkip(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                🎁
              </div>

              <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
                Wait! Special Downsell Offer
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Get our top 2 essential design manuals (Living Room + Kitchen Design Books) for just <strong className="text-gray-950">${DOWNSELL_BOOKS_PRICE}</strong> instead of ${UPSELL2_PRICE}!
              </p>

              <div className="space-y-2">
                <button
                  disabled={isProcessingDownsell}
                  onClick={executeDownsell}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  {isProcessingDownsell ? "Processing..." : `Get 2 Core Books for $${DOWNSELL_BOOKS_PRICE}`}
                </button>

                <button
                  onClick={handleSkip}
                  className="w-full py-2 text-gray-400 hover:text-gray-600 text-xs font-medium"
                >
                  No thanks, continue without books
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
