import React, { useState, useEffect, useRef } from 'react';
import {
    Lock, Check, Loader2, Timer, CreditCard, Mail, ShieldCheck, AlertCircle,
    ArrowLeft, BookOpen, CheckCircle2, Download, Star, Shield, Clock,
    MessageSquare, Package, Truck
} from 'lucide-react';
import { trackMetaEvent } from '../utils/meta-tracking';

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

const WHO_IS_THIS_FOR = [
    { label: 'Homeowners', icon: '/images/icon-3d-homeowners.png' },
    { label: 'Architecture Students', icon: '/images/icon-3d-students.png' },
    { label: 'Interior Designers', icon: '/images/icon-3d-designers.png' },
    { label: 'Real Estate Developers', icon: '/images/icon-3d-developers.png' },
    { label: 'Renovators', icon: '/images/icon-3d-renovators.png' },
    { label: 'DIY Enthusiasts', icon: '/images/icon-3d-diy.png' },
];

/**
 * HARDCOPY CHECKOUT COMPONENT
 * For physical book orders at $199 with 10-day global delivery.
 */
export const HardcopyCheckoutPage: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    // Meta InitiateCheckout
    useEffect(() => {
        trackMetaEvent({
            eventName: 'InitiateCheckout',
            value: 199.00,
            currency: 'USD',
            content_name: 'Interior Design System - 6 Book Hardcopy Collection',
            content_ids: ['interior-design-system-6-books-hardcopy'],
            content_type: 'product'
        });
    }, []);

    // --- STATE ---
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [zip, setZip] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isStripeLoaded, setIsStripeLoaded] = useState(false);
    const [viewState, setViewState] = useState<'FORM' | 'PROCESSING' | 'SUCCESS'>('FORM');
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [hidePayPal, setHidePayPal] = useState(false);
    const [hasAddedPaymentInfo, setHasAddedPaymentInfo] = useState(false);

    const stripeRef = useRef<any>(null);
    const elementsRef = useRef<any>(null);

    // --- ENTRANCE ANIMATION ---
    useEffect(() => { requestAnimationFrame(() => setIsVisible(true)); }, []);

    // --- TIMER ---
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
                amount: 19900,
                currency: 'usd',
                automatic_payment_methods: { enabled: true },
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

            const paymentElement = elementsRef.current.create('payment', {
                layout: 'tabs',
                fields: {
                    billingDetails: {
                        address: 'never',
                    },
                },
            });
            const peMount = document.getElementById('stripe-payment-element-hardcopy');
            if (peMount) paymentElement.mount('#stripe-payment-element-hardcopy');

            paymentElement.on('change', (event: any) => {
                if (!event.empty) {
                    setHidePayPal(true);
                    if (!hasAddedPaymentInfo) {
                        trackMetaEvent({
                            eventName: 'AddPaymentInfo',
                            content_name: 'Interior Design System - 6 Book Hardcopy Collection',
                            content_ids: ['interior-design-system-6-books-hardcopy'],
                            content_type: 'product',
                            value: 199.00,
                            currency: 'USD'
                        });
                        setHasAddedPaymentInfo(true);
                    }
                }
            });

            const linkAuth = elementsRef.current.create('linkAuthentication', {});
            const linkMount = document.getElementById('stripe-link-auth-hardcopy');
            if (linkMount) linkAuth.mount('#stripe-link-auth-hardcopy');
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
        if (!address.trim()) { setAddressError(true); hasError = true; }
        if (hasError) {
            e.preventDefault();
            setErrorMessage("Please fill in all required fields.");
            return;
        }
        if (!hasAddedPaymentInfo) {
            trackMetaEvent({
                eventName: 'AddPaymentInfo',
                content_name: 'Interior Design System - 6 Book Hardcopy Collection',
                content_ids: ['interior-design-system-6-books-hardcopy'],
                content_type: 'product',
                value: 199.00,
                currency: 'USD',
                payment_type: 'paypal'
            });
            setHasAddedPaymentInfo(true);
        }
        setViewState('PROCESSING');
    };

    const handleCardPay = async () => {
        let hasError = false;
        if (!name.trim()) { setNameError(true); hasError = true; }
        if (!address.trim()) { setAddressError(true); hasError = true; }
        if (hasError) { setErrorMessage("Please fill in your name and shipping address."); return; }
        if (!stripeRef.current || !elementsRef.current) {
            setErrorMessage("Payment gateway loading. Please wait a moment.");
            return;
        }
        setViewState('PROCESSING');
        setErrorMessage(null);

        try {
            const { error: submitError } = await elementsRef.current.submit();
            if (submitError) {
                setErrorMessage(submitError.message || "Please check your payment details.");
                setViewState('FORM');
                return;
            }

            const res = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: [{ id: 'hardcopy-bundle' }], email, name, address: `${address}, ${city}, ${country} ${zip}` })
            });
            if (!res.ok) {
                if (res.status === 404) throw new Error("Payment server unavailable. Please try PayPal.");
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server error: ${res.status}`);
            }
            const { clientSecret } = await res.json();

            const result = await stripeRef.current.confirmPayment({
                elements: elementsRef.current,
                clientSecret,
                confirmParams: {
                    return_url: window.location.origin + '/checkout-hardcopy?success=true',
                    receipt_email: email,
                    payment_method_data: {
                        billing_details: {
                            address: {
                                country: 'US',
                                state: 'CA',
                                city: city || 'Los Angeles',
                                line1: address || '123 Main St',
                                line2: '',
                                postal_code: zip || '90001',
                            },
                        },
                    },
                },
                redirect: 'if_required',
            });

            if (result.error) {
                setErrorMessage(result.error.message || "Payment failed.");
                setViewState('FORM');
            } else if (result.paymentIntent?.status === 'succeeded') {
                setViewState('SUCCESS');
                trackMetaEvent({
                    eventName: 'Purchase',
                    email,
                    value: 199.00,
                    currency: 'USD',
                    content_name: 'Interior Design System - 6 Book Hardcopy Collection',
                    content_ids: ['interior-design-system-6-books-hardcopy'],
                    content_type: 'product',
                    order_id: result.paymentIntent.id
                });
                fetch("https://dhufnozehayzjlsmnvdl.supabase.co/functions/v1/send-book-mail", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, name, orderId: result.paymentIntent.id, type: 'hardcopy', address: `${address}, ${city}, ${country} ${zip}` })
                }).catch(err => console.error("Email trigger failed:", err));
            }
        } catch (err: any) {
            setErrorMessage(err.message || "An unexpected error occurred.");
            setViewState('FORM');
        }
    };

    const goBack = () => { window.location.href = '/'; };
    const pad = (n: number) => n.toString().padStart(2, '0');

    const inputClass = (hasError: boolean) => `block w-full px-3.5 py-3 bg-white border text-sm rounded-lg transition-all focus:outline-none focus:ring-2 ${hasError
        ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
        : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-400'
    }`;

    // --- RENDER ---
    return (
        <div className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                .checkout-container * { font-family: 'Inter', -apple-system, sans-serif; }
                .stripe-input-wrapper { min-height: 20px; }
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
                            <Package size={14} className="text-white" />
                        </div>
                        <span className="font-semibold text-sm text-gray-900">Hardcopy Collection</span>
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
                            <h3 className="text-2xl font-bold text-gray-900">Order Confirmed!</h3>
                            <p className="text-gray-600 text-sm mt-2">Your hardcopy collection will be shipped within 24 hours.</p>
                            <p className="text-gray-500 text-xs mt-1">Estimated delivery: 10 business days worldwide</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-3 text-left">
                                <Truck size={20} className="text-orange-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Global Shipping</p>
                                    <p className="text-xs text-gray-600">You'll receive a tracking number via email within 24 hours.</p>
                                </div>
                            </div>
                        </div>
                        <a href="https://wa.me/919198747810" target="_blank" rel="noopener noreferrer"
                            onClick={() => trackMetaEvent({ eventName: 'Contact' })}
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

                                {/* Hardcopy badge */}
                                <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
                                    <Package size={16} className="text-orange-500" />
                                    <span className="text-sm font-bold text-orange-700">Physical Hardcopy Collection</span>
                                    <span className="text-[10px] font-semibold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">PRINTED BOOKS</span>
                                </div>

                                {/* WHO IS THIS FOR (All 6 Icons in a Single Line) */}
                                <div 
                                    className="mb-4 rounded-2xl border border-gray-200/90 shadow-sm bg-[#fdfdfc] p-3.5 sm:p-4.5 relative overflow-hidden"
                                    style={{
                                        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)`,
                                        backgroundSize: '22px 22px'
                                    }}
                                >
                                    <div className="text-center mb-3">
                                        <span className="inline-block text-[10.5px] font-extrabold tracking-[0.14em] text-[#ea580c] uppercase mb-1">
                                            WHO IS THIS FOR?
                                        </span>
                                        <h3 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight leading-snug">
                                            Trusted by <span className="text-[#ea580c]">Homeowners & Professionals</span> Alike
                                        </h3>
                                    </div>

                                    {/* All 6 icons in a single line */}
                                    <div className="grid grid-cols-6 gap-1 sm:gap-1.5 items-stretch">
                                        {WHO_IS_THIS_FOR.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white rounded-lg sm:rounded-xl border border-gray-200/80 py-1.5 px-0.5 sm:py-2 sm:px-1 flex flex-col items-center justify-start text-center shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-orange-300 hover:shadow-md transition-all group overflow-hidden"
                                            >
                                                <div className="w-8 h-8 sm:w-9.5 sm:h-9.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] border border-orange-200/60 flex items-center justify-center mb-1 shrink-0 group-hover:scale-105 transition-transform">
                                                    <img
                                                        src={item.icon}
                                                        alt={item.label}
                                                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-sm"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <span className="text-[7.5px] sm:text-[8.5px] font-bold text-gray-800 leading-[1.15] px-0.5 break-words">
                                                    {item.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* PREMIUM MOVIE TICKET PASS */}
                                <div className="relative bg-white rounded-2xl border border-gray-300/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden transition-all hover:shadow-[0_14px_40px_rgba(0,0,0,0.09)]">
                                    {/* Ticket Upper Section (Header & Price) */}
                                    <div className="p-4 sm:p-5 pb-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                                                    6 Hardcopy Books Collection
                                                </h4>
                                                <p className="text-xs text-gray-500 font-medium mt-0.5">
                                                    Shipped Globally · Premium Hardcover Edition
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="flex items-baseline justify-end gap-1.5">
                                                    <span className="text-xs text-gray-400 line-through font-semibold">$450</span>
                                                    <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">$199<span className="text-base font-bold text-gray-500">.00</span></span>
                                                </div>
                                                <span className="inline-block mt-0.5 text-[9.5px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                                                    SAVE $251 (56% OFF)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Perforated Tear Line with Semicircular Ticket Notches */}
                                    <div className="relative flex items-center justify-between my-1">
                                        {/* Left Notch */}
                                        <div className="w-3.5 h-7 bg-gray-50 border-r border-y border-gray-300/80 rounded-r-full -ml-[1px]" />
                                        {/* Dashed Line */}
                                        <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2 relative">
                                            <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-2 text-[8px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                                                PERFORATED TICKET STUB
                                            </span>
                                        </div>
                                        {/* Right Notch */}
                                        <div className="w-3.5 h-7 bg-gray-50 border-l border-y border-gray-300/80 rounded-l-full -mr-[1px]" />
                                    </div>

                                    {/* Ticket Lower Section (Included Perks) */}
                                    <div className="p-4 sm:p-5 pt-3 bg-gradient-to-b from-[#fafaf9]/80 to-white">
                                        <p className="text-[10.5px] font-extrabold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                            <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <Check size={10} className="text-white" strokeWidth={3} />
                                            </span>
                                            INCLUDED WITH THIS ORDER
                                        </p>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50/80 border border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center shrink-0">
                                                        <Package size={13} className="text-orange-600" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-800">All 6 Printed Hardcover Books</span>
                                                </div>
                                                <span className="text-[9.5px] font-mono font-bold text-gray-500">800+ PGS</span>
                                            </div>

                                            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                                                        <Truck size={13} className="text-emerald-600" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-800">10-Day Global Tracked Shipping</span>
                                                </div>
                                                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                                    FREE SHIPPING
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                                                        <Download size={13} className="text-emerald-600" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-800">Instant Digital Copies (PDF) Included</span>
                                                </div>
                                                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                                    FREE BONUS
                                                </span>
                                            </div>
                                        </div>

                                        {/* Authentic Vector Barcode */}
                                        <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-col items-center">
                                            <svg className="h-6 sm:h-7 w-48 text-gray-800 max-w-full" viewBox="0 0 176 28" fill="currentColor">
                                                <rect x="0" y="0" width="3" height="28"/>
                                                <rect x="5" y="0" width="1.5" height="28"/>
                                                <rect x="9" y="0" width="4" height="28"/>
                                                <rect x="15" y="0" width="2" height="28"/>
                                                <rect x="19" y="0" width="1.5" height="28"/>
                                                <rect x="23" y="0" width="3.5" height="28"/>
                                                <rect x="29" y="0" width="2" height="28"/>
                                                <rect x="33" y="0" width="1" height="28"/>
                                                <rect x="36" y="0" width="4" height="28"/>
                                                <rect x="42" y="0" width="2" height="28"/>
                                                <rect x="46" y="0" width="1.5" height="28"/>
                                                <rect x="50" y="0" width="3" height="28"/>
                                                <rect x="55" y="0" width="4" height="28"/>
                                                <rect x="61" y="0" width="1" height="28"/>
                                                <rect x="64" y="0" width="3" height="28"/>
                                                <rect x="69" y="0" width="2" height="28"/>
                                                <rect x="73" y="0" width="4" height="28"/>
                                                <rect x="79" y="0" width="1.5" height="28"/>
                                                <rect x="83" y="0" width="2" height="28"/>
                                                <rect x="87" y="0" width="3.5" height="28"/>
                                                <rect x="93" y="0" width="1" height="28"/>
                                                <rect x="96" y="0" width="4" height="28"/>
                                                <rect x="102" y="0" width="2" height="28"/>
                                                <rect x="106" y="0" width="1.5" height="28"/>
                                                <rect x="110" y="0" width="3" height="28"/>
                                                <rect x="115" y="0" width="4" height="28"/>
                                                <rect x="121" y="0" width="1.5" height="28"/>
                                                <rect x="125" y="0" width="3" height="28"/>
                                                <rect x="130" y="0" width="2" height="28"/>
                                                <rect x="134" y="0" width="4" height="28"/>
                                                <rect x="140" y="0" width="1" height="28"/>
                                                <rect x="143" y="0" width="3.5" height="28"/>
                                                <rect x="148" y="0" width="2" height="28"/>
                                                <rect x="152" y="0" width="1.5" height="28"/>
                                                <rect x="156" y="0" width="4" height="28"/>
                                                <rect x="162" y="0" width="2" height="28"/>
                                                <rect x="166" y="0" width="1.5" height="28"/>
                                                <rect x="170" y="0" width="3" height="28"/>
                                                <rect x="174" y="0" width="2" height="28"/>
                                            </svg>
                                            <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-gray-400 mt-1 uppercase">
                                                * 19900-VIP-HARDCOPY-2026 *
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Trust badges */}
                                <div className="flex items-center justify-between mt-3 text-[10px] sm:text-xs text-gray-600 font-semibold gap-1 whitespace-nowrap">
                                    <span className="flex items-center gap-1"><Truck size={12} className="shrink-0" /> Free Shipping</span>
                                    <span className="flex items-center gap-1 text-blue-600"><Shield size={12} className="shrink-0" /> + Digital Copies</span>
                                    <span className="flex items-center gap-1"><ShieldCheck size={12} className="shrink-0" /> 30-Day Guarantee</span>
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
                                            <div id="stripe-link-auth-hardcopy" />
                                        </div>
                                    </div>

                                    {/* Shipping address */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Shipping address</h3>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => { setAddress(e.target.value); setAddressError(false); setErrorMessage(null); }}
                                                placeholder="Street address"
                                                className={inputClass(addressError)}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    placeholder="City"
                                                    className={inputClass(false)}
                                                />
                                                <input
                                                    type="text"
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    placeholder="Country"
                                                    className={inputClass(false)}
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={zip}
                                                onChange={(e) => setZip(e.target.value)}
                                                placeholder="ZIP / Postal code"
                                                className={inputClass(false)}
                                            />
                                        </div>
                                    </div>

                                    {/* Payment method */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment method</h3>
                                        <div id="stripe-payment-element-hardcopy" />
                                    </div>

                                    {/* Cardholder name */}
                                    <div>
                                        <label className="text-xs font-medium text-gray-600 mb-1 block">Full name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => { setName(e.target.value); setNameError(false); setErrorMessage(null); }}
                                            placeholder="Full name"
                                            className={inputClass(nameError)}
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

                                {/* Pay button + PayPal */}
                                <div className="px-5 pb-5 pt-3 space-y-2">
                                    <button
                                        onClick={handleCardPay}
                                        disabled={viewState === 'PROCESSING'}
                                        className="w-full py-3.5 bg-[#0570DE] hover:bg-[#0462c7] text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
                                    >
                                        {viewState === 'PROCESSING' ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <><Package size={18} /><span>Order Hardcopy — $199</span></>
                                        )}
                                    </button>

                                    {/* OR divider */}
                                    {!hidePayPal && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-px bg-gray-200" />
                                            <span className="text-[10px] font-semibold text-gray-400 uppercase">OR</span>
                                            <div className="flex-1 h-px bg-gray-200" />
                                        </div>
                                    )}

                                    {/* PayPal button */}
                                    {!hidePayPal && (
                                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" onSubmit={handlePaypalSubmit}>
                                        <input type="hidden" name="cmd" value="_xclick" />
                                        <input type="hidden" name="business" value={PAYPAL_BUSINESS_EMAIL} />
                                        <input type="hidden" name="item_name" value="Avada Design Bundle - Hardcopy" />
                                        <input type="hidden" name="amount" value="199" />
                                        <input type="hidden" name="currency_code" value="USD" />
                                        <input type="hidden" name="return" value={`${window.location.origin}/success?email=${email}&method=paypal&type=hardcopy`} />
                                        <input type="hidden" name="email" value={email} />
                                        <button
                                            type="submit"
                                            className="w-full py-3.5 bg-[#ffc439] hover:bg-[#f0b72e] text-gray-900 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
                                        >
                                            Pay with <img src={PAYPAL_LOGO_URL} alt="PayPal" className="h-5 object-contain" />
                                        </button>
                                    </form>
                                    )}

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
