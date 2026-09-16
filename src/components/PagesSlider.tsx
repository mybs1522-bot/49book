import React, { useState } from 'react';
import { X } from 'lucide-react';

export const PAGE_PREVIEWS = [
  { id: 1, src: '/images/page-previews/1_Zirolashope -The Crucial Guide To Residential Space Planning-77.pdf.jpg', title: 'Living Room Clearances & Layouts' },
  { id: 2, src: '/images/page-previews/2_Zirolashope -The Crucial Guide To Residential Space Planning-88.pdf.jpg', title: 'Standard Room Dimensions' },
  { id: 3, src: '/images/page-previews/3_Zirolashope -The Crucial Guide To Residential Space Planning-39.pdf.jpg', title: 'Kitchen Triangle & Work Zones' },
  { id: 4, src: '/images/page-previews/4_Zirolashope -The Crucial Guide To Residential Space Planning-43.pdf.jpg', title: 'Cabinet Clearances & Heights' },
  { id: 5, src: '/images/page-previews/5_Zirolashope -The Crucial Guide To Residential Space Planning-76.pdf.jpg', title: 'Bedroom Circulation Zones' },
  { id: 6, src: '/images/page-previews/6_Zirolashope -The Crucial Guide To Residential Space Planning-80.pdf.jpg', title: 'Walk-in Closet Layout Rules' },
  { id: 7, src: '/images/page-previews/7_Zirolashope -The Crucial Guide To Residential Space Planning-125.pdf.jpg', title: 'Bathroom Layout & Clearances' },
  { id: 8, src: '/images/page-previews/8_Zirolashope -The Crucial Guide To Residential Space Planning-44.pdf.jpg', title: 'Shower & Fixture Specs' },
  { id: 9, src: '/images/page-previews/9_Zirolashope -The Crucial Guide To Residential Space Planning-65.pdf.jpg', title: 'Ergonomic Desk & Study Setup' },
  { id: 10, src: '/images/page-previews/10_Zirolashope -The Crucial Guide To Residential Space Planning-83.pdf.jpg', title: 'Electrical & Lighting Mapping' },
  { id: 11, src: '/images/page-previews/11_Zirolashope -The Crucial Guide To Residential Space Planning-45.pdf.jpg', title: 'Sunpath & Natural Lighting' },
  { id: 12, src: '/images/page-previews/12_Zirolashope -The Crucial Guide To Residential Space Planning-103.pdf.jpg', title: 'Passive Cooling & Airflow' },
  { id: 13, src: '/images/page-previews/13_Zirolashope -The Crucial Guide To Residential Space Planning-49.pdf.jpg', title: 'Elevations & Facade Rules' },
];

export const PagesSlider: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null);

  return (
    <div
      className="mb-2.5 sm:mb-4 rounded-xl sm:rounded-2xl border border-gray-200/90 shadow-sm bg-[#fdfdfc] p-2 sm:p-3.5 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)`,
        backgroundSize: '22px 22px'
      }}
    >
      <style>{`
        @keyframes pageMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-pages-marquee {
          display: flex;
          width: max-content;
          animation: pageMarquee 26s linear infinite;
        }
        .animate-pages-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header: Just "Inside Books" */}
      <div className="text-center mb-1.5 sm:mb-2.5">
        <span className="text-[11px] sm:text-sm font-extrabold text-gray-900 tracking-tight uppercase">
          Inside Books
        </span>
      </div>

      {/* Infinite Autoscrolling Track */}
      <div className="overflow-hidden relative w-full py-0.5">
        {/* Subtle edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#fdfdfc] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#fdfdfc] to-transparent z-10 pointer-events-none" />

        <div className="animate-pages-marquee gap-2 sm:gap-2.5 items-center">
          {[...PAGE_PREVIEWS, ...PAGE_PREVIEWS].map((page, idx) => (
            <div
              key={`${page.id}-${idx}`}
              onClick={() => setSelectedImage({ src: page.src, title: page.title })}
              className="shrink-0 w-[74px] sm:w-[96px] aspect-[1/1.41] bg-white rounded-lg border border-gray-200/90 shadow-sm hover:shadow-md hover:border-orange-400 hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <img
                src={page.src}
                alt={page.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-2 pb-1 border-b border-gray-100">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                {selectedImage.title}
              </h4>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Close Preview"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-2 max-h-[75vh] overflow-y-auto flex items-center justify-center bg-gray-50 rounded-xl">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
