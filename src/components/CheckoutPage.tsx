import React, { useState, useEffect, useRef } from 'react';
import {
    Lock, Check, Loader2, Timer, CreditCard, Mail, ShieldCheck, AlertCircle,
    ArrowLeft, BookOpen, CheckCircle2, Download, Star, Shield, Clock,
    MessageSquare
} from 'lucide-react';
import { trackMetaEvent } from '../utils/meta-tracking';
import { BOOK_IMAGES } from '../AppHelpers';

// --- CONFIGURATION ---
const STRIPE_PUBLISHABLE_KEY = "pk_live_51PRJCsGGsoQTkhyv6OrT4zvnaaB5Y0MSSkTXi0ytj33oygsfW3dcu6aOFa9q3dr2mXYTCJErnFQJcOcyuDAsQd4B00lIAdclbB";
const BACKEND_URL = "https://dhufnozehayzjlsmnvdl.supabase.co/functions/v1/create-payment-intent";
const PAYPAL_BUSINESS_EMAIL = "design@avada.in";
const PAYPAL_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg";

declare global {
    interface Window {
        Stripe?: (key: string) => any;
    }
}

// Book labels for the order summary
const BOOK_LABELS = [
    { key: 'living', label: 'Living Room Design' },
    { key: 'kitchen', label: 'Kitchen Design' },
    { key: 'bedroom', label: 'Bedroom Design' },
    { key: 'washroom', label: 'Washroom Design' },
    { key: 'study', label: 'Study Design' },
    { key: 'elevations', label: 'Elevations Design' },
];

/**
 * REFINED CHECKOUT COMPONENT
 * Implements Stripe Link, Unified Payment Element, 8px grid, and monochrome design.
 */
export const CheckoutPage: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    // Meta InitiateCheckout
    useEffect(() => {
        trackMetaEvent({
            eventName: 'InitiateCheckout',
            value: 49.00,
            currency: 'USD',
            content_name: 'Interior Design System - 6 Book Collection',
            content_type: 'product'
        });
    }, []);

    // --- STATE ---
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isStripeLoaded, setIsStripeLoaded] = useState(false);
    const [viewState, setViewState] = useState<'FORM' | 'PROCESSING' | 'SUCCESS'>('FORM');
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
    const [isVisible, setIsVisible] = useState(false);

    const stripeRef = useRef<any>(null);
    const elementsRef = useRef<any>(null);

    // --- ENTRANCE ANIMATION ---
    useEffect(() => { requestAnimationFrame(() => setIsVisible(true)); }, []);

    // --- TIMER (synced with landing page via shared localStorage key) ---
    useEffect(() => {
        const INITIAL_SECONDS = (4 * 3600) + (36 * 60) + 27;
        const getTarget = () => {
            const stored = localStorage.getItem('timer_target');
            const now = Date.now();
            if (stored) {
                const target = parseInt(stored, 10);
                if (target > now) return target;
            }
            const newTarget = now + (INITIAL_SECONDS * 1000);
            localStorage.setItem('timer_target', newTarget.toString());
            return newTarget;
        };
        const target = getTarget();
        const calc = () => {
            const diff = Math.max(0, target - Date.now());
            setTimeLeft({ h: Math.floor(diff / (1000 * 60 * 60)), m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)), s: Math.floor((diff % (1000 * 60)) / 1000) });
        };
        const t = setInterval(calc, 1000); calc();
        return () => clearInterval(t);
    }, []);

    // --- STRIPE INIT ---
    useEffect(() => {
        if (!stripeRef.current) initializeStripeUI();
    }, []);

    const initializeStripeUI = async (retry = 0) => {
        try {
            if (!window.Stripe) {
                if (retry < 5) setTimeout(() => initializeStripeUI(retry + 1), 500);
                return;
            }
            if (stripeRef.current) return;

            stripeRef.current = window.Stripe(STRIPE_PUBLISHABLE_KEY);
            elementsRef.current = stripeRef.current.elements({
                mode: 'payment',
                amount: 4900,
                currency: 'usd',
                payment_method_types: ['card', 'crypto'], // Enabled crypto and card

                appearance: {
                    theme: 'stripe',
                    variables: {
                        fontFamily: '"Inter", -apple-system, sans-serif',
                        fontSizeBase: '14px',
                        colorPrimary: '#0570DE',
                        borderRadius: '8px',
                    },
                },
            });

            // Payment Element — handles cards, Link, Google Pay, etc.
            const paymentElement = elementsRef.current.create('payment', {
                layout: 'tabs',
                fields: {
                    billingDetails: {
                        address: 'never',
                    },
                },
            });
            const peMount = document.getElementById('stripe-payment-element');
            if (peMount) paymentElement.mount('#stripe-payment-element');

            // Link authentication element — captures email and enables Link autofill
            const linkAuth = elementsRef.current.create('linkAuthentication', {});
            const linkMount = document.getElementById('stripe-link-auth');
            if (linkMount) linkAuth.mount('#stripe-link-auth');
            linkAuth.on('change', (event: any) => {
                if (event.value?.email) setEmail(event.value.email);
            });

            setIsStripeLoaded(true);
        } catch (err: any) {
            console.error("Stripe Init Failed:", err);
            setErrorMessage("Card gateway unavailable. Please try PayPal.");
            setIsStripeLoaded(false);
        }
    };

    const handlePaypalSubmit = (e: React.FormEvent) => {
        let hasError = false;
        if (!name.trim()) { setNameError(true); hasError = true; }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError(true); hasError = true; }
        if (hasError) {
            e.preventDefault();
            setErrorMessage("Please fill in all fields to receive your books.");
            return;
        }
        setViewState('PROCESSING');
    };

    const handleCardPay = async () => {
        if (!name.trim()) { setNameError(true); setErrorMessage("Please enter your name."); return; }
        if (!stripeRef.current || !elementsRef.current) {
            setErrorMessage("Payment gateway loading. Please wait a moment.");
            return;
        }
        setViewState('PROCESSING');
        setErrorMessage(null);

        try {
            // 1. Submit elements (validates card + Link)
            const { error: submitError } = await elementsRef.current.submit();
            if (submitError) {
                setErrorMessage(submitError.message || "Please check your payment details.");
                setViewState('FORM');
                return;
            }

            // 2. Create PaymentIntent on server
            const res = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: [{ id: 'lifetime-bundle' }], email, name })
            });
            if (!res.ok) {
                if (res.status === 404) throw new Error("Payment server unavailable. Please try PayPal.");
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server error: ${res.status}`);
            }
            const { clientSecret } = await res.json();

            // 3. Confirm payment with elements
            const result = await stripeRef.current.confirmPayment({
                elements: elementsRef.current,
                clientSecret,
                confirmParams: {
                    return_url: window.location.origin + '/checkout?success=true',
                    receipt_email: email,
                    payment_method_data: {
                        billing_details: {
                            name,
                            email,
                            address: { country: 'US', postal_code: '10001', state: 'NY', city: 'New York', line1: '1235 Sixth Ave' }
                        }
                    }
                },
                redirect: 'if_required',
            });

            if (result.error) {
                setErrorMessage(result.error.message || "Payment failed.");
                setViewState('FORM');
            } else if (result.paymentIntent?.status === 'succeeded') {
                setViewState('SUCCESS');
                trackMetaEvent({
                    eventName: 'Purchase', email, value: 49.00, currency: 'USD',
                    content_name: 'Interior Design System - 6 Book Collection', content_type: 'product',
                    order_id: result.paymentIntent.id
                });
                fetch("https://dhufnozehayzjlsmnvdl.supabase.co/functions/v1/send-book-order-email", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, name, orderId: result.paymentIntent.id })
                }).catch(err => console.error("Email trigger failed:", err));
                setTimeout(() => {
                    window.location.href = "https://drive.google.com/drive/folders/1cVcmiL-fo3o--aA-2YnXTO5UkF_3ERHc";
                }, 2500);
            }
        } catch (err: any) {
            setErrorMessage(err.message || "An unexpected error occurred.");
            setViewState('FORM');
        }
    };

    const goBack = () => { window.location.href = '/'; };
    const pad = (n: number) => n.toString().padStart(2, '0');

    // --- RENDER ---
    return (
        <div className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                .checkout-container * { font-family: 'Inter', -apple-system, sans-serif; }
                .stripe-input-wrapper { min-height: 20px; }
                .book-scroll { display: flex; gap: 6px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 4px; }
                .book-scroll::-webkit-scrollbar { display: none; }
                .book-scroll > div { scroll-snap-align: start; flex: 1 1 0; min-width: 0; }
                @media (min-width: 640px) { .book-scroll { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; overflow: visible; } }
            `}</style>

            {/* === HEADER === */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <button onClick={goBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center">
                            <BookOpen size={14} className="text-white" />
                        </div>
                        <span className="font-semibold text-sm text-gray-900">Interior Design Books</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                        <Lock size={12} />
                        <span className="hidden sm:inline">Secure Checkout</span>
                    </div>
                </div>
            </header>

            {/* === TIMER === */}
            <div className="flex items-center justify-center gap-1.5 py-1.5 text-gray-600">
                <Timer size={11} />
                <span className="text-[11px] font-semibold tracking-wide">Offer ends in</span>
                <span className="font-mono text-[11px] font-bold text-gray-900">{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</span>
            </div>

            {/* === MAIN CONTENT === */}
            <div className="checkout-container max-w-5xl mx-auto px-4 sm:px-6 py-4 lg:py-6">

                {/* SUCCESS VIEW */}
                {viewState === 'SUCCESS' && (
                    <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg p-10 text-center space-y-6">
                        <div className="relative mx-auto w-20 h-20">
                            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
                            <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
                                <Check size={40} className="text-white" strokeWidth={3} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
                            <p className="text-gray-600 text-sm mt-2">Your interior design collection is ready.</p>
                        </div>
                        <button
                            onClick={() => window.location.href = "https://drive.google.com/drive/folders/1cVcmiL-fo3o--aA-2YnXTO5UkF_3ERHc"}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-base shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                            Download Now <Download size={18} />
                        </button>
                        <a href="https://wa.me/919198747810" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-gray-600 text-xs font-semibold hover:text-gray-900 transition-colors">
                            <MessageSquare size={14} /> Need help? WhatsApp us
                        </a>
                    </div>
                )}

                {/* FORM VIEW */}
                {(viewState === 'FORM' || viewState === 'PROCESSING') && (
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">

                        {/* ========== LEFT COLUMN: ORDER SUMMARY ========== */}
                        <div className="flex-1 lg:max-w-[50%]">
                            <div className="lg:sticky lg:top-4">

                                {/* Best part callout */}
                                <p className="text-xs text-gray-600 font-medium text-center mb-4">
                                    <span className="font-bold text-gray-900">Best Part:</span> Monthly Updates in Books at no extra charge
                                </p>

                                {/* Book images */}
                                <div className="book-scroll mb-4">
                                    {BOOK_LABELS.map((book, i) => (
                                        <div key={book.key} className="group">
                                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow bg-white">
                                                <img
                                                    src={(BOOK_IMAGES as any)[book.key]}
                                                    alt={book.label}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Line items */}
                                <div className="space-y-2 border-t border-gray-200 pt-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Interior Design — 6 Book Collection</p>
                                            <p className="text-xs text-gray-600 font-medium mt-0.5">800+ pages • Instant PDF download • Monthly free updates</p>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">$49.00</p>
                                    </div>
                                </div>

                                {/* Trust badges */}
                                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-600 font-semibold">
                                    <span className="flex items-center gap-1.5"><Download size={12} /> Instant PDF</span>
                                    <span className="flex items-center gap-1.5"><Shield size={12} /> Lifetime Access</span>
                                    <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> 30-Day Guarantee</span>
                                </div>
                            </div>
                        </div>

                        {/* ========== RIGHT COLUMN: PAYMENT FORM ========== */}
                        <div className="flex-1 lg:max-w-[50%]">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                                {/* Contact information */}
                                <div className="px-5 pt-5 space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Contact information</h3>
                                        <div className="space-y-2">
                                            {/* Stripe Link Authentication */}
                                            <div id="stripe-link-auth" />
                                        </div>
                                    </div>

                                    {/* Payment method — Stripe Payment Element */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment method</h3>
                                        <div id="stripe-payment-element" />
                                    </div>

                                    {/* Cardholder name */}
                                    <div>
                                        <label className="text-xs font-medium text-gray-600 mb-1 block">Cardholder name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => { setName(e.target.value); setNameError(false); setErrorMessage(null); }}
                                            placeholder="Full name on card"
                                            className={`block w-full px-3.5 py-3 bg-white border text-sm rounded-lg transition-all focus:outline-none focus:ring-2 ${nameError
                                                ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                                                : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-400'
                                                }`}
                                        />
                                    </div>

                                    {/* Error */}
                                    {errorMessage && (
                                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium flex items-center gap-2 border border-red-100">
                                            <AlertCircle size={14} className="shrink-0" />
                                            {errorMessage}
                                        </div>
                                    )}
                                </div>

                                {/* Download button + PayPal */}
                                <div className="px-5 pb-5 pt-3 space-y-2">
                                    <button
                                        onClick={handleCardPay}
                                        disabled={viewState === 'PROCESSING'}
                                        className="w-full py-3.5 bg-[#0570DE] hover:bg-[#0462c7] text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
                                    >
                                        {viewState === 'PROCESSING' ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <><Download size={18} /><span>Download</span></>
                                        )}
                                    </button>

                                    {/* OR divider */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-px bg-gray-200" />
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase">OR</span>
                                        <div className="flex-1 h-px bg-gray-200" />
                                    </div>

                                    {/* PayPal button */}
                                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" onSubmit={handlePaypalSubmit}>
                                        <input type="hidden" name="cmd" value="_xclick" />
                                        <input type="hidden" name="business" value={PAYPAL_BUSINESS_EMAIL} />
                                        <input type="hidden" name="item_name" value="Avada Design Bundle" />
                                        <input type="hidden" name="amount" value="49" />
                                        <input type="hidden" name="currency_code" value="USD" />
                                        <input type="hidden" name="return" value={`${window.location.origin}/success?email=${email}&method=paypal`} />
                                        <input type="hidden" name="email" value={email} />
                                        <button
                                            type="submit"
                                            className="w-full py-3.5 bg-[#ffc439] hover:bg-[#f0b72e] text-gray-900 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
                                        >
                                            Download with <img src={PAYPAL_LOGO_URL} alt="PayPal" className="h-5 object-contain" />
                                        </button>
                                    </form>

                                    {/* Powered by Stripe */}
                                    <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-600 font-medium">
                                        <span>Powered by</span>
                                        <span className="font-bold text-gray-500">stripe</span>
                                        <span className="mx-1">•</span>
                                        <span>Terms</span>
                                        <span className="mx-1">•</span>
                                        <span>Privacy</span>
                                    </div>
                                </div>
                            </div>

                            {/* Security note */}
                            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-600 font-medium">
                                <Lock size={11} />
                                <span>256-bit SSL encrypted • Your payment info is secure</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
