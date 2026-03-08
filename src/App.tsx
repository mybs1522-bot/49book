import React, { useState, useEffect, useRef } from 'react';
import { CheckoutPage } from './components/CheckoutPage';
import { SuccessPage } from './components/SuccessPage';
import { AdminModal } from './components/AdminModal';
import { LoginModal } from './components/LoginModal';
import { FAQ_ITEMS, TESTIMONIALS, COURSES, INDUSTRIES, FEATURES, BUSINESS_MODULES } from './constants';
import { ChevronDown, ArrowRight, Star, BookOpen, Sparkles, CheckCircle2, ShieldCheck, Target, TrendingUp, Zap, Users, X, Home, Sofa, ChefHat, Bed, Bath, Map, GraduationCap, Building, Wrench, Hammer, Palette, Download, Infinity, Award, Eye, Heart, Clock, Layers, LifeBuoy, Briefcase, AlertCircle } from 'lucide-react';
import { Course } from './types';
import {
  Counter, Logo, CountdownTimer,
  APP_STYLES, PORTRAIT_IMAGES, BOOK_THUMBNAILS, BOOK_IMAGES,
  PROBLEM_POINTS, TRANSFORMATION_STORIES, CURRICULUM_DATA
} from './AppHelpers';

const ICON_MAP: Record<string, any> = { Home, BookOpen, Palette, Building, Hammer, Wrench, Download, Infinity, LifeBuoy, Users, Briefcase, GraduationCap, TrendingUp };

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      // Clean up the URL
      window.history.replaceState({}, '', redirect);
      return redirect;
    }
    return window.location.pathname;
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeCurriculumBook, setActiveCurriculumBook] = useState(0);
  const [curriculumPaused, setCurriculumPaused] = useState(false);

  // Auto-cycle curriculum tabs
  useEffect(() => {
    if (curriculumPaused) return;
    const timer = setInterval(() => {
      setActiveCurriculumBook(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(timer);
  }, [curriculumPaused]);

  // When user clicks a tab manually, pause auto-cycle for 8s
  const handleCurriculumClick = (index: number) => {
    setActiveCurriculumBook(index);
    setCurriculumPaused(true);
    setTimeout(() => setCurriculumPaused(false), 8000);
  };

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [currentPath]);

  useEffect(() => {
    const h = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Routing
  if (currentPath === '/checkout') return <CheckoutPage />;
  if (currentPath.startsWith('/success')) return <SuccessPage />;

  const navigateToCheckout = () => {
    window.scrollTo(0, 0);
    window.history.pushState({}, '', '/checkout');
    setCurrentPath('/checkout');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden antialiased">
      <style>{APP_STYLES}</style>

      <main>

        {/* ═══════════════════════════════════════════════
           SECTION 1: HERO — The First Impression
           ═══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          {/* Subtle warm gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50/50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-orange-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-amber-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Sticky Header */}
          <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 py-3.5">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Logo />
              <button onClick={navigateToCheckout} className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-900/10">
                Get the Books <ArrowRight size={14} />
              </button>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-5 relative z-10 pt-8 md:pt-20 pb-10 md:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left — Copy */}
              <div className="reveal text-center lg:text-left">
                {/* Trust badge */}
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mx-auto lg:mx-0">
                  <div className="flex -space-x-2">
                    {PORTRAIT_IMAGES.slice(0, 4).map((img, i) => (
                      <img key={i} src={img} alt="" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-orange-700">Join 50,000+ designers who stopped guessing</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-display font-black leading-[0.95] mb-6 text-gray-900 tracking-tightest text-balance max-w-4xl mx-auto lg:mx-0">
                  The only <span className="font-serif italic font-normal text-orange-600">design resource</span>
                  <br />
                  you'll ever need.
                </h1>

                <p className="text-lg md:text-xl text-gray-700 font-medium mb-4 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  6 books. 800+ pages. Every dimension, every clearance, every layout secret that top designers charge thousands to know — now in your hands for less than a dinner out.
                </p>

                {/* Author line */}
                <p className="text-sm text-gray-600 mb-8 flex items-center justify-center lg:justify-start gap-2">
                  <span className="w-1 h-1 bg-orange-400 rounded-full" />
                  Created by a firm with 1,000+ completed projects and 20 years of real-world experience
                </p>



                {/* Trust line */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-gray-800 font-semibold">
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> 30-day money back</span>
                  <span className="flex items-center gap-1.5"><Zap size={14} className="text-orange-400" /> Instant PDF download</span>
                  <span className="flex items-center gap-1.5"><Infinity size={14} className="text-blue-400" /> Free lifetime updates</span>
                </div>
              </div>

              {/* Right — Book visual grid */}
              <div className="reveal-scale">
                <div className="grid grid-cols-3 gap-3">
                  {BOOK_THUMBNAILS.map((thumb, i) => (
                    <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100 group cursor-pointer shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all hover:scale-[1.03]">
                      <img src={thumb.image} alt={thumb.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider">{thumb.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 2: BOOK FLIP-THROUGH VIDEO
           ═══════════════════════════════════════════════ */}
        <section className="py-8 md:py-24">
          <div className="max-w-4xl mx-auto px-5">

            <div className="reveal relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                title="Book flip-through preview"
                src="https://iframe.mediadelivery.net/embed/494628/0c78b16a-d584-41b9-8f5e-12c341817f72?autoplay=true&loop=true&muted=true&preload=true&responsive=true"
                loading="lazy"
                style={{ border: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="text-center mt-8">
              <button onClick={navigateToCheckout} className="cta-primary px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all inline-flex items-center gap-3 group whitespace-nowrap">
                Get All 6 Books — $49 <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 2B: MARKETING COPY — Confidence Guarantee
           ═══════════════════════════════════════════════ */}
        <section className="py-8 md:py-20">
          <div className="max-w-3xl mx-auto px-5">
            <div className="reveal text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 tracking-tightest leading-[1] text-balance">
                What if you never made <span className="font-serif italic font-normal text-orange-600">another design mistake?</span>
              </h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                Most people don't realize how much money they waste on bad design decisions — wrong furniture sizes, awkward layouts, wasted space. One kitchen redo alone costs more than these 6 books combined.
              </p>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                These aren't ordinary books. They contain <strong className="text-gray-900">hand-made diagrams with exact measurements</strong> — the same knowledge that professional firms guard closely and charge thousands of dollars for.
              </p>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
                <p className="text-gray-600 text-sm md:text-base leading-relaxed italic">
                  "If after reading these books you still need to look anywhere else for interior design knowledge — we'll refund you. No questions asked."
                </p>
                <p className="text-gray-900 font-bold text-sm mt-3">
                  That's how certain we are. Nobody else in this industry makes that promise.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* ═══════════════════════════════════════════════
           SECTION 3C: SOUND FAMILIAR? — Pain Points
           ═══════════════════════════════════════════════ */}
        <section className="py-8 md:py-24">
          <div className="max-w-4xl mx-auto px-5">
            <div className="reveal text-center mb-12">
              <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 font-display">Sound familiar?</p>
              <h2 className="text-3xl md:text-6xl font-display font-black text-gray-900 tracking-tightest">The <span className="font-serif italic font-normal text-orange-600">expensive trap</span> nobody warns you about</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROBLEM_POINTS.map((p, i) => (
                <div key={i} className="reveal bg-gray-50 border border-gray-100 rounded-2xl p-6 flex gap-4 items-start hover:border-orange-200 transition-colors">
                  <span className="text-3xl shrink-0">{p.emoji}</span>
                  <p className="text-gray-600 text-sm leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 2C: WHY THESE BOOKS CHANGE EVERYTHING
           ═══════════════════════════════════════════════ */}
        <section className="py-8 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5">
            <div className="reveal">
              <div className="border-t-[6px] border-orange-500 pt-10">
                <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 tracking-tightest text-center mb-12">
                  Why designers call this <span className="font-serif italic font-normal text-orange-600">a career-changer</span>
                </h2>
                <div className="space-y-4 max-w-xl mx-auto">
                  {[
                    { emoji: '💡', bold: "Instantly look more professional", rest: ' — clients notice when you know exact dimensions without checking your phone' },
                    { emoji: '📐', bold: 'Every measurement is from real projects', rest: ' — not theoretical textbooks that have never seen a real construction site' },
                    { emoji: '🏠', bold: 'Design rooms that actually work', rest: ' — where doors open properly, furniture fits perfectly, and nothing feels cramped' },
                    { emoji: '✨', bold: 'The "unfair advantage"', rest: ' — know things in 2 hours that others take years of trial and error to learn' },
                    { emoji: '💰', bold: 'Save thousands in costly mistakes', rest: ' — one wrong kitchen layout costs more than 10x the price of all 6 books' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-base">
                      <span className="text-xl shrink-0">{item.emoji}</span>
                      <p className="text-gray-800">
                        <strong className="text-gray-900">{item.bold}</strong>{item.rest}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 7: CURRICULUM DEEP DIVE (Moved Up)
           ═══════════════════════════════════════════════ */}
        <section className="py-8 md:py-24">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-10">
              <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 font-display">What's inside</p>
              <h2 className="text-3xl md:text-6xl font-display font-black text-gray-900 tracking-tightest">800+ pages of <span className="font-serif italic font-normal text-orange-600">pure gold</span></h2>
            </div>

            {/* Book tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 reveal">
              {CURRICULUM_DATA.map((book, i) => (
                <button key={book.id} onClick={() => handleCurriculumClick(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeCurriculumBook === i
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {book.icon} {book.bookNum}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-900/5 border border-gray-100 reveal">
              <div className="md:flex">
                <div className="md:w-1/3 aspect-square md:aspect-auto bg-gray-100">
                  <img src={CURRICULUM_DATA[activeCurriculumBook].imageUrl} alt={CURRICULUM_DATA[activeCurriculumBook].title} className="w-full h-full object-cover" />
                </div>
                <div className="md:w-2/3 p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{CURRICULUM_DATA[activeCurriculumBook].title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CURRICULUM_DATA[activeCurriculumBook].sections.map((section, j) => (
                      <div key={j}>
                        <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-3">{section.name}</h4>
                        <ul className="space-y-2">
                          {section.items.map((item, k) => (
                            <li key={k} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 size={12} className="text-gray-400 mt-1 shrink-0" />{item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 3: SOCIAL PROOF STATS BAR
           ═══════════════════════════════════════════════ */}

        {/* ═══════════════════════════════════════════════
           SECTION 4: THE BACKSTORY — Build Trust
           ═══════════════════════════════════════════════ */}
        <section className="py-8 md:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-5">
            <div className="reveal text-center mb-12">
              <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 font-display">The real story</p>
              <h2 className="text-3xl md:text-5xl font-serif italic text-gray-900 mb-8 leading-[1.1] tracking-tight text-balance">
                "We got tired of watching people destroy their dream homes with one bad decision."
              </h2>
            </div>
            <div className="reveal space-y-5 text-gray-700 text-base md:text-lg leading-relaxed">
              <p>After 20 years and 1,000+ projects, we've seen it all. Beautiful homes ruined by <strong className="text-gray-800">one wrong measurement. One forgotten clearance. One layout that looked great on paper but was a nightmare to live in.</strong> And every single time, the homeowner says the same thing: "I wish someone had just told me."</p>
              <p>Here's what nobody tells you: hiring a designer doesn't guarantee you'll avoid these mistakes. Most designers <strong className="text-gray-900">don't share their dimensional knowledge</strong> — because that's their competitive edge. And YouTube? It teaches you trends. Trends expire. <strong className="text-gray-800">Dimensions don't.</strong></p>
              <p>So we did something no architectural firm has done before — we took <strong className="text-gray-900">every measurement, every clearance, every layout principle</strong> we've learned across two decades and put it into 6 beautifully illustrated books. This isn't theory. This is the exact knowledge that has saved our clients hundreds of thousands of dollars in renovation mistakes.</p>
              <p className="text-gray-900 font-semibold text-lg md:text-xl pt-4 border-l-4 border-orange-400 pl-5">800+ pages of proprietary knowledge that took 20 years to accumulate — yours in minutes. This is the shortcut that didn't exist until now.</p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 5: YOU NEED / YOU DON'T NEED
           ═══════════════════════════════════════════════ */}
        <section className="py-8 md:py-24">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-12">
              <p className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-3 font-semibold">Be honest with yourself</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 tracking-tight mb-3">This isn't for <span className="text-orange-500">everyone.</span></h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">We'd rather be upfront. These books will transform how you design — but only if you're serious about it.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* You NEED these books */}
              <div className="reveal bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">This is you?</div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><CheckCircle2 size={20} className="text-emerald-500" /></div>
                  <h3 className="text-xl font-bold text-gray-800">You'll wish you had these sooner…</h3>
                </div>
                <div className="space-y-3">
                  {[
                    `You're building or renovating and can't afford a single costly mistake — these books pay for themselves with the first decision they save you from`,
                    `You're a designer who wants clients to see you as the expert who always has the right answer — instantly`,
                    `You're tired of Googling dimensions every time and never being 100% sure if the source is reliable`,
                    `You want the confidence that comes from knowing more than 95% of designers in the room`
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3 py-2">
                      <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* You DON'T need these books */}
              <div className="reveal bg-red-50/60 border border-red-100 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><X size={20} className="text-red-500" /></div>
                  <h3 className="text-xl font-bold text-gray-800">Skip this if…</h3>
                </div>
                <div className="space-y-3">
                  {[
                    `You're comfortable spending $5,000–$15,000 fixing design mistakes later (most people are, until they get the bill)`,
                    `You think watching a few YouTube videos makes you as qualified as someone with 20 years of experience`,
                    `You don't mind your clients finding out you've been eyeballing clearances this whole time`,
                    `You believe good design is just about "how it looks" — and not about how it functions every day for the next 30 years`
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3 py-2">
                      <X size={16} className="text-red-400 mt-0.5 shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 5B: WHO THIS IS FOR
           ═══════════════════════════════════════════════ */}
        <section className="py-8 md:py-20">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-10">
              <p className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-3 font-semibold">Who is this for?</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight">Trusted by <span className="text-orange-500">every type</span> of design professional</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {INDUSTRIES.map((ind, i) => {
                const IconComp = ICON_MAP[ind.icon] || Home;
                return (
                  <div key={i} className="reveal text-center bg-white border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <IconComp size={22} className="text-orange-500" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">{ind.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════════
           SECTION 6B: WHAT YOU GET — Features
           ═══════════════════════════════════════════════ */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight">Everything you get <span className="text-orange-500">for $49</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((feat, i) => {
                return (
                  <div key={i} className="reveal bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-orange-200 transition-all group">
                    <div className="w-12 h-12 mb-4 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-100 transition-colors">
                      {feat.icon}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{feat.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════════
           SECTION 7B: HOW TO USE IT — Business Modules
           ═══════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-12">
              <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 font-display">Start using them today</p>
              <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 tracking-tightest">4 ways this <span className="font-serif italic font-normal text-orange-600">pays for itself</span> immediately</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {BUSINESS_MODULES.map((mod, i) => {
                const IconComp = ICON_MAP[mod.icon] || Home;
                return (
                  <div key={i} className="reveal bg-white border border-gray-100 rounded-2xl p-6 flex gap-5 items-start hover:shadow-lg hover:border-orange-200 transition-all">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <IconComp size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">{mod.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{mod.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 8: TESTIMONIALS
           ═══════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 overflow-hidden">
          <div className="px-5 mb-12 text-center">
            <div className="reveal">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 tracking-tight mb-3">50,000+ readers <span className="text-orange-500">can't be wrong</span></h2>
              <p className="text-gray-600 text-lg">See why people call this the best design investment they've ever made.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Top Row */}
            <div className="flex gap-5 animate-scroll-left hover:pause">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={i} className="w-[340px] shrink-0 bg-white border border-gray-100 p-7 rounded-3xl shadow-sm hover:shadow-lg transition-all">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-orange-400 text-orange-400" />)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-sm text-orange-600">{t.name[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">{t.name} <CheckCircle2 size={12} className="text-emerald-500" /></p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t.role} • {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="flex gap-5 animate-scroll-right hover:pause">
              {[...TESTIMONIALS.slice().reverse(), ...TESTIMONIALS.slice().reverse()].map((t, i) => (
                <div key={i} className="w-[340px] shrink-0 bg-white border border-gray-100 p-7 rounded-3xl shadow-sm hover:shadow-lg transition-all">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-orange-400 text-orange-400" />)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-sm text-orange-600">{t.name[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">{t.name} <CheckCircle2 size={12} className="text-emerald-500" /></p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest">{t.role} • {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 9: GUARANTEE + PRICING CTA
           ═══════════════════════════════════════════════ */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-5">
            {/* Guarantee */}
            <div className="reveal text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 mb-6">
                <ShieldCheck size={36} className="text-emerald-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4 tracking-tight">You're protected. Completely.</h2>
              <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto">
                Try the books for a full 30 days. If they don't change how you approach design, we'll refund every rupee. No questions, no forms — just an email. We take the risk so you don't have to.
              </p>
            </div>

            {/* Pricing Card */}
            <div className="reveal bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-gray-900/10 border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

              <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-4">Limited time pricing</p>
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-2xl font-medium text-gray-300 line-through">$199</span>
                <span className="text-6xl md:text-7xl font-display font-black text-gray-900 tracking-tighter">$49</span>
              </div>
              <p className="text-orange-500 font-semibold text-sm mb-8">75% off · One-time payment · Yours forever · Free updates for life</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 text-left">
                {[
                  { icon: <BookOpen size={16} />, text: 'All 6 eBooks (PDF)' },
                  { icon: <Download size={16} />, text: 'Instant Download' },
                  { icon: <Infinity size={16} />, text: 'Lifetime Updates' },
                  { icon: <Target size={16} />, text: 'Clearance Charts' },
                  { icon: <Sparkles size={16} />, text: 'High-Res Images' },
                  { icon: <ShieldCheck size={16} />, text: '30-Day Guarantee' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-orange-400">{feat.icon}</span> {feat.text}
                  </div>
                ))}
              </div>

              <button onClick={navigateToCheckout} className="cta-primary w-full py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
                Get Instant Access <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>

              <p className="text-xs text-gray-500 mt-4">Secure payment · Instant download · No subscription</p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 10: FAQ
           ═══════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-5">
            <div className="reveal text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 tracking-tight">Still thinking about it?</h2>
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, i) => (
                <details key={i} className="reveal group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm" open={openFaqIndex === i}>
                  <summary
                    className="flex items-center justify-between p-5 cursor-pointer list-none"
                    onClick={(e) => { e.preventDefault(); setOpenFaqIndex(openFaqIndex === i ? null : i); }}
                  >
                    <span className="text-sm md:text-base font-semibold text-gray-800 pr-6">{faq.question}</span>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform shrink-0 ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 11: FINAL CTA
           ═══════════════════════════════════════════════ */}
        <section className="py-8 md:py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
            <div className="reveal">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-5 tracking-tight">Every day you wait is another design decision you might regret.</h2>
              <p className="text-gray-500 text-lg mb-8">50,000+ designers and homeowners already have these books. The only question is — how many more mistakes will you make before you get them too?</p>
              <button onClick={navigateToCheckout} className="cta-primary px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all inline-flex items-center gap-3 group whitespace-nowrap">
                Get all 6 books — $49 <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> 30-Day Guarantee</span>
                <span className="flex items-center gap-1.5"><Zap size={14} className="text-orange-400" /> Instant Download</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 bg-gray-900 border-t border-gray-800">
          <div className="max-w-5xl mx-auto px-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <BookOpen size={16} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-white">Interior Design System</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-500">
                <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
              </div>
              <p className="text-xs text-gray-600">© {new Date().getFullYear()} Interior Design System. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Sticky Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 shadow-2xl shadow-gray-900/10">
          <div className="max-w-6xl mx-auto">
            {/* Mobile: timer + full-width button */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider">Offer ends in</span>
                  <CountdownTimer />
                </div>
                <div>
                  <span className="text-xs text-gray-600 line-through mr-1">$199</span>
                  <span className="text-lg font-display font-black text-gray-900">$49</span>
                </div>
              </div>
              <button onClick={navigateToCheckout} className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-orange-500/20">
                Get All 6 Books <ArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
              </button>
            </div>

            {/* Desktop: portraits + timer + price + button */}
            <div className="hidden sm:flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {PORTRAIT_IMAGES.slice(0, 3).map((img, i) => (
                    <img key={i} src={img} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-none">50,000+ readers</p>
                  <p className="text-[10px] text-gray-600">trusted worldwide</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider">Offer ends in</span>
                  <CountdownTimer />
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600 line-through mr-2">$199</span>
                  <span className="text-xl font-display font-black text-gray-900">$49</span>
                </div>
                <button onClick={navigateToCheckout} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-sm hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 group whitespace-nowrap shadow-lg shadow-orange-500/20">
                  Get All 6 Books <ArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;