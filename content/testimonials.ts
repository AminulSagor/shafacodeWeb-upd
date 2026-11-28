export type TextTestimonial = {
  quote: string;
  name: string;
  role: string;
  photo: string;
};

export type VideoStory = {
  quote: string;
  name: string;
  role: string;
  poster: { src: string; alt: string };
  duration: string;
  youtubeId?: string;
};

/** Placeholder quotes from the design: confirm names, photos and permission before launch. */
export const textTestimonials: TextTestimonial[] = [
  {
    quote:
      "The team at ShafaCode didn't just write code; they understood our business goals. Their product-minded approach saved us months of development time.",
    name: 'Mark Sullivan',
    role: 'CTO, TechStream',
    photo: '/images/people/mark-sullivan.jpg',
  },
  {
    quote: "ShafaCode's expertise in both software and IoT hardware was the key to our project's success.",
    name: 'Sarah Chen',
    role: 'Founder, GreenLog',
    photo: '/images/people/sarah-chen.jpg',
  },
  {
    quote:
      'A truly elite engineering partner. They build scalable solutions and communicate like part of our own team.',
    name: 'James Miller',
    role: 'Head of Product, Varko',
    photo: '/images/people/james-miller.jpg',
  },
];

export const videoStories: VideoStory[] = [
  {
    quote: 'Their engineering rigor is unmatched. We saw a 40% increase in system efficiency.',
    name: 'Fahad Ahmed',
    role: 'Founder, Italir Pothe',
    poster: { src: '/images/stories/fahad-ahmed.jpg', alt: 'Fahad Ahmed smiling at his desk in a bright office' },
    duration: '2:14',
  },
  {
    quote: 'They shipped our live-score app fast, and it held up on match day.',
    name: 'Jahid',
    role: 'Founder, Kickscore',
    poster: { src: '/images/stories/jahid.jpg', alt: 'Jahid holding a phone with the Kickscore app on a football pitch' },
    duration: '1:48',
  },
  {
    quote: 'The transformation of our platform was radical. ShafaCode delivered a competitive advantage.',
    name: 'Anna Kar',
    role: 'Founder, BrandGuru',
    poster: { src: '/images/stories/anna-kar.jpg', alt: 'Anna Kar talking in a colourful design studio' },
    duration: '2:02',
  },
];

export const clientNames = ['MeghSwar', 'Chorki', 'Texas Airway', 'Tri Gardening', 'Kickscore', 'BrandGuru', 'GreenLog'];
