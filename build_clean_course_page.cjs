const fs = require('fs');
const path = require('path');

const projectRoot = 'C:\\Users\\bhave\\.gemini\\antigravity\\scratch\\49book';

// Read the pure working 6-books page as template
const indexHtmlPath = path.join(projectRoot, 'index.html');
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Inject Tailwind CDN, Google Fonts, and modern landing page styling into <head>
const modernLandingHeadInject = `
<!-- Google Fonts for Course Landing Page (Inter, Space Grotesk, Playfair Display, JetBrains Mono) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

<!-- Tailwind CDN with preflight disabled so outer Shopify Booster theme is untouched -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    corePlugins: {
      preflight: false,
    },
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
          display: ['Space Grotesk', 'sans-serif'],
          serif: ['Playfair Display', 'serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        colors: {
          slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
          },
        },
        boxShadow: {
          'soft': '0 2px 40px rgba(0,0,0,0.06)',
          'card': '0 4px 24px rgba(0,0,0,0.06)',
          'lift': '0 20px 60px rgba(0,0,0,0.1)',
        }
      }
    }
  }
</script>

<style>
  /* 1. Hide buggy top sticky mobile bar completely */
  .sticky--mobile, .sticky--closed, .sticky--open__button, .sticky--atc__button {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    overflow: hidden !important;
  }

  /* 2. Grid Background & Smooth Animations from start.avadalearn.com */
  .grid-bg {
    background-color: #ffffff;
    background-image: 
      linear-gradient(to right, rgba(37, 99, 235, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(37, 99, 235, 0.05) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  @keyframes scroll-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes scroll-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .animate-scroll-left {
    display: flex;
    width: max-content;
    animation: scroll-left 45s linear infinite;
  }
  .animate-scroll-right {
    display: flex;
    width: max-content;
    animation: scroll-right 45s linear infinite;
  }
  .hover\\:pause:hover {
    animation-play-state: paused !important;
  }

  
  /* CRITICAL: Override Booster theme .grid rule that forces 12 rows repeat(12, 1fr) */
  #tab--tab_synopsis .grid,
  #landing-page-exact-avadalearn .grid,
  #tab--tab_synopsis [class*="grid-cols-"],
  #landing-page-exact-avadalearn [class*="grid-cols-"] {
    display: grid !important;
    grid-template-rows: auto !important;
    grid-auto-rows: auto !important;
  }

  /* 3. Clean Scoped Resets for Synopsis Tab */
  #tab--tab_synopsis {
    padding: 0 !important;
    border: none !important;
    background: #ffffff !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    color: #0f172a !important;
    -webkit-font-smoothing: antialiased;
  }
  #tab--tab_synopsis * {
    box-sizing: border-box;
  }
  #tab--tab_synopsis a {
    text-decoration: none;
    color: inherit;
  }
  #tab--tab_synopsis button {
    cursor: pointer;
    font-family: inherit;
  }
  #tab--tab_synopsis details > summary::-webkit-details-marker {
    display: none;
  }
  #tab--tab_synopsis details > summary {
    list-style: none;
  }

  /* Lightbox Modal */
  .cl-render-modal {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(8px);
    padding: 1rem;
  }
  .cl-render-modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cl-render-modal img {
    max-width: 100%;
    max-height: 85vh;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    object-fit: contain;
  }
  .cl-modal-btn {
    position: absolute;
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 9999px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .cl-modal-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
  .cl-modal-close {
    top: -50px;
    right: 0;
  }
  .cl-modal-prev {
    left: -60px;
  }
  .cl-modal-next {
    right: -60px;
  }
  @media (max-width: 768px) {
    .cl-modal-prev { left: 10px; bottom: 20px; }
    .cl-modal-next { right: 10px; bottom: 20px; }
    .cl-modal-close { top: 10px; right: 10px; }
  }
</style>
`;
html = html.replace('</head>', modernLandingHeadInject + '\n</head>');

// 2. Remove broken shopify internal modules/scripts
html = html.replace(/<script async="async" src="\/checkouts\/internal\/preloads\.js\?locale=en-US"><\/script>/g, '');
html = html.replace(/<script type="module" src="\/cdn\/shopifycloud\/portable-wallets\/latest\/portable-wallets\.en\.js"[^>]*><\/script>/g, '');
html = html.replace(/<link id="shopify-accelerated-checkout-styles"[^>]*>/g, '');
html = html.replace(/<script src="\/cdn\/wpm\/[^"]*"[^>]*><\/script>/g, '');
html = html.replace(/<script src="\/cdn\/shopifycloud\/perf-kit\/[^"]*"[^>]*><\/script>/g, '');
html = html.replace(/<script src="\/web-pixels[^"]*"[^>]*><\/script>/g, '');
html = html.replace(/<script defer="defer" async="" type="module" src="https:\/\/cdn\.shopify\.com\/shopifycloud\/shop-js\/[^"]*"><\/script>/g, '');
html = html.replace(/<script type="module">\s*await import\("https:\/\/cdn\.shopify\.com\/shopifycloud\/shop-js\/[^"]*"\);[\s\S]*?<\/script>/g, '');
html = html.replace(/<script id="shop-js-analytics"[^>]*>[\s\S]*?<\/script>/g, '');

// 3. Page Title & Meta
html = html.replace(
  /<title>.*?<\/title>/gi,
  '<title>3 Master Courses on 3D Modeling & Photorealism (SketchUp + V-Ray + D5 Render AI) — AVADA</title>'
);

html = html.replace(
  /content="800\+ Pages of Handmade Architectural Diagrams.*?"/gi,
  'content="Master 3D Architectural Modeling, Photorealistic V-Ray Lighting & Real-Time D5 Render AI from scratch. Over 50+ hours of step-by-step masterclasses, source project files, and 10,000+ 3D assets trusted by 50,000+ architects and designers worldwide."'
);

html = html.replace(
  /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
  `<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "3 Master Courses for 3D Modeling & Photorealism",
  "image": [
    "https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo"
  ],
  "description": "Master 3D Architectural Modeling, Photorealistic V-Ray Lighting & Real-Time D5 Render AI from scratch. Over 50+ hours of step-by-step masterclasses, source project files, and 10,000+ 3D assets trusted by 50,000+ architects and designers worldwide.",
  "brand": {
    "@type": "Brand",
    "name": "AVADA"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "9.00",
    "availability": "https://schema.org/InStock",
    "url": "https://books.avadalearn.com/courses"
  }
}
</script>`
);

html = html.replace(
  /\/products\/6-books-for-interior-exterior-design/g,
  '/courses'
);

// 4. Header Nav Links
const coursesDesktopNav = `<nav class="main__navigation main__navigation--center main__navigation--opacity font__size--base">
                <span class="nav__link__holder">
                    <a class="nav__link nav__link--opacity" href="/">Home</a>
                </span>
                <span class="nav__link__holder">
                    <a class="nav__link nav__link--opacity" href="/">6 Books</a>
                </span>
                <span class="nav__link__holder nav__link--active">
                    <a class="nav__link nav__link--opacity" href="/courses">Courses</a>
                </span>
                <span class="nav__link__holder">
                    <a class="nav__link nav__link--opacity" href="/contact">Contact</a>
                </span>
        </nav>`;

const coursesMobileNav = `<nav class="mobile__navigation">
                <span class="nav__link__holder">
                    <a class="nav__link" href="/">Home</a>
                </span>
                <span class="nav__link__holder">
                    <a class="nav__link" href="/">6 Books</a>
                </span>
                <span class="nav__link__holder nav__link--active">
                    <a class="nav__link" href="/courses">Courses</a>
                </span>
                <span class="nav__link__holder">
                    <a class="nav__link" href="/contact">Contact</a>
                </span>
            <div class="mobile__navigation__footer">`;

html = html.replace(/<nav class="main__navigation main__navigation--center main__navigation--opacity font__size--base">[\s\S]*?<\/nav>/, coursesDesktopNav);
html = html.replace(/<nav class="mobile__navigation">[\s\S]*?<div class="mobile__navigation__footer">/, coursesMobileNav);

// 5. Left Column Gallery Slides (5 high-res course images)
const courseSlidesHtml = `
            <div data-variants="|" class="slide--product zoom" data-bstr-slide="active">
                <img height="1024" width="1024" loading="lazy" class="image-zoom lazyloaded" alt="3 Master Courses for 3D Modeling &amp; Photorealism" src="https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo" data-zoom="https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo">
            </div>
            <div data-variants="|" class="slide--product zoom" data-bstr-slide="">
                <img height="1024" width="1024" loading="lazy" class="lazyload image-zoom" alt="V-Ray 6 Photorealism Mastery" src="https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8" data-zoom="https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8">
            </div>
            <div data-variants="|" class="slide--product zoom" data-bstr-slide="">
                <img height="1024" width="1024" loading="lazy" class="lazyload image-zoom" alt="D5 Render AI Real-Time Raytracing" src="https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr" data-zoom="https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr">
            </div>
            <div data-variants="|" class="slide--product zoom" data-bstr-slide="">
                <img height="1024" width="1024" loading="lazy" class="lazyload image-zoom" alt="SketchUp 3D Modeling Precision" src="https://lh3.googleusercontent.com/d/1N_BbG9kAEwIk541Id53_RV0CWjO1jzAt" data-zoom="https://lh3.googleusercontent.com/d/1N_BbG9kAEwIk541Id53_RV0CWjO1jzAt">
            </div>
            <div data-variants="|" class="slide--product zoom" data-bstr-slide="">
                <img height="1024" width="1024" loading="lazy" class="lazyload image-zoom" alt="10,000+ 3D Assets &amp; PBR Materials" src="https://lh3.googleusercontent.com/d/1fV5bz4JDugh8HxLMJ0fXu5K5sDj3qlSR" data-zoom="https://lh3.googleusercontent.com/d/1fV5bz4JDugh8HxLMJ0fXu5K5sDj3qlSR">
            </div>
`;

html = html.replace(
  /<div class="slider--product" data-bstr-slider-height="auto" data-bstr-slider-orientation="horizontal" data-bstr-slide-holder="1" data-bstr-slider-current="0" data-bstr-slider-id="template--28173635256637__page">[\s\S]*?<\/div>\s*<\/div>\s*<div class="gallery__thumbnails-side">/,
  `<div class="slider--product" data-bstr-slider-height="auto" data-bstr-slider-orientation="horizontal" data-bstr-slide-holder="1" data-bstr-slider-current="0" data-bstr-slider-id="template--28173635256637__page">\n${courseSlidesHtml}\n</div>\n</div>\n<div class="gallery__thumbnails-side">`
);

// 6. Gallery Thumbnails
const courseThumbsHtml = `
            <span class="gallery__thumbnail bstrSlider__thumb--active" data-media-type="image" data-bstr-slider-for="template--28173635256637__page" data-bstr-slider-thumb="0">
                <img height="200" width="200" src="https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo" alt="SketchUp Pro Course">
            </span>
            <span class="gallery__thumbnail" data-media-type="image" data-bstr-slider-for="template--28173635256637__page" data-bstr-slider-thumb="1">
                <img height="200" width="200" src="https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8" alt="V-Ray 6 Course">
            </span>
            <span class="gallery__thumbnail" data-media-type="image" data-bstr-slider-for="template--28173635256637__page" data-bstr-slider-thumb="2">
                <img height="200" width="200" src="https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr" alt="D5 Render AI Course">
            </span>
            <span class="gallery__thumbnail" data-media-type="image" data-bstr-slider-for="template--28173635256637__page" data-bstr-slider-thumb="3">
                <img height="200" width="200" src="https://lh3.googleusercontent.com/d/1N_BbG9kAEwIk541Id53_RV0CWjO1jzAt" alt="Revit & BIM">
            </span>
            <span class="gallery__thumbnail" data-media-type="image" data-bstr-slider-for="template--28173635256637__page" data-bstr-slider-thumb="4">
                <img height="200" width="200" src="https://lh3.googleusercontent.com/d/1fV5bz4JDugh8HxLMJ0fXu5K5sDj3qlSR" alt="CAD & 3D Assets">
            </span>
`;

html = html.replace(
  /<div class="gallery__thumbnails hidden-scroll">[\s\S]*?<\/div>\s*<button data-thumbnail_slide="\+"/,
  `<div class="gallery__thumbnails hidden-scroll">\n${courseThumbsHtml}\n</div>\n<button data-thumbnail_slide="+"`
);

// 7. Right Column Eyebrow & Title
html = html.replace(
  /Bestseller in 26 Countries \| Home Design Category/g,
  'Bestseller in 3D Architectural Visualisation & Design'
);

html = html.replace(
  /<span class="product__title-prefix">6 Books For<\/span>\s*<span class="product__title-highlight">Interior &amp; Exterior Design<\/span>/g,
  '<span class="product__title-prefix">3 Master Courses For</span>\n    <span class="product__title-highlight">3D Modeling &amp; Photorealism</span>'
);

// 8. Rating Line
html = html.replace(
  /5,310&nbsp;ratings/g,
  '4,892&nbsp;ratings'
);
html = html.replace(
  /4,892&nbsp;verified reader reviews/g,
  '4,892&nbsp;verified student reviews'
);

// 9. Pricing & Discount
html = html.replace(/\$49/g, '$9');
html = html.replace(/\$98/g, '$29');
html = html.replace(/-50% OFF/g, '-69% OFF');

// 10. Swatches & Single Edition Clean Up (Remove Physical/Hardcopy, Only One Option Exists)
// Remove the Hardcopy swatch card element completely so only Instant Cloud Access exists
html = html.replace(
  /<div class="luxury-swatch-card"[^>]*data-swatch-option="Hardcopy"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
  ''
);

// Remove the Hardcopy variant from preselect JSON
html = html.replace(/,\s*"53067294572861":\s*\{[^}]+\}/g, '');

// Clean up Swatches Text
html = html.replace(/E-Book/g, 'Instant Cloud Access');
html = html.replace(/⚡ Instant PDF Download · 800\+ Pages · Lifetime Updates/g, '⚡ Instant Cloud Access · 3 Full Masterclasses · HD Video & Source Files');
html = html.replace(/<h4 class="h-reset swatches__title">Format/g, '<h4 class="h-reset swatches__title">Access Type');

// Remove the 6-books editorial blocks ("Avoid costly layout mistakes...", four sketches, 6 volumes)
html = html.replace(
  /<div class="product-editorial-block">[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>\s*<\/div>/g,
  ''
);

// Replace the trust bar safely without overshooting into tab structure
html = html.replace(
  /<div class="product-luxury-trust-bar">[\s\S]*?<\/div>\s*(?=<script>[\s\S]*?booster:initialized)/,
  `<div class="product-luxury-trust-bar">
    <div class="luxury-trust-item">
        <svg class="luxury-trust-icon-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        <div class="luxury-trust-heading">Instant Digital Access</div>
        <div class="luxury-trust-sub">Immediate download + lifetime updates</div>
    </div>
    <div class="luxury-trust-item">
        <svg class="luxury-trust-icon-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <div class="luxury-trust-heading">Software Links Included</div>
        <div class="luxury-trust-sub">SketchUp, V-Ray &amp; D5 Render</div>
    </div>
</div>\n\n`
);

// Remove dynamic hardcopy delivery sync script completely
html = html.replace(
  /\/\* Dynamic Hardcopy Delivery Visibility \*\/[\s\S]*?syncHardcopyDelivery\);\s*\}\)\(\);/,
  '/* Single Instant Access Edition - No Physical delivery required */'
);

// Single Swatch Mobile CSS: Make single swatch card full-width, clean and centered
html = html.replace(
  /\/\* Responsive Mobile Swatches[^\n]*\*\/[\s\S]*?\.luxury-soldout-tag\s*\{[^}]*\}\s*\}/,
  `/* Responsive Mobile Swatches (Single Clean Instant Access Card) */
@media (max-width: 767px) {
  .luxury-swatches-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    margin: 12px 0 16px 0 !important;
    width: 100% !important;
  }
  .luxury-swatch-card {
    flex: 1 1 100% !important;
    width: 100% !important;
    min-width: 0 !important;
    padding: 12px 14px !important;
    border-radius: 10px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    border: 1.5px solid #09090b !important;
    background: #ffffff !important;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04) !important;
  }
  .luxury-card-inner {
    gap: 10px !important;
    width: 100% !important;
    align-items: center !important;
  }
  .luxury-card-top-row {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
  }
  .luxury-card-title {
    font-size: 14px !important;
    font-weight: 700 !important;
  }
  .luxury-card-price {
    font-size: 15px !important;
    font-weight: 800 !important;
    color: #09090b !important;
  }
  .luxury-card-subtitle {
    display: block !important;
    font-size: 11px !important;
    line-height: 1.35 !important;
    color: #71717a !important;
    margin-top: 4px !important;
  }
  .luxury-card-badge {
    display: block !important;
    top: -7px !important;
    right: 8px !important;
    font-size: 7.5px !important;
    padding: 1.5px 6px !important;
  }
}`
);

// Neutralize any hardcopy checks in price calculations
html = html.replace(
  /var isHardcopy = activeSwatch && \([\s\S]*?\);/g,
  'var isHardcopy = false;'
);

// 10b. Replace 6 Books Showcase with 3 Master Courses Showcase (Images, Names & Hours)
const threeCoursesShowcaseHtml = `<!-- 3 Master Courses Showcase -->
  <div class="top-rating-books-ripple-wrap">
    <div class="top-rating-books-track">
      <div class="top-rating-book-item" style="--ripple-delay: 0s;" onclick="scrollToCurriculum(0)">
        <div class="top-rating-book-cover">
          <img src="https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo" alt="SketchUp Pro 3D Course" loading="lazy" width="90" height="115">
        </div>
        <span class="top-rating-book-name">SketchUp Pro</span>
        <span class="top-rating-book-pages">18+ Hours</span>
      </div>
      <div class="top-rating-book-item" style="--ripple-delay: 0.25s;" onclick="scrollToCurriculum(1)">
        <div class="top-rating-book-cover">
          <img src="https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8" alt="V-Ray 6 Photorealism Course" loading="lazy" width="90" height="115">
        </div>
        <span class="top-rating-book-name">V-Ray 6</span>
        <span class="top-rating-book-pages">22+ Hours</span>
      </div>
      <div class="top-rating-book-item" style="--ripple-delay: 0.5s;" onclick="scrollToCurriculum(2)">
        <div class="top-rating-book-cover">
          <img src="https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr" alt="D5 Render AI Mastery Course" loading="lazy" width="90" height="115">
        </div>
        <span class="top-rating-book-name">D5 Render AI</span>
        <span class="top-rating-book-pages">14+ Hours</span>
      </div>
    </div>
  </div>`;

html = html.replace(
  /<!-- 6 Books Showcase with Zoom Ripple Animation -->[\s\S]*?<div class="top-rating-books-track">[\s\S]*?<\/div>\s*<\/div>/,
  threeCoursesShowcaseHtml
);

const miniThreeCoursesHtml = `<!-- 3 Master Courses Showcase -->
        <div class="lp6-mini-books-ripple-wrap">
          <div class="lp6-mini-books-track">
            <div class="lp6-mini-book-item" style="--ripple-delay: 0s;" onclick="lp6SelectCurriculum(0)">
              <div class="lp6-mini-book-cover">
                <img src="https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo" alt="SketchUp Pro 3D Course" loading="lazy" width="90" height="115">
              </div>
              <span class="lp6-mini-book-name">SketchUp Pro</span>
              <span class="lp6-mini-book-pages">18+ Hours</span>
            </div>
            <div class="lp6-mini-book-item" style="--ripple-delay: 0.25s;" onclick="lp6SelectCurriculum(1)">
              <div class="lp6-mini-book-cover">
                <img src="https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8" alt="V-Ray 6 Photorealism Course" loading="lazy" width="90" height="115">
              </div>
              <span class="lp6-mini-book-name">V-Ray 6</span>
              <span class="lp6-mini-book-pages">22+ Hours</span>
            </div>
            <div class="lp6-mini-book-item" style="--ripple-delay: 0.5s;" onclick="lp6SelectCurriculum(2)">
              <div class="lp6-mini-book-cover">
                <img src="https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr" alt="D5 Render AI Mastery Course" loading="lazy" width="90" height="115">
              </div>
              <span class="lp6-mini-book-name">D5 Render AI</span>
              <span class="lp6-mini-book-pages">14+ Hours</span>
            </div>
          </div>
        </div>`;

html = html.replace(
  /<!-- 6 Books in small size with consistent zoom ripple animation -->[\s\S]*?<div class="lp6-mini-books-track">[\s\S]*?<\/div>\s*<\/div>/,
  miniThreeCoursesHtml
);

// Update CSS for top rating & mini books to fit 3 courses beautifully
html = html.replace(
  /\.top-rating-books-track\s*\{[\s\S]*?<\/style>/,
  `.top-rating-books-track {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: clamp(10px, 2.5vw, 18px);
    padding: 8px 2px 4px 2px;
  }

  .top-rating-book-item {
    flex: 0 0 clamp(68px, 18vw, 92px);
    width: clamp(68px, 18vw, 92px);
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }

  .top-rating-book-cover {
    width: 100%;
    aspect-ratio: 1 / 1.25;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1.5px solid #e2e8f0;
    background: #ffffff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }

  .top-rating-book-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .top-rating-book-name {
    font-size: clamp(10px, 2.2vw, 11.5px);
    font-weight: 700;
    color: #1e293b;
    margin-top: 5px;
    text-align: center;
    line-height: 1.2;
    transition: color 0.2s ease;
  }

  .top-rating-book-pages {
    font-size: clamp(9px, 2vw, 10.5px);
    font-weight: 700;
    color: #ea580c;
    margin-top: 2px;
    text-align: center;
    line-height: 1.15;
    white-space: nowrap;
    transition: color 0.2s ease;
  }

  .top-rating-book-item:hover .top-rating-book-cover {
    border-color: #ea580c;
    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
    transform: translateY(-2px);
  }

  .top-rating-book-item:hover .top-rating-book-name {
    color: #ea580c;
  }
</style>`
);

html = html.replace(
  /\/\* Mini 6 Books Ripple Animation \*\/[\s\S]*?\.lp6-mini-book-item:hover \.lp6-mini-book-pages \{[^}]*\}\s*\}/,
  `/* Mini 3 Courses Ripple Animation */
.lp6-mini-books-ripple-wrap {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px dashed #e2e8f0;
}

.lp6-mini-books-track {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: clamp(12px, 3vw, 22px);
  padding: 8px 4px 4px 4px;
}

.lp6-mini-book-item {
  flex: 0 0 clamp(72px, 20vw, 100px);
  width: clamp(72px, 20vw, 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.lp6-mini-book-cover {
  width: 100%;
  aspect-ratio: 1 / 1.25;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.lp6-mini-book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lp6-mini-book-name {
  font-size: clamp(10.5px, 2.2vw, 12px);
  font-weight: 700;
  color: #1e293b;
  margin-top: 5px;
  text-align: center;
  line-height: 1.2;
}

.lp6-mini-book-pages {
  font-size: clamp(9px, 2vw, 10.5px);
  font-weight: 700;
  color: #ea580c;
  margin-top: 2px;
  text-align: center;
  line-height: 1.15;
  white-space: nowrap;
}

.lp6-mini-book-item:hover .lp6-mini-book-cover {
  border-color: #ea580c;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
  transform: translateY(-2px);
}`
);

// 11. Buy Button Action & Text
html = html.replace(
  /<button data-buy-button="10507180605757"[\s\S]*?<span data-button-text="">Buy Now<\/span>\s*<\/button>/,
  `<button data-buy-button="10507180605757" data-original-text="Get Instant Access — $9" class="button button--addToCart button--primary button--filled button--primary__filled button--buy-now" type="button" onclick="executeDirectBuyNow(event, this);">
<svg class="buy-now-button-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px; flex-shrink: 0;">
  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
  <line x1="3" y1="6" x2="21" y2="6"></line>
  <path d="M16 10a4 4 0 0 1-8 0"></path>
</svg>
<span data-button-text="">Get Instant Access — $9</span> 
</button>`
);

// Replace executeDirectBuyNow to redirect to /courses/checkout
html = html.replace(
  /window\.executeDirectBuyNow = function\(e, btn\) \{[\s\S]*?window\.location\.href = '\/checkout';\s*\};/,
  `window.executeDirectBuyNow = function(e, btn) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (!btn) btn = (e && e.currentTarget) ? e.currentTarget : document.querySelector('[data-buy-button]');
  if (btn) {
    btn.style.opacity = '0.85';
    btn.style.pointerEvents = 'none';
    const textSpan = btn.querySelector('[data-button-text]');
    if (textSpan) textSpan.textContent = 'Redirecting to Course Checkout...';
  }
  window.location.href = '/courses/checkout';
};`
);

// Replace executeStickyBuyNow to redirect to /courses/checkout
html = html.replace(
  /window\.executeStickyBuyNow = function\(btn\) \{[\s\S]*?window\.location\.href = '\/checkout';\s*\};/,
  `window.executeStickyBuyNow = function(btn) {
  if (!btn) btn = document.getElementById('archStickyBuyBtn');
  if (btn) {
    btn.style.opacity = '0.85';
    btn.style.pointerEvents = 'none';
    const textSpan = btn.querySelector('.arch-sticky-btn__text');
    if (textSpan) textSpan.textContent = 'Redirecting to Course Checkout...';
  }
  window.location.href = '/courses/checkout';
};`
);

// Also replace modal/drawer checkout buttons from /checkout to /courses/checkout
html = html.replace(/href="\/checkout"/g, 'href="/courses/checkout"');


html = html.replace(
  /Made with <span class="arch-heart-emoji">💗<\/span> for Home Owners, Interior Designers &amp; Architects/g,
  'Made with <span class="arch-heart-emoji">💗</span> for 3D Artists, Architects &amp; Interior Designers'
);

// 12. Helper generators for Marquees and Cards
const generateRenderCards = (rowArr) => {
  return [...rowArr, ...rowArr].map((img) => {
    const idx = parseInt(img.replace(/[^0-9]/g, ''), 10) - 1;
    return `
      <div onclick="clOpenLightbox(${idx})" class="w-[200px] md:w-[400px] shrink-0 aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative group bg-slate-100 cursor-pointer">
        <img src="${img}" alt="Student Work ${idx + 1}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
      </div>
    `;
  }).join('');
};

const PAGE_PREVIEWS_ROW1 = [
  '/renders/RENDER-1.jpg', '/renders/RENDER-2.jpg', '/renders/RENDER-3.jpg',
  '/renders/RENDER-4.jpg', '/renders/RENDER-5.jpg', '/renders/RENDER-6.jpg',
  '/renders/RENDER-7.jpg', '/renders/RENDER-8.jpg', '/renders/RENDER-9.jpg',
  '/renders/RENDER-10.jpg', '/renders/RENDER-11.jpg', '/renders/RENDER-12.jpg',
  '/renders/RENDER-13.jpg',
];
const PAGE_PREVIEWS_ROW2 = [
  '/renders/RENDER-14.jpg', '/renders/RENDER-15.jpg', '/renders/RENDER-16.jpg',
  '/renders/RENDER-17.jpg', '/renders/RENDER-18.jpg', '/renders/RENDER-19.jpg',
  '/renders/RENDER-20.jpg', '/renders/RENDER-21.jpg', '/renders/RENDER-22.jpg',
  '/renders/RENDER-23.jpg', '/renders/RENDER-24.jpg', '/renders/RENDER-25.jpg',
];

const teamMembers = [
  { image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=560&fit=crop&crop=face", name: "James Carter", role: "Lead Architecture Instructor" },
  { image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=560&fit=crop&crop=face", name: "Sofia Reyes", role: "Interior Design Expert" },
  { image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=560&fit=crop&crop=face", name: "Marcus Webb", role: "3D Visualization Specialist" },
  { image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=560&fit=crop&crop=face", name: "Claire Dubois", role: "SketchUp & V-Ray Mentor" },
  { image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=560&fit=crop&crop=face", name: "Ethan Müller", role: "AutoCAD & BIM Lead" },
  { image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=560&fit=crop&crop=face", name: "Layla Hassan", role: "Lumion & AI Design Coach" },
];

const teamCardsHtml = [...teamMembers, ...teamMembers].map(m => `
  <div class="group flex w-56 shrink-0 flex-col">
    <div class="relative overflow-hidden rounded-2xl bg-slate-100" style="height: 320px;">
      <img alt="${m.name}" class="h-full w-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0" src="${m.image}" style="display: block;">
      <div class="absolute bottom-0 w-full rounded-b-2xl bg-white/90 backdrop-blur-sm p-3 text-left">
        <h4 class="font-semibold text-slate-900 text-sm m-0">${m.name}</h4>
        <p class="text-slate-500 text-xs m-0">${m.role}</p>
      </div>
    </div>
  </div>
`).join('');

const testimonials = [
  { name: 'Emma R.', role: 'Freelance Designer', location: 'Los Angeles, USA', content: 'I went from zero SketchUp knowledge to delivering photorealistic V-Ray renders in 3 weeks. The 24/7 support team patiently walked me through every crash and weird shadow. Now I use D5 Render AI and feel completely secure in my career.' },
  { name: 'James C.', role: 'Senior Architect', location: 'New York, USA', content: 'Having SketchUp, V-Ray, and D5 Render in one bundle is genius. My studio now uses the full pipeline to generate gorgeous client presentations in minutes. Best $9 our firm ever invested.' },
  { name: 'Sophie L.', role: '3D Visualizer', location: 'London, UK', content: 'The step-by-step guidance from SketchUp modeling to final V-Ray render is incredible. The D5 Render course lets me make real-time changes during client meetings. Complete game-changer.' },
  { name: 'Daniel C.', role: 'Architecture Student', location: 'Toronto, Canada', content: 'College taught me outdated software. This bundle gave me SketchUp + two rendering engines in two weeks. I started freelancing before graduation and now earn more than some employed architects.' },
  { name: 'Olivia B.', role: 'Interior Designer', location: 'Sydney, Australia', content: 'To have someone look at your screen and say "press this button" saves weeks of frustration. The SketchUp course builds the model, V-Ray makes it stunning, D5 makes it instant. All for $9.' },
  { name: 'Marco R.', role: 'Landscape Architect', location: 'Milan, Italy', content: 'D5 Render combined with V-Ray is just magical. I model in SketchUp, do beauty shots in V-Ray, and use D5 for real-time client walkthroughs. It took away all my anxiety about falling behind.' },
  { name: 'Sarah K.', role: 'Studio Owner', location: 'Berlin, Germany', content: 'My team of 4 now works with zero stress because we integrated the SketchUp → V-Ray → D5 pipeline. No more late nights before client meetings. We deliver faster, charge more.' },
  { name: 'Ryan M.', role: 'Freelance Visualizer', location: 'Dubai, UAE', content: 'I almost quit 3D entirely because I couldn\'t connect the dots between modeling and rendering. This bundle connected everything. SketchUp for structure, V-Ray for polish, D5 AI for speed.' },
  { name: 'Chloe P.', role: 'Design Student', location: 'Singapore', content: 'Started from absolute zero. Didn\'t even know what SketchUp was. 15 days later, my portfolio had photorealistic renders from V-Ray and real-time walkthroughs from D5 that landed me a paid studio gig.' },
  { name: 'Alex D.', role: 'Architect & Educator', location: 'Barcelona, Spain', content: 'Universities don\'t teach this pipeline. SketchUp + V-Ray + D5 Render AI is the modern standard. I recommend this $9 bundle to all my students — it\'s more practical than their entire semester.' },
];

const testimonialsCardsHtml = [...testimonials, ...testimonials].map(t => `
  <div class="w-[350px] shrink-0 bg-white border border-slate-200 p-8 rounded-3xl hover:border-orange-200 transition-all shadow-soft text-left">
    <div class="flex gap-1 mb-4 text-orange-500 text-sm">★★★★★</div>
    <p class="text-slate-700 text-sm leading-relaxed mb-6 italic">"${t.content}"</p>
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center font-bold text-orange-500 shrink-0">${t.name[0]}</div>
      <div>
        <p class="text-sm font-bold text-slate-900 flex items-center gap-1 m-0">${t.name} <span class="text-orange-600">✓</span></p>
        <p class="text-[10px] text-slate-500 uppercase tracking-widest m-0">${t.role} • ${t.location}</p>
      </div>
    </div>
  </div>
`).join('');

// Reusable CTA with Timer Component
const renderCtaWithTimer = (variant = 'green') => {
  const bgClass = variant === 'dark' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-900';
  const timerAccent = variant === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const timerBg = variant === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-orange-50 border-orange-200';
  const priceColor = variant === 'dark' ? 'text-white' : 'text-slate-900';

  return `
    <div class="${bgClass} rounded-2xl px-5 py-6 relative overflow-hidden max-w-sm mx-auto shadow-soft text-center">
      <div class="relative z-10 flex flex-col items-center text-center gap-3">
        <!-- Timer label -->
        <div class="flex items-center gap-1.5">
          <svg width="14" height="14" class="${timerAccent} animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"></line><line x1="12" x2="15" y1="14" y2="11"></line><circle cx="12" cy="14" r="8"></circle></svg>
          <span class="text-[10px] md:text-xs font-bold uppercase tracking-widest ${timerAccent}">Offer Ends In</span>
        </div>

        <!-- Timer digits -->
        <div class="flex items-center gap-1">
          <div class="flex flex-col items-center">
            <div class="${timerBg} border rounded-md px-2 py-0.5">
              <span class="text-sm font-black tabular-nums font-mono ${priceColor} cl-timer-h">03</span>
            </div>
            <span class="text-[6px] font-bold uppercase tracking-widest mt-0.5 ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'}">HRS</span>
          </div>
          <span class="text-xs font-bold ${variant === 'dark' ? 'text-slate-600' : 'text-slate-300'} -mt-3">:</span>
          <div class="flex flex-col items-center">
            <div class="${timerBg} border rounded-md px-2 py-0.5">
              <span class="text-sm font-black tabular-nums font-mono ${priceColor} cl-timer-m">36</span>
            </div>
            <span class="text-[6px] font-bold uppercase tracking-widest mt-0.5 ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'}">MIN</span>
          </div>
          <span class="text-xs font-bold ${variant === 'dark' ? 'text-slate-600' : 'text-slate-300'} -mt-3">:</span>
          <div class="flex flex-col items-center">
            <div class="${timerBg} border rounded-md px-2 py-0.5">
              <span class="text-sm font-black tabular-nums font-mono ${priceColor} cl-timer-s">20</span>
            </div>
            <span class="text-[6px] font-bold uppercase tracking-widest mt-0.5 ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'}">SEC</span>
          </div>
        </div>

        <!-- Price -->
        <div class="flex items-baseline gap-2">
          <span class="text-sm ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'} line-through font-bold">$29</span>
          <span class="text-3xl font-display font-black ${priceColor}">$9</span>
          <span class="bg-orange-100 text-orange-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full">69% OFF</span>
        </div>

        <!-- Button -->
        <a href="/courses/checkout" class="bg-slate-900 hover:bg-black text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-all w-full no-underline" style="box-shadow: 0 0 0 2px #f97316, 0 0 16px rgba(249,115,22,0.4);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
          <span style="color:#ffffff !important;">Get Instant Access</span>
          <svg width="16" height="16" class="group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>

        <p class="text-[10px] font-medium ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'} m-0">Lifetime access • Free AI software • 7-day money-back</p>
      </div>
    </div>
  `;
};

// 13. EXACT HTML of https://start.avadalearn.com/ for the About Tab
const fullCourseAboutHtml = `
<div id="landing-page-exact-avadalearn" class="w-full bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-orange-100">

  <!-- ══════════════════════════════════════════════════
       1. HERO SECTION — Pitch, Hook & Hero Video
       ══════════════════════════════════════════════════ -->
  <section class="relative pt-4 pb-8 md:pb-16 overflow-hidden bg-white text-slate-900 font-sans">
    <div class="w-full px-4 md:max-w-3xl md:mx-auto relative z-10">
      <div class="flex flex-col items-center text-center pt-4 md:pt-8">

        <!-- Badge -->
        <div class="mb-6 inline-flex items-center gap-2 px-5 py-2 bg-slate-800 rounded-full shadow-sm">
          <span class="text-[11px] md:text-xs font-bold text-white tracking-wide">Start charging $500–$1,500 for designing and rendering.</span>
        </div>

        <!-- Main Headline -->
        <h2 class="tracking-tight mb-2 w-full text-center" style="letter-spacing: -0.02em;">
          <span class="block text-3xl md:text-6xl font-display font-black text-slate-900 leading-[1.1]">Learn to Design</span>
          <span class="block text-3xl md:text-6xl font-display font-black leading-[1.1] mt-1">
            <span class="text-emerald-600">Homes</span><span class="text-slate-900">, </span>
            <span class="text-emerald-600">Offices</span>
            <span class="italic font-serif text-slate-700 font-normal text-2xl md:text-5xl">&amp;</span>
            <span class="text-emerald-600">Villas</span>
          </span>
        </h2>

        <!-- Italic Subtitle -->
        <p class="text-base md:text-xl italic text-slate-600 mb-3 font-medium font-serif">
          and show real 3D to clients.
        </p>

        <!-- PDR line -->
        <p class="text-sm md:text-base text-slate-800 font-bold mb-1">
          Learn <span class="font-black">PDR</span> — Planning, Designing &amp; Rendering
        </p>
        <p class="text-xs md:text-sm text-slate-400 mb-4">
          One bundle. Everything included.
        </p>

        <!-- Quote + Video Card -->
        <div class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-6 md:px-8 md:py-6 text-left mb-4">
          <p class="text-sm md:text-base italic text-slate-700 mb-3 leading-relaxed">
            "In our business of Architecture and Design, <strong class="text-slate-900 not-italic">Planning, Design and Rendering</strong> matter the most."
          </p>
          <p class="text-sm md:text-base text-slate-600 mb-2">
            The question isn't <em>if</em> you can. It's...
          </p>
          <p class="text-lg md:text-xl font-black text-red-600 mb-5">
            How to do it FASTER?
          </p>

          <!-- Responsive Video Player -->
          <div class="w-full overflow-hidden rounded-xl shadow-lg border border-slate-100 relative" style="padding-top: 56.25%;">
            <iframe src="https://iframe.mediadelivery.net/embed/494628/1f7b76dd-7d47-4f39-87af-bff5a6b02d08?autoplay=true&amp;loop=true&amp;muted=true&amp;preload=true&amp;responsive=true" loading="lazy" style="border: 0; position: absolute; top: 0; left: 0; height: 100%; width: 100%;" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;" allowfullscreen=""></iframe>
          </div>

          <p class="text-sm md:text-base font-bold text-slate-700 text-center tracking-wide mt-4">
            Learn Complete Interior &amp; Exterior Design in one package.
          </p>
        </div>

        <!-- Persuasion Text -->
        <div class="w-full mb-6 flex items-start gap-3 px-2 text-left">
          <span class="text-lg mt-0.5">🚀</span>
          <p class="text-sm md:text-base text-slate-700 leading-relaxed m-0">
            That's exactly why we built this. A complete blueprint — from software basics to client-ready renders — designed to make you <span class="font-bold underline underline-offset-2 decoration-orange-400">job or business ready in just one month.</span>
          </p>
        </div>

        

      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       2. WE HELP YOU TO (Outcome Cards)
       ══════════════════════════════════════════════════ -->
  <section class="py-6 md:py-6 bg-slate-50 border-b border-slate-200">
    <div class="max-w-3xl mx-auto px-4">
      <h3 class="text-2xl md:text-3xl font-display font-black text-slate-800 text-center mb-6">We Help You To</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div class="bg-white border-2 border-yellow-300 rounded-2xl px-5 py-5 flex items-start gap-3 text-left">
          <span class="text-2xl">💼</span>
          <div>
            <p class="text-base font-bold text-slate-900 m-0">Get a Better Job</p>
            <p class="text-sm text-slate-500 m-0">Higher-paying design roles</p>
          </div>
        </div>
        <div class="bg-white border-2 border-yellow-300 rounded-2xl px-5 py-5 flex items-start gap-3 text-left">
          <span class="text-2xl">🏢</span>
          <div>
            <p class="text-base font-bold text-slate-900 m-0">Own Design Firm</p>
            <p class="text-sm text-slate-500 m-0">Freelance &amp; studio projects</p>
          </div>
        </div>
      </div>

      <!-- Freelance Projects Card -->
      <div class="bg-orange-50 border-2 border-orange-300 rounded-2xl px-5 py-5 text-left">
        <div class="flex items-start gap-3">
          <span class="text-2xl">🎨</span>
          <div class="flex-1">
            <p class="text-base font-bold text-slate-900 mb-1">3 Interior Design Freelance Projects</p>
            <p class="text-sm text-slate-500 mb-3">Freelance paid projects to every student to gather real experience</p>
            <div class="flex flex-wrap items-center gap-3">
              <span class="inline-flex items-center gap-1.5 bg-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">Worth $200</span>
              <span class="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                Certificate on Completion
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       3. MASTER DESIGN TO RENDER PIPELINE
       ══════════════════════════════════════════════════ -->
  <section class="bg-white border-b border-gray-100 relative">
    <div class="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-6 text-center">
      <div class="mb-6">
        <h3 class="text-2xl md:text-4xl font-display font-black text-slate-900 tracking-tight mb-2">Master Design to Render Pipeline</h3>
        <p class="text-sm md:text-lg text-slate-500 font-medium m-0">Software Top Designers &amp; Architects Use</p>
      </div>
      <div class="flex justify-center mb-4">
        <img src="https://lh3.googleusercontent.com/d/1sVPZ_PDQCwMEuA9MiZxHLkTWP6LbjKL7" alt="Design to Render Pipeline: SketchUp, V-Ray, D5 Render" class="w-full rounded-2xl shadow-xl border border-slate-100 max-w-4xl mx-auto">
      </div>
      <p class="text-center text-sm md:text-base font-bold text-emerald-600 flex items-center justify-center gap-2 m-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
        Software Download Links Included
      </p>
    </div>
  </section>

  

  <!-- ══════════════════════════════════════════════════
       4. 50,000+ STUDENTS WORLDWIDE & SOCIAL PROOF
       ══════════════════════════════════════════════════ -->
  <section class="py-6 md:py-6 bg-white">
    <div class="max-w-3xl mx-auto px-4 text-center">
      <p class="text-lg md:text-2xl font-black uppercase tracking-[0.15em] text-slate-900 mb-4">50,000+ Students Worldwide</p>

      <!-- Student collage images -->
      <div class="w-full mb-4 overflow-hidden rounded-2xl shadow-lg border border-slate-100">
        <img src="https://lh3.googleusercontent.com/d/1MXpuSNzxwru2XaHmFJ3RnC9CL1YcckRS" alt="50,000+ Students Worldwide" class="w-full h-auto object-cover">
      </div>
      <div class="w-full mb-4 overflow-hidden rounded-2xl shadow-lg border border-slate-100">
        <img src="https://lh3.googleusercontent.com/d/1fJGHXqn5Fb12r8FjgLzd0ebPQEHM3i1G" alt="Student Success" class="w-full h-auto object-cover">
      </div>

      <!-- Outcome cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-left">
        <div class="bg-white border border-slate-200 rounded-2xl px-4 py-5">
          <p class="text-lg font-black text-slate-900 mb-2">💰 Start Earning Faster</p>
          <p class="text-sm text-slate-600 m-0">Design real projects &amp; charge clients within weeks</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl px-4 py-5">
          <p class="text-lg font-black text-slate-900 mb-2">🏢 Design Full Projects</p>
          <p class="text-sm text-slate-600 m-0">Homes, villas, offices — from floor plan to final visual</p>
        </div>
      </div>

      <!-- Why this bundle is different -->
      <div class="w-full bg-orange-50 border border-orange-200 rounded-2xl px-5 py-5 text-left">
        <p class="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-2">
          <span>✨</span> Why This Bundle Is Different
        </p>
        <ul class="space-y-3 m-0 p-0 list-none">
          <li class="flex items-start gap-3 text-sm md:text-base font-semibold text-slate-800"><span class="text-orange-400 shrink-0 mt-0.5">—</span> Learn to design complete homes, villas &amp; offices end-to-end</li>
          <li class="flex items-start gap-3 text-sm md:text-base font-semibold text-slate-800"><span class="text-orange-400 shrink-0 mt-0.5">—</span> 4 tools that form one seamless pipeline: Plan → Design → Render → Deliver</li>
          <li class="flex items-start gap-3 text-sm md:text-base font-semibold text-slate-800"><span class="text-orange-400 shrink-0 mt-0.5">—</span> AI does the heavy lifting — you focus on creativity, not tech headaches</li>
          <li class="flex items-start gap-3 text-sm md:text-base font-semibold text-slate-800"><span class="text-orange-400 shrink-0 mt-0.5">—</span> Go from zero to client-ready renders in just 15 days</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       5. AI ENHANCEMENT — Learn D5 Render AI (Real Video)
       ══════════════════════════════════════════════════ -->
  <section class="py-6 md:py-6 bg-white border-b border-slate-200 text-center">
    <div class="max-w-5xl mx-auto px-5">
      <div class="mb-5">
        <p class="text-orange-500 text-xs font-mono uppercase tracking-widest mb-3 font-bold">AI-Powered Rendering</p>
        <h3 class="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Learn <span class="text-orange-600">D5 Render AI</span></h3>
        <p class="text-slate-500 text-base max-w-xl mx-auto m-0">Create stunning photorealistic renders in real-time — free AI tools that run locally on your system.</p>
      </div>
      <div class="flex justify-center">
        <video src="https://rendair-landingpage.s3.us-east-1.amazonaws.com/rendair-ai-chat-03-cc.mp4" autoplay="" loop="" muted="" playsinline="" class="w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-100"></video>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       6. STUDENT WORK CAROUSEL (25 Renders Continuous Marquee)
       ══════════════════════════════════════════════════ -->
  <section class="py-6 md:py-6 bg-slate-50 overflow-hidden border-b border-slate-200 grid-bg">
    <div class="max-w-5xl mx-auto px-5 mb-6 text-center">
      <h3 class="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">See What Our <span class="text-orange-600">Students Have Created</span></h3>
      <p class="text-slate-600 text-lg m-0">50,000+ learners • 4.9★ average rating</p>
    </div>
    <div class="flex flex-col gap-6 md:gap-4">
      <!-- Row 1 -->
      <div class="flex gap-3 md:gap-4 animate-scroll-left hover:pause">
        ${generateRenderCards(PAGE_PREVIEWS_ROW1)}
      </div>
      <!-- Row 2 -->
      <div class="flex gap-3 md:gap-4 animate-scroll-right hover:pause">
        ${generateRenderCards(PAGE_PREVIEWS_ROW2)}
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       7. INCOME TIERS — The ROI
       ══════════════════════════════════════════════════ -->
  <section class="py-6 bg-white border-b border-slate-200">
    <div class="max-w-5xl mx-auto px-5 text-center">
      <div class="mb-5">
        <h3 class="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Your $9 Investment <br class="hidden md:block"><span class="text-orange-600">Pays for Itself 100x Over</span></h3>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
        <!-- Tier 1 -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-600/40 transition-all shadow-soft flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-bold text-slate-900 leading-tight w-2/3">Single Render Charge</span>
            <span class="text-3xl">🖼️</span>
          </div>
          <div class="flex items-center justify-between">
            <div><p class="text-[10px] font-mono text-slate-500 uppercase m-0">Before</p><p class="text-slate-400 text-sm line-through m-0">Can't render at all</p></div>
            <svg width="16" height="16" class="text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            <div class="text-right"><p class="text-[10px] font-mono text-orange-500 uppercase m-0">After</p><p class="text-orange-600 text-sm font-bold m-0">Confidently quoting $200+</p></div>
          </div>
        </div>

        <!-- Tier 2 -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-600/40 transition-all shadow-soft flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-bold text-slate-900 leading-tight w-2/3">Interior Design Project</span>
            <span class="text-3xl">🏠</span>
          </div>
          <div class="flex items-center justify-between">
            <div><p class="text-[10px] font-mono text-slate-500 uppercase m-0">Before</p><p class="text-slate-400 text-sm line-through m-0">Rejected for poor visuals</p></div>
            <svg width="16" height="16" class="text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            <div class="text-right"><p class="text-[10px] font-mono text-orange-500 uppercase m-0">After</p><p class="text-orange-600 text-sm font-bold m-0">Winning $2,000–$5,000</p></div>
          </div>
        </div>

        <!-- Tier 3 -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-600/40 transition-all shadow-soft flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-bold text-slate-900 leading-tight w-2/3">Time to Finish a Room</span>
            <span class="text-3xl">⏱️</span>
          </div>
          <div class="flex items-center justify-between">
            <div><p class="text-[10px] font-mono text-slate-500 uppercase m-0">Before</p><p class="text-slate-400 text-sm line-through m-0">3 Frustrating Nights</p></div>
            <svg width="16" height="16" class="text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            <div class="text-right"><p class="text-[10px] font-mono text-orange-500 uppercase m-0">After</p><p class="text-orange-600 text-sm font-bold m-0">2 Hours with D5 AI</p></div>
          </div>
        </div>

        <!-- Tier 4 -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-600/40 transition-all shadow-soft flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-bold text-slate-900 leading-tight w-2/3">Your Career Confidence</span>
            <span class="text-3xl">🌟</span>
          </div>
          <div class="flex items-center justify-between">
            <div><p class="text-[10px] font-mono text-slate-500 uppercase m-0">Before</p><p class="text-slate-400 text-sm line-through m-0">Anxious &amp; Overwhelmed</p></div>
            <svg width="16" height="16" class="text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            <div class="text-right"><p class="text-[10px] font-mono text-orange-500 uppercase m-0">After</p><p class="text-orange-600 text-sm font-bold m-0">In-Demand Professional</p></div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       8. WHAT YOU GET — The Value Stack Offer
       ══════════════════════════════════════════════════ -->
  <section class="py-6 md:py-6 bg-slate-50 border-y border-slate-200 grid-bg">
    <div class="max-w-5xl mx-auto px-5 text-center">
      <div class="mb-5">
        <p class="text-orange-500 text-xs font-mono uppercase tracking-widest mb-3 font-bold">Included with enrollment</p>
        <h3 class="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Everything You Need to Succeed, <span class="text-orange-600">Included Today</span></h3>
        <p class="text-slate-600 text-base md:text-lg max-w-2xl mx-auto m-0">The complete design-to-render toolkit — courses, software, support, and resources.</p>
      </div>
      <div class="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft text-left">
        
        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="text-orange-500 font-bold">✓</span>
            <span class="text-sm text-slate-800 font-medium">SketchUp 3D Modeling — Complete Course</span>
          </div>
          <span class="text-sm font-bold text-slate-500">Included</span>
        </div>

        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="text-orange-500 font-bold">✓</span>
            <span class="text-sm text-slate-800 font-medium">V-Ray Photo-Realism Masterclass</span>
          </div>
          <span class="text-sm font-bold text-slate-500">Included</span>
        </div>

        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="text-orange-500 font-bold">✓</span>
            <span class="text-sm text-slate-800 font-medium">D5 Real-Time AI Rendering Course</span>
          </div>
          <span class="text-sm font-bold text-slate-500">Included</span>
        </div>

        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="text-orange-500 font-bold">✓</span>
            <span class="text-sm text-slate-800 font-medium">10,000+ Premium Texture Library</span>
          </div>
          <span class="text-sm font-bold text-slate-500">Included</span>
        </div>

        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="text-orange-500 font-bold">✓</span>
            <span class="text-sm text-slate-800 font-medium">2,000+ Drag-and-Drop 3D Models</span>
          </div>
          <span class="text-sm font-bold text-slate-500">Included</span>
        </div>

        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="text-orange-500 font-bold">✓</span>
            <span class="text-sm text-slate-800 font-medium">Software Installation Hub</span>
          </div>
          <span class="text-sm font-bold text-slate-500">Included</span>
        </div>

        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="text-orange-500 font-bold">✓</span>
            <span class="text-sm text-slate-800 font-medium">24/7 Team Access &amp; Portfolio Review</span>
          </div>
          <span class="text-sm font-bold text-slate-500">Included</span>
        </div>

        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="text-orange-500 font-bold">✓</span>
            <span class="text-sm text-slate-800 font-medium">Certified Digital Diploma</span>
          </div>
          <span class="text-sm font-bold text-slate-500">Included</span>
        </div>

        <!-- Orange Highlight Row -->
        <div class="bg-orange-50 border-t border-orange-100 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div class="flex items-center gap-3">
            <span class="text-orange-600 font-bold text-base">✓</span>
            <span class="text-sm text-orange-900 font-bold">All Software (Free/Student Edition Links)</span>
          </div>
          <span class="text-sm font-black text-orange-600">INCLUDED</span>
        </div>

        

      </div>
    </div>
  </section>

  

  <!-- ══════════════════════════════════════════════════
       9. PROOF STATS
       ══════════════════════════════════════════════════ -->
  <section class="py-6 bg-slate-50 border-y border-slate-200 grid-bg">
    <div class="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      <div>
        <span class="text-2xl mb-2 block">📉</span>
        <span class="text-3xl md:text-4xl font-display font-black text-orange-500">82%</span>
        <p class="text-xs text-slate-500 mt-1 leading-snug m-0">of visualization jobs now require rendering skills alongside 3D modeling. SketchUp alone isn't enough.</p>
      </div>
      <div>
        <span class="text-2xl mb-2 block">🚀</span>
        <span class="text-3xl md:text-4xl font-display font-black text-orange-500">10x</span>
        <p class="text-xs text-slate-500 mt-1 leading-snug m-0">faster output when you use the SketchUp + V-Ray + D5 Render AI pipeline together.</p>
      </div>
      <div>
        <span class="text-2xl mb-2 block">🤝</span>
        <span class="text-3xl md:text-4xl font-display font-black text-orange-500">24/7</span>
        <p class="text-xs text-slate-500 mt-1 leading-snug m-0">Team support. We guide you through every installation, render, and software question personally.</p>
      </div>
      <div>
        <span class="text-2xl mb-2 block">⏳</span>
        <span class="text-3xl md:text-4xl font-display font-black text-orange-500">15 Days</span>
        <p class="text-xs text-slate-500 mt-1 leading-snug m-0">From opening SketchUp for the first time to creating portfolio-ready photorealistic renders.</p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       10. MEET YOUR DESIGN MENTORS (Team Section)
       ══════════════════════════════════════════════════ -->
  <section class="relative w-full overflow-hidden bg-white py-6 md:py-6 text-center">
    <div class="relative z-10 mx-auto max-w-7xl">
      <div class="mx-auto mb-6 flex max-w-5xl flex-col items-center px-6 lg:px-0">
        <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <h3 class="mb-4 font-display font-bold text-4xl text-slate-900 tracking-tight sm:text-5xl">
          Meet Your Design Mentors
        </h3>
        <p class="max-w-2xl text-slate-500 text-lg m-0">
          Industry professionals with years of real-world experience in architecture, interior design, and 3D visualization — guiding you every step of the way.
        </p>
      </div>

      <!-- Continuous Team Marquee -->
      <div class="relative w-full overflow-hidden">
        <div class="flex gap-6 animate-scroll-left hover:pause">
          ${teamCardsHtml}
        </div>
      </div>

      <!-- Sofia Reyes Quote -->
      <div class="mx-auto mt-16 max-w-3xl px-6 lg:px-0 text-center">
        <p class="mb-6 font-medium text-lg text-slate-900 leading-relaxed md:text-xl italic font-serif">
          "The mentorship at Avada Design is unmatched. Our instructors don't just teach software — they guide you through the entire professional workflow, from concept to stunning final render."
        </p>
        <div class="flex flex-col items-center gap-3">
          <div class="relative h-14 w-14 overflow-hidden rounded-full border-2 border-orange-500">
            <img alt="Sofia Reyes" class="h-full w-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&amp;h=200&amp;fit=crop&amp;crop=face">
          </div>
          <div>
            <p class="font-semibold text-slate-900 m-0">Sofia Reyes</p>
            <p class="text-slate-500 text-sm m-0">Interior Design Expert · Avada Design Faculty</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       11. MANIFESTO — Supportive Message from Our Team
       ══════════════════════════════════════════════════ -->
  <section class="py-6 md:py-6 grid-bg bg-white border-b border-slate-200">
    <div class="max-w-3xl mx-auto px-5 text-center">
      <div class="mb-6">
        <p class="text-orange-500 text-xs font-mono uppercase tracking-widest mb-4 font-bold">A Supportive Message from Our Team</p>
        <h3 class="text-3xl md:text-5xl font-serif italic text-slate-900 mb-4 leading-snug">"We believe every designer deserves restaurant-quality tools at street-food prices."</h3>
      </div>
      <div class="space-y-6 text-slate-600 text-base md:text-lg leading-relaxed text-left">
        <p>Learning SketchUp, V-Ray, and D5 Render separately? That's <strong class="text-slate-900 font-bold">$300+ in courses, months of confusion, and a dozen browser tabs</strong> you'll never close.</p>
        <p>We built this bundle because <strong class="text-orange-600 font-bold">the rendering pipeline shouldn't be gatekept</strong>. Whether you're a student, a freelancer, or a studio owner — you deserve a clear, guided path from 3D model to photorealistic render.</p>
        <p>Every lesson is designed so you build <strong class="text-slate-900 font-bold">real projects</strong>. Not theory. Not fluff. Actual rooms, actual renders, actual portfolio pieces.</p>
        
        <div class="my-10 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 md:p-8 shadow-soft">
          <p class="font-bold text-slate-900 text-xl mb-4">Here's What Makes This Bundle Special:</p>
          <ul class="space-y-3 m-0 p-0 list-none">
            <li class="flex items-center gap-3 text-slate-800"><span class="text-orange-500 font-bold">✓</span> <strong>SketchUp</strong> — Design stunning 3D models from scratch, even if you've never opened the software.</li>
            <li class="flex items-center gap-3 text-slate-800"><span class="text-orange-500 font-bold">✓</span> <strong>V-Ray</strong> — Turn those models into magazine-quality photorealistic images.</li>
            <li class="flex items-center gap-3 text-slate-800"><span class="text-orange-500 font-bold">✓</span> <strong>D5 Render AI</strong> — Real-time AI rendering: see changes instantly, generate 4K images in seconds.</li>
            <li class="flex items-center gap-3 text-slate-800"><span class="text-orange-500 font-bold">✓</span> 24/7 support, free software links, and a community that's always got your back.</li>
          </ul>
          <div class="mt-6 pt-6 border-t border-orange-200 flex items-center justify-between">
            <span class="text-slate-600 text-sm italic font-bold">The complete design-to-render ecosystem for just $9.</span>
            <a href="/courses/checkout" class="text-orange-600 font-bold text-sm hover:text-orange-700 flex items-center gap-1 group no-underline">
              Get Started <span class="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        <p class="text-slate-900 font-semibold text-lg md:text-xl border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded-r-xl">Stop collecting bookmarks. Start building a portfolio. 50,000+ students already did — and they started with the same $9 decision you're about to make.</p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       12. OLD VS NEW — The Contrast
       ══════════════════════════════════════════════════ -->
  <section class="py-6 md:py-6 bg-white grid-bg">
    <div class="max-w-5xl mx-auto px-5 text-center">
      <div class="mb-6">
        <h3 class="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">The Slow, Expensive Path <br class="hidden md:block">vs. <span class="text-orange-600">Our $9 Shortcut</span></h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <!-- Left: Old Struggle -->
        <div class="bg-white border border-red-200 rounded-2xl p-8 shadow-soft">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 font-bold text-xl">✕</div>
            <h4 class="text-xl font-bold text-red-500 m-0">The Old Struggle</h4>
          </div>
          <ul class="space-y-4 m-0 p-0 list-none">
            <li class="flex items-start gap-3 text-slate-600 text-sm"><span class="mt-1 shrink-0 text-base">⏰</span> Spending days on a single 3D view because you don't know SketchUp, V-Ray, or D5 Render — and clients keep asking for revisions?</li>
            <li class="flex items-start gap-3 text-slate-600 text-sm"><span class="mt-1 shrink-0 text-base">😰</span> Feeling overwhelmed by the sheer number of tools studios expect you to know — modeling, rendering, AI — where do you even start?</li>
            <li class="flex items-start gap-3 text-slate-600 text-sm"><span class="mt-1 shrink-0 text-base">🤖</span> Watching AI generate stunning renders in seconds and worrying your traditional skills will become obsolete before you catch up?</li>
            <li class="flex items-start gap-3 text-slate-600 text-sm"><span class="text-red-500 font-bold mt-1 shrink-0">✕</span> Searching random YouTube tutorials that leave you confused and frustrated</li>
            <li class="flex items-start gap-3 text-slate-600 text-sm"><span class="text-red-500 font-bold mt-1 shrink-0">✕</span> Paying expensive monthly subscriptions for software you barely know how to use</li>
            <li class="flex items-start gap-3 text-slate-600 text-sm"><span class="text-red-500 font-bold mt-1 shrink-0">✕</span> Graduating from college but lacking a truly stunning portfolio to get hired</li>
          </ul>
        </div>

        <!-- Right: $9 Shortcut -->
        <div class="bg-gradient-to-br from-orange-50 to-slate-50 border border-orange-200 rounded-2xl p-8 shadow-soft">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">✓</div>
            <h4 class="text-xl font-bold text-slate-900 m-0">The $9 Bundle</h4>
          </div>
          <ul class="space-y-4 m-0 p-0 list-none">
            <li class="flex items-start gap-3 text-slate-700 text-sm"><span class="text-orange-500 font-bold mt-1 shrink-0">✓</span> SketchUp: Build 3D models from floor plans in minutes</li>
            <li class="flex items-start gap-3 text-slate-700 text-sm"><span class="text-orange-500 font-bold mt-1 shrink-0">✓</span> V-Ray: One-click photorealistic lighting, materials &amp; shadows</li>
            <li class="flex items-start gap-3 text-slate-700 text-sm"><span class="text-orange-500 font-bold mt-1 shrink-0">✓</span> D5 Render AI: Real-time renders — see it as you design it</li>
            <li class="flex items-start gap-3 text-slate-700 text-sm"><span class="text-orange-500 font-bold mt-1 shrink-0">✓</span> All software links provided — no expensive licenses needed</li>
            <li class="flex items-start gap-3 text-slate-700 text-sm"><span class="text-orange-500 font-bold mt-1 shrink-0">✓</span> 24/7 team support — stuck on a render? We fix it with you</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       13. TESTIMONIALS & TRANSFORMATIONS
       ══════════════════════════════════════════════════ -->
  <section class="py-6 md:py-6 bg-white overflow-hidden grid-bg text-center">
    <div class="max-w-5xl mx-auto px-5 mb-6">
      <div class="text-center mb-6">
        <p class="text-orange-500 text-xs font-mono uppercase tracking-widest mb-4 font-bold">Student Reviews</p>
        <h3 class="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Students &amp; <span class="text-orange-500">Professionals</span></h3>
        <p class="text-slate-600 text-lg m-0">50,000+ learners • 4.9★ average rating</p>
      </div>

      <!-- Featured Transformations -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 text-left">
        <!-- Story 1 -->
        <div class="bg-gradient-to-br from-slate-50 to-orange-50 border border-slate-200 rounded-2xl p-8 shadow-soft relative overflow-hidden transition-all hover:border-orange-300">
          <span class="text-4xl mb-4 block">✨</span>
          <div class="flex items-center gap-2 mb-6">
            <span class="font-bold text-slate-900 text-lg">Emma R.</span>
            <span class="text-sm font-medium text-orange-500">• Freelance Designer</span>
          </div>
          <div class="mb-4">
            <p class="text-[10px] font-mono uppercase text-slate-400 mb-1 tracking-wider m-0">Before</p>
            <p class="text-slate-600 text-sm leading-relaxed m-0">Struggling alone with YouTube tutorials for months. Her SketchUp models looked amateur, V-Ray kept crashing, and clients wouldn't pay more than $200.</p>
          </div>
          <div>
            <p class="text-[10px] font-mono uppercase text-orange-500 mb-1 tracking-wider m-0">After</p>
            <p class="text-slate-900 text-base font-bold leading-relaxed m-0">Mastered the full SketchUp → V-Ray → D5 Render AI pipeline with 24/7 team support. Now charges $3,500+ per room and delivers in 48 hours instead of 2 weeks.</p>
          </div>
        </div>

        <!-- Story 2 -->
        <div class="bg-gradient-to-br from-slate-50 to-orange-50 border border-slate-200 rounded-2xl p-8 shadow-soft relative overflow-hidden transition-all hover:border-orange-300">
          <span class="text-4xl mb-4 block">🎓</span>
          <div class="flex items-center gap-2 mb-6">
            <span class="font-bold text-slate-900 text-lg">Daniel C.</span>
            <span class="text-sm font-medium text-orange-500">• Architecture Student</span>
          </div>
          <div class="mb-4">
            <p class="text-[10px] font-mono uppercase text-slate-400 mb-1 tracking-wider m-0">Before</p>
            <p class="text-slate-600 text-sm leading-relaxed m-0">Terrified of AI replacing his future job. College taught outdated software. Had no rendering skills and zero portfolio pieces worth showing.</p>
          </div>
          <div>
            <p class="text-[10px] font-mono uppercase text-orange-500 mb-1 tracking-wider m-0">After</p>
            <p class="text-slate-900 text-base font-bold leading-relaxed m-0">We walked him through the entire design-to-render workflow. He now uses SketchUp for modeling, V-Ray for stills, and D5 AI for real-time client presentations. Just landed a dream internship.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrolling Testimonials Marquee -->
    <div class="flex flex-col gap-6 overflow-hidden">
      <div class="flex gap-6 animate-scroll-left hover:pause">
        ${testimonialsCardsHtml}
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       14. FAQ SECTION (Interactive Details Accordion)
       ══════════════════════════════════════════════════ -->
  <section class="py-6 md:py-6 bg-slate-50 border-t border-slate-200 grid-bg">
    <div class="max-w-3xl mx-auto px-5 mb-16 text-center">
      <div class="mb-6">
        <h3 class="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Common Questions</h3>
        <p class="text-slate-600 text-base m-0">All your questions, answered.</p>
      </div>

      <div class="space-y-3 text-left">
        <!-- FAQ 1 -->
        <details class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft" open="">
          <summary class="flex items-center justify-between p-5 cursor-pointer list-none select-none">
            <span class="text-sm md:text-base font-semibold text-slate-900 pr-6">What exactly do I get?</span>
            <svg class="text-slate-400 transition-transform shrink-0 group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </summary>
          <div class="px-5 pb-5">
            <p class="text-slate-600 text-sm leading-relaxed m-0">You get 3 complete courses: SketchUp Pro (3D modeling), V-Ray Photorealism (magazine-quality renders), and D5 Render AI (real-time AI rendering). Plus 10,000+ textures, 2,000+ 3D models, all software download links, a certified diploma, and 24/7 team support. Lifetime access, one-time payment.</p>
          </div>
        </details>

        <!-- FAQ 2 -->
        <details class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft">
          <summary class="flex items-center justify-between p-5 cursor-pointer list-none select-none">
            <span class="text-sm md:text-base font-semibold text-slate-900 pr-6">I'm a complete beginner — is this for me?</span>
            <svg class="text-slate-400 transition-transform shrink-0 group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </summary>
          <div class="px-5 pb-5">
            <p class="text-slate-600 text-sm leading-relaxed m-0">Absolutely! SketchUp builds up to full 3D interiors step-by-step, and V-Ray and D5 Render follow the same beginner-friendly approach. Our 24/7 support team is always a message away whenever you feel stuck.</p>
          </div>
        </details>

        <!-- FAQ 3 -->
        <details class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft">
          <summary class="flex items-center justify-between p-5 cursor-pointer list-none select-none">
            <span class="text-sm md:text-base font-semibold text-slate-900 pr-6">Why is it so cheap? What's the catch?</span>
            <svg class="text-slate-400 transition-transform shrink-0 group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </summary>
          <div class="px-5 pb-5">
            <p class="text-slate-600 text-sm leading-relaxed m-0">No catch. We believe high-quality design education shouldn't cost $300+. We've served 50,000+ students at this price point and it works — low price, high volume, massive impact. You get the same content other platforms charge hundreds for.</p>
          </div>
        </details>

        <!-- FAQ 4 -->
        <details class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft">
          <summary class="flex items-center justify-between p-5 cursor-pointer list-none select-none">
            <span class="text-sm md:text-base font-semibold text-slate-900 pr-6">Do I need to buy expensive software?</span>
            <svg class="text-slate-400 transition-transform shrink-0 group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </summary>
          <div class="px-5 pb-5">
            <p class="text-slate-600 text-sm leading-relaxed m-0">Not at all. We provide links to official free or student versions of SketchUp, V-Ray, and D5 Render. You won't spend a single extra dollar on software licenses.</p>
          </div>
        </details>

        <!-- FAQ 5 -->
        <details class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft">
          <summary class="flex items-center justify-between p-5 cursor-pointer list-none select-none">
            <span class="text-sm md:text-base font-semibold text-slate-900 pr-6">Will this actually help me get clients or a job?</span>
            <svg class="text-slate-400 transition-transform shrink-0 group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </summary>
          <div class="px-5 pb-5">
            <p class="text-slate-600 text-sm leading-relaxed m-0">Yes. The #1 reason designers struggle to land clients is they can't produce professional photorealistic renders. This bundle teaches you the full pipeline — SketchUp to model, V-Ray for beauty shots, D5 AI for real-time presentations. Designers with these skills charge $2,000–$5,000 per project.</p>
          </div>
        </details>

        <!-- FAQ 6 -->
        <details class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft">
          <summary class="flex items-center justify-between p-5 cursor-pointer list-none select-none">
            <span class="text-sm md:text-base font-semibold text-slate-900 pr-6">How long does it take to finish all 3 courses?</span>
            <svg class="text-slate-400 transition-transform shrink-0 group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </summary>
          <div class="px-5 pb-5">
            <p class="text-slate-600 text-sm leading-relaxed m-0">Most students complete the full pipeline in 2–3 weeks at 1–2 hours per day. SketchUp takes about 5 days, V-Ray about 4, and D5 Render about 3. By day 15, you'll have portfolio-ready renders.</p>
          </div>
        </details>

        <!-- FAQ 7 -->
        <details class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft">
          <summary class="flex items-center justify-between p-5 cursor-pointer list-none select-none">
            <span class="text-sm md:text-base font-semibold text-slate-900 pr-6">What if it's not for me?</span>
            <svg class="text-slate-400 transition-transform shrink-0 group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </summary>
          <div class="px-5 pb-5">
            <p class="text-slate-600 text-sm leading-relaxed m-0">We offer a 100% money-back guarantee within 7 days. If you feel it's not a good fit, just message us and we'll refund you immediately — no questions asked. Zero risk.</p>
          </div>
        </details>

      </div>
    </div>

    

<!-- Social Proof Toast Notification (Bottom-Left) -->
<div id="clSocialToast" class="fixed bottom-6 left-4 z-[80] transition-all duration-500 -translate-x-full opacity-0 pointer-events-none">
  <div class="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-full px-4 py-2 shadow-lg flex items-center gap-2.5">
    <span class="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
    <p id="clSocialToastText" class="text-xs font-medium text-slate-700 m-0"><span class="font-bold text-slate-900">Emma R.</span> from New York just enrolled</p>
  </div>
</div>

<!-- Interactive Scripts for Countdown Timer, Lightbox & Social Proof -->
<script>
  (function() {
    // 1. Live Countdown Timer (Ticks every second)
    function updateTimers() {
      var D = (3 * 3600 + 36 * 60 + 20) * 1000;
      var now = Date.now();
      var r = D - (now % D);
      var h = String(Math.floor((r / 3600000) % 24)).padStart(2, '0');
      var m = String(Math.floor((r / 60000) % 60)).padStart(2, '0');
      var s = String(Math.floor((r / 1000) % 60)).padStart(2, '0');
      
      document.querySelectorAll('.cl-timer-h').forEach(function(el) { el.textContent = h; });
      document.querySelectorAll('.cl-timer-m').forEach(function(el) { el.textContent = m; });
      document.querySelectorAll('.cl-timer-s').forEach(function(el) { el.textContent = s; });
    }
    setInterval(updateTimers, 1000);
    updateTimers();

    // 2. Lightbox Modal
    var ALL_RENDERS = [];
    for (var i = 1; i <= 25; i++) {
      ALL_RENDERS.push('/renders/RENDER-' + i + '.jpg');
    }
    var currentRenderIdx = 0;

    window.clOpenLightbox = function(idx) {
      currentRenderIdx = idx;
      var modal = document.getElementById('clLightboxModal');
      var img = document.getElementById('clLightboxImg');
      if (modal && img) {
        img.src = ALL_RENDERS[currentRenderIdx];
        modal.style.display = 'flex';
      }
    };

    window.clCloseLightbox = function(e) {
      var modal = document.getElementById('clLightboxModal');
      if (modal) modal.style.display = 'none';
    };

    window.clPrevLightbox = function() {
      currentRenderIdx = (currentRenderIdx - 1 + ALL_RENDERS.length) % ALL_RENDERS.length;
      var img = document.getElementById('clLightboxImg');
      if (img) img.src = ALL_RENDERS[currentRenderIdx];
    };

    window.clNextLightbox = function() {
      currentRenderIdx = (currentRenderIdx + 1) % ALL_RENDERS.length;
      var img = document.getElementById('clLightboxImg');
      if (img) img.src = ALL_RENDERS[currentRenderIdx];
    };

    document.addEventListener('keydown', function(e) {
      var modal = document.getElementById('clLightboxModal');
      if (modal && modal.style.display === 'flex') {
        if (e.key === 'Escape') clCloseLightbox();
        if (e.key === 'ArrowLeft') clPrevLightbox();
        if (e.key === 'ArrowRight') clNextLightbox();
      }
    });

    // 3. Social Proof Toast
    var JOINERS = [
      { name: "Emma R.", city: "New York" },
      { name: "Daniel C.", city: "Toronto" },
      { name: "Olivia B.", city: "Sydney" },
      { name: "Marco R.", city: "Milan" },
      { name: "Sophie L.", city: "London" },
      { name: "James C.", city: "Chicago" },
      { name: "Sarah K.", city: "Berlin" },
      { name: "Ryan M.", city: "Dubai" },
      { name: "Chloe P.", city: "Singapore" },
      { name: "Alex D.", city: "Barcelona" }
    ];
    var joinerIdx = 0;

    function triggerSocialToast() {
      var toast = document.getElementById('clSocialToast');
      var text = document.getElementById('clSocialToastText');
      if (!toast || !text) return;

      var j = JOINERS[joinerIdx];
      joinerIdx = (joinerIdx + 1) % JOINERS.length;
      text.innerHTML = '<span class="font-bold text-slate-900">' + j.name + '</span> from ' + j.city + ' just enrolled';
      
      toast.classList.remove('-translate-x-full', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');

      setTimeout(function() {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('-translate-x-full', 'opacity-0');
      }, 3500);
    }

    setTimeout(triggerSocialToast, 5000);
    setInterval(triggerSocialToast, 20000);
  })();
</script>
`;

html = html.replace(
  /<div class="product--tab__content tab--show\s*" id="tab--tab_synopsis">[\s\S]*?<div class="product--tab__content\s*" id="tab--tab_reviews">/,
  `<div class="product--tab__content tab--show" id="tab--tab_synopsis">\n${fullCourseAboutHtml}\n</div>\n<div class="product--tab__content" id="tab--tab_reviews">`
);

// 14. Reviews Dataset (4,892 ratings)
const COURSE_REVIEWS_DATA = [
  { name: 'Alexander Wright', loc: 'London, UK', d: '12 September 2026', r: 5, t: 'From zero 3D knowledge to delivering full interior renders in 3 weeks', b: 'I was genuinely skeptical because of the $9 price tag, but this is hands down the highest value course bundle I have ever purchased. The SketchUp module starts from clean precision modeling, and within 10 days I had moved through V-Ray lighting and D5 Render AI. The real-time AI raytracing workflow alone saved our studio 40+ hours on client revisions.', h: 38 },
  { name: 'Elena Rostova', loc: 'Berlin, Germany', d: '08 September 2026', r: 5, t: 'The V-Ray sunlight and material lessons are pure gold', b: 'Before this bundle, all my interior renders looked flat and artificial like a 2005 video game. The explanation of directional sunlight, secondary bounces, and PBR roughness maps changed everything. The included 10,000+ textures and 3D models made assembling scenes effortless.', h: 29 },
  { name: 'Marcus Sterling', loc: 'Sydney, Australia', d: '03 September 2026', r: 5, t: 'D5 Render AI is the future of architectural visualization', b: 'Being able to tweak camera angles, sun positions, and furniture textures in real-time at 60 FPS while the client is watching over Zoom is mind-blowing. No more waiting 45 minutes for a single test render. This course bundle puts you 3 years ahead of most architectural visualization studios.', h: 44 },
  { name: 'Chloe Dubois', loc: 'Paris, France', d: '29 August 2026', r: 5, t: 'Clear, concise, zero fluff — structured like a real design studio', b: 'Every tutorial is straight to the point. No rambling. The instructors explain WHY they pick each setting rather than just telling you to copy numbers blindly. The 3 freelance practice contracts included gave me the confidence to pitch real clients.', h: 17 },
  { name: 'David K. Miller', loc: 'Chicago, USA', d: '25 August 2026', r: 5, t: 'Best $9 our design firm has ever invested', b: 'We purchased this for our 4 junior designers to standardize our internal SketchUp to V-Ray to D5 pipeline. Within two weeks, our render turnaround time dropped by 70%. It paid for itself a thousand times over on the very first residential project.', h: 52 },
  { name: 'Siddharth Nair', loc: 'Dubai, UAE', d: '19 August 2026', r: 5, t: 'Transformed my architecture portfolio completely', b: 'I graduated college with zero real-time rendering experience. In 15 days following this syllabus, I rebuilt my entire portfolio with 4K renders and real-time animations. I landed two commercial freelance visualization gigs within a month.', h: 21 },
  { name: 'Sophia Chen', loc: 'Toronto, Canada', d: '14 August 2026', r: 5, t: 'Unbelievable quality and 24/7 team guidance', b: 'I ran into a weird shadow glitch in V-Ray and got help immediately from their support. The material library alone is worth hundreds of dollars. Highly recommend to every interior designer and architect!', h: 19 },
  { name: 'Liam O\'Connor', loc: 'Dublin, Ireland', d: '09 August 2026', r: 5, t: 'Everything you need to produce magazine-quality 3D renders', b: 'No fluff, just pure masterclass execution. Followed along with the source files provided and ended up with renders that look indistinguishable from real photography.', h: 14 }
];

function renderReviewCard(r) {
  const initials = r.name.split(' ').map(n => n[0]).join('').substring(0, 2);
  const stars = '★'.repeat(r.r);
  return `
<div class="bstr-rev-card">
  <div class="bstr-rev-card-header">
    <div class="bstr-rev-user-col">
      <div class="bstr-rev-avatar">${initials}</div>
      <div>
        <div class="bstr-rev-author-name">
          <span>${r.name}</span>
          <span class="bstr-rev-verified-pill">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Verified Student
          </span>
        </div>
        <div class="bstr-rev-meta">SketchUp + V-Ray + D5 Render AI Bundle · ${r.loc} · ${r.d}</div>
      </div>
    </div>
    <div class="bstr-rev-stars-item">${stars}</div>
  </div>
  <div class="bstr-rev-title">"${r.t}"</div>
  <div class="bstr-rev-body">${r.b}</div>
  <div class="bstr-rev-card-footer">
    <span>Reviewed on ${r.d}</span>
    <button type="button" class="bstr-rev-helpful-btn" onclick="this.innerHTML='✓ Helpful (${r.h + 1})'">👍 Helpful (${r.h})</button>
  </div>
</div>`;
}

const staticReviewsHtml = COURSE_REVIEWS_DATA.slice(0, 6).map(renderReviewCard).join('');

html = html.replace(
  /<div class="bstr-rev-list" id="bstrReviewsContainer">[\s\S]*?<\/div>\s*<!-- Pagination Controls -->/,
  `<div class="bstr-rev-list" id="bstrReviewsContainer">${staticReviewsHtml}</div>\n\n  <!-- Pagination Controls -->`
);

const reviewsJsCode = `
    (function() {
      var ALL_REVIEWS = ${JSON.stringify(COURSE_REVIEWS_DATA)};
      var TOTAL_COUNT = 4892;
`;

html = html.replace(
  /\(function\(\) \{\s*var ALL_REVIEWS = \[[\s\S]*?\];/,
  reviewsJsCode
);

html = html.replace(/Verified Reader/g, 'Verified Student');
html = html.replace(/Hardcopy Collector's Edition/g, 'SketchUp + V-Ray + D5 Render AI');
html = html.replace(/Digital Complete Collection/g, 'SketchUp + V-Ray + D5 Render AI');
html = html.replace(/6 Books to Design Interiors &amp; Exteriors/g, '3 Master Courses for 3D Modeling &amp; Photorealism');
html = html.replace(/6 Books to Design Interiors & Exteriors/g, '3 Master Courses for 3D Modeling & Photorealism');
html = html.replace(/6 Books to Design Interiors \\u0026 Exteriors/g, '3 Master Courses for 3D Modeling \\u0026 Photorealism');
html = html.replace(/6-Book Collection/g, '3-Course Master Bundle');
html = html.replace(/6-book collection/g, '3-course master bundle');
html = html.replace(/Complete 6-Book Collection/g, 'Complete 3-Course Masterclass');

// Save outputs
const targetPath = path.join(projectRoot, 'products', '3-master-courses-architecture-3d.html');
fs.writeFileSync(targetPath, html, 'utf8');

const publicTargetPath = path.join(projectRoot, 'public', 'products', '3-master-courses-architecture-3d.html');
fs.writeFileSync(publicTargetPath, html, 'utf8');

// Also update build_clean_course_page.cjs in project root
fs.writeFileSync(path.join(projectRoot, 'build_clean_course_page.cjs'), fs.readFileSync(__filename, 'utf8'), 'utf8');

console.log('Successfully generated clean start.avadalearn.com matching course page!');
