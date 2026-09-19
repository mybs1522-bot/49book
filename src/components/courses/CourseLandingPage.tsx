import React, { useState, useEffect } from 'react';
import {
  ArrowRight, Star, CheckCircle2, ShieldCheck, Target, TrendingUp,
  Zap, Users, BookOpen, Download, Infinity, Award, Eye, Heart,
  Clock, Layers, LifeBuoy, Briefcase, ChevronDown, Check, Sparkles,
  Monitor, Video, Palette, Box, Cpu, Compass, Layout, ChevronLeft, ChevronRight
} from 'lucide-react';
import { FRONT_END_COURSES, FRONT_END_PRICE, FRONT_END_ORIGINAL_PRICE, TESTIMONIALS, FAQ_ITEMS } from '../../constants-courses';
import { trackMetaEvent } from '../../utils/meta-tracking';

const PORTRAIT_IMAGES = [
  '/portraits/reader1.jpg',
  '/portraits/reader2.jpg',
  '/portraits/reader3.jpg',
  '/portraits/reader4.jpg',
];

const AUDIENCE_LIST = [
  { label: 'Architecture Students', icon: Compass },
  { label: 'Interior Designers', icon: Palette },
  { label: '3D Visualizers', icon: Monitor },
  { label: 'Freelancers & Studios', icon: Briefcase },
  { label: 'Contractors & Builders', icon: Layout },
  { label: 'DIY Enthusiasts', icon: Box },
];

const CURRICULUM_COURSES = [
  {
    id: 'sketchup',
    tab: 'Course 1',
    bookNum: 'Course 1',
    title: 'SketchUp Pro: 3D Modeling Masterclass',
    badge: 'Foundation · 55k Students',
    desc: 'From a blank digital canvas to accurate 3D rooms, custom furniture, millwork, and complex architectural structures.',
    sections: [
      {
        name: 'Interface & Precision',
        items: ['Fast keyboard shortcuts & custom setup', 'Millimeter & inch precision drawing', 'Wall framing, window cutouts & openings', 'Stairs, roofs & structural elements']
      },
      {
        name: 'Complex Rooms & Furniture',
        items: ['Cabinetry, islands & custom kitchens', 'Curved surfaces & parametric geometry', 'Organizing tags, groups & nested components', 'Dynamic components for rapid variations']
      },
      {
        name: 'Materials & UV Mapping',
        items: ['PBR wood grains, fabric repeats & tiles', 'Importing 2D CAD drawings for 1-click extrusion', 'Clean modeling habits for V-Ray & D5', 'Optimizing polygons for lag-free models']
      },
      {
        name: 'Client Presentations',
        items: ['Style presets & sketch aesthetics', 'Exporting high-res 2D layouts', 'Section planes & architectural cutaways', 'Scene tabs for client walkthroughs']
      }
    ],
    image: 'https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo'
  },
  {
    id: 'vray',
    tab: 'Course 2',
    bookNum: 'Course 2',
    title: 'V-Ray Photorealism: Lighting & Shading',
    badge: 'Magazine Quality · 48k Students',
    desc: 'Transform raw 3D models into award-winning photorealistic renderings with realistic sunlight, night moods, and glass reflections.',
    sections: [
      {
        name: 'Natural & Studio Lighting',
        items: ['Sun + Sky simulation & Golden Hour warmth', 'HDRI dome environments for hyper-realism', 'Interior IES light profiles & downlights', 'Day vs night moody scene setups']
      },
      {
        name: 'PBR Shader Creation',
        items: ['Flawless glass, water & mirror reflections', 'Velvet, leather, boucle & micro-scratched brass', 'Displacement maps for textured brick & concrete', 'Subsurface scattering for marble & wax']
      },
      {
        name: 'Camera Composition',
        items: ['Architectural 2-point vertical perspective', 'Depth of field (bokeh) for hero shots', 'Exposure balance & ISO / shutter controls', 'Rule of thirds for interior focal points']
      },
      {
        name: 'Post-Production in VFB',
        items: ['Color correction directly in V-Ray VFB', 'Bloom & glare optical lens effects', 'Cryptomatte & render elements export', '4K batch rendering workflows']
      }
    ],
    image: 'https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8'
  },
  {
    id: 'd5',
    tab: 'Course 3',
    bookNum: 'Course 3',
    title: 'D5 Render AI: Real-Time Raytracing',
    badge: 'Next-Gen AI · 19k Students',
    desc: 'Harness the power of AI real-time raytracing. See photorealistic changes instantly while walking through designs in 60 FPS.',
    sections: [
      {
        name: 'Real-Time AI Lighting',
        items: ['Instant real-time raytracing preview', 'AI Atmosphere Match from reference photos', 'Dynamic weather: rain, fog, snowfall & clouds', 'Geo-located realistic sun positions']
      },
      {
        name: 'Smart Asset Library',
        items: ['Animated wind-reactive trees & foliage', 'Photorealistic humans, cars & parallax interiors', '1-click Scatter tools for lush lawns and forests', 'High-poly luxury furniture assets']
      },
      {
        name: '4K Animations & Video',
        items: ['Cinematic camera keyframing & drone sweeps', 'Exporting 4K video walkthroughs in minutes', 'AI Post-Enhancer for ultra-crisp output', 'Virtual Reality (VR) 360° panoramas']
      },
      {
        name: 'Live Client Presentations',
        items: ['Live syncing with SketchUp models', 'Switching materials on the fly in meetings', 'Interactive presentation mode for clients', 'Quick cloud rendering for instant sharing']
      }
    ],
    image: 'https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr'
  }
];

const COURSE_THUMBNAILS = [
  { label: 'SketchUp Pro', sub: '3D Modeling', image: 'https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo' },
  { label: 'V-Ray', sub: 'Photorealism', image: 'https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8' },
  { label: 'D5 Render AI', sub: 'Real-Time Raytracing', image: 'https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr' }
];

export const CourseLandingPage: React.FC<{ onNavigateToCheckout: () => void }> = ({ onNavigateToCheckout }) => {
  const [activeCurriculumIndex, setActiveCurriculumIndex] = useState(0);
  const [curriculumPaused, setCurriculumPaused] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  const heroSlides = [
    {
      title: 'Real-Time AI Rendering Pipeline',
      image: 'https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr',
      tag: 'SketchUp + V-Ray + D5 Render AI'
    },
    {
      title: 'Magazine-Quality Photorealistic Lighting',
      image: 'https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8',
      tag: 'V-Ray Next Masterclass'
    },
    {
      title: 'Fast & Accurate 3D Interior Modeling',
      image: 'https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo',
      tag: 'SketchUp Pro Pipeline'
    }
  ];

  // Auto-cycle hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex(prev => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Auto-cycle curriculum tabs
  useEffect(() => {
    if (curriculumPaused) return;
    const timer = setInterval(() => {
      setActiveCurriculumIndex(prev => (prev + 1) % CURRICULUM_COURSES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [curriculumPaused]);

  const handleCurriculumClick = (index: number) => {
    setActiveCurriculumIndex(index);
    setCurriculumPaused(true);
    setTimeout(() => setCurriculumPaused(false), 8000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    trackMetaEvent({
      eventName: 'ViewContent',
      content_name: '3 Architecture & 3D Visualization Master Courses',
      content_ids: ['courses-sketchup-vray-d5'],
      content_type: 'product',
      value: FRONT_END_PRICE,
      currency: 'USD'
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheckoutClick = () => {
    trackMetaEvent({
      eventName: 'AddToCart',
      content_name: '3 Architecture & 3D Visualization Master Courses',
      content_ids: ['courses-sketchup-vray-d5'],
      content_type: 'product',
      value: FRONT_END_PRICE,
      currency: 'USD'
    });
    onNavigateToCheckout();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden antialiased relative">
      {/* Light opacity grid overlay across entire page matching 6 Books */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <main className="relative z-10">
        {/* ═══════════════════════════════════════════════
           SECTION 1: HERO — The First Impression
           ═══════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(165deg, #fefcf9 0%, #fff8f0 25%, #ffffff 50%, #fef9f2 75%, #fffdf8 100%)'
          }}
        >
          {/* Animated ambient orbs */}
          <div
            className="absolute top-[-150px] right-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)',
              animation: 'float 8s ease-in-out infinite'
            }}
          />
          <div
            className="absolute bottom-[-100px] left-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
              animation: 'float 10s ease-in-out infinite reverse'
            }}
          />

          <div className="max-w-6xl mx-auto px-5 relative z-10 pt-10 md:pt-20 pb-10 md:pb-28">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              
              {/* Pain-point opener */}
              <p className="text-gray-900 text-sm md:text-lg font-semibold leading-relaxed max-w-lg mb-3">
                In 3D Architecture & Visualization, <span className="font-black text-gray-950">speed & photorealism</span> matter most. The real question is&nbsp;—
              </p>
              
              <h2 className="text-xl md:text-3xl font-display font-black text-orange-600 tracking-tight leading-[1.15] mb-5 max-w-xl">
                How to create magazine-quality 3D renders in minutes without wasting months on scattered tutorials?
              </h2>

              <p className="text-sm md:text-lg text-gray-800 font-semibold mb-6 max-w-md">That's why we present</p>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-display font-black leading-[1.05] mb-5 text-gray-900 tracking-tightest text-balance">
                3 Master Courses on<br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #ea580c 0%, #d97706 50%, #b45309 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  3D Modeling & Photorealism
                </span>
              </h1>

              {/* Trust badge pill */}
              <div className="mb-6 inline-flex items-center gap-1.5 md:gap-2.5 px-3 md:px-5 py-2 md:py-2.5 bg-white/70 backdrop-blur-md border border-orange-100/80 rounded-full shadow-sm shadow-orange-500/5 whitespace-nowrap">
                <div className="hidden md:flex -space-x-2">
                  {PORTRAIT_IMAGES.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div className="flex items-center gap-0.5 md:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="fill-orange-400 text-orange-400 md:w-[11px] md:h-[11px]" />
                  ))}
                </div>
                <span className="text-[10px] md:text-xs font-bold text-gray-700">
                  Trusted by 48,000+ architects & 3D designers in 21+ countries
                </span>
              </div>

              {/* Hero Product Image Showcase Slider */}
              <div className="w-full max-w-4xl mx-auto">
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group bg-white shadow-2xl border border-orange-100">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                    <video
                      src="https://d38b044pevnwc9.cloudfront.net/promeAI/landing/func-video/blender.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 text-left">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest mb-2 shadow">
                          <Sparkles size={12} /> Real-Time Raytracing Pipeline
                        </span>
                        <h3 className="text-xl md:text-3xl font-display font-black text-white leading-tight">
                          SketchUp Pro + V-Ray + D5 Render AI
                        </h3>
                        <p className="text-xs md:text-sm text-gray-300 max-w-lg mt-1">
                          Model complete 3D interiors, master realistic lighting, and export 4K cinematic walkthroughs in minutes.
                        </p>
                      </div>

                      <button
                        onClick={handleCheckoutClick}
                        className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-orange-500/30 flex items-center gap-2 shrink-0 active:scale-95 transition-all"
                      >
                        <span>Enroll for ${FRONT_END_PRICE}</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pain Point + Value Prop — Below Image (Matching 6 Books layout) */}
              <div className="mt-16 md:mt-24 w-full max-w-4xl mx-auto">
                <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto space-y-4">
                  <p className="text-orange-500 text-xs font-mono uppercase tracking-[0.25em] font-bold">
                    Before you design anything
                  </p>
                  <h2 className="text-2xl md:text-5xl font-display font-black text-gray-900 tracking-tightest leading-[1.1]">
                    One bad render =<br />
                    <span className="font-serif italic font-normal text-orange-600">lost $5,000 clients.</span>
                  </h2>
                  <p className="text-gray-700 text-sm md:text-lg leading-relaxed">
                    <span className="font-bold text-gray-900">50+ hours of step-by-step masterclasses.</span> Every shortcut, material, lighting setup & AI real-time raytracing trick.
                  </p>
                  <p className="text-orange-600 font-bold text-sm md:text-base">
                    Years of studio knowledge — yours in hours.
                  </p>
                </div>

                {/* 3 Course Thumbnails Grid (Matching 6 Books 3-column card style) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
                  {COURSE_THUMBNAILS.map((thumb, i) => (
                    <div
                      key={i}
                      onClick={handleCheckoutClick}
                      className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[3/4] bg-gray-100 group cursor-pointer shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:scale-[1.03]"
                    >
                      <img
                        src={thumb.image}
                        alt={thumb.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-left">
                        <span className="text-[10px] md:text-xs font-bold text-orange-400 uppercase tracking-widest">
                          Course {i + 1}
                        </span>
                        <p className="text-base md:text-lg font-bold text-white leading-tight mt-0.5">
                          {thumb.label}
                        </p>
                        <p className="text-xs text-gray-300 mt-1">{thumb.sub}</p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-transparent group-hover:border-orange-400/40 transition-colors pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 2: WHO THIS IS FOR (Matching 6 Books)
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-5">
            <div className="text-center mb-7 md:mb-10">
              <p className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-3 font-semibold">
                Who is this for?
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight">
                Trusted by <span className="text-orange-500">Students, Designers & 3D Artists</span> Alike
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {AUDIENCE_LIST.map((ind, i) => {
                const IconComp = ind.icon;
                return (
                  <div
                    key={i}
                    className="text-center bg-white border border-gray-100 rounded-2xl p-4 md:p-5 hover:border-orange-200 hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-50 flex items-center justify-center">
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
           SECTION 3: WHAT'S INSIDE — CURRICULUM TABS (Matching 6 Books Curriculum component)
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-24 bg-gray-50 border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-5">
            <div className="text-center mb-7 md:mb-10">
              <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 font-display">
                What's inside
              </p>
              <h2 className="text-3xl md:text-6xl font-display font-black text-gray-900 tracking-tightest">
                50+ hours that cover <span className="font-serif italic font-normal text-orange-600">everything</span>
              </h2>
              <p className="text-gray-600 text-base md:text-lg mt-3 max-w-2xl mx-auto">
                Every modeling shortcut. Every photorealistic lighting setting. Every real-time AI tool — <span className="font-bold text-gray-900">and how to close $5,000 clients with it</span>.
              </p>
            </div>

            {/* Curriculum Buttons Tab Switcher */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
              {CURRICULUM_COURSES.map((course, i) => (
                <button
                  key={course.id}
                  onClick={() => handleCurriculumClick(i)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeCurriculumIndex === i
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <BookOpen size={16} />
                  <span>{course.bookNum}: {course.tab === 'Course 1' ? 'SketchUp' : course.tab === 'Course 2' ? 'V-Ray' : 'D5 Render AI'}</span>
                </button>
              ))}
            </div>

            {/* Curriculum Panel */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-900/5 border border-gray-100">
              <div className="md:flex">
                <div className="md:w-1/3 aspect-square md:aspect-auto bg-gray-900 relative overflow-hidden">
                  <img
                    src={CURRICULUM_COURSES[activeCurriculumIndex].image}
                    alt={CURRICULUM_COURSES[activeCurriculumIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase">
                    {CURRICULUM_COURSES[activeCurriculumIndex].badge}
                  </span>
                </div>
                <div className="md:w-2/3 p-5 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    {CURRICULUM_COURSES[activeCurriculumIndex].title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-5">{CURRICULUM_COURSES[activeCurriculumIndex].desc}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {CURRICULUM_COURSES[activeCurriculumIndex].sections.map((section, j) => (
                      <div key={j}>
                        <h4 className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">
                          {section.name}
                        </h4>
                        <ul className="space-y-1.5 md:space-y-2">
                          {section.items.map((item, k) => (
                            <li key={k} className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                              <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">10,000+ textures & models included</span>
                    <button
                      onClick={handleCheckoutClick}
                      className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <span>Enroll for ${FRONT_END_PRICE}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA under curriculum */}
            <div className="flex flex-col items-center justify-center mt-8">
              <button
                onClick={handleCheckoutClick}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all inline-flex items-center gap-3 group whitespace-nowrap"
              >
                <span>Courses Instant Access — ${FRONT_END_PRICE}</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1 font-medium">
                <Download size={12} className="text-orange-400" /> Download & Stream Instantly
              </p>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 4: MARKETING COPY & CONFIDENCE (Matching 6 Books)
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5">
            <div className="text-center space-y-4 md:space-y-6">
              <p className="text-gray-600 text-sm md:text-lg mb-1 italic max-w-2xl mx-auto">
                In our business of 3D Visualization and Architecture, <span className="font-bold text-gray-900">creating photorealistic renders on demand</span> matters the most.
              </p>
              <p className="text-gray-700 text-sm md:text-lg leading-relaxed max-w-xl mx-auto mb-2 md:mb-4">
                And now, the question is no longer <span className="font-serif italic">how</span> to learn it. The real question is...
              </p>
              <h2 className="text-3xl md:text-6xl font-display font-black text-orange-600 tracking-tightest leading-[1] text-balance mb-5 md:mb-8">
                How to master it WITHOUT spending years in trial and error?
              </h2>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 rounded-2xl p-5 md:p-8 max-w-2xl mx-auto">
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0">💡</span>
                  <div>
                    <p className="text-gray-800 text-sm md:text-lg leading-relaxed text-left">
                      That's <span className="font-bold text-orange-600">exactly why</span> we built these 3 courses. <span className="font-bold text-orange-600">50+ hours of step-by-step masterclasses</span> showing exact lighting, camera compositions, and AI raytracing pipelines. <span className="font-serif italic text-gray-900">Learn in hours what took us 10 years to master.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* This is for you if... */}
        <section className="py-6 md:py-12 bg-white">
          <div className="max-w-3xl mx-auto px-5">
            <h2 className="text-2xl md:text-3xl font-display font-black text-gray-900 tracking-tight mb-4 md:mb-6 text-center">
              Here's the thing — <span className="font-serif italic font-normal text-orange-600">this is for you if...</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
              {[
                { text: 'You want to create photorealistic renders that stun clients', icon: '✅' },
                { text: "You want to complete 3D models 10x faster without software lag", icon: '✅' },
                { text: 'You want to use AI real-time raytracing in client meetings', icon: '✅' },
                { text: 'You want high-paying freelance visualization projects', icon: '✅' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-100 transition-colors">
                  <span className="text-base shrink-0">{item.icon}</span>
                  <p className="text-gray-800 text-sm font-medium leading-snug">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sound Familiar? */}
        <section className="py-10 md:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-5">
            <div className="text-center mb-8 md:mb-12">
              <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 font-display">Sound familiar?</p>
              <h2 className="text-3xl md:text-6xl font-display font-black text-gray-900 tracking-tightest">
                You know what <span className="font-serif italic font-normal text-orange-600">really hurts?</span>
              </h2>
              <p className="text-gray-600 text-base md:text-lg mt-3 mb-5 md:mb-8">It's not that you lack creativity. You have it. But...</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {[
                { emoji: "😩", text: "You spend 12 hours rendering a room... and it still looks flat, plastic, and amateur. You don't know which setting is ruining it." },
                { emoji: "💸", text: "You lost high-ticket interior design clients to competitors because their 3D presentation renders looked like real photographs." },
                { emoji: "😶", text: "YouTube tutorials give 5-minute disjointed tricks that don't teach the complete pipeline from blank canvas to final client delivery." },
                { emoji: "🤯", text: "Your computer crashes and freezes on heavy models because you never learned the professional polygon and proxy workflows." }
              ].map((p, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 flex gap-4 items-start hover:border-orange-200 transition-colors shadow-sm">
                  <span className="text-3xl shrink-0">{p.emoji}</span>
                  <p className="text-gray-600 text-sm leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why These Courses Change Everything */}
        <section className="py-10 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5">
            <div className="border-t-[6px] border-orange-500 pt-7 md:pt-10">
              <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 tracking-tightest text-center mb-4 md:mb-6">
                Here's what makes these courses <span className="font-serif italic font-normal text-orange-600">different</span>
              </h2>
              <p className="text-center text-gray-600 text-base md:text-lg mb-8 md:mb-12 max-w-xl mx-auto">
                They're not just theory. They're <span className="font-bold text-gray-900">practical studio projects</span> that show you <span className="font-bold text-emerald-600">exact settings</span> and <span className="font-bold text-red-600">mistakes to avoid</span>.
              </p>
              <div className="space-y-3 md:space-y-4 max-w-xl mx-auto">
                {[
                  { emoji: '💡', bold: "Instantly charge 3x more for designs", rest: ' — clients gladly pay premium rates when your renders look like architectural magazine spreads' },
                  { emoji: '📐', bold: 'Full project files included', rest: ' — follow along with exact 3D models, textures, and lighting setups' },
                  { emoji: '⚡', bold: 'Real-time rendering speed', rest: ' — make live changes in seconds during client video calls with D5 Render AI' },
                  { emoji: '✨', bold: 'The "studio secret"', rest: ' — know exact PBR reflection and IES lighting values without guessing' },
                  { emoji: '💰', bold: 'High return on investment', rest: ' — closing just one client pays for this $9 bundle 500 times over' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm md:text-base">
                    <span className="text-xl shrink-0">{item.emoji}</span>
                    <p className="text-gray-800">
                      <strong className="text-gray-900">{item.bold}</strong>{item.rest}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 5: WHAT YOU GET FOR $9 (Matching 6 Books)
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-5">
            <div className="text-center mb-7 md:mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight">
                Everything you get <span className="text-orange-500">for ${FRONT_END_PRICE}</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {[
                { title: '3 Full Masterclasses', desc: 'SketchUp Pro + V-Ray Photorealism + D5 Render AI video courses.', icon: <Video size={22} /> },
                { title: '10,000+ Textures & PBR', desc: 'High-res woods, marbles, metals, fabrics and displacement maps.', icon: <Palette size={22} /> },
                { title: '2,000+ 3D Assets', desc: 'Ready-to-drop furniture, vegetation, cars and lighting components.', icon: <Box size={22} /> },
                { title: 'HDRI Lighting Pack', desc: 'Studio, daylight and sunset lighting domes for instant realism.', icon: <Sparkles size={22} /> },
                { title: 'Official Certificate', desc: 'Verified diploma of completion to display on your portfolio.', icon: <Award size={22} /> },
                { title: 'Lifetime Access & Updates', desc: 'Keep forever with all future software updates included at no extra charge.', icon: <Infinity size={22} /> }
              ].map((feat, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-lg hover:border-orange-200 transition-all group">
                  <div className="w-12 h-12 mb-4 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-100 transition-colors">
                    {feat.icon}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 6: TESTIMONIALS (Exact Double Marquee Matching 6 Books)
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-24 overflow-hidden bg-white">
          <div className="px-5 mb-8 md:mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 tracking-tight mb-3">
              Don't just take <span className="text-orange-500">our word for it</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Thousands of designers and students already have these courses. Here's what they're saying:
            </p>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            {/* Top Row Marquee */}
            <div className="flex gap-5 animate-scroll-left hover:pause">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div
                  key={i}
                  className="w-[320px] md:w-[340px] shrink-0 bg-white border border-gray-100 p-5 md:p-7 rounded-3xl shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className="fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-sm text-orange-600">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">{t.name}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest">{t.role} • {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row Marquee */}
            <div className="flex gap-5 animate-scroll-right hover:pause">
              {[...TESTIMONIALS.slice().reverse(), ...TESTIMONIALS.slice().reverse()].map((t, i) => (
                <div
                  key={i}
                  className="w-[320px] md:w-[340px] shrink-0 bg-white border border-gray-100 p-5 md:p-7 rounded-3xl shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className="fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-sm text-orange-600">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">{t.name}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest">{t.role} • {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 7: GUARANTEE + PRICING CARD (Matching 6 Books)
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-5">
            {/* Guarantee */}
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 mb-6">
                <ShieldCheck size={36} className="text-emerald-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4 tracking-tight">
                And yes, you're <span className="text-emerald-600">completely protected</span>
              </h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                Try the courses for 30 days. If they don't level up your rendering skills — <span className="font-bold text-gray-900">we'll refund every penny.</span> No questions. Just an email. <span className="font-serif italic">We take the risk, not you.</span>
              </p>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl shadow-gray-900/10 border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

              <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-4">
                The Complete 3-Course Bundle
              </p>
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-6xl md:text-7xl font-display font-black text-gray-900 tracking-tighter">
                  ${FRONT_END_PRICE}
                </span>
              </div>
              <p className="text-orange-500 font-semibold text-sm mb-6 md:mb-8">
                One-time payment · Yours forever · Free software links included
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 md:mb-8 text-left">
                {[
                  { icon: <Monitor size={16} />, text: '3 Full Masterclasses' },
                  { icon: <Download size={16} />, text: 'Instant Access' },
                  { icon: <Infinity size={16} />, text: 'Lifetime Updates' },
                  { icon: <Palette size={16} />, text: '10,000+ Textures' },
                  { icon: <Sparkles size={16} />, text: '2,000+ 3D Assets' },
                  { icon: <ShieldCheck size={16} />, text: '30-Day Guarantee' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-orange-400">{feat.icon}</span> {feat.text}
                  </div>
                ))}
              </div>

              <div>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span>Get Instant Access — ${FRONT_END_PRICE}</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 8: FAQ ACCORDION
           ═══════════════════════════════════════════════ */}
        <section className="py-12 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-5">
            <div className="text-center mb-10">
              <p className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-2 font-semibold">
                Got Questions?
              </p>
              <h2 className="text-3xl font-display font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full p-5 text-left font-bold text-sm md:text-base text-gray-900 flex justify-between items-center gap-4 hover:text-orange-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 transition-transform duration-200 shrink-0 ${
                        openFaqIndex === i ? 'rotate-180 text-orange-500' : ''
                      }`}
                    />
                  </button>
                  {openFaqIndex === i && (
                    <div className="px-5 pb-5 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 bg-white border-t border-gray-100 text-center text-xs text-gray-500">
          <div className="max-w-4xl mx-auto px-5 space-y-3">
            <p className="font-bold text-gray-800">AVADA Courses — Architecture & 3D Visualization</p>
            <p>© {new Date().getFullYear()} AVADA. All rights reserved.</p>
          </div>
        </footer>
      </main>

      {/* Sticky Bottom Bar on Mobile/Desktop matching 6 Books */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 px-4 shadow-2xl flex items-center justify-between max-w-lg md:max-w-xl mx-auto md:rounded-t-2xl">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-display font-black text-gray-900">${FRONT_END_PRICE}</span>
              <span className="text-xs text-gray-400 line-through">${FRONT_END_ORIGINAL_PRICE}</span>
            </div>
            <p className="text-[10px] text-orange-600 font-bold">3 Master Courses · Instant Lifetime Access</p>
          </div>

          <button
            onClick={handleCheckoutClick}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs md:text-sm font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <span>Get Instant Access</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
