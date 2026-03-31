import turmericImage from '../assets/products/turmeric-gold.avif'
import garamMasalaImage from '../assets/products/royal-garam-masala.webp'
import corianderImage from '../assets/products/coriander-crush.webp'
import chiliImage from '../assets/products/kashmiri-chili.avif'
import cuminImage from '../assets/products/roasted-cumin.avif'
import pepperImage from '../assets/products/black-pepper.avif'

export const initialProducts = [
  {
    id: 'turmeric-gold',
    name: 'Turmeric Gold',
    category: 'Essentials',
    price: 220,
    originalPrice: 260,
    size: '250 gm',
    rating: 4.8,
    reviews: 126,
    stock: 42,
    featured: true,
    badge: 'Best Seller',
    image: turmericImage,
    shortDescription: 'Curcumin-rich turmeric with bold color and earthy depth.',
    description:
      'Stone-ground turmeric sourced for color intensity, purity, and everyday wellness cooking. Ideal for curries, milk blends, and healthy meal prep.',
    benefits: ['High color strength', 'Fine texture', 'Fresh harvest aroma'],
  },
  {
    id: 'royal-garam-masala',
    name: 'Royal Garam Masala',
    category: 'Blends',
    price: 340,
    originalPrice: 390,
    size: '200 gm',
    rating: 4.9,
    reviews: 98,
    stock: 28,
    featured: true,
    badge: 'Chef Choice',
    image: garamMasalaImage,
    shortDescription: 'Layered signature blend for curries, gravies, and finishing.',
    description:
      'A premium garam masala crafted with warming whole spices and carefully balanced roasting for restaurant-style aroma at home.',
    benefits: ['Deep aroma', 'Balanced roast', 'Premium finishing blend'],
  },
  {
    id: 'coriander-crush',
    name: 'Coriander Crush',
    category: 'Essentials',
    price: 180,
    originalPrice: 210,
    size: '250 gm',
    rating: 4.7,
    reviews: 84,
    stock: 34,
    featured: false,
    badge: 'Fresh Batch',
    image: corianderImage,
    shortDescription: 'Fresh coriander powder with citrus warmth and clean finish.',
    description:
      'Ground from quality seeds to preserve the mild citrus top note and earthy body that works beautifully across vegetables, curries, and marinades.',
    benefits: ['Freshly milled', 'Bright aroma', 'All-purpose use'],
  },
  {
    id: 'kashmiri-chili',
    name: 'Kashmiri Chili',
    category: 'Heat & Color',
    price: 260,
    originalPrice: 295,
    size: '200 gm',
    rating: 4.8,
    reviews: 110,
    stock: 19,
    featured: true,
    badge: 'Color Rich',
    image: chiliImage,
    shortDescription: 'Vibrant red chili powder with rich color and gentle heat.',
    description:
      'Delivers beautiful color for gravies, tandoori marinades, and masala bases while keeping the spice level balanced for family cooking.',
    benefits: ['Natural red color', 'Gentle heat', 'Smooth blend quality'],
  },
  {
    id: 'roasted-cumin',
    name: 'Roasted Cumin',
    category: 'Roasted Range',
    price: 240,
    originalPrice: 275,
    size: '180 gm',
    rating: 4.6,
    reviews: 71,
    stock: 31,
    featured: false,
    badge: 'Roasted',
    image: cuminImage,
    shortDescription: 'Toasty cumin powder built for chaats, raitas, and curries.',
    description:
      'Carefully roasted for a nutty, smoky note that lifts snacks, dals, yogurt dishes, and modern fusion plates.',
    benefits: ['Nutty finish', 'Roasted aroma', 'Snack-friendly seasoning'],
  },
  {
    id: 'black-pepper',
    name: 'Black Pepper Supreme',
    category: 'Premium Select',
    price: 380,
    originalPrice: 420,
    size: '150 gm',
    rating: 4.9,
    reviews: 63,
    stock: 16,
    featured: true,
    badge: 'Premium Select',
    image: pepperImage,
    shortDescription: 'Sharp, fragrant pepper for finishing and balanced spice heat.',
    description:
      'A premium pepper grind with strong fragrance and natural bite. Excellent for soups, stir-fries, marinades, and clean seasoning profiles.',
    benefits: ['Strong fragrance', 'Fresh crackle heat', 'Premium-grade selection'],
  },
]

export const categoryOptions = ['All', 'Essentials', 'Blends', 'Heat & Color', 'Roasted Range', 'Premium Select']
