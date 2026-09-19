export interface Course {
  id: string;
  title: string;
  software: string;
  description: string;
  imageUrl: string;
  color: string;
  students: string;
  price: number;
  originalPrice: number;
  learningPoints: string[];
  workflowImpact: string;
}

export interface Testimonial {
  name: string;
  role: string;
  location: string;
  content: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

const RAW_COURSES: Course[] = [
  {
    id: '5',
    title: 'V-Ray Photorealism',
    software: 'V-Ray',
    description: 'Turn your SketchUp models into magazine-quality photorealistic images that close deals.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8',
    color: 'from-blue-600 to-indigo-500',
    students: '48k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'Master realistic sunlight, night lighting & shadows',
      'Create materials that look like real wood, glass & stone',
      'Produce beauty shots that sell $5,000 projects'
    ],
    workflowImpact: 'Sell your design before it exists.'
  },
  {
    id: '1',
    title: 'AutoCAD Mastery',
    software: 'AutoCAD',
    description: 'Draw accurate 2D floor plans for houses and buildings.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1fV5bz4JDugh8HxLMJ0fXu5K5sDj3qlSR',
    color: 'from-red-500 to-red-400',
    students: '42.5k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'Draw floor plans and furniture layouts easily',
      'Print your drawings to scale for construction',
      'Use shortcuts to draw 10x faster than others'
    ],
    workflowImpact: 'Create professional blueprints that contractors can actually build from.'
  },
  {
    id: '2',
    title: 'BIM with Revit',
    software: 'Revit',
    description: 'Build smart 3D buildings on your computer.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1N_BbG9kAEwIk541Id53_RV0CWjO1jzAt',
    color: 'from-red-600 to-red-500',
    students: '38k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'Create 3D buildings with automatic floor plans',
      'Calculate how many bricks and windows you need',
      'Work on big projects with other team members'
    ],
    workflowImpact: 'Save days of work. The software does it for you.'
  },
  {
    id: '3',
    title: 'SketchUp Pro',
    software: 'SketchUp',
    description: 'Build complete 3D interiors from scratch — the foundation of every great render.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo',
    color: 'from-blue-500 to-cyan-400',
    students: '55k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'Build 3D rooms, kitchens & full homes from a blank canvas',
      'Apply realistic textures, furniture & materials',
      'Export scenes ready for V-Ray & D5 Render'
    ],
    workflowImpact: 'Model their dream kitchen or bedroom in just minutes.'
  },
  {
    id: '4',
    title: '3ds Max Advanced',
    software: '3ds Max',
    description: 'Design fancy furniture and luxury interiors.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1DgmIvkeC2dxGpRpzbIthHQsSdlCty2Xg',
    color: 'from-cyan-600 to-blue-500',
    students: '22k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'Model complex shapes like twisted towers',
      'Create soft fabrics, pillows, and blankets',
      'Design high-end luxury interior spaces'
    ],
    workflowImpact: 'Charge more for premium, high-detail luxury designs.'
  },
  {
    id: '6',
    title: 'Lumion Cinematic',
    software: 'Lumion',
    description: 'Make movies of your architecture.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1XW2DDHVa1Qc15NcZ3wUKMFRT7LkyZMCt',
    color: 'from-teal-500 to-emerald-400',
    students: '31k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'Add grass, trees, and water instantly',
      'Make people walk and cars drive in your scene',
      'Create a video tour of the house'
    ],
    workflowImpact: 'A 1-minute video sells a house better than 100 drawings.'
  },
  {
    id: '7',
    title: 'D5 Render AI',
    software: 'D5 Render',
    description: 'AI-powered real-time rendering. See changes instantly. Generate 4K images in seconds.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr',
    color: 'from-purple-500 to-pink-500',
    students: '19k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'Real-time AI rendering — see changes as you make them',
      'AI-assisted lighting, materials & scene composition',
      'Generate cinematic 4K images & video walkthroughs in seconds'
    ],
    workflowImpact: 'Make live design changes while the client watches.'
  },
  {
    id: '8',
    title: 'Enscape VR',
    software: 'Enscape',
    description: 'Walk inside your design using VR.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1SmezP6LwT3yo9aE3oivpGkqS-xycSOyx',
    color: 'from-blue-500 to-indigo-600',
    students: '25k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'One-click to start walking inside your model',
      'Send a web link so clients can walk around too',
      'Use Virtual Reality (VR) to impress'
    ],
    workflowImpact: 'Spot mistakes before construction starts.'
  },
  {
    id: '9',
    title: 'AI Architecture',
    software: 'Midjourney',
    description: 'Get 100 design ideas in 1 minute with AI.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1s-HzZVKpc9F92mLW2gMOPk0kVrKAqUIS',
    color: 'from-fuchsia-600 to-purple-600',
    students: '60k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'How to write text to get amazing house images',
      'Create mood boards for clients instantly',
      'Combine different styles (e.g., Classic + Modern)'
    ],
    workflowImpact: 'Never run out of ideas.'
  },
  {
    id: '10',
    title: 'Generative Design',
    software: 'Stable Diffusion',
    description: 'Turn a rough sketch into a realistic building using AI.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1xSzSjuL4imlbXwEYMwKw_vhuueDcFtHm',
    color: 'from-indigo-500 to-purple-500',
    students: '15k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'Turn hand sketches into realistic renders',
      'Change specific parts of an image with AI',
      'Install AI tools on your own computer'
    ],
    workflowImpact: 'Show a client a realistic picture during the first meeting.'
  },
  {
    id: '11',
    title: 'Unreal Engine 5',
    software: 'Unreal Engine',
    description: 'Make your design look like a high-end video game.',
    imageUrl: 'https://lh3.googleusercontent.com/d/14EfKoC7BfxXmYxd6t6qIE470yQaX0toW',
    color: 'from-gray-600 to-gray-400',
    students: '18k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'Create interactive lights and doors',
      'Make realistic fire, water, and wind',
      'Package your design as a playable game'
    ],
    workflowImpact: 'Give clients a controller and let them play inside their future home.'
  },
  {
    id: '12',
    title: 'Post Production',
    software: 'Photoshop',
    description: 'Add real sky, birds, and people to your renders.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1FkzIhdu7K5JeRFq7BM1wGV5MND_fLMKe',
    color: 'from-blue-800 to-blue-600',
    students: '72k',
    price: 9,
    originalPrice: 49,
    learningPoints: [
      'Fix lighting and colors easily',
      'Add realistic people and trees',
      'Make your portfolio look professional'
    ],
    workflowImpact: 'Make average renders look like award-winning photography.'
  }
];

export const COURSES: Course[] = RAW_COURSES;

// ─── FRONT-END OFFER: SketchUp + V-Ray + D5 Render ───
export const FRONT_END_IDS = ['3', '5', '7'];
export const FRONT_END_COURSES = FRONT_END_IDS.map(id => COURSES.find(c => c.id === id)!);

// ─── UPSELL: Everything else (12 Courses Master Suite) ───
export const UPSELL_COURSES = COURSES.filter(c => !FRONT_END_IDS.includes(c.id));

export const FRONT_END_PRICE = 9;
export const FRONT_END_ORIGINAL_PRICE = 29;
export const UPSELL_PRICE = 27;
export const UPSELL_ORIGINAL_PRICE = 199;
export const UPSELL2_PRICE = 36;
export const UPSELL2_ORIGINAL_PRICE = 99;
export const DOWNSELL_BOOKS_PRICE = 12;

export const BUNDLE_PRICE = FRONT_END_PRICE;
export const BUNDLE_ORIGINAL_PRICE = FRONT_END_ORIGINAL_PRICE;
export const AUTOCAD_ADDON_PRICE = 9;
export const AUTOCAD_ADDON_ORIGINAL_PRICE = 29;

export const RAW_BOOKS = [
  {
    id: 'b1',
    title: 'Living Room Design Book',
    software: '145 Pages',
    description: 'Conversation circles, rug sizing, and lighting layers that actually work.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1YYJxA6NPSH23Oe3Nal_3QlW_DG0-mqKJ',
    learningPoints: ['The "Rug Rule" 90% of people break', 'Lighting layering for mood vs function', 'Selecting the perfect sofa scale'],
    workflowImpact: 'Stop making living rooms that look like showrooms. Make them liveable.'
  },
  {
    id: 'b2',
    title: 'Kitchen Design Book',
    software: '180 Pages',
    description: 'Working Triangle, cabinet finishes that don\'t date, and island dimensions.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1AlxdHun9I2AO639g4Q0YJv_BOzb9sbZe',
    learningPoints: ['The Golden Triangle rule explained', 'Materials that survive spills', 'Hidden storage hacks for small spaces'],
    workflowImpact: 'Design kitchens people love to cook in.'
  },
  {
    id: 'b3',
    title: 'Bedroom Design Book',
    software: '120 Pages',
    description: 'Texture and color psychology to lower heart rates. Complete sanctuary layout.',
    imageUrl: 'https://lh3.googleusercontent.com/d/12APuUeW_CUcJxCYDG-R0PhmtwpKmWqs8',
    learningPoints: ['Color psychology for deep sleep', 'Bedding textures that feel expensive', 'Blackout solutions that look chic'],
    workflowImpact: 'Create spaces where clients can truly disconnect.'
  },
  {
    id: 'b4',
    title: 'Washroom Design Book',
    software: '95 Pages',
    description: 'Tile transitions, vanity lighting, and making 40sqft feel like a luxury spa.',
    imageUrl: 'https://lh3.googleusercontent.com/d/17CCyJ7HJhtPg3XPS8y9wf7SOG_kVMgf8',
    learningPoints: ['Tile layouts that expand space', 'Flattering vanity lighting', 'Fixture mixing: Brass vs Chrome'],
    workflowImpact: 'Turn the most expensive room per sqft into the most impressive.'
  },
  {
    id: 'b5',
    title: 'Study Design Book',
    software: '110 Pages',
    description: 'Ergonomic, distraction-free home office zones designed for high focus.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1dzA2UnKUd_S37XMjh53ZiuhviZAivH1B',
    learningPoints: ['Video-call background styling', 'Ergonomics without ugly chairs', 'Cable management mastery'],
    workflowImpact: 'Build spaces that encourage deep productive work.'
  },
  {
    id: 'b6',
    title: 'Elevations Design Book',
    software: '160 Pages',
    description: 'Exterior curb appeal, paint palettes, landscaping integration, and front doors.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1_TGYyThr32ciEl7C7obqHnwq1_WOR8N2',
    learningPoints: ['Choosing exterior paint that lasts', 'Exterior lighting: Safety vs Style', 'Welcoming entryway styling'],
    workflowImpact: 'Increase property value before anyone even steps inside.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'James Carter',
    role: 'Senior Architect',
    location: 'New York, USA',
    content: 'Having SketchUp, V-Ray and D5 Render in one bundle changed how our entire studio works. We model, render, and present — all from this $9 course.'
  },
  {
    name: 'Sophie Laurent',
    role: '3D Visualizer',
    location: 'London, UK',
    content: 'The SketchUp-to-V-Ray pipeline is so well taught. D5 Render AI lets me do real-time walkthroughs in client meetings. My close rate doubled.'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Freelance Designer',
    location: 'Los Angeles, USA',
    content: 'I went from flat 2D drawings to photorealistic V-Ray renders in 2 weeks. Built my entire freelance portfolio from these 3 courses. Now I charge 3x more.'
  },
  {
    name: 'Daniel Chen',
    role: 'Architecture Student',
    location: 'Toronto, Canada',
    content: 'SketchUp + V-Ray + D5 Render AI — this pipeline is what firms actually use. I was the only student who knew all three. Landed my dream internship immediately.'
  },
  {
    name: 'Olivia Brooks',
    role: 'Interior Designer',
    location: 'Sydney, Australia',
    content: 'I can model a room in SketchUp, render it in V-Ray, and show 10 variations in D5 — all in the time it used to take for one basic drawing. Best $9 ever.'
  },
  {
    name: 'Marco Rossi',
    role: 'Landscape Architect',
    location: 'Milan, Italy',
    content: 'D5 Render AI for real-time changes during meetings, V-Ray for portfolio-grade shots, SketchUp for the foundation. This bundle covers everything.'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What exactly do I get for $9?",
    answer: "You get 3 complete courses: SketchUp Pro (3D modeling), V-Ray Photorealism (beauty shots), and D5 Render AI (real-time AI rendering). Plus 10,000+ textures, 2,000+ 3D models, all software download links, certified diploma, and 24/7 team support. Lifetime access."
  },
  {
    question: "How do I access the courses after buying?",
    answer: "You'll receive instant access via email with direct download links and video stream access immediately after payment."
  },
  {
    question: "Are project files and models included?",
    answer: "Yes, all 3D models, textures, lighting setups, and source files used in tutorials are included for instant download."
  },
  {
    question: "Do I need to buy expensive software?",
    answer: "No. We provide links and setup instructions for official free, student, or trial versions of SketchUp, V-Ray, and D5 Render."
  },
  {
    question: "Do I receive a certificate?",
    answer: "Yes, industry-recognized certificates of completion are provided."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes, 100% money-back guarantee within 30 days if you're not satisfied. No questions asked."
  }
];
