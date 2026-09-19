import React, { useState, useEffect } from "react";
import { UPSELL_COURSES, UPSELL_PRICE, UPSELL_ORIGINAL_PRICE } from "../../constants-courses";
import { Sparkles, Timer, CheckCircle2, Download, Mail, Lock, Check, X, ArrowRight, Gift, Zap, Star, ShieldCheck } from "lucide-react";
import ModernPaymentForm from "../ui/modern-payment-form";
import { chargeSavedCardUpsell } from "../../services/stripe";
import { sendStageEmail } from "../../services/email";
import FunnelProgressBar from "./FunnelProgressBar";
import { trackMetaEvent } from "../../utils/meta-tracking";

interface CourseOnetimePageProps {
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

export const CourseOnetimePage: React.FC<CourseOnetimePageProps> = ({ orderState, onProceed }) => {
  const { customerId, paymentMethodId, paymentIntentId, email = '', purchased = ['render'] } = orderState;
  const [timeLeft, setTimeLeft] = useState({ m: 9, s: 59 });
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingUpSell, setIsProcessingUpSell] = useState(false);
  const [userEmail, setUserEmail] = useState(email);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackMetaEvent({
      eventName: "ViewContent",
      content_name: "Architecture Master Suite 12-Course Upsell",
      value: UPSELL_PRICE,
      currency: "USD"
    });
  }, []);

  // 10-minute countdown timer
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

  const handleSuccess = (newCustomerId?: string, newPaymentMethodId?: string) => {
    trackMetaEvent({
      eventName: "Purchase",
      value: UPSELL_PRICE,
      currency: "USD",
      content_name: "Architecture Master Suite 12-Course Upsell",
      content_ids: ["upsell-12-courses"],
      content_type: "product"
    });
    sendStageEmail(userEmail, 'full');
    onProceed({
      customerId: newCustomerId ?? customerId,
      paymentMethodId: newPaymentMethodId ?? paymentMethodId,
      paymentIntentId,
      email: userEmail,
      purchased: [...purchased, 'full']
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

  const handleCTA = async () => {
    console.log('[CourseOnetimePage] handleCTA called. customerId:', customerId, 'paymentMethodId:', paymentMethodId);
    if (customerId) {
      setIsProcessingUpSell(true);
      try {
        await chargeSavedCardUpsell(customerId, `$${UPSELL_PRICE}`, paymentMethodId, paymentIntentId);
        handleSuccess();
      } catch (err) {
        console.error("One-click upsell failed", err);
        setIsProcessingUpSell(false);
        setShowPayment(true);
      }
    } else {
      setShowPayment(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white text-gray-900 font-sans">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .upsell-fade { animation: fadeIn 0.6s ease-out both; }
        @keyframes subtlePulse { 
          0%, 100% { transform: scale(1); box-shadow: 0 4px 14px 0 rgba(249,115,22,0.2); } 
          50% { transform: scale(1.02); box-shadow: 0 6px 20px rgba(249,115,22,0.4); } 
        }
        .btn-pulse { animation: subtlePulse 2.5s ease-in-out infinite; }
      `}</style>

      {/* Funnel Progress Bar */}
      <FunnelProgressBar step={2} />

      {/* Top Banner */}
      <div className="sticky top-0 z-50 bg-orange-500 text-white text-center py-2 px-4 shadow-md">
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold">
          <Timer size={14} className="animate-pulse" />
          <span>WAIT! One-Time Exclusive Upgrade — Expires in {f(timeLeft.m)}:{f(timeLeft.s)}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 upsell-fade">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-4">
            <Gift size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Special 1-Time Upgrade</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black mb-3 leading-tight text-gray-900">
            Unlock All 12 Architectural & AI Master Courses for Just <span className="text-orange-600">${UPSELL_PRICE}</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-lg mx-auto">
            Upgrade now to include <strong className="text-gray-900">3ds Max, Revit BIM, Lumion, Unreal Engine 5, Midjourney AI Architecture</strong> and Photoshop Post-Production at 86% off!
          </p>
        </div>

        {/* Price Card */}
        <div className="upsell-fade bg-white shadow-xl shadow-gray-200/50 border border-gray-200 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Complete Master Suite</p>
              <p className="text-gray-500 text-sm">All 12 Premium Architecture & 3D Courses</p>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-lg line-through mr-2">${UPSELL_ORIGINAL_PRICE}</span>
              <span className="text-4xl font-display font-black text-gray-900">${UPSELL_PRICE}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            <Zap size={14} className="text-emerald-500" />
            <span className="text-xs md:text-sm font-semibold text-emerald-700">
              You save ${UPSELL_ORIGINAL_PRICE - UPSELL_PRICE} — Instant 1-Click Upgrade
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="upsell-fade mb-8 w-full max-w-xl mx-auto">
          {!showPayment ? (
            <div className="space-y-3">
              <button
                disabled={isProcessingUpSell}
                onClick={handleCTA}
                className="w-full py-4 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] btn-pulse disabled:opacity-70 disabled:cursor-wait"
                style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
              >
                <Gift size={20} />
                {isProcessingUpSell ? "Processing Instant Upgrade..." : "Yes! Unlock All 12 Courses Now ($27)"}
                {!isProcessingUpSell && <ArrowRight size={20} />}
              </button>

              <button
                onClick={handleSkip}
                className="block w-full text-center text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors py-2"
              >
                No thanks, I'll pass on the full master suite →
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
              <p className="text-sm font-bold text-gray-900 mb-3">Complete your $27 Upgrade:</p>
              <ModernPaymentForm
                amount={`$${UPSELL_PRICE}`}
                onSuccess={handleSuccess}
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

        {/* Courses Grid */}
        <div className="upsell-fade mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-orange-500" /> Additional Courses Included:
          </h3>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {UPSELL_COURSES.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:border-orange-500/40 transition-all group"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-1 right-1 bg-black/70 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full">
                    {course.software}
                  </div>
                </div>
                <div className="p-2">
                  <h4 className="font-bold text-gray-900 text-[11px] line-clamp-1">{course.title}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={8} className="fill-orange-400 text-orange-400" />
                    <span className="text-[9px] text-gray-500">{course.students}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1"><ShieldCheck size={12} /> 30-Day Money-Back</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Lock size={12} /> 256-Bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
};
