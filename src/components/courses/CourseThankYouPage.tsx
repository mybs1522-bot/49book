import React, { useState, useEffect } from "react";
import {
  Check, ExternalLink, Download, MessageSquare, Copy, Star, CheckCircle2, ShieldCheck, Mail, ArrowRight, Layers, BookOpen
} from "lucide-react";
import { getAccessLinks } from "../../services/stripe";
import { sendStageEmail } from "../../services/email";
import { trackMetaEvent } from "../../utils/meta-tracking";

interface CourseThankYouPageProps {
  orderState: {
    customerId?: string;
    paymentMethodId?: string;
    paymentIntentId?: string;
    email: string;
    purchased: string[];
  };
}

// Verified Google Drive Folder links
export const DEFAULT_ACCESS_LINKS: Record<string, string> = {
  render: 'https://drive.google.com/drive/folders/1MAm2SDHKsXWDBeJtNTl7V9DBc6sbpEi9?usp=drive_link',
  autocad: 'https://drive.google.com/drive/folders/1fV5bz4JDugh8HxLMJ0fXu5K5sDj3qlSR',
  full: 'https://drive.google.com/drive/folders/1CCyv9u82HiYI8jnyULISfBoGMcbcqd9U?usp=drive_link',
  books: 'https://drive.google.com/drive/folders/1cVcmiL-fo3o--aA-2YnXTO5UkF_3ERHc?usp=drive_link',
  downsell: 'https://drive.google.com/drive/folders/1cVcmiL-fo3o--aA-2YnXTO5UkF_3ERHc?usp=drive_link',
};

export const CourseThankYouPage: React.FC<CourseThankYouPageProps> = ({ orderState }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const emailParam = queryParams.get('email');
  const methodParam = queryParams.get('method');

  const email = orderState?.email || emailParam || '';
  const initialPurchased = (orderState?.purchased && orderState.purchased.length > 0)
    ? orderState.purchased
    : ['render'];
  const [purchased, setPurchased] = useState<string[]>(initialPurchased);
  const [links, setLinks] = useState<Record<string, string>>(DEFAULT_ACCESS_LINKS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // If redirected from PayPal, send confirmation email and track purchase
    if (methodParam === 'paypal' && email) {
      sendStageEmail(email, 'render');
      trackMetaEvent({
        eventName: 'Purchase',
        email,
        value: 9.00,
        currency: 'USD',
        content_name: '3 Architecture & 3D Visualization Master Courses',
        content_ids: ['courses-sketchup-vray-d5'],
        content_type: 'product',
        order_id: 'paypal-' + Date.now()
      });
    }

    getAccessLinks(purchased).then((fetched) => {
      if (fetched && Object.keys(fetched).length > 0) {
        setLinks(prev => ({ ...prev, ...fetched }));
      }
    }).catch(() => {});
  }, [purchased, email, methodParam]);

  const handleCopy = (key: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-md">
            <Check size={32} />
          </div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Order Confirmed & Unlocked
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black text-gray-900 mt-1 mb-2">
            Welcome to the Course Portal!
          </h1>
          <p className="text-sm text-gray-600">
            An email with your lifetime access links and login info has been dispatched to <strong className="text-gray-900">{email || 'your email'}</strong>.
          </p>
        </div>

        {/* Access Links Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Download size={18} className="text-orange-500" />
            Your Instant Download & Streaming Access:
          </h2>

          <div className="space-y-4">
            {/* Front-End 3D Rendering Bundle */}
            <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Included
                </span>
                <h3 className="font-bold text-gray-900 text-base mt-1">
                  SketchUp + V-Ray + D5 Render AI Masterclasses
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Full 4K video masterclasses, 10,000+ textures & 2,000+ 3D models.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={links.render || DEFAULT_ACCESS_LINKS.render}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
                >
                  <span>Access Folder</span>
                  <ExternalLink size={13} />
                </a>
                <button
                  onClick={() => handleCopy('render', links.render || DEFAULT_ACCESS_LINKS.render)}
                  className="p-2.5 bg-white border border-orange-200 text-gray-700 hover:text-gray-900 rounded-xl text-xs font-medium transition-colors"
                  title="Copy link"
                >
                  {copiedKey === 'render' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* AutoCAD Add-on (if checked) */}
            {purchased.includes('autocad') && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    AutoCAD Add-on
                  </span>
                  <h3 className="font-bold text-gray-900 text-base mt-1">
                    AutoCAD 2D Drafting & Blueprint Mastery
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Floor plans, section cuts, structural drawings & shortcut cheat-sheets.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={links.autocad || DEFAULT_ACCESS_LINKS.autocad}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
                  >
                    <span>Access AutoCAD</span>
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => handleCopy('autocad', links.autocad || DEFAULT_ACCESS_LINKS.autocad)}
                    className="p-2.5 bg-white border border-amber-200 text-gray-700 hover:text-gray-900 rounded-xl text-xs font-medium transition-colors"
                    title="Copy link"
                  >
                    {copiedKey === 'autocad' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}

            {/* If Full 12 Courses Suite purchased */}
            {purchased.includes('full') && (
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Unlocked Upgrade
                  </span>
                  <h3 className="font-bold text-gray-900 text-base mt-1">
                    All 12 Architecture & AI Master Suite Courses
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    3ds Max, Revit BIM, Lumion, Unreal Engine 5, Midjourney AI & Photoshop.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={links.full || DEFAULT_ACCESS_LINKS.full}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
                  >
                    <span>Access Suite</span>
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => handleCopy('full', links.full || DEFAULT_ACCESS_LINKS.full)}
                    className="p-2.5 bg-white border border-indigo-200 text-gray-700 hover:text-gray-900 rounded-xl text-xs font-medium transition-colors"
                    title="Copy link"
                  >
                    {copiedKey === 'full' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}

            {/* If Books purchased */}
            {(purchased.includes('books') || purchased.includes('downsell')) && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    E-Book Library
                  </span>
                  <h3 className="font-bold text-gray-900 text-base mt-1">
                    Architectural Dimensions & Clearances Books
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    800+ pages of handmade architectural diagrams & layout rules.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={links.books || DEFAULT_ACCESS_LINKS.books}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
                  >
                    <span>Download PDFs</span>
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => handleCopy('books', links.books || DEFAULT_ACCESS_LINKS.books)}
                    className="p-2.5 bg-white border border-emerald-200 text-gray-700 hover:text-gray-900 rounded-xl text-xs font-medium transition-colors"
                    title="Copy link"
                  >
                    {copiedKey === 'books' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Support Box */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm text-center text-xs text-gray-600 space-y-2">
          <p className="font-semibold text-gray-900">Need help or have questions about your access?</p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <a href="https://wa.me/919198747810" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:underline">
              <MessageSquare size={14} /> WhatsApp Support (+91 91987 47810)
            </a>
            <span>•</span>
            <a href="mailto:design@avada.in" className="text-orange-600 font-bold hover:underline">
              Email: design@avada.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
