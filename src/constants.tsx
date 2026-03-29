import React from 'react';
import { Course, Feature, Testimonial, FaqItem, PricingPlan } from './types';
import { Download, BookOpen, Infinity, LifeBuoy, Users } from 'lucide-react';

/* 
  -----------------------------------------------------------------------
  DATA SOURCE: INTERIOR DESIGN BOOKS
  -----------------------------------------------------------------------
*/

const getDriveUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;

const RAW_BOOKS: Course[] = [
  {
    id: '1',
    title: 'Living Room Design Book',
    software: '145 Pages',
    description: 'The heart of the home is usually the most cluttered. I teach you how to create conversation circles, master rug sizing, and lighting layers that actually work.',
    imageUrl: getDriveUrl('1YYJxA6NPSH23Oe3Nal_3QlW_DG0-mqKJ'),
    color: 'from-orange-400 to-amber-300',
    students: '12.5k',
    learningPoints: [
      'The "Rug Rule" 90% of people break',
      'Lighting layering for mood vs. function',
      'Selecting the perfect sofa scale'
    ],
    workflowImpact: 'Stop making living rooms that look like furniture showrooms. Make them liveable.'
  },
  {
    id: '2',
    title: 'Kitchen Design Book',
    software: '180 Pages',
    description: 'Function meets envy. We go deep on the "Working Triangle," cabinet finishes that don\'t date, and island dimensions that allow flow.',
    imageUrl: getDriveUrl('1AlxdHun9I2AO639g4Q0YJv_BOzb9sbZe'),
    color: 'from-slate-600 to-slate-400',
    students: '10.2k',
    learningPoints: [
      'The Golden Triangle rule explained',
      'Materials that survive red wine spills',
      'Hidden storage hacks for small spaces'
    ],
    workflowImpact: 'Design kitchens that people actually want to cook in, not just look at.'
  },
  {
    id: '3',
    title: 'Bedroom Design Book',
    software: '120 Pages',
    description: 'Your sanctuary. I show you how to use texture and color psychology to lower heart rates. It\'s not just a bed in a room; it\'s a retreat.',
    imageUrl: getDriveUrl('12APuUeW_CUcJxCYDG-R0PhmtwpKmWqs8'),
    color: 'from-stone-500 to-stone-400',
    students: '15k',
    learningPoints: [
      'Color psychology for deep sleep',
      'Bedding textures that feel expensive',
      'Blackout solutions that look chic'
    ],
    workflowImpact: 'Create spaces where your clients (or you) can actually disconnect from the world.'
  },
  {
    id: '4',
    title: 'Washroom Design Book',
    software: '95 Pages',
    description: 'Yes, bathrooms matter. Stop treating them like utility closets. We cover tile transitions, vanity lighting, and how to make 40sqft feel like a spa.',
    imageUrl: getDriveUrl('17CCyJ7HJhtPg3XPS8y9wf7SOG_kVMgf8'),
    color: 'from-teal-500 to-emerald-400',
    students: '9.8k',
    learningPoints: [
      'Tile layouts that expand space',
      'The science of flattering vanity lighting',
      'Fixture mixing: Brass vs. Chrome'
    ],
    workflowImpact: 'Turn the most expensive room per sqft into the most impressive one.'
  },
  {
    id: '5',
    title: 'Study Design Book',
    software: '110 Pages',
    description: 'Work from home is here to stay. Learn to design ergonomic, distraction-free zones that look good on a Zoom call.',
    imageUrl: getDriveUrl('1dzA2UnKUd_S37XMjh53ZiuhviZAivH1B'),
    color: 'from-blue-900 to-blue-700',
    students: '11k',
    learningPoints: [
      'Video-call background styling',
      'Ergonomics without the ugly chair',
      'Cable management mastery'
    ],
    workflowImpact: 'Productivity is designed. Build spaces that encourage deep work.'
  },
  {
    id: '6',
    title: 'Elevations Design Book',
    software: '160 Pages',
    description: 'Curb appeal is the first impression. We talk paint palettes, landscaping integration, and front door theory.',
    imageUrl: getDriveUrl('1_TGYyThr32ciEl7C7obqHnwq1_WOR8N2'),
    color: 'from-green-600 to-lime-500',
    students: '8.5k',
    learningPoints: [
      'Choosing exterior paint that lasts',
      'Lighting the path: Safety vs. Style',
      'Entryway styling that welcomes'
    ],
    workflowImpact: 'Increase property value before anyone even steps inside the house.'
  }
];

export const COURSES = RAW_BOOKS;

export const ROWS = [
  {
    title: "Social Spaces",
    courses: [
      COURSES.find(c => c.id === '1')!,
      COURSES.find(c => c.id === '2')!,
      COURSES.find(c => c.id === '6')!
    ]
  },
  {
    title: "Private Sanctuaries",
    courses: [
      COURSES.find(c => c.id === '3')!,
      COURSES.find(c => c.id === '4')!,
      COURSES.find(c => c.id === '5')!
    ]
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'lifetime-basic',
    duration: 'The Digital Collection',
    period: 'One-time payment',
    price: '$49',
    originalPrice: '$199',
    label: 'BEST SELLER',
    features: ['All 6 eBooks (PDF)', 'Mobile Optimized', 'High-Res Image Bank', 'Instant Download', 'Lifetime Updates'],
    accentColor: 'border-brand-success shadow-glow-success'
  }
];

export const FEATURES: Feature[] = [
  {
    icon: <Download className="w-8 h-8" />,
    title: 'Instant PDF Download',
    description: 'Get the files immediately after purchase. No shipping, no waiting.',
  },
  {
    icon: <Infinity className="w-8 h-8" />,
    title: 'Lifetime Updates',
    description: 'If I update a chapter or add a trend, you get the new file for free.',
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: '800+ Pages',
    description: 'Zero fluff. Just actionable design theory, dimensions, and guides.',
  },
  {
    icon: <LifeBuoy className="w-8 h-8" />,
    title: 'Design Support',
    description: 'Reply to your purchase email with questions. I actually answer.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Reader Community',
    description: 'Join 50k+ other designers in our monthly newsletter.',
  }
];

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Sarah Miller', role: 'Homeowner', location: 'Austin, TX', verified: true, content: 'I redesigned our entire home using just these books. The living room layout principles alone saved me from buying furniture that would have been completely wrong for the space.' },
  { name: 'Michael Chen', role: 'Architecture Student', location: 'London, UK', verified: true, content: 'My professors taught theory. These books taught me how to actually design liveable spaces. Aced my final thesis and landed my first internship.' },
  { name: 'Emma Wilson', role: 'Real Estate Developer', location: 'Toronto, Canada', verified: true, content: 'We use the 6-book system to stage every model home. Buyer conversion rate is up 60% since we started applying these principles.' },
  { name: 'David Smith', role: 'DIY Enthusiast', location: 'Sydney, Australia', verified: true, content: 'The step-by-step guides for kitchen layouts are incredible. I saved $15k doing it myself instead of hiring a designer.' },
  { name: 'Olivia Garcia', role: 'Interior Designer', location: 'Madrid, Spain', verified: true, content: 'Even as a pro, I keep these books as a reference. The clearance charts are the most comprehensive I have ever found.' },
  { name: 'James Taylor', role: 'Homeowner', location: 'Seattle, WA', verified: true, content: 'Fixed my bedroom lighting and flow. It feels like a luxury hotel now. Best $49 I have ever spent.' },
  { name: 'Sophia Brown', role: 'Renovator', location: 'Berlin, Germany', verified: true, content: 'Transformed a cramped bathroom into a spa-like retreat using the Book 4 layout rules. Truly life-changing.' },
  { name: 'Lucas Martinez', role: 'Architecture Student', location: 'Mexico City', verified: true, content: 'The elevations and sunpath chapters helped me understand climate-responsive design better than my textbooks.' },
  { name: 'Isabella Lee', role: 'Real Estate Agent', location: 'New York, NY', verified: true, content: 'I recommend these books to all my clients who want to increase their property value before selling. It works every time.' },
  { name: 'William Jones', role: 'Homeowner', location: 'Vancouver, Canada', verified: true, content: 'The study and home office design guide changed how I work. No more neck pain, and the background looks professional.' },
  { name: 'Charlotte Davis', role: 'Interior Designer', location: 'Paris, France', verified: true, content: 'Elegant, practical, and systematic. This approach to design should be the industry standard.' },
  { name: 'Benjamin White', role: 'Homebuilder', location: 'Chicago, IL', verified: true, content: 'We give these books to all our new homeowners. It helps them make better decisions during the build process.' },
  { name: 'Mia Thompson', role: 'Student', location: 'Singapore', verified: true, content: 'Practical knowledge that textbooks skip. I feel much more confident entering the workforce now.' },
  { name: 'Alexander Clark', role: 'Homeowner', location: 'Melbourne, Australia', verified: true, content: 'Finally understood the "why" behind design. My home finally feels cohesive and balanced.' },
  { name: 'Amelia Lewis', role: 'DIY Renovator', location: 'Denver, CO', verified: true, content: 'The material selection guides saved me from making several expensive mistakes at the tile shop.' },
  { name: 'Daniel Walker', role: 'Architecture Junior', location: 'Dublin, Ireland', verified: true, content: 'The drainage and electrical mapping in the services chapter is worth the price alone.' },
  { name: 'Ava Hall', role: 'Homeowner', location: 'San Francisco, CA', verified: true, content: 'I was overwhelmed by our renovation. These books gave me a clear 9-phase system to follow.' },
  { name: 'Henry Allen', role: 'Real Estate Developer', location: 'Dubai, UAE', verified: true, content: 'Standardizing our layouts across projects using these principles has streamlined our entire design-build workflow.' },
  { name: 'Emily Young', role: 'Student', location: 'Auckland, NZ', verified: true, content: 'The sketches and diagrams make complex architectural concepts so easy to understand.' },
  { name: 'Sebastian King', role: 'Homeowner', location: 'Cape Town, SA', verified: true, content: 'Our living room went from feeling cluttered to feeling luxurious just by following the traffic flow rules.' }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Can't I just learn this from YouTube for free?",
    answer: "Sure, you can find scattered tips. But nobody teaches the complete system. These books give you 800+ pages of clearances, dimensions, materials, and layouts—all in one place. No more hunting through 50 videos to find one measurement."
  },
  {
    question: "Do I need a design background to understand this?",
    answer: "Not at all. These are written for complete beginners. Every concept has handmade diagrams, exact dimensions, and real examples. If you can read, you can use these."
  },
  {
    question: "Will this work for modern homes and apartments?",
    answer: "Yes. These cover standard home sizes, modern layouts, climate considerations, and space optimization for contemporary living. Whether you're in a 500 sqft apartment or a 3000 sqft house—it's all here."
  },
  {
    question: "What if the content gets outdated?",
    answer: "You get free lifetime updates. When we add new content or update dimensions, you get the new version at no extra cost. Buy once, benefit forever."
  },
  {
    question: "Can I use this for client projects?",
    answer: "Absolutely. Architecture students, developers, and design consultants use these as their reference library. The clearance charts and dimension guides work for both residential and commercial projects."
  }
];

/* 
  -----------------------------------------------------------------------
  INTERIOR DESIGN SYSTEM DATA
  -----------------------------------------------------------------------
*/

export interface Module {
  id: string;
  title: string;
  description: string;
  items: string[];
  icon: string;
}

export const INDUSTRIES = [
  { label: 'Homeowners', icon: 'Home' },
  { label: 'Architecture Students', icon: 'BookOpen' },
  { label: 'Interior Designers', icon: 'Palette' },
  { label: 'Real Estate Developers', icon: 'Building' },
  { label: 'Renovators', icon: 'Hammer' },
  { label: 'DIY Enthusiasts', icon: 'Wrench' }
];

export const MODULES: Module[] = [
  {
    id: 'living-room',
    title: 'Living Room Design',
    description: 'Master conversation circles, rug sizing, lighting layers, and storage solutions that make living rooms actually liveable.',
    items: ['Clearances & Flow', 'Furniture Layout', 'Lighting Design'],
    icon: 'Sofa'
  },
  {
    id: 'kitchen',
    title: 'Kitchen Engineering',
    description: 'The working triangle, cabinet science, pantry planning, and countertop dimensions that make kitchens functional.',
    items: ['Working Triangle', 'Cabinet Planning', 'Storage Systems'],
    icon: 'ChefHat'
  },
  {
    id: 'bedroom',
    title: 'Bedroom Sanctuary',
    description: 'Color psychology for sleep, Vastu & Feng Shui principles, closet design, and circulation planning.',
    items: ['Sleep Psychology', 'Vastu Principles', 'Closet Design'],
    icon: 'Bed'
  },
  {
    id: 'washroom',
    title: 'Washroom Transformation',
    description: 'Tile layouts, vanity lighting, drainage planning, and making 40 sqft feel like a luxury spa.',
    items: ['Tile Planning', 'Fixture Placement', 'Ventilation'],
    icon: 'Bath'
  },
  {
    id: 'study',
    title: 'Study & Home Office',
    description: 'Ergonomic desk setups, video-call backgrounds, acoustics, and productivity-driven design.',
    items: ['Ergonomics', 'Cable Management', 'Lighting for Focus'],
    icon: 'Layers'
  },
  {
    id: 'elevations',
    title: 'Exterior & Elevations',
    description: 'Curb appeal, sun path analysis, wind patterns, and climate-responsive architecture.',
    items: ['Sun Path', 'Wind Analysis', 'Material Selection'],
    icon: 'Map'
  }
];

export const BUSINESS_MODULES = [
  {
    title: 'Redesign Your Home',
    description: 'Apply professional design principles to transform every room. Clearances, layouts, and materials explained step-by-step.',
    icon: 'Home'
  },
  {
    title: 'Start a Design Practice',
    description: 'Use these frameworks as your reference library. Serve clients with confidence using tried-and-tested design systems.',
    icon: 'Briefcase'
  },
  {
    title: 'Ace Your Projects',
    description: 'Architecture and design students — use the practical knowledge, dimension charts, and real examples to excel.',
    icon: 'GraduationCap'
  },
  {
    title: 'Stage & Sell Properties',
    description: 'Real estate developers — use design principles to stage model flats that convert browsers into buyers.',
    icon: 'TrendingUp'
  }
];