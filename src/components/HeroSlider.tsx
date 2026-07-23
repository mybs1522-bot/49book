import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'mistakes',
    src: '/images/hero-mistakes-grid.jpg',
    alt: 'Small Mistakes, Big Problems - Get It Right! Graphical Interior Design Guide',
    title: 'Small Mistakes, Big Problems'
  },
  {
    id: 'measurements',
    src: '/images/hero-standard-measurements.jpg',
    alt: 'Standard Measurements for Kitchen, Living Room, Bedroom & Washroom',
    title: 'Standard Measurements'
  },
  {
    id: 'planning',
    src: '/images/hero-how-to-plan.jpg',
    alt: 'How to Plan - Smart Planning Tips for Every Space',
    title: 'Smart Planning Tips'
  }
];

export const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div 
      className="hero-scale-in w-full max-w-4xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden hero-book-glow cursor-pointer group bg-white shadow-xl">
        {/* Subtle animated border accent */}
        <div className="absolute inset-0 rounded-2xl md:rounded-3xl z-20 pointer-events-none" style={{ border: '1px solid rgba(251,146,60,0.2)' }} />
        
        {/* Slides container */}
        <div className="relative w-full overflow-hidden">
          {/* Invisible sizing image to maintain natural height */}
          <img
            src={HERO_SLIDES[0].src}
            alt="Hero Sizing"
            className="w-full h-auto opacity-0 pointer-events-none block"
            aria-hidden="true"
          />

          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95 pointer-events-none'
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-sm opacity-90 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-sm opacity-90 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0"
        >
          <ChevronRight size={22} />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              title={slide.title}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex ? 'w-7 h-2 bg-orange-500' : 'w-2 h-2 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
