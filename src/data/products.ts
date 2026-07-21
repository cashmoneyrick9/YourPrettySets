import { sizingFacts } from "./storefrontFacts";

export const lengthOptions = ["Extra Short", "Short", "Medium", "Long", "Extra Long"] as const;

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
export type OrderType = "ready-to-ship" | "made-to-order";

export type ProductVariantAvailability = "available" | "low-stock" | "sold-out" | "unavailable";

export type ProductVariant = {
  availability: ProductVariantAvailability;
  inventoryCount?: number;
  length: LengthOption;
  mediaOverride?: ProductPresentation["media"];
  priceOverride?: number;
  shape: ShapeOption;
  sku: string;
};

type ProductPresentation = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  images: {
    clean: string;
    editorial: string;
  };
  media?: {
    clean?: string;
    editorial?: string;
    video?: {
      poster?: string;
      src: string;
      thumbnail?: string;
    };
  };
};

export type Product = ProductPresentation & {
  kind: "nail-set";
  detailTier: DetailTier;
  orderType: OrderType;
  collections: CollectionLabel[];
  isNew: boolean;
  isPopular: boolean;
  lengthOptions: readonly LengthOption[];
  shapeOptions: readonly ShapeOption[];
  variants?: readonly ProductVariant[];
};

export type SizingKitProduct = ProductPresentation & {
  commerceStatus: "pending";
  kind: "sizing-kit";
};

export type ProductPageEntry = Product | SizingKitProduct;

const sharedOptions = {
  lengthOptions,
  shapeOptions
};

const shapeSkuCodes: Record<ShapeOption, string> = {
  Almond: "ALM",
  Coffin: "COF",
  Oval: "OVL",
  Round: "RND",
  Square: "SQR",
  Stiletto: "STL"
};

const lengthSkuCodes: Record<LengthOption, string> = {
  "Extra Long": "XL",
  "Extra Short": "XS",
  Long: "L",
  Medium: "M",
  Short: "S"
};

export function buildProductVariant(
  productId: string,
  shape: ShapeOption,
  length: LengthOption,
  overrides: Partial<Omit<ProductVariant, "length" | "shape" | "sku">> = {}
): ProductVariant {
  return {
    availability: "available",
    length,
    shape,
    sku: `${productId.toUpperCase()}-${shapeSkuCodes[shape]}-${lengthSkuCodes[length]}`,
    ...overrides
  };
}

export function generateProductVariants(
  productId: string,
  shapes: readonly ShapeOption[] = shapeOptions,
  lengths: readonly LengthOption[] = lengthOptions
) {
  return shapes.flatMap((shape) => lengths.map((length) => buildProductVariant(productId, shape, length)));
}

export function getProductVariant(product: Product, shape: ShapeOption, length: LengthOption) {
  return product.variants?.find((variant) => variant.shape === shape && variant.length === length)
    ?? buildProductVariant(product.id, shape, length);
}

type ProductSeed = Omit<Product, "kind" | "slug" | "images" | "lengthOptions" | "shapeOptions"> & {
  slug?: string;
};

function toProductSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function makeProduct({ slug, ...product }: ProductSeed): Product {
  return {
    ...product,
    kind: "nail-set",
    slug: slug ?? toProductSlug(product.name),
    images: {
      clean: `${product.name} press-on nail set on a cool studio background`,
      editorial: `Stylized editorial placeholder for ${product.name}`
    },
    media: {
      clean: `/assets/products/${product.id}.jpg`,
      ...product.media
    },
    variants: generateProductVariants(product.id),
    ...sharedOptions
  };
}

export const products: Product[] = [
  makeProduct({
    id: "blush-crush",
    name: "Blush Crush",
    price: 18,
    detailTier: "simple",
    orderType: "ready-to-ship",
    collections: ["New Arrivals", "Everyday", "Date Night"],
    isNew: true,
    isPopular: true,
    description: "A soft pink ready-to-wear set with an easy everyday glow."
  }),
  makeProduct({
    id: "golden-hour",
    name: "Golden Hour",
    price: 28,
    detailTier: "mid",
    orderType: "ready-to-ship",
    collections: ["New Arrivals", "Vacation", "Birthday"],
    isNew: true,
    isPopular: true,
    description: "Warm peach and golden shimmer for sunny plans and photos."
  }),
  makeProduct({
    id: "vacation-crush",
    name: "Vacation Crush",
    price: 34,
    detailTier: "detailed",
    orderType: "ready-to-ship",
    collections: ["New Arrivals", "Vacation", "Statement"],
    isNew: true,
    isPopular: false,
    description: "A brighter set with playful color made for packing first."
  }),
  makeProduct({
    id: "birthday-candle",
    name: "Birthday Candle",
    price: 38,
    detailTier: "detailed",
    orderType: "ready-to-ship",
    collections: ["Birthday", "Statement", "New Arrivals"],
    isNew: true,
    isPopular: true,
    description: "A celebration set with playful color and extra detail."
  }),
  makeProduct({
    id: "peach-jelly",
    name: "Peach Jelly",
    price: 20,
    detailTier: "simple",
    orderType: "ready-to-ship",
    collections: ["New Arrivals", "Everyday", "Vacation"],
    isNew: true,
    isPopular: false,
    description: "A sheer peach set with a soft glossy finish."
  }),
  makeProduct({
    id: "cabana-stripe",
    name: "Cabana Stripe",
    price: 26,
    detailTier: "mid",
    orderType: "ready-to-ship",
    collections: ["New Arrivals", "Vacation"],
    isNew: true,
    isPopular: false,
    description: "A sunny striped set for pool days, trips, and bright outfits."
  }),
  makeProduct({
    id: "lace-veil",
    name: "Lace Veil",
    price: 36,
    detailTier: "detailed",
    orderType: "ready-to-ship",
    collections: ["New Arrivals", "Bridal"],
    isNew: true,
    isPopular: false,
    description: "A soft white set with delicate lace-inspired detail."
  }),
  makeProduct({
    id: "confetti-pop",
    name: "Confetti Pop",
    price: 32,
    detailTier: "detailed",
    orderType: "ready-to-ship",
    collections: ["New Arrivals", "Birthday"],
    isNew: true,
    isPopular: false,
    description: "A cheerful party set with colorful dots and a glossy finish."
  }),
  makeProduct({
    id: "soft-serve",
    name: "Soft Serve",
    price: 20,
    detailTier: "simple",
    orderType: "ready-to-ship",
    collections: ["Everyday", "Work/Neutral"],
    isNew: false,
    isPopular: true,
    description: "A creamy neutral set with a polished everyday finish."
  }),
  makeProduct({
    id: "mint-to-be",
    name: "Mint To Be",
    price: 24,
    detailTier: "mid",
    orderType: "ready-to-ship",
    collections: ["Everyday", "Vacation", "Work/Neutral"],
    isNew: false,
    isPopular: false,
    description: "Fresh mint detail for a clean, playful look."
  }),
  makeProduct({
    id: "date-night-gloss",
    name: "Date Night Gloss",
    price: 30,
    detailTier: "mid",
    orderType: "ready-to-ship",
    collections: ["Date Night", "Statement"],
    isNew: false,
    isPopular: true,
    description: "Glossy romantic tones with enough detail to feel dressed up."
  }),
  makeProduct({
    id: "something-blue",
    name: "Something Blue",
    price: 36,
    detailTier: "detailed",
    orderType: "ready-to-ship",
    collections: ["Bridal", "Statement"],
    isNew: false,
    isPopular: false,
    description: "A soft bridal-inspired set with blue and shimmer accents."
  }),
  makeProduct({
    id: "office-crush",
    name: "Office Crush",
    price: 22,
    detailTier: "mid",
    orderType: "ready-to-ship",
    collections: ["Work/Neutral", "Everyday"],
    isNew: false,
    isPopular: false,
    description: "A tidy neutral set with a pretty finish for workdays."
  }),
  makeProduct({
    id: "sea-glass",
    name: "Sea Glass",
    price: 32,
    detailTier: "detailed",
    orderType: "ready-to-ship",
    collections: ["Vacation", "Statement"],
    isNew: false,
    isPopular: true,
    description: "Seafoam and turquoise details with a bright summer feel."
  }),
  makeProduct({
    id: "pink-french",
    name: "Pink French",
    price: 18,
    detailTier: "simple",
    orderType: "ready-to-ship",
    collections: ["Everyday", "Bridal", "Date Night"],
    isNew: false,
    isPopular: true,
    description: "A clean pink French-inspired ready-to-wear set."
  }),
  makeProduct({
    id: "main-character",
    name: "Main Character",
    price: 40,
    detailTier: "detailed",
    orderType: "ready-to-ship",
    collections: ["Statement", "Birthday"],
    isNew: false,
    isPopular: false,
    description: "A detailed statement set made to be noticed."
  }),
  makeProduct({
    id: "glossy-bare",
    name: "Glossy Bare",
    price: 15,
    detailTier: "simple",
    orderType: "made-to-order",
    collections: ["Everyday", "Work/Neutral"],
    isNew: false,
    isPopular: false,
    description: "A barely-there nude gloss for simple daily wear."
  }),
  makeProduct({
    id: "barely-there",
    name: "Barely There",
    price: 17,
    detailTier: "simple",
    orderType: "made-to-order",
    collections: ["Everyday", "Work/Neutral"],
    isNew: false,
    isPopular: false,
    description: "A sheer neutral set with a clean natural finish."
  }),
  makeProduct({
    id: "satin-sheer",
    name: "Satin Sheer",
    price: 19,
    detailTier: "simple",
    orderType: "made-to-order",
    collections: ["Bridal", "Work/Neutral"],
    isNew: false,
    isPopular: false,
    description: "A soft satin neutral that works for vows, events, and weekdays."
  }),
  makeProduct({
    id: "lavender-milk",
    name: "Lavender Milk",
    price: 22,
    detailTier: "mid",
    orderType: "made-to-order",
    collections: ["Everyday"],
    isNew: false,
    isPopular: false,
    description: "Milky lavender with a calm, pretty finish."
  }),
  makeProduct({
    id: "glazed-donut",
    name: "Glazed Donut",
    price: 24,
    detailTier: "mid",
    orderType: "made-to-order",
    collections: ["Everyday"],
    isNew: false,
    isPopular: true,
    description: "A soft glazed shimmer set with easy outfit range."
  }),
  makeProduct({
    id: "cherry-kiss",
    name: "Cherry Kiss",
    price: 34,
    detailTier: "detailed",
    orderType: "made-to-order",
    collections: ["Date Night", "Statement"],
    isNew: false,
    isPopular: true,
    description: "Glossy cherry accents with a flirty dressed-up feel."
  }),
  makeProduct({
    id: "rose-velvet",
    name: "Rose Velvet",
    price: 28,
    detailTier: "mid",
    orderType: "made-to-order",
    collections: ["Date Night"],
    isNew: false,
    isPopular: false,
    description: "A romantic rose set with a soft velvet-inspired finish."
  }),
  makeProduct({
    id: "wine-hour",
    name: "Wine Hour",
    price: 30,
    detailTier: "mid",
    orderType: "made-to-order",
    collections: ["Date Night"],
    isNew: false,
    isPopular: false,
    description: "Deep berry gloss for dinner plans and evening looks."
  }),
  makeProduct({
    id: "sunset-spritz",
    name: "Sunset Spritz",
    price: 28,
    detailTier: "mid",
    orderType: "made-to-order",
    collections: ["Vacation"],
    isNew: false,
    isPopular: false,
    description: "Tangerine and pink tones with a bright travel-ready finish."
  }),
  makeProduct({
    id: "seashell-pearl",
    name: "Seashell Pearl",
    price: 34,
    detailTier: "detailed",
    orderType: "made-to-order",
    collections: ["Vacation", "Bridal"],
    isNew: false,
    isPopular: false,
    description: "Pearl detail and shell-like shimmer for beach plans or bridal looks."
  }),
  makeProduct({
    id: "pearl-glaze",
    name: "Pearl Glaze",
    price: 30,
    detailTier: "mid",
    orderType: "made-to-order",
    collections: ["Bridal"],
    isNew: false,
    isPopular: true,
    description: "A pearly white glaze with a clean occasion-ready finish."
  }),
  makeProduct({
    id: "cake-topper",
    name: "Cake Topper",
    price: 26,
    detailTier: "mid",
    orderType: "made-to-order",
    collections: ["Birthday"],
    isNew: false,
    isPopular: false,
    description: "A sweet pink set with tiny party-inspired accents."
  }),
  makeProduct({
    id: "star-party",
    name: "Star Party",
    price: 36,
    detailTier: "detailed",
    orderType: "made-to-order",
    collections: ["Birthday", "Statement"],
    isNew: false,
    isPopular: false,
    description: "A starry celebration set with extra shine and detail."
  }),
  makeProduct({
    id: "taupe-studio",
    name: "Taupe Studio",
    price: 24,
    detailTier: "mid",
    orderType: "made-to-order",
    collections: ["Work/Neutral"],
    isNew: false,
    isPopular: false,
    description: "A modern taupe set for polished workdays."
  }),
  makeProduct({
    id: "latte-hearts",
    name: "Latte Hearts",
    price: 28,
    detailTier: "mid",
    orderType: "made-to-order",
    collections: ["Work/Neutral"],
    isNew: false,
    isPopular: false,
    description: "Warm latte tones with small heart details."
  }),
  makeProduct({
    id: "clean-slate",
    name: "Clean Slate",
    price: 22,
    detailTier: "mid",
    orderType: "made-to-order",
    collections: ["Work/Neutral"],
    isNew: false,
    isPopular: false,
    description: "A soft gray-neutral set that stays simple and tidy."
  }),
  makeProduct({
    id: "chrome-aura",
    name: "Chrome Aura",
    price: 38,
    detailTier: "detailed",
    orderType: "made-to-order",
    collections: ["Statement"],
    isNew: false,
    isPopular: true,
    description: "A high-shine chrome set with a bold party-ready finish."
  })
];

export const sizingKitProduct: SizingKitProduct = {
  commerceStatus: "pending",
  description:
    "A physical sizing kit for customers who want fit guidance without an active custom order.",
  id: "sizing-kit",
  images: {
    clean: "Clean background placeholder for the YourPrettySets sizing kit",
    editorial: "Stylized editorial placeholder for the YourPrettySets sizing kit"
  },
  kind: "sizing-kit",
  name: "Sizing Kit",
  price: sizingFacts.standaloneKitPrice,
  slug: "sizing-kit"
};

export const productPageEntries: readonly ProductPageEntry[] = [...products, sizingKitProduct];

export function findProductBySlug(slug: string | undefined) {
  return productPageEntries.find((product) => product.slug === slug);
}

export const featuredProducts = products.filter((product) => product.isPopular);
export const newArrivals = products.filter((product) => product.isNew);
