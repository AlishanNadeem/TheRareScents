// Mock product data shaped to map directly onto future MongoDB documents.
// Field names use snake_case to match the eventual database schema.

const products = [
  {
    _id: "1",
    name: "Velvet Oud",
    slug: "velvet-oud",
    short_description: "A rich, smoky oud wrapped in soft amber and vanilla.",
    description:
      "Velvet Oud opens with a bold breath of smoky agarwood before settling into a warm heart of amber and saffron. A base of vanilla and sandalwood lingers for hours, making it a signature scent for evening wear.",
    price: 8500,
    currency: "PKR",
    images: ["/mock/perfume-1.jpg", "/mock/perfume-2.jpg"],
    category: "Attar/Oud",
    notes: {
      top: ["Saffron", "Smoky Oud"],
      middle: ["Amber", "Rose"],
      base: ["Vanilla", "Sandalwood"],
    },
    volume_ml: 50,
    in_stock: true,
    featured: true,
  },
  {
    _id: "2",
    name: "Citrus Noir",
    slug: "citrus-noir",
    short_description: "A sharp burst of citrus grounded by dark musk.",
    description:
      "Citrus Noir combines zesty bergamot and grapefruit with a mysterious dark musk base. A modern, unisex fragrance perfect for daytime confidence with a hint of nighttime edge.",
    price: 4500,
    currency: "PKR",
    images: ["/mock/perfume-3.jpg", "/mock/perfume-4.jpg"],
    category: "Unisex",
    notes: {
      top: ["Bergamot", "Grapefruit"],
      middle: ["Black Pepper", "Violet Leaf"],
      base: ["Musk", "Cedarwood"],
    },
    volume_ml: 100,
    in_stock: true,
    featured: true,
  },
  {
    _id: "3",
    name: "Rose Mirage",
    slug: "rose-mirage",
    short_description: "A delicate rose bouquet with a soft powdery finish.",
    description:
      "Rose Mirage is an ode to timeless femininity, blending Damask rose with peony and a whisper of white musk. The powdery, soft-focus finish makes it ideal for everyday elegance.",
    price: 5200,
    currency: "PKR",
    images: ["/mock/perfume-5.jpg", "/mock/perfume-6.jpg"],
    category: "For Her",
    notes: {
      top: ["Peony", "Litchi"],
      middle: ["Damask Rose", "Jasmine"],
      base: ["White Musk", "Iris"],
    },
    volume_ml: 50,
    in_stock: true,
    featured: false,
  },
  {
    _id: "4",
    name: "Iron & Leather",
    slug: "iron-and-leather",
    short_description: "A bold, masculine accord of leather and spice.",
    description:
      "Iron & Leather is built for the confident man, opening with cracked black pepper and cardamom before revealing a rugged leather heart. A base of oakmoss and tobacco grounds the composition.",
    price: 6800,
    currency: "PKR",
    images: ["/mock/perfume-7.jpg", "/mock/perfume-8.jpg"],
    category: "For Him",
    notes: {
      top: ["Black Pepper", "Cardamom"],
      middle: ["Leather", "Nutmeg"],
      base: ["Tobacco", "Oakmoss"],
    },
    volume_ml: 100,
    in_stock: true,
    featured: true,
  },
  {
    _id: "5",
    name: "White Amber Bloom",
    slug: "white-amber-bloom",
    short_description: "Creamy white florals over a golden amber base.",
    description:
      "White Amber Bloom layers tuberose and jasmine sambac over a glowing amber and vanilla base. Radiant and sensual, it's designed for those who want to leave a memorable trail.",
    price: 7200,
    currency: "PKR",
    images: ["/mock/perfume-9.jpg", "/mock/perfume-10.jpg"],
    category: "For Her",
    notes: {
      top: ["Mandarin", "Pear"],
      middle: ["Tuberose", "Jasmine Sambac"],
      base: ["Amber", "Vanilla"],
    },
    volume_ml: 50,
    in_stock: false,
    featured: false,
  },
  {
    _id: "6",
    name: "Sandalwood Mist",
    slug: "sandalwood-mist",
    short_description: "Creamy sandalwood softened by a gentle citrus veil.",
    description:
      "Sandalwood Mist pairs smooth Mysore-style sandalwood with a light citrus opening and a touch of coconut milk. Comforting and versatile, it works beautifully for any occasion.",
    price: 5600,
    currency: "PKR",
    images: ["/mock/perfume-11.jpg", "/mock/perfume-12.jpg"],
    category: "Unisex",
    notes: {
      top: ["Lemon", "Coconut Milk"],
      middle: ["Sandalwood", "Heliotrope"],
      base: ["Musk", "Tonka Bean"],
    },
    volume_ml: 100,
    in_stock: true,
    featured: false,
  },
  {
    _id: "7",
    name: "Royal Bakhoor",
    slug: "royal-bakhoor",
    short_description: "A traditional bakhoor attar with deep woody smoke.",
    description:
      "Royal Bakhoor captures the essence of burning bakhoor chips, blending oud, spices, and resins into a dense, ceremonial fragrance. Long-lasting and intense, a few drops go a long way.",
    price: 9200,
    currency: "PKR",
    images: ["/mock/perfume-13.jpg", "/mock/perfume-14.jpg"],
    category: "Attar/Oud",
    notes: {
      top: ["Clove", "Cinnamon"],
      middle: ["Oud", "Frankincense"],
      base: ["Amber Resin", "Musk"],
    },
    volume_ml: 30,
    in_stock: true,
    featured: true,
  },
  {
    _id: "8",
    name: "Ocean Vetiver",
    slug: "ocean-vetiver",
    short_description: "Fresh aquatic notes anchored by earthy vetiver.",
    description:
      "Ocean Vetiver evokes a coastal breeze with marine and mint accords over a grounding vetiver and ambroxan base. Clean, energizing, and perfect for daily wear.",
    price: 4800,
    currency: "PKR",
    images: ["/mock/perfume-15.jpg", "/mock/perfume-16.jpg"],
    category: "For Him",
    notes: {
      top: ["Sea Notes", "Mint"],
      middle: ["Geranium", "Ambroxan"],
      base: ["Vetiver", "Musk"],
    },
    volume_ml: 100,
    in_stock: true,
    featured: false,
  },
  {
    _id: "9",
    name: "Golden Saffron Musk",
    slug: "golden-saffron-musk",
    short_description: "A warm gourmand blend of saffron, honey, and musk.",
    description:
      "Golden Saffron Musk opens with luxurious saffron threads and orange blossom honey, resting on a soft, skin-like musk base. Indulgent, warm, and unmistakably rich.",
    price: 6200,
    currency: "PKR",
    images: ["/mock/perfume-17.jpg", "/mock/perfume-18.jpg"],
    category: "Unisex",
    notes: {
      top: ["Saffron", "Orange Blossom Honey"],
      middle: ["Rose", "Cinnamon"],
      base: ["White Musk", "Benzoin"],
    },
    volume_ml: 50,
    in_stock: true,
    featured: false,
  },
];

export default products;

export function getAllProducts() {
  return products;
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured);
}

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id) {
  return products.find((product) => product._id === id);
}
