export const lengthOptions = ["Short", "Medium", "Long", "Extra Long"] as const;

export const shapeOptions = ["Almond", "Coffin", "Square", "Round", "Stiletto", "Oval"] as const;

export const collectionLabels = [
  "New Arrivals",
  "Everyday",
  "Date Night",
  "Vacation",
  "Bridal",
  "Birthday",
  "Work/Neutral",
  "Statement"
] as const;

export const detailTiers = [
  { id: "simple", label: "Simple", priceRange: "$15-$20" },
  { id: "mid", label: "Mid-detail", priceRange: "$22-$30" },
  { id: "detailed", label: "Detailed", priceRange: "$32-$40" }
] as const;

export type LengthOption = (typeof lengthOptions)[number];
export type ShapeOption = (typeof shapeOptions)[number];
export type CollectionLabel = (typeof collectionLabels)[number];
export type DetailTier = (typeof detailTiers)[number]["id"];

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  detailTier: DetailTier;
  collections: CollectionLabel[];
  isNew: boolean;
  isPopular: boolean;
  description: string;
  images: {
    clean: string;
    editorial: string;
  };
  lengthOptions: readonly LengthOption[];
  shapeOptions: readonly ShapeOption[];
};

const sharedOptions = {
  lengthOptions,
  shapeOptions
};

export const products: Product[] = [
  {
    id: "blush-crush",
    name: "Blush Crush",
    slug: "blush-crush",
    price: 18,
    detailTier: "simple",
    collections: ["New Arrivals", "Everyday", "Date Night"],
    isNew: true,
    isPopular: true,
    description: "A soft pink ready-to-wear set with an easy everyday glow.",
    images: {
      clean: "Clean background placeholder for Blush Crush",
      editorial: "Stylized spring editorial placeholder for Blush Crush"
    },
    ...sharedOptions
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    slug: "golden-hour",
    price: 28,
    detailTier: "mid",
    collections: ["New Arrivals", "Vacation", "Birthday"],
    isNew: true,
    isPopular: true,
    description: "Warm peach and golden shimmer for sunny plans and photos.",
    images: {
      clean: "Clean background placeholder for Golden Hour",
      editorial: "Stylized spring editorial placeholder for Golden Hour"
    },
    ...sharedOptions
  },
  {
    id: "vacation-crush",
    name: "Vacation Crush",
    slug: "vacation-crush",
    price: 34,
    detailTier: "detailed",
    collections: ["New Arrivals", "Vacation", "Statement"],
    isNew: true,
    isPopular: false,
    description: "A brighter set with playful color made for packing first.",
    images: {
      clean: "Clean background placeholder for Vacation Crush",
      editorial: "Stylized spring editorial placeholder for Vacation Crush"
    },
    ...sharedOptions
  },
  {
    id: "soft-serve",
    name: "Soft Serve",
    slug: "soft-serve",
    price: 20,
    detailTier: "simple",
    collections: ["Everyday", "Work/Neutral"],
    isNew: false,
    isPopular: true,
    description: "A creamy neutral set with a polished everyday finish.",
    images: {
      clean: "Clean background placeholder for Soft Serve",
      editorial: "Stylized spring editorial placeholder for Soft Serve"
    },
    ...sharedOptions
  },
  {
    id: "mint-to-be",
    name: "Mint To Be",
    slug: "mint-to-be",
    price: 24,
    detailTier: "mid",
    collections: ["Everyday", "Vacation", "Work/Neutral"],
    isNew: false,
    isPopular: false,
    description: "Fresh mint detail for a clean, playful look.",
    images: {
      clean: "Clean background placeholder for Mint To Be",
      editorial: "Stylized spring editorial placeholder for Mint To Be"
    },
    ...sharedOptions
  },
  {
    id: "date-night-gloss",
    name: "Date Night Gloss",
    slug: "date-night-gloss",
    price: 30,
    detailTier: "mid",
    collections: ["Date Night", "Statement"],
    isNew: false,
    isPopular: true,
    description: "Glossy romantic tones with enough detail to feel dressed up.",
    images: {
      clean: "Clean background placeholder for Date Night Gloss",
      editorial: "Stylized spring editorial placeholder for Date Night Gloss"
    },
    ...sharedOptions
  },
  {
    id: "something-blue",
    name: "Something Blue",
    slug: "something-blue",
    price: 36,
    detailTier: "detailed",
    collections: ["Bridal", "Statement"],
    isNew: false,
    isPopular: false,
    description: "A soft bridal-inspired set with blue and shimmer accents.",
    images: {
      clean: "Clean background placeholder for Something Blue",
      editorial: "Stylized spring editorial placeholder for Something Blue"
    },
    ...sharedOptions
  },
  {
    id: "birthday-candle",
    name: "Birthday Candle",
    slug: "birthday-candle",
    price: 38,
    detailTier: "detailed",
    collections: ["Birthday", "Statement", "New Arrivals"],
    isNew: true,
    isPopular: true,
    description: "A celebration set with playful color and extra detail.",
    images: {
      clean: "Clean background placeholder for Birthday Candle",
      editorial: "Stylized spring editorial placeholder for Birthday Candle"
    },
    ...sharedOptions
  },
  {
    id: "office-crush",
    name: "Office Crush",
    slug: "office-crush",
    price: 22,
    detailTier: "mid",
    collections: ["Work/Neutral", "Everyday"],
    isNew: false,
    isPopular: false,
    description: "A tidy neutral set with a pretty finish for workdays.",
    images: {
      clean: "Clean background placeholder for Office Crush",
      editorial: "Stylized spring editorial placeholder for Office Crush"
    },
    ...sharedOptions
  },
  {
    id: "sea-glass",
    name: "Sea Glass",
    slug: "sea-glass",
    price: 32,
    detailTier: "detailed",
    collections: ["Vacation", "Statement"],
    isNew: false,
    isPopular: true,
    description: "Seafoam and turquoise details with a bright summer feel.",
    images: {
      clean: "Clean background placeholder for Sea Glass",
      editorial: "Stylized spring editorial placeholder for Sea Glass"
    },
    ...sharedOptions
  },
  {
    id: "pink-french",
    name: "Pink French",
    slug: "pink-french",
    price: 18,
    detailTier: "simple",
    collections: ["Everyday", "Bridal", "Date Night"],
    isNew: false,
    isPopular: true,
    description: "A clean pink French-inspired ready-to-wear set.",
    images: {
      clean: "Clean background placeholder for Pink French",
      editorial: "Stylized spring editorial placeholder for Pink French"
    },
    ...sharedOptions
  },
  {
    id: "main-character",
    name: "Main Character",
    slug: "main-character",
    price: 40,
    detailTier: "detailed",
    collections: ["Statement", "Birthday"],
    isNew: false,
    isPopular: false,
    description: "A detailed statement set made to be noticed.",
    images: {
      clean: "Clean background placeholder for Main Character",
      editorial: "Stylized spring editorial placeholder for Main Character"
    },
    ...sharedOptions
  }
];

export const featuredProducts = products.filter((product) => product.isPopular);
export const newArrivals = products.filter((product) => product.isNew);
