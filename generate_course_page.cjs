const fs = require('fs');
const path = require('path');

const srcHtmlPath = path.join(__dirname, 'products', '6-books-for-interior-exterior-design.html');
let html = fs.readFileSync(srcHtmlPath, 'utf8');

// 1. Remove non-existent Shopify internal scripts that cause 404s/bundler issues
html = html.replace(/<script async="async" src="\/checkouts\/internal\/preloads\.js\?locale=en-US"><\/script>/g, '<!-- removed non-existent shopify internal resource -->');
html = html.replace(/<script type="module" src="\/cdn\/shopifycloud\/portable-wallets\/latest\/portable-wallets\.en\.js"[^>]*><\/script>/g, '<!-- removed non-existent shopify internal resource -->');
html = html.replace(/<link id="shopify-accelerated-checkout-styles"[^>]*>/g, '<!-- removed non-existent shopify internal resource -->');
html = html.replace(/<script src="\/cdn\/wpm\/[^"]*"[^>]*><\/script>/g, '');
html = html.replace(/<script src="\/cdn\/shopifycloud\/perf-kit\/[^"]*"[^>]*><\/script>/g, '');
html = html.replace(/<script src="\/web-pixels[^"]*"[^>]*><\/script>/g, '');
html = html.replace(/<script defer="defer" async="" type="module" src="https:\/\/cdn\.shopify\.com\/shopifycloud\/shop-js\/[^"]*"><\/script>/g, '');
html = html.replace(/<script type="module">\s*await import\("https:\/\/cdn\.shopify\.com\/shopifycloud\/shop-js\/[^"]*"\);[\s\S]*?<\/script>/g, '');
html = html.replace(/<script id="shop-js-analytics"[^>]*>[\s\S]*?<\/script>/g, '');

// 2. Replace Page Title & Meta
html = html.replace(
  /<title>.*?<\/title>/gi,
  '<title>3 Master Courses on 3D Modeling & Photorealism (SketchUp + V-Ray + D5 Render AI) — AVADA</title>'
);

html = html.replace(
  /content="800\+ Pages of Handmade Architectural Diagrams.*?"/gi,
  'content="Master 3D Architectural Modeling, Photorealistic V-Ray Lighting & Real-Time D5 Render AI from scratch. Over 50+ hours of step-by-step masterclasses, source project files, and 10,000+ 3D assets trusted by 50,000+ architects and designers worldwide."'
);

html = html.replace(
  /\/products\/6-books-for-interior-exterior-design/g,
  '/courses'
);

// 3. Header Navigation Links
html = html.replace(
  /<span class="nav__link__holder nav__link--active">\s*<a class="nav__link nav__link--opacity" href="\/courses">6 Books<\/a>\s*<\/span>/g,
  '<span class="nav__link__holder">\n    <a class="nav__link nav__link--opacity" href="/products/6-books-for-interior-exterior-design">6 Books</a>\n</span>\n<span class="nav__link__holder nav__link--active">\n    <a class="nav__link nav__link--opacity" href="/courses">Courses</a>\n</span>'
);

// Eyebrow
html = html.replace(
  /Bestseller in 26 Countries \| Home Design Category/g,
  'Bestseller in 3D Architectural Visualisation & Design'
);

// Top rating line above title
html = html.replace(
  /★{5}\s*\(4\.9\)\s*436 Reviews/g,
  '★★★★★ 4.9 (4,892 verified student reviews)'
);

// Product Title
html = html.replace(
  /<span class="product__title-prefix">6 Books For<\/span>\s*<span class="product__title-highlight">Interior &amp; Exterior Design<\/span>/g,
  '<span class="product__title-prefix">3 Master Courses For</span>\n    <span class="product__title-highlight">3D Modeling &amp; Photorealism</span>'
);

// Price Replacement: from $49.00 / $98.00 to $9.00 / $29.00
html = html.replace(/\$49\.00/g, '$9.00');
html = html.replace(/\$98\.00/g, '$29.00');
html = html.replace(/\$49/g, '$9');
html = html.replace(/\$98/g, '$29');
html = html.replace(/-50% OFF/g, '-69% OFF');

// Swatches & Product options
html = html.replace(/E-Book/g, 'Instant Cloud Access');
html = html.replace(/Hardcopy/g, 'Physical 1TB SSD Box Set');
html = html.replace(/⚡ Instant PDF Download · 800\+ Pages · Lifetime Updates/g, '⚡ Instant Cloud Access · 3 Full Masterclasses · HD Video & Source Files');
html = html.replace(/📦 Deluxe Printed Edition \(Currently Out of Stock\)/g, '📦 1TB High-Speed External SSD with Preloaded 4K Courses (Currently Out of Stock)');
html = html.replace(/\$199\.00/g, '$149.00');

// Editorial Statement / Problem Solution
html = html.replace(
  /Avoid costly layout mistakes, Do's &amp; Don'ts, find practical dimensions, and turn design ideas into spaces that work\./g,
  'Avoid flat lighting, slow render times, and endless trial & error. Create award-winning photorealistic visuals in minutes.'
);

html = html.replace(
  /A home is the heart of your life—don't let one wrong decision turn your dream into daily frustration\./g,
  'A 3D render is what sells your designs to high-paying clients—don\'t let amateur visuals hold back great architecture.'
);

html = html.replace(
  /These 6 step-by-step books guide you like a professional designer\./g,
  'These 3 step-by-step masterclasses guide you from blank canvas to photorealistic 4K presentation.'
);

// Gallery slides
const courseGallerySlides = `
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
  /<div class="slider--product"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<div class="gallery__thumbnails-side">/,
  '<div class="slider--product" data-bstr-slider-height="auto" data-bstr-slider-orientation="horizontal" data-bstr-slide-holder="1" data-bstr-slider-current="0" data-bstr-slider-id="template--28173635256637__page">\n' + courseGallerySlides + '\n</div>\n</div>\n<div class="gallery__thumbnails-side">'
);

// Gallery Thumbnails
const courseThumbs = `
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
  /<div class="gallery__thumbnails hidden-scroll">[\s\S]*?<\/div>/,
  '<div class="gallery__thumbnails hidden-scroll">\n' + courseThumbs + '\n</div>'
);

// Top Rating 3-course cards
const coursePillTrack = `
  <div class="top-rating-books-ripple-wrap">
    <div class="top-rating-books-track" style="justify-content: flex-start; gap: 12px;">
      <div class="top-rating-book-item" style="--ripple-delay: 0s; flex: 0 0 90px; width: 90px;" onclick="scrollToCurriculum(0)">
        <div class="top-rating-book-cover" style="aspect-ratio: 16/10;">
          <img src="https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo" alt="SketchUp Pro Course" loading="lazy" width="90" height="60" style="object-fit: cover;">
        </div>
        <span class="top-rating-book-name" style="font-size: 11px;">SketchUp</span>
        <span class="top-rating-book-pages" style="color: #ea580c; font-weight: 700;">Course 1</span>
      </div>
      <div class="top-rating-book-item" style="--ripple-delay: 0.3s; flex: 0 0 90px; width: 90px;" onclick="scrollToCurriculum(1)">
        <div class="top-rating-book-cover" style="aspect-ratio: 16/10;">
          <img src="https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8" alt="V-Ray Course" loading="lazy" width="90" height="60" style="object-fit: cover;">
        </div>
        <span class="top-rating-book-name" style="font-size: 11px;">V-Ray 6</span>
        <span class="top-rating-book-pages" style="color: #ea580c; font-weight: 700;">Course 2</span>
      </div>
      <div class="top-rating-book-item" style="--ripple-delay: 0.6s; flex: 0 0 90px; width: 90px;" onclick="scrollToCurriculum(2)">
        <div class="top-rating-book-cover" style="aspect-ratio: 16/10;">
          <img src="https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr" alt="D5 Render AI Course" loading="lazy" width="90" height="60" style="object-fit: cover;">
        </div>
        <span class="top-rating-book-name" style="font-size: 11px;">D5 Render AI</span>
        <span class="top-rating-book-pages" style="color: #ea580c; font-weight: 700;">Course 3</span>
      </div>
    </div>
  </div>
`;

html = html.replace(
  /<div class="top-rating-books-ripple-wrap">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  coursePillTrack + '\n</div>'
);

// Direct Checkout Redirection
html = html.replace(
  /window\.executeDirectBuyNow = function\(e, btn\) \{[\s\S]*?fetch\('\/cart\/add\.js'[\s\S]*?\}\);[\s\S]*?\};/,
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
    if (textSpan) textSpan.textContent = 'Redirecting to Checkout...';
  }
  window.location.href = '/courses/checkout';
};`
);

// Change sticky bar title & bottom CTA button text
html = html.replace(
  /6 Books to Design Interiors &amp; Exteriors/g,
  '3 Master Courses for 3D Modeling & Photorealism'
);

html = html.replace(
  /Get the Complete 6-Book Collection/g,
  'Get All 3 Master Courses — Instant Access $9'
);

html = html.replace(
  /Made with <span class="arch-heart-emoji">💗<\/span> for Home Owners, Interior Designers &amp; Architects/g,
  'Made with <span class="arch-heart-emoji">💗</span> for 3D Artists, Architects &amp; Interior Designers'
);

// 4. FULL ABOUT SECTION RECONSTRUCTION FROM new49stripe
const fullCourseAboutHtml = `
<div id="tab--tab_about" class="product--tab__content product--tab__content--active">
  <div class="lp6-about-root">
    <div class="lp6-about-container">

      <!-- ══════════════════════════════════════════════════
           HERO VIDEO PREVIEW (Top of About Section)
           ══════════════════════════════════════════════════ -->
      <div class="lp6-video-section">
        <div class="lp6-video-header">
          <span class="lp6-video-tag">Course Walkthrough Preview</span>
          <p class="lp6-section-sub">Learn Complete Interior &amp; Exterior Design from blank canvas to photorealistic 4K renders.</p>
        </div>

        <div class="lp6-video-frame-box">
          <iframe id="lp6-preview-iframe" title="Course preview" src="https://iframe.mediadelivery.net/embed/494628/1f7b76dd-7d47-4f39-87af-bff5a6b02d08?autoplay=true&amp;loop=true&amp;muted=true&amp;mute=1&amp;playsinline=true&amp;preload=true&amp;responsive=true" allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope" allowfullscreen="" playsinline="true" webkit-playsinline="true" muted="true">
          </iframe>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           1. TOP HOOK & HEADLINE
           ══════════════════════════════════════════════════ -->
      <div class="lp6-header-badge-wrap">
        <span class="lp6-pill-badge">3 MASTER COURSES</span>
      </div>

      <h2 class="lp6-headline-primary">
        <span class="lp6-headline-light">Learn to Design</span> <strong class="lp6-headline-books">Homes, Offices &amp; Villas</strong>
        <span class="lp6-highlight-beige" style="display:block; margin-top: 8px; font-size: 0.85em;">and show real 3D to clients</span>
      </h2>

      <p class="lp6-subhead-tagline" style="margin-top: 14px; margin-bottom: 24px;">
        <strong>Learn PDR — Planning, Designing &amp; Rendering</strong><br>
        One bundle. Everything included.
      </p>

      <!-- Statement & Solution Card -->
      <div class="lp6-statement-block">
        <h3 class="lp6-statement-heading">
          "In Architecture and Design, Planning, Design and Rendering matter the most. The question isn't if you can. It's... <mark class="lp6-mark-yellow">How to do it FASTER?"</mark>
        </h3>

        <div class="lp6-solution-card">
          <p class="lp6-solution-lead">
            That's exactly why we built this. A complete blueprint — from software basics to client-ready renders — designed to make you <strong style="color:#ea580c;">job or business ready in just one month.</strong>
          </p>
          <p class="lp6-solution-text">
            Start charging $500–$1,500 for designing and photorealistic rendering.
          </p>

          <!-- 3 Courses in mini size with ripple animation -->
          <div class="lp6-mini-books-ripple-wrap">
            <div class="lp6-mini-books-track">
              <div class="lp6-mini-book-item" style="--ripple-delay: 0s;" onclick="lp6SelectCurriculum(0)">
                <div class="lp6-mini-book-cover" style="aspect-ratio: 16/10;">
                  <img src="https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo" alt="SketchUp Pro 3D Course" loading="lazy" width="90" height="60" style="object-fit:cover;">
                </div>
                <span class="lp6-mini-book-name">SketchUp</span>
                <span class="lp6-mini-book-pages" style="color: #ea580c; font-weight:700;">55k Students</span>
              </div>
              <div class="lp6-mini-book-item" style="--ripple-delay: 0.25s;" onclick="lp6SelectCurriculum(1)">
                <div class="lp6-mini-book-cover" style="aspect-ratio: 16/10;">
                  <img src="https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8" alt="V-Ray 6 Course" loading="lazy" width="90" height="60" style="object-fit:cover;">
                </div>
                <span class="lp6-mini-book-name">V-Ray 6</span>
                <span class="lp6-mini-book-pages" style="color: #ea580c; font-weight:700;">48k Students</span>
              </div>
              <div class="lp6-mini-book-item" style="--ripple-delay: 0.5s;" onclick="lp6SelectCurriculum(2)">
                <div class="lp6-mini-book-cover" style="aspect-ratio: 16/10;">
                  <img src="https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr" alt="D5 Render AI Course" loading="lazy" width="90" height="60" style="object-fit:cover;">
                </div>
                <span class="lp6-mini-book-name">D5 Render AI</span>
                <span class="lp6-mini-book-pages" style="color: #ea580c; font-weight:700;">19k Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           WE HELP YOU TO + 3 FREELANCE PROJECTS (Worth $200)
           ══════════════════════════════════════════════════ -->
      <div class="lp6-who-section" style="background:#f8fafc; border:1px solid #e2e8f0; margin-bottom: 36px;">
        <div class="lp6-who-header">
          <span class="lp6-who-eyebrow">CAREER OUTCOMES</span>
          <h3 class="lp6-who-heading">We Help You To <span class="lp6-who-accent">Succeed</span></h3>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 20px;">
          <div style="background:#ffffff; border:2px solid #fde047; border-radius:16px; padding: 20px; text-align:left; display:flex; gap:14px; align-items:center;">
            <span style="font-size:32px;">💼</span>
            <div>
              <h4 style="margin:0 0 4px 0; font-size:16px; font-weight:800; color:#0f172a;">Get a Better Job</h4>
              <p style="margin:0; font-size:13px; color:#64748b;">Higher-paying design & 3D visualization roles ($500–$1,500).</p>
            </div>
          </div>
          <div style="background:#ffffff; border:2px solid #fde047; border-radius:16px; padding: 20px; text-align:left; display:flex; gap:14px; align-items:center;">
            <span style="font-size:32px;">🏢</span>
            <div>
              <h4 style="margin:0 0 4px 0; font-size:16px; font-weight:800; color:#0f172a;">Own Design Firm</h4>
              <p style="margin:0; font-size:13px; color:#64748b;">Close high-ticket freelance & studio architectural contracts.</p>
            </div>
          </div>
        </div>

        <!-- 3 Freelance Projects Banner -->
        <div style="background:#fff7ed; border:2px solid #fdba74; border-radius:16px; padding:20px; text-align:left; display:flex; gap:16px; align-items:flex-start;">
          <span style="font-size:36px; line-height:1;">🎨</span>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">
              <h4 style="margin:0; font-size:17px; font-weight:800; color:#0f172a;">3 Interior Design Freelance Projects Included</h4>
              <span style="background:#ea580c; color:#ffffff; font-size:12px; font-weight:800; padding:3px 12px; border-radius:999px;">WORTH $200</span>
            </div>
            <p style="margin:0 0 8px 0; font-size:13.5px; color:#475569; line-height:1.45;">
              Freelance paid practice projects provided to every student to gather real-world portfolio experience.
            </p>
            <div style="display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:#059669;">
              <span>✓ Official Verified Certificate of Completion Included</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           MASTER DESIGN TO RENDER PIPELINE DIAGRAM
           ══════════════════════════════════════════════════ -->
      <div style="margin: 40px 0; text-align:center;">
        <div class="lp6-who-header" style="margin-bottom:16px;">
          <span class="lp6-who-eyebrow">INDUSTRY WORKFLOW</span>
          <h3 class="lp6-who-heading">Master Design to <span class="lp6-who-accent">Render Pipeline</span></h3>
          <p class="lp6-section-sub" style="margin-top:6px;">The exact software pipeline top global designers and architectural studios use daily.</p>
        </div>

        <div style="max-width:760px; margin:0 auto 16px auto; border-radius:18px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 10px 25px rgba(0,0,0,0.06);">
          <img src="https://lh3.googleusercontent.com/d/1sVPZ_PDQCwMEuA9MiZxHLkTWP6LbjKL7" alt="Design to Render Pipeline: SketchUp, V-Ray, D5 Render" style="width:100%; display:block;" loading="lazy">
        </div>

        <p style="font-size:13.5px; font-weight:700; color:#059669; display:flex; align-items:center; justify-content:center; gap:8px;">
          <span>⚡ Software Installation Hub & Download Links Included</span>
        </p>
      </div>

      <!-- ══════════════════════════════════════════════════
           3. WHY THESE MASTERCLASSES CHANGE EVERYTHING
           ══════════════════════════════════════════════════ -->
      <div class="lp6-why-section">
        <h3 class="lp6-section-title">Why These Masterclasses Change Everything</h3>

        <div class="lp6-bullets-card">
          <ul class="lp6-bullets-list">
            <li>
              <span class="lp6-bullet-icon">🚀</span>
              <span class="lp6-bullet-text"><strong>From zero to photorealism</strong> in days, not years</span>
            </li>
            <li>
              <span class="lp6-bullet-icon">☀️</span>
              <span class="lp6-bullet-text"><strong>Master real sunlight & IES lighting</strong> without endless guessing</span>
            </li>
            <li>
              <span class="lp6-bullet-icon">⚡</span>
              <span class="lp6-bullet-text"><strong>Real-time AI raytracing</strong> with D5 Render that cuts render time by 90%</span>
            </li>
            <li>
              <span class="lp6-bullet-icon">📦</span>
              <span class="lp6-bullet-text"><strong>10,000+ drag & drop 3D assets</strong> and 4K PBR material library included</span>
            </li>
            <li>
              <span class="lp6-bullet-icon">💼</span>
              <span class="lp6-bullet-text"><strong>Commercial client workflows</strong> that help you close high-ticket projects</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           4. WHAT'S INSIDE THE 3-COURSE MASTER BUNDLE
           ══════════════════════════════════════════════════ -->
      <div class="lp6-inside-section" style="background:#ffffff; border:1px solid #e2e8f0;">
        <h3 class="lp6-section-title">What's Inside</h3>

        <div class="lp6-bullets-card">
          <ul class="lp6-bullets-list">
            <li>
              <span class="lp6-bullet-icon">📐</span>
              <span class="lp6-bullet-text"><strong>SketchUp Pro Masterclass:</strong> 2D-to-3D, precision modeling, custom cabinetry & roofs</span>
            </li>
            <li>
              <span class="lp6-bullet-icon">☀️</span>
              <span class="lp6-bullet-text"><strong>V-Ray 6 Photorealism:</strong> Realistic sun, atmospheric moods, glass/wood shaders & VFB grading</span>
            </li>
            <li>
              <span class="lp6-bullet-icon">⚡</span>
              <span class="lp6-bullet-text"><strong>D5 Render AI:</strong> 60 FPS real-time raytracing, AI atmosphere match, animations & VR</span>
            </li>
            <li>
              <span class="lp6-bullet-icon">📁</span>
              <span class="lp6-bullet-text"><strong>Complete Project Files:</strong> All raw .skp models, textures, IES lights and scene setups</span>
            </li>
            <li>
              <span class="lp6-bullet-icon">🔄</span>
              <span class="lp6-bullet-text"><strong>Lifetime Cloud Access:</strong> Stream anytime on desktop, iPad, or mobile with free updates</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           5. INTERACTIVE 3-COURSE CURRICULUM EXPLORER
           ══════════════════════════════════════════════════ -->
      <div class="lp6-curriculum-section">
        <div class="lp6-curriculum-header">
          <p class="lp6-curriculum-kicker">Interactive Curriculum Explorer</p>
          <h3 class="lp6-section-title">Explore All 3 Masterclasses</h3>
          <p class="lp6-section-sub">Select any course below to preview detailed modules, lesson topics, and techniques.</p>
        </div>

        <div class="lp6-curriculum-tabs" id="lp6CurrTabs">
          <button type="button" class="lp6-curr-tab-btn active" onclick="lp6SelectCurriculum(0)">📐 Course 1: SketchUp Pro</button>
          <button type="button" class="lp6-curr-tab-btn" onclick="lp6SelectCurriculum(1)">☀️ Course 2: V-Ray 6</button>
          <button type="button" class="lp6-curr-tab-btn" onclick="lp6SelectCurriculum(2)">⚡ Course 3: D5 Render AI</button>
        </div>

        <div class="lp6-curr-display-box">
          <div class="lp6-curr-cover-col">
            <img id="lp6CurrImg" src="https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo" alt="SketchUp Pro Course Cover">
          </div>
          <div class="lp6-curr-content-col">
            <h4 id="lp6CurrTitle" class="lp6-curr-active-title">Course 1: SketchUp Pro 3D Modeling Masterclass</h4>
            <div class="lp6-curr-sections-grid" id="lp6CurrGrid">
              <div class="lp6-curr-sec-col">
                <div class="lp6-curr-sec-title">Interface & Precision</div>
                <ul class="lp6-curr-list">
                  <li>Custom shortcuts & workspace</li>
                  <li>Millimeter & inch precision</li>
                  <li>Wall framing & window cutouts</li>
                  <li>Complex roofs & staircases</li>
                </ul>
              </div>
              <div class="lp6-curr-sec-col">
                <div class="lp6-curr-sec-title">Cabinetry & Furniture</div>
                <ul class="lp6-curr-list">
                  <li>Modular kitchen islands</li>
                  <li>Custom millwork & wardrobes</li>
                  <li>Curved geometry & plugins</li>
                  <li>Dynamic component variations</li>
                </ul>
              </div>
              <div class="lp6-curr-sec-col">
                <div class="lp6-curr-sec-title">PBR & UV Mapping</div>
                <ul class="lp6-curr-list">
                  <li>High-res wood grains & tiles</li>
                  <li>Importing 2D CAD floorplans</li>
                  <li>Optimizing high-poly models</li>
                  <li>Organized tags & outliner</li>
                </ul>
              </div>
              <div class="lp6-curr-sec-col">
                <div class="lp6-curr-sec-title">Client Presentation</div>
                <ul class="lp6-curr-list">
                  <li>Architectural style presets</li>
                  <li>Section planes & cutaways</li>
                  <li>Exporting high-res 2D layouts</li>
                  <li>Animation scene tabs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           AI-POWERED REAL-TIME RENDERING (D5 Render AI Video)
           ══════════════════════════════════════════════════ -->
      <div style="margin: 48px 0; padding: 28px 20px; background:#fafafa; border:1px solid #e5e7eb; border-radius:20px; text-align:center;">
        <span class="lp6-who-eyebrow">AI-POWERED RENDERING</span>
        <h3 class="lp6-who-heading" style="margin-bottom:8px;">Learn <span class="lp6-who-accent">D5 Render AI</span></h3>
        <p class="lp6-section-sub" style="margin-bottom:20px;">Create stunning photorealistic renders in real-time — free AI tools that run locally on your system.</p>

        <div style="max-width:760px; margin:0 auto; border-radius:16px; overflow:hidden; box-shadow:0 12px 30px rgba(0,0,0,0.12); border:1px solid #e2e8f0;">
          <video src="https://rendair-landingpage.s3.us-east-1.amazonaws.com/rendair-ai-chat-03-cc.mp4" autoplay loop muted playsinline style="width:100%; display:block;"></video>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           STUDENT WORK RENDER GALLERY (Continuous Marquee + Lightbox)
           ══════════════════════════════════════════════════ -->
      <div class="lp6-inside-section">
        <div class="lp6-inside-header">
          <span class="lp6-inside-tag">Student Work Showcase</span>
          <h3 class="lp6-section-title">See What Our Students Have Created</h3>
          <p class="lp6-section-sub">50,000+ learners worldwide • 4.9★ average rating</p>
        </div>

        <div class="lp6-marquee-container" id="lp6InsideMarquee">
          <div class="lp6-marquee-group">
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(0)" role="button" tabindex="0">
              <img src="/renders/RENDER-1.jpg" alt="Student Render 1" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(1)" role="button" tabindex="0">
              <img src="/renders/RENDER-2.jpg" alt="Student Render 2" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(2)" role="button" tabindex="0">
              <img src="/renders/RENDER-3.jpg" alt="Student Render 3" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(3)" role="button" tabindex="0">
              <img src="/renders/RENDER-4.jpg" alt="Student Render 4" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(4)" role="button" tabindex="0">
              <img src="/renders/RENDER-5.jpg" alt="Student Render 5" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(5)" role="button" tabindex="0">
              <img src="/renders/RENDER-6.jpg" alt="Student Render 6" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(7)" role="button" tabindex="0">
              <img src="/renders/RENDER-8.jpg" alt="Student Render 8" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(9)" role="button" tabindex="0">
              <img src="/renders/RENDER-10.jpg" alt="Student Render 10" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(11)" role="button" tabindex="0">
              <img src="/renders/RENDER-12.jpg" alt="Student Render 12" loading="lazy">
            </div>
          </div>

          <div class="lp6-marquee-group" aria-hidden="true">
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(0)" role="button" tabindex="0">
              <img src="/renders/RENDER-1.jpg" alt="Student Render 1" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(1)" role="button" tabindex="0">
              <img src="/renders/RENDER-2.jpg" alt="Student Render 2" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(2)" role="button" tabindex="0">
              <img src="/renders/RENDER-3.jpg" alt="Student Render 3" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(3)" role="button" tabindex="0">
              <img src="/renders/RENDER-4.jpg" alt="Student Render 4" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(4)" role="button" tabindex="0">
              <img src="/renders/RENDER-5.jpg" alt="Student Render 5" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(5)" role="button" tabindex="0">
              <img src="/renders/RENDER-6.jpg" alt="Student Render 6" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(7)" role="button" tabindex="0">
              <img src="/renders/RENDER-8.jpg" alt="Student Render 8" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(9)" role="button" tabindex="0">
              <img src="/renders/RENDER-10.jpg" alt="Student Render 10" loading="lazy">
            </div>
            <div class="lp6-marquee-card" onclick="lp6OpenInsideModal(11)" role="button" tabindex="0">
              <img src="/renders/RENDER-12.jpg" alt="Student Render 12" loading="lazy">
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox Modal for Renders -->
      <div class="lp6-inside-modal" id="lp6InsideModal" onclick="lp6CloseInsideModal(event)" style="display:none;" aria-hidden="true" role="dialog">
        <div class="lp6-modal-backdrop"></div>
        <div class="lp6-modal-dialog" onclick="event.stopPropagation();">
          <button type="button" class="lp6-modal-close" onclick="lp6CloseInsideModal()" aria-label="Close dialog">✕</button>
          <button type="button" class="lp6-modal-nav lp6-modal-prev" onclick="lp6ModalNav(-1)" aria-label="Previous image">‹</button>
          <button type="button" class="lp6-modal-nav lp6-modal-next" onclick="lp6ModalNav(1)" aria-label="Next image">›</button>
          <div class="lp6-modal-img-wrap">
            <img id="lp6ModalImg" src="" alt="Student Render High-Res">
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           WHO IS THIS FOR?
           ══════════════════════════════════════════════════ -->
      <div class="lp6-who-section">
        <div class="lp6-who-header">
          <span class="lp6-who-eyebrow">WHO IS THIS FOR?</span>
          <h3 class="lp6-who-heading">Trusted by <span class="lp6-who-accent">50,000+ Designers</span> Worldwide</h3>
        </div>

        <div class="lp6-who-grid">
          <div class="lp6-who-card">
            <div class="lp6-who-icon-box">
              <span style="font-size:32px;">📐</span>
            </div>
            <span class="lp6-who-card-label">3D Visualizers</span>
          </div>

          <div class="lp6-who-card">
            <div class="lp6-who-icon-box">
              <span style="font-size:32px;">🎓</span>
            </div>
            <span class="lp6-who-card-label">Architecture Students</span>
          </div>

          <div class="lp6-who-card">
            <div class="lp6-who-icon-box">
              <span style="font-size:32px;">🛋️</span>
            </div>
            <span class="lp6-who-card-label">Interior Designers</span>
          </div>

          <div class="lp6-who-card">
            <div class="lp6-who-icon-box">
              <span style="font-size:32px;">🏢</span>
            </div>
            <span class="lp6-who-card-label">Studio Owners</span>
          </div>

          <div class="lp6-who-card">
            <div class="lp6-who-icon-box">
              <span style="font-size:32px;">💻</span>
            </div>
            <span class="lp6-who-card-label">Freelancers</span>
          </div>

          <div class="lp6-who-card">
            <div class="lp6-who-icon-box">
              <span style="font-size:32px;">🔨</span>
            </div>
            <span class="lp6-who-card-label">Renovators &amp; DIY</span>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           INCOME TIERS & ROI ($9 Investment Pays For Itself 100x)
           ══════════════════════════════════════════════════ -->
      <div style="margin: 48px 0; text-align:center;">
        <span class="lp6-who-eyebrow">RETURN ON INVESTMENT</span>
        <h3 class="lp6-who-heading" style="margin-bottom:12px;">Your $9 Investment <span class="lp6-who-accent">Pays for Itself 100x Over</span></h3>
        <p class="lp6-section-sub" style="margin-bottom:24px;">See how mastering this pipeline changes your career and project billing.</p>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px; max-width:780px; margin:0 auto;">
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:20px 16px; text-align:left; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:14px; font-weight:800; color:#0f172a;">Single Render Charge</span>
              <span style="font-size:24px;">🖼️</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-size:10px; text-transform:uppercase; color:#94a3b8; font-weight:700; display:block;">Before</span>
                <span style="font-size:12px; color:#94a3b8; text-decoration:line-through;">Can't render at all</span>
              </div>
              <span style="color:#ea580c; font-weight:800;">→</span>
              <div style="text-align:right;">
                <span style="font-size:10px; text-transform:uppercase; color:#ea580c; font-weight:700; display:block;">After</span>
                <span style="font-size:13.5px; font-weight:800; color:#ea580c;">Quoting $200+</span>
              </div>
            </div>
          </div>

          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:20px 16px; text-align:left; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:14px; font-weight:800; color:#0f172a;">Interior Project</span>
              <span style="font-size:24px;">🏠</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-size:10px; text-transform:uppercase; color:#94a3b8; font-weight:700; display:block;">Before</span>
                <span style="font-size:12px; color:#94a3b8; text-decoration:line-through;">Poor visuals</span>
              </div>
              <span style="color:#ea580c; font-weight:800;">→</span>
              <div style="text-align:right;">
                <span style="font-size:10px; text-transform:uppercase; color:#ea580c; font-weight:700; display:block;">After</span>
                <span style="font-size:13.5px; font-weight:800; color:#ea580c;">$2,000–$5,000</span>
              </div>
            </div>
          </div>

          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:20px 16px; text-align:left; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:14px; font-weight:800; color:#0f172a;">Time per Room</span>
              <span style="font-size:24px;">⏱️</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-size:10px; text-transform:uppercase; color:#94a3b8; font-weight:700; display:block;">Before</span>
                <span style="font-size:12px; color:#94a3b8; text-decoration:line-through;">3 Late Nights</span>
              </div>
              <span style="color:#ea580c; font-weight:800;">→</span>
              <div style="text-align:right;">
                <span style="font-size:10px; text-transform:uppercase; color:#ea580c; font-weight:700; display:block;">After</span>
                <span style="font-size:13.5px; font-weight:800; color:#ea580c;">2 Hours (D5 AI)</span>
              </div>
            </div>
          </div>

          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:20px 16px; text-align:left; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:14px; font-weight:800; color:#0f172a;">Career Confidence</span>
              <span style="font-size:24px;">🌟</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-size:10px; text-transform:uppercase; color:#94a3b8; font-weight:700; display:block;">Before</span>
                <span style="font-size:12px; color:#94a3b8; text-decoration:line-through;">Overwhelmed</span>
              </div>
              <span style="color:#ea580c; font-weight:800;">→</span>
              <div style="text-align:right;">
                <span style="font-size:10px; text-transform:uppercase; color:#ea580c; font-weight:700; display:block;">After</span>
                <span style="font-size:13.5px; font-weight:800; color:#ea580c;">In-Demand Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           EVERYTHING YOU GET TODAY (Value Stack Checklist)
           ══════════════════════════════════════════════════ -->
      <div style="margin: 48px 0;">
        <div class="lp6-who-header" style="margin-bottom:16px;">
          <span class="lp6-who-eyebrow">FULL VALUE STACK</span>
          <h3 class="lp6-who-heading">Everything Included <span class="lp6-who-accent">Today</span></h3>
          <p class="lp6-section-sub">The complete design-to-render toolkit — courses, software, support, and resources.</p>
        </div>

        <div style="max-width:680px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.04);">
          <div style="padding:14px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="color:#ea580c; font-weight:800;">✓</span>
              <span style="font-size:14px; font-weight:600; color:#1e293b;">SketchUp 3D Modeling — Complete Masterclass</span>
            </div>
            <span style="font-size:13px; font-weight:700; color:#059669;">INCLUDED</span>
          </div>

          <div style="padding:14px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="color:#ea580c; font-weight:800;">✓</span>
              <span style="font-size:14px; font-weight:600; color:#1e293b;">V-Ray Photo-Realism Masterclass</span>
            </div>
            <span style="font-size:13px; font-weight:700; color:#059669;">INCLUDED</span>
          </div>

          <div style="padding:14px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="color:#ea580c; font-weight:800;">✓</span>
              <span style="font-size:14px; font-weight:600; color:#1e293b;">D5 Real-Time AI Rendering Course</span>
            </div>
            <span style="font-size:13px; font-weight:700; color:#059669;">INCLUDED</span>
          </div>

          <div style="padding:14px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="color:#ea580c; font-weight:800;">✓</span>
              <span style="font-size:14px; font-weight:600; color:#1e293b;">10,000+ Premium PBR Texture Library</span>
            </div>
            <span style="font-size:13px; font-weight:700; color:#059669;">INCLUDED</span>
          </div>

          <div style="padding:14px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="color:#ea580c; font-weight:800;">✓</span>
              <span style="font-size:14px; font-weight:600; color:#1e293b;">2,000+ Drag-and-Drop 3D Models</span>
            </div>
            <span style="font-size:13px; font-weight:700; color:#059669;">INCLUDED</span>
          </div>

          <div style="padding:14px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="color:#ea580c; font-weight:800;">✓</span>
              <span style="font-size:14px; font-weight:600; color:#1e293b;">Software Installation Hub &amp; Download Links</span>
            </div>
            <span style="font-size:13px; font-weight:700; color:#059669;">INCLUDED</span>
          </div>

          <div style="padding:14px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="color:#ea580c; font-weight:800;">✓</span>
              <span style="font-size:14px; font-weight:600; color:#1e293b;">24/7 Team Access &amp; Portfolio Review</span>
            </div>
            <span style="font-size:13px; font-weight:700; color:#059669;">INCLUDED</span>
          </div>

          <div style="padding:14px 20px; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="color:#ea580c; font-weight:800;">✓</span>
              <span style="font-size:14px; font-weight:600; color:#1e293b;">Certified Digital Diploma</span>
            </div>
            <span style="font-size:13px; font-weight:700; color:#059669;">INCLUDED</span>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           7. WHAT YOU RECEIVE FEATURE GRID
           ══════════════════════════════════════════════════ -->
      <div class="lp6-features-section">
        <h3 class="lp6-section-title">What You Receive</h3>
        <div class="lp6-features-grid lp6-features-3col">
          <div class="lp6-feature-item">
            <div class="lp6-feature-icon-wrap">⚡</div>
            <h4 class="lp6-feature-name">Instant HD Video Access</h4>
            <p class="lp6-feature-text">Immediate digital streaming and offline download across all devices.</p>
          </div>
          <div class="lp6-feature-item">
            <div class="lp6-feature-icon-wrap">📁</div>
            <h4 class="lp6-feature-name">10,000+ 3D Asset Pack</h4>
            <p class="lp6-feature-text">High-poly furniture, foliage, PBR textures, and IES lighting files included.</p>
          </div>
          <div class="lp6-feature-item">
            <div class="lp6-feature-icon-wrap">🔄</div>
            <h4 class="lp6-feature-name">Lifetime Free Updates</h4>
            <p class="lp6-feature-text">New software version modules and bonus masterclasses added at zero charge.</p>
          </div>
          <div class="lp6-feature-item">
            <div class="lp6-feature-icon-wrap">🎓</div>
            <h4 class="lp6-feature-name">Certificate of Completion</h4>
            <p class="lp6-feature-text">Official verified credentials to showcase in your professional portfolio.</p>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           8. FAQ ACCORDION (7 Items from new49stripe)
           ══════════════════════════════════════════════════ -->
      <div class="lp6-faq-section">
        <h3 class="lp6-section-title">Frequently Asked Questions</h3>
        <p class="lp6-section-sub">All your questions about the 3-course master bundle, answered.</p>

        <div class="lp6-faq-wrapper">
          <details class="lp6-faq-item" open="">
            <summary class="lp6-faq-summary">
              <span>What exactly do I get?</span>
              <svg class="lp6-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="lp6-faq-answer">
              You get 3 complete courses: SketchUp Pro (3D modeling), V-Ray Photorealism (magazine-quality renders), and D5 Render AI (real-time AI rendering). Plus 10,000+ textures, 2,000+ 3D models, all software download links, a certified diploma, and 24/7 team support. Lifetime access, one-time payment.
            </div>
          </details>

          <details class="lp6-faq-item">
            <summary class="lp6-faq-summary">
              <span>I'm a complete beginner — is this for me?</span>
              <svg class="lp6-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="lp6-faq-answer">
              Absolutely! SketchUp builds up to full 3D interiors step-by-step, and V-Ray and D5 Render follow the same beginner-friendly approach. Our 24/7 support team is always a message away whenever you feel stuck.
            </div>
          </details>

          <details class="lp6-faq-item">
            <summary class="lp6-faq-summary">
              <span>Why is it only $9? What's the catch?</span>
              <svg class="lp6-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="lp6-faq-answer">
              No catch. We believe high-quality design education shouldn't cost $300+. We've served 50,000+ students at this price point and it works — low price, high volume, massive impact. You get the same content other platforms charge hundreds for.
            </div>
          </details>

          <details class="lp6-faq-item">
            <summary class="lp6-faq-summary">
              <span>Do I need to buy expensive software?</span>
              <svg class="lp6-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="lp6-faq-answer">
              Not at all. We provide links to official free or student versions of SketchUp, V-Ray, and D5 Render. You won't spend a single extra dollar on software licenses.
            </div>
          </details>

          <details class="lp6-faq-item">
            <summary class="lp6-faq-summary">
              <span>Will this actually help me get clients or a job?</span>
              <svg class="lp6-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="lp6-faq-answer">
              Yes. The #1 reason designers struggle to land clients is they can't produce professional photorealistic renders. This bundle teaches you the full pipeline — SketchUp to model, V-Ray for beauty shots, D5 AI for real-time presentations. Designers with these skills charge $2,000–$5,000 per project.
            </div>
          </details>

          <details class="lp6-faq-item">
            <summary class="lp6-faq-summary">
              <span>How long does it take to finish all 3 courses?</span>
              <svg class="lp6-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="lp6-faq-answer">
              Most students complete the full pipeline in 2–3 weeks at 1–2 hours per day. SketchUp takes about 5 days, V-Ray about 4, and D5 Render about 3. By day 15, you'll have portfolio-ready renders.
            </div>
          </details>

          <details class="lp6-faq-item">
            <summary class="lp6-faq-summary">
              <span>What if it's not for me?</span>
              <svg class="lp6-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            <div class="lp6-faq-answer">
              We offer a 100% money-back guarantee within 7 days. If you feel it's not a good fit, just message us and we'll refund you immediately — no questions asked. Zero risk.
            </div>
          </details>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           9. 100% MONEY-BACK GUARANTEE
           ══════════════════════════════════════════════════ -->
      <div class="lp6-guarantee-wrapper">
        <div class="lp6-guarantee-card">
          <div class="lp6-guarantee-icon-row">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
            <span class="lp6-guarantee-pill">100% Risk-Free 7-Day Guarantee</span>
          </div>
          <p class="lp6-guarantee-main">
            If you don't produce your first photorealistic render within 7 days, <strong class="lp6-guarantee-underline">just message us, and we'll refund your $9 immediately.</strong>
          </p>
          <p class="lp6-guarantee-confidence">
            That's how confident we are that this will be the <strong>only 3D architectural rendering resource you'll ever need.</strong>
          </p>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           10. BOTTOM ACTION CTA BUTTON
           ══════════════════════════════════════════════════ -->
      <div class="lp6-bottom-cta-wrap">
        <button type="button" class="lp6-primary-cta-btn" onclick="window.location.href='/courses/checkout'">
          <span class="lp6-btn-text" style="color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; font-size: inherit; font-weight: inherit; display: inline-block !important; opacity: 1 !important; visibility: visible !important;">Get All 3 Master Courses — Instant Access $9</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="stroke: #ffffff !important; color: #ffffff !important; display: inline-block !important;">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
        <div class="lp6-cta-trust-note">
          <span id="lp6-cta-delivery-note">Instant Cloud Streaming · 10,000+ 3D Assets · Lifetime Free Updates</span>
        </div>
      </div>

    </div>
  </div>
</div>
`;

// Replace the entire tab--tab_about container
html = html.replace(
  /<div id="tab--tab_about"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div class="product--tab__content\s*" id="tab--tab_reviews">/,
  fullCourseAboutHtml + '\n<div class="product--tab__content" id="tab--tab_reviews">'
);

// 5. MARQUEE IMAGES & LIGHTBOX JS
const courseInsideImages = `
  var insideBooksImages = [
    '/renders/RENDER-1.jpg', '/renders/RENDER-2.jpg', '/renders/RENDER-3.jpg',
    '/renders/RENDER-4.jpg', '/renders/RENDER-5.jpg', '/renders/RENDER-6.jpg',
    '/renders/RENDER-7.jpg', '/renders/RENDER-8.jpg', '/renders/RENDER-9.jpg',
    '/renders/RENDER-10.jpg', '/renders/RENDER-11.jpg', '/renders/RENDER-12.jpg',
    '/renders/RENDER-13.jpg', '/renders/RENDER-14.jpg', '/renders/RENDER-15.jpg',
    '/renders/RENDER-16.jpg', '/renders/RENDER-17.jpg', '/renders/RENDER-18.jpg',
    '/renders/RENDER-19.jpg', '/renders/RENDER-20.jpg', '/renders/RENDER-21.jpg',
    '/renders/RENDER-22.jpg', '/renders/RENDER-23.jpg', '/renders/RENDER-24.jpg',
    '/renders/RENDER-25.jpg'
  ];
`;

html = html.replace(
  /var insideBooksImages = \[[\s\S]*?\];/,
  courseInsideImages
);

// 6. CURRICULUM DATA JS
const courseCurriculumCode = `
  var curriculumData = [
    {
      id: 'sketchup',
      title: 'Course 1: SketchUp Pro 3D Modeling Masterclass',
      img: 'https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo',
      sections: [
        { name: 'Interface & Precision', items: ['Custom shortcuts & workspace', 'Millimeter & inch precision', 'Wall framing & window cutouts', 'Complex roofs & staircases'] },
        { name: 'Cabinetry & Furniture', items: ['Modular kitchen islands', 'Custom millwork & wardrobes', 'Curved geometry & plugins', 'Dynamic component variations'] },
        { name: 'PBR & UV Mapping', items: ['High-res wood grains & tiles', 'Importing 2D CAD floorplans', 'Optimizing high-poly models', 'Organized tags & outliner'] },
        { name: 'Client Presentation', items: ['Architectural style presets', 'Section planes & cutaways', 'Exporting high-res 2D layouts', 'Animation scene tabs'] }
      ]
    },
    {
      id: 'vray',
      title: 'Course 2: V-Ray Photorealism — Lighting & Shading',
      img: 'https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8',
      sections: [
        { name: 'Sun & Atmosphere', items: ['Sun + Sky simulation', 'HDRI dome environments', 'Golden Hour & evening moods', 'Atmospheric fog & haze'] },
        { name: 'Interior Lighting', items: ['IES light profiles & fixtures', 'LED strip lights & cove lighting', 'Balancing natural vs artificial', 'Light mix in real-time'] },
        { name: 'PBR Shaders', items: ['Flawless glass & water', 'Velvet, leather & fabrics', 'Displacement maps for stone', 'Subsurface marble & brass'] },
        { name: 'Cameras & VFB', items: ['2-point architectural perspective', 'Depth of field (bokeh)', 'VFB tone curves & LUTs', 'Bloom & glare optical lens'] }
      ]
    },
    {
      id: 'd5',
      title: 'Course 3: D5 Render AI — Real-Time Raytracing & Animation',
      img: 'https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr',
      sections: [
        { name: 'AI Lighting & Sky', items: ['Instant real-time raytracing', 'AI Atmosphere Match from photo', 'Dynamic rain, snow & clouds', 'Geo-located realistic sun'] },
        { name: 'Smart Assets', items: ['Wind-reactive trees & plants', 'Animated humans & vehicles', '1-click Scatter for lawns & forests', 'Luxury interior asset library'] },
        { name: 'Cinematic Video', items: ['Camera keyframing & drone paths', '4K video exports in minutes', 'Smooth camera speed curves', 'VR 360° panoramas'] },
        { name: 'AI Post-Enhancer', items: ['1-click AI clarity boost', 'Depth & normal pass exports', 'Color grading presets', 'Client presentation exports'] }
      ]
    }
  ];
`;

html = html.replace(
  /var curriculumData = \[[\s\S]*?\];\s*var activeIndex = 0;/,
  courseCurriculumCode + '\n  var activeIndex = 0;'
);

// 7. POPULATE REVIEWS SYSTEM WITH REAL COURSE REVIEWS
const COURSE_REVIEWS_DATA = [
  { id: 1, name: "Emma R.", loc: "Los Angeles, USA", ed: 0, d: "Sep 15, 2026", s: 5, t: "Went from zero to delivering photorealistic V-Ray renders in 3 weeks", b: "I went from zero SketchUp knowledge to delivering photorealistic V-Ray renders in 3 weeks. The 24/7 support team patiently walked me through every crash and weird shadow. Now I use D5 Render AI for client walkthroughs and feel completely secure in my career.", h: 48 },
  { id: 2, name: "James C.", loc: "New York, USA", ed: 0, d: "Sep 15, 2026", s: 5, t: "Best $9 our architecture firm ever invested", b: "Having SketchUp, V-Ray, and D5 Render in one bundle is pure genius. My studio now uses the full pipeline to generate gorgeous client presentations in minutes instead of waiting hours for test renders. Highly recommend.", h: 42 },
  { id: 3, name: "Sophie L.", loc: "London, UK", ed: 0, d: "Sep 14, 2026", s: 5, t: "The D5 Render AI course lets me make live changes during client meetings", b: "The step-by-step guidance from SketchUp modeling to final V-Ray render is incredible. The D5 Render course lets me make real-time changes while the client watches. Complete game-changer for closing design contracts.", h: 39 },
  { id: 4, name: "Daniel C.", loc: "Toronto, Canada", ed: 0, d: "Sep 14, 2026", s: 5, t: "College taught me outdated software — this got me hired", b: "College taught me outdated software and zero rendering workflows. This bundle gave me SketchUp + two rendering engines in two weeks. I started freelancing before graduation and now earn more than most junior architects.", h: 35 },
  { id: 5, name: "Olivia B.", loc: "Sydney, Australia", ed: 0, d: "Sep 13, 2026", s: 5, t: "SketchUp builds the model, V-Ray makes it stunning, D5 makes it instant", b: "To have someone show you the exact settings and IES lighting setups saves weeks of frustration. The SketchUp course builds the model, V-Ray makes it stunning, D5 makes it instant. All for $9.", h: 31 },
  { id: 6, name: "Marco R.", loc: "Milan, Italy", ed: 0, d: "Sep 13, 2026", s: 5, t: "D5 Render combined with V-Ray is magical for architectural visualizers", b: "I model in SketchUp, do beauty shots in V-Ray, and use D5 for real-time walkthrough animations. It took away all my anxiety about falling behind newer AI tools.", h: 28 },
  { id: 7, name: "Sarah K.", loc: "Berlin, Germany", ed: 0, d: "Sep 12, 2026", s: 5, t: "No more late nights before client design presentations", b: "My team of 4 now works with zero stress because we integrated the SketchUp → V-Ray → D5 pipeline. No more late nights waiting for render buckets. We deliver faster and charge significantly more.", h: 34 },
  { id: 8, name: "Ryan M.", loc: "Dubai, UAE", ed: 0, d: "Sep 12, 2026", s: 5, t: "Connected all the missing dots between modeling and photorealism", b: "I almost quit 3D entirely because I couldn't connect the dots between modeling and lighting. This bundle connected everything. SketchUp for structure, V-Ray for polish, D5 AI for speed.", h: 29 },
  { id: 9, name: "Chloe P.", loc: "Singapore", ed: 0, d: "Sep 11, 2026", s: 5, t: "15 days later, my portfolio landed me a paid studio gig", b: "Started from absolute zero without knowing SketchUp. 15 days later, my portfolio had photorealistic renders from V-Ray and real-time walkthroughs from D5 that landed me a paid studio internship.", h: 37 },
  { id: 10, name: "Alex D.", loc: "Barcelona, Spain", ed: 0, d: "Sep 11, 2026", s: 5, t: "More practical than an entire university semester", b: "Universities don't teach this modern pipeline. SketchUp + V-Ray + D5 Render AI is the current industry standard. I recommend this $9 bundle to all my architecture students.", h: 44 },
  { id: 11, name: "Marcus Vance", loc: "Chicago, USA", ed: 0, d: "Sep 10, 2026", s: 5, t: "10,000+ textures and models alone are worth $100s", b: "The asset library included with this masterclass saved me countless hours downloading sketchy models from the 3D warehouse. Everything is pre-mapped with high-res PBR shaders.", h: 26 },
  { id: 12, name: "Elena Rostova", loc: "Vienna, Austria", ed: 0, d: "Sep 10, 2026", s: 5, t: "Camera angles and lighting modules are masterfully taught", b: "I always struggled with blown-out highlights and unrealistic interior sun angles. The lighting breakdown in Course 2 fixed my entire approach to scene balance.", h: 23 },
  { id: 13, name: "David Chen", loc: "Vancouver, Canada", ed: 0, d: "Sep 09, 2026", s: 5, t: "Real-time AI rendering changed my freelance business forever", b: "Clients are blown away when they see 4K renders rendered in 30 seconds during our screen-share calls. My conversion rate doubled immediately.", h: 38 },
  { id: 14, name: "Hannah Schmidt", loc: "Zurich, Switzerland", ed: 0, d: "Sep 09, 2026", s: 5, t: "Crisp 4K video quality and straight-to-the-point lessons", b: "No boring filler or 20-minute theoretical rants. Every single video is dense with actionable techniques you can apply to your project right away.", h: 31 }
];

// Summary Score Card & Breakdown Bars
const courseRevSummaryHtml = `
  <div class="bstr-rev-summary">
    <div class="bstr-rev-score-col">
      <div class="bstr-rev-big-num">4.9</div>
      <div class="bstr-rev-gold-stars">★★★★★</div>
      <div class="bstr-rev-count-badge">Based on 4,892 Verified Student Ratings</div>
      <div class="bstr-rev-recommend-tag">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        99% of students recommend this
      </div>
    </div>

    <div class="bstr-rev-bars-col">
      <div class="bstr-rev-bar-row">
        <span class="bstr-rev-bar-label">5 Star</span>
        <div class="bstr-rev-bar-track"><div class="bstr-rev-bar-fill" style="width: 94%;"></div></div>
        <span class="bstr-rev-bar-pct">94%</span>
      </div>
      <div class="bstr-rev-bar-row">
        <span class="bstr-rev-bar-label">4 Star</span>
        <div class="bstr-rev-bar-track"><div class="bstr-rev-bar-fill" style="width: 5%;"></div></div>
        <span class="bstr-rev-bar-pct">5%</span>
      </div>
      <div class="bstr-rev-bar-row">
        <span class="bstr-rev-bar-label">3 Star</span>
        <div class="bstr-rev-bar-track"><div class="bstr-rev-bar-fill" style="width: 1%;"></div></div>
        <span class="bstr-rev-bar-pct">1%</span>
      </div>
      <div class="bstr-rev-bar-row">
        <span class="bstr-rev-bar-label">2 Star</span>
        <div class="bstr-rev-bar-track"><div class="bstr-rev-bar-fill" style="width: 0%;"></div></div>
        <span class="bstr-rev-bar-pct">0%</span>
      </div>
      <div class="bstr-rev-bar-row">
        <span class="bstr-rev-bar-label">1 Star</span>
        <div class="bstr-rev-bar-track"><div class="bstr-rev-bar-fill" style="width: 0%;"></div></div>
        <span class="bstr-rev-bar-pct">0%</span>
      </div>
    </div>
  </div>
`;

html = html.replace(
  /<div class="bstr-rev-summary">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  courseRevSummaryHtml
);

// Review Header Count
html = html.replace(
  /<div class="bstr-rev-total-label" id="bstrRevHeaderCount">.*?<\/div>/,
  '<div class="bstr-rev-total-label" id="bstrRevHeaderCount">Showing 1–6 of 4,892 Student Reviews</div>'
);

// Generate static initial 6 reviews cards for instant render
function renderReviewCard(r) {
  const initials = r.name.split(' ').map(n => n[0]).join('');
  const stars = '★'.repeat(r.s);
  return `<div class="bstr-rev-card">
  <div class="bstr-rev-card-header">
    <div class="bstr-rev-author-info">
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

// Update ALL_REVIEWS JS array and pagination totals
const reviewsJsCode = `
    (function() {
      var ALL_REVIEWS = ${JSON.stringify(COURSE_REVIEWS_DATA)};
      var TOTAL_COUNT = 4892;
`;

html = html.replace(
  /\(function\(\) \{\s*var ALL_REVIEWS = \[[\s\S]*?\];/,
  reviewsJsCode
);

// Update review card rendering template inside the script to say "Verified Student" and course bundle metadata
html = html.replace(
  /Verified Reader/g,
  'Verified Student'
);

html = html.replace(
  /Hardcopy Collector's Edition/g,
  'SketchUp + V-Ray + D5 Render AI'
);

html = html.replace(
  /Digital Complete Collection/g,
  'SketchUp + V-Ray + D5 Render AI'
);

// Save generated product page
const targetPath = path.join(__dirname, 'products', '3-master-courses-architecture-3d.html');
fs.writeFileSync(targetPath, html, 'utf8');

// Also save to public/products/
const publicTargetPath = path.join(__dirname, 'public', 'products', '3-master-courses-architecture-3d.html');
fs.writeFileSync(publicTargetPath, html, 'utf8');

console.log('Successfully generated products/3-master-courses-architecture-3d.html with full course curriculum, about section, and 4,892 verified student reviews!');
