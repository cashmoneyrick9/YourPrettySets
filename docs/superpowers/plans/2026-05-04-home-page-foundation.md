# YourPrettySets Home Page Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the from-scratch React foundation and the first polished Home page for YourPrettySets using central placeholder product data.

**Architecture:** Use a Vite React TypeScript app with a small set of focused files: central catalog data, shared UI components, and a Home page that composes those components. The Home page is the visual reference for future pages, but the implementation should keep data and structure coherent first.

**Tech Stack:** Vite, React, TypeScript, CSS, Vitest, React Testing Library, lucide-react.

---

## Source Docs

Agents must follow:

- `docs/brief/README.md`
- `docs/brief/brand.md`
- `docs/brief/site-map.md`
- `docs/brief/product-data.md`
- `docs/brief/shared-components.md`
- `docs/brief/page-home.md`
- `docs/brief/open-decisions.md`
- `docs/superpowers/specs/2026-05-04-yourprettysets-site-design.md`

## File Structure

Create this app structure:

```text
package.json
index.html
vite.config.ts
tsconfig.json
tsconfig.node.json
src/
  App.tsx
  App.test.tsx
  main.tsx
  styles.css
  test/setup.ts
  data/
    products.ts
    products.test.ts
  components/
    BrandHeader.tsx
    BrandHeader.test.tsx
    ProductCard.tsx
    ProductCard.test.tsx
    ProductCarousel.tsx
    ProductCarousel.test.tsx
    CollectionFilters.tsx
    CollectionFilters.test.tsx
    KitContents.tsx
    KitContents.test.tsx
  pages/
    HomePage.tsx
    HomePage.test.tsx
```

## Task 1: Scaffold The React App

**Files:**

- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/test/setup.ts`
- Create: `src/styles.css`

- [ ] **Step 1: Create the failing smoke test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the YourPrettySets brand shell", () => {
    render(<App />);

    expect(screen.getByText("YourPrettySets")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop Collections" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create package and config files**

Create `package.json`:

```json
{
  "name": "your-pretty-sets",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview --host 0.0.0.0"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "lucide-react": "^0.468.0",
    "vite": "^6.0.0",
    "typescript": "^5.6.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "jsdom": "^25.0.1",
    "vitest": "^2.1.5"
  }
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>YourPrettySets</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: false
  }
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Create the minimal app shell**

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create `src/App.tsx`:

```tsx
const navItems = ["Home", "Shop Collections", "How It Works", "FAQ", "Bag"];

function App() {
  return (
    <div className="site-shell">
      <header className="brand-header">
        <a className="brand-mark" href="#home" aria-label="YourPrettySets home">
          YourPrettySets
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>
              {item}
            </a>
          ))}
        </nav>
      </header>
      <main id="home">
        <section className="hero-shell">
          <p className="eyebrow">Handmade ready-to-wear press-ons</p>
          <h1>Art on Miniature Canvases</h1>
          <p>
            Pretty sets made for everyday style, special plans, and salon-looking moments at home.
          </p>
          <a className="primary-button" href="#shop-collections">
            Shop ready-to-wear
          </a>
        </section>
      </main>
    </div>
  );
}

export default App;
```

Create `src/styles.css`:

```css
:root {
  color: #2a2528;
  background: #fffaf8;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  background: #fffaf8;
}

a {
  color: inherit;
  text-decoration: none;
}

.site-shell {
  min-height: 100vh;
}

.brand-header {
  align-items: center;
  display: flex;
  gap: 24px;
  justify-content: space-between;
  padding: 18px clamp(18px, 4vw, 56px);
}

.brand-mark {
  color: #d94f7c;
  font-size: 1.35rem;
  font-weight: 800;
}

.brand-header nav {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: flex-end;
}

.brand-header nav a {
  color: #55424a;
  font-size: 0.92rem;
  font-weight: 700;
}

.hero-shell {
  display: grid;
  gap: 20px;
  min-height: 68vh;
  padding: clamp(48px, 8vw, 96px) clamp(18px, 4vw, 56px);
  place-content: center start;
}

.eyebrow {
  color: #118a88;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  margin: 0;
  text-transform: uppercase;
}

h1 {
  color: #2f2630;
  font-size: clamp(2.6rem, 8vw, 6rem);
  letter-spacing: 0;
  line-height: 0.95;
  margin: 0;
  max-width: 820px;
}

.hero-shell p {
  font-size: 1.08rem;
  line-height: 1.7;
  margin: 0;
  max-width: 620px;
}

.primary-button {
  align-items: center;
  background: #ff6f61;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-weight: 800;
  justify-content: center;
  min-height: 48px;
  padding: 0 22px;
  width: fit-content;
}

@media (max-width: 720px) {
  .brand-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .brand-header nav {
    justify-content: flex-start;
  }
}
```

- [ ] **Step 4: Install dependencies and verify the smoke test passes**

Run:

```bash
npm install
npm test -- --runInBand
```

Expected:

- `npm install` exits 0.
- `npm test -- --runInBand` exits 0.
- The App smoke test passes.

- [ ] **Step 5: Verify build**

Run:

```bash
npm run build
```

Expected:

- TypeScript build exits 0.
- Vite build exits 0.

- [ ] **Step 6: Commit**

Run:

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json src
git commit -m "Add React app foundation"
```

Expected:

- Commit succeeds.

## Task 2: Add Central Product Data

**Files:**

- Create: `src/data/products.ts`
- Create: `src/data/products.test.ts`

- [ ] **Step 1: Write the failing product data tests**

Create `src/data/products.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  collectionLabels,
  detailTiers,
  lengthOptions,
  products,
  shapeOptions
} from "./products";

describe("product data", () => {
  it("has a realistic placeholder launch range", () => {
    expect(products.length).toBeGreaterThanOrEqual(12);
    expect(products.length).toBeLessThanOrEqual(30);
  });

  it("lets every product support every launch length and shape", () => {
    for (const product of products) {
      expect(product.lengthOptions).toEqual(lengthOptions);
      expect(product.shapeOptions).toEqual(shapeOptions);
    }
  });

  it("uses only approved collections and detail tiers", () => {
    const allowedCollections = new Set(collectionLabels);
    const allowedTiers = new Set(detailTiers.map((tier) => tier.id));

    for (const product of products) {
      expect(allowedTiers.has(product.detailTier)).toBe(true);
      expect(product.collections.length).toBeGreaterThan(0);
      for (const collection of product.collections) {
        expect(allowedCollections.has(collection)).toBe(true);
      }
    }
  });

  it("includes clean and editorial placeholder image descriptions", () => {
    for (const product of products) {
      expect(product.images.clean).toContain(product.name);
      expect(product.images.editorial).toContain(product.name);
    }
  });
});
```

- [ ] **Step 2: Run the product tests to verify they fail**

Run:

```bash
npm test -- src/data/products.test.ts
```

Expected:

- Fails because `src/data/products.ts` does not exist.

- [ ] **Step 3: Implement central product data**

Create `src/data/products.ts`:

```ts
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
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm test -- src/data/products.test.ts
```

Expected:

- Product data tests pass.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/data
git commit -m "Add central placeholder product data"
```

Expected:

- Commit succeeds.

## Task 3: Build Shared Home Components

**Files:**

- Create: `src/components/BrandHeader.tsx`
- Create: `src/components/BrandHeader.test.tsx`
- Create: `src/components/ProductCard.tsx`
- Create: `src/components/ProductCard.test.tsx`
- Create: `src/components/ProductCarousel.tsx`
- Create: `src/components/ProductCarousel.test.tsx`
- Create: `src/components/CollectionFilters.tsx`
- Create: `src/components/CollectionFilters.test.tsx`
- Create: `src/components/KitContents.tsx`
- Create: `src/components/KitContents.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write component tests**

Create `src/components/BrandHeader.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandHeader } from "./BrandHeader";

describe("BrandHeader", () => {
  it("renders the brand and all primary navigation links", () => {
    render(<BrandHeader />);

    expect(screen.getByLabelText("YourPrettySets home")).toBeInTheDocument();
    for (const label of ["Home", "Shop Collections", "How It Works", "FAQ", "Bag"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });
});
```

Create `src/components/ProductCard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { products } from "../data/products";
import { ProductCard } from "./ProductCard";

describe("ProductCard", () => {
  it("shows only the product image label, name, and price", () => {
    render(<ProductCard product={products[0]} />);

    expect(screen.getByText(products[0].name)).toBeInTheDocument();
    expect(screen.getByText("$18")).toBeInTheDocument();
    expect(screen.getByLabelText(products[0].images.clean)).toBeInTheDocument();
  });
});
```

Create `src/components/ProductCarousel.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { newArrivals } from "../data/products";
import { ProductCarousel } from "./ProductCarousel";

describe("ProductCarousel", () => {
  it("renders a titled carousel with product cards", () => {
    render(<ProductCarousel title="New Arrivals" products={newArrivals} />);

    expect(screen.getByRole("heading", { name: "New Arrivals" })).toBeInTheDocument();
    expect(screen.getAllByRole("article").length).toBe(newArrivals.length);
  });
});
```

Create `src/components/CollectionFilters.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { collectionLabels } from "../data/products";
import { CollectionFilters } from "./CollectionFilters";

describe("CollectionFilters", () => {
  it("renders every collection as a link", () => {
    render(<CollectionFilters />);

    for (const collection of collectionLabels.filter((label) => label !== "New Arrivals")) {
      expect(screen.getByRole("link", { name: collection })).toBeInTheDocument();
    }
  });
});
```

Create `src/components/KitContents.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KitContents } from "./KitContents";

describe("KitContents", () => {
  it("renders the full included kit list", () => {
    render(<KitContents />);

    for (const item of [
      "24 nails",
      "Adhesive tabs",
      "Nail glue",
      "Nail file",
      "Cuticle pusher",
      "Alcohol wipe",
      "Application card",
      "Storage box or bag"
    ]) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run component tests to verify they fail**

Run:

```bash
npm test -- src/components
```

Expected:

- Tests fail because the component files do not exist.

- [ ] **Step 3: Implement shared components**

Create `src/components/BrandHeader.tsx`:

```tsx
const navItems = ["Home", "Shop Collections", "How It Works", "FAQ", "Bag"];

export function BrandHeader() {
  return (
    <header className="brand-header">
      <a className="brand-mark" href="#home" aria-label="YourPrettySets home">
        YourPrettySets
      </a>
      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
```

Create `src/components/ProductCard.tsx`:

```tsx
import type { Product } from "../data/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className={`product-art product-art--${product.detailTier}`} aria-label={product.images.clean}>
        <span>{product.name}</span>
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </div>
    </article>
  );
}
```

Create `src/components/ProductCarousel.tsx`:

```tsx
import type { Product } from "../data/products";
import { ProductCard } from "./ProductCard";

type ProductCarouselProps = {
  title: string;
  eyebrow?: string;
  products: Product[];
};

export function ProductCarousel({ title, eyebrow, products }: ProductCarouselProps) {
  return (
    <section className="section-block">
      <div className="section-heading">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      <div className="product-carousel" aria-label={title}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

Create `src/components/CollectionFilters.tsx`:

```tsx
import { collectionLabels } from "../data/products";

const visibleCollections = collectionLabels.filter((label) => label !== "New Arrivals");

export function CollectionFilters() {
  return (
    <section className="section-block collection-section" id="shop-collections">
      <div className="section-heading">
        <p className="eyebrow">Shop by collection</p>
        <h2>Browse by the plan, mood, or moment.</h2>
      </div>
      <div className="collection-grid">
        {visibleCollections.map((collection) => (
          <a className="collection-card" href={`#collection-${collection.toLowerCase().replaceAll("/", "-").replaceAll(" ", "-")}`} key={collection}>
            {collection}
          </a>
        ))}
      </div>
    </section>
  );
}
```

Create `src/components/KitContents.tsx`:

```tsx
import { Gift, Hand, Package, Sparkles } from "lucide-react";

const kitItems = [
  "24 nails",
  "Adhesive tabs",
  "Nail glue",
  "Nail file",
  "Cuticle pusher",
  "Alcohol wipe",
  "Application card",
  "Storage box or bag"
];

export function KitContents() {
  return (
    <section className="section-block kit-section">
      <div className="section-heading">
        <p className="eyebrow">What's included</p>
        <h2>Everything needed to apply and care for your set.</h2>
      </div>
      <div className="kit-layout">
        <div className="kit-feature">
          <Sparkles aria-hidden="true" />
          <p>Includes 24 nails so you can find your best fit.</p>
        </div>
        <ul className="kit-list">
          {kitItems.map((item, index) => {
            const Icon = index % 3 === 0 ? Package : index % 3 === 1 ? Hand : Gift;
            return (
              <li key={item}>
                <Icon aria-hidden="true" />
                <span>{item}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add shared component styling**

Append these styles to `src/styles.css`, replacing duplicate selectors from Task 1 only when needed:

```css
.section-block {
  padding: clamp(48px, 7vw, 86px) clamp(18px, 4vw, 56px);
}

.section-heading {
  display: grid;
  gap: 10px;
  margin: 0 auto 24px;
  max-width: 920px;
}

.section-heading h2 {
  color: #2f2630;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
  margin: 0;
}

.product-carousel {
  display: grid;
  gap: 18px;
  grid-auto-columns: minmax(220px, 300px);
  grid-auto-flow: column;
  margin-inline: auto;
  max-width: 1180px;
  overflow-x: auto;
  padding: 4px 0 16px;
  scroll-snap-type: x mandatory;
}

.product-card {
  background: #ffffff;
  border: 1px solid rgba(217, 79, 124, 0.16);
  border-radius: 8px;
  box-shadow: 0 14px 38px rgba(93, 48, 67, 0.08);
  overflow: hidden;
  scroll-snap-align: start;
}

.product-art {
  align-items: end;
  aspect-ratio: 4 / 5;
  background:
    radial-gradient(circle at 28% 24%, rgba(255, 211, 102, 0.72), transparent 22%),
    radial-gradient(circle at 76% 30%, rgba(98, 210, 190, 0.56), transparent 24%),
    linear-gradient(135deg, #ffd6df, #fff7ed 48%, #ccefeb);
  color: #56313f;
  display: flex;
  font-size: 0.82rem;
  font-weight: 800;
  justify-content: center;
  padding: 18px;
  text-align: center;
}

.product-art--mid {
  background:
    radial-gradient(circle at 72% 20%, rgba(255, 184, 77, 0.7), transparent 22%),
    radial-gradient(circle at 24% 74%, rgba(181, 230, 126, 0.58), transparent 25%),
    linear-gradient(145deg, #ffc4b5, #fff7d9 48%, #d7f5ef);
}

.product-art--detailed {
  background:
    radial-gradient(circle at 25% 28%, rgba(255, 111, 97, 0.75), transparent 24%),
    radial-gradient(circle at 78% 24%, rgba(87, 174, 214, 0.6), transparent 22%),
    radial-gradient(circle at 52% 78%, rgba(246, 216, 92, 0.68), transparent 22%),
    linear-gradient(145deg, #ffd8ec, #f7fff6 45%, #c8f1ff);
}

.product-card__body {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 14px;
}

.product-card h3,
.product-card p {
  margin: 0;
}

.product-card h3 {
  font-size: 1rem;
}

.product-card p {
  color: #d94f7c;
  font-weight: 900;
}

.collection-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  margin: 0 auto;
  max-width: 1180px;
}

.collection-card {
  align-items: center;
  background: #ffffff;
  border: 1px solid rgba(17, 138, 136, 0.18);
  border-radius: 8px;
  color: #2f554d;
  display: flex;
  font-weight: 900;
  justify-content: center;
  min-height: 92px;
  padding: 18px;
  text-align: center;
}

.kit-section {
  background: #f4fffb;
}

.kit-layout {
  display: grid;
  gap: 22px;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  margin: 0 auto;
  max-width: 1180px;
}

.kit-feature {
  align-items: flex-start;
  background: #ffffff;
  border-radius: 8px;
  display: grid;
  gap: 14px;
  padding: 24px;
}

.kit-feature svg {
  color: #ff6f61;
  height: 32px;
  width: 32px;
}

.kit-feature p {
  font-size: 1.25rem;
  font-weight: 900;
  line-height: 1.35;
  margin: 0;
}

.kit-list {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}

.kit-list li {
  align-items: center;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  min-height: 58px;
  padding: 14px;
}

.kit-list svg {
  color: #118a88;
  flex: 0 0 auto;
  height: 18px;
  width: 18px;
}

@media (max-width: 760px) {
  .kit-layout {
    grid-template-columns: 1fr;
  }

  .kit-list {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Run component tests**

Run:

```bash
npm test -- src/components
```

Expected:

- Component tests pass.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/components src/styles.css
git commit -m "Add shared home components"
```

Expected:

- Commit succeeds.

## Task 4: Compose The Home Page

**Files:**

- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/HomePage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write the Home page tests**

Create `src/pages/HomePage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("renders every approved Home section", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Art on Miniature Canvases" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "New Arrivals" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Browse by the plan, mood, or moment." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Featured Sets" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Everything needed to apply and care for your set." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How it works" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pretty notes from future customers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Quick answers" })).toBeInTheDocument();
  });
});
```

Modify `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the YourPrettySets home experience", () => {
    render(<App />);

    expect(screen.getByText("YourPrettySets")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop Collections" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Art on Miniature Canvases" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run Home tests to verify they fail**

Run:

```bash
npm test -- src/pages/HomePage.test.tsx src/App.test.tsx
```

Expected:

- Fails because `HomePage` does not exist and `App` has not been wired to it.

- [ ] **Step 3: Implement Home page composition**

Create `src/pages/HomePage.tsx`:

```tsx
import { CollectionFilters } from "../components/CollectionFilters";
import { KitContents } from "../components/KitContents";
import { ProductCarousel } from "../components/ProductCarousel";
import { featuredProducts, newArrivals } from "../data/products";

const howItWorks = [
  "Choose your ready-to-wear set.",
  "Pick your length and shape.",
  "Apply with glue or tabs.",
  "Wear, remove, and store with care."
];

const reviews = [
  {
    quote: "The set looked dressed up without feeling hard to wear.",
    name: "Everyday customer"
  },
  {
    quote: "Pretty enough for photos, practical enough for the week.",
    name: "Beauty shopper"
  },
  {
    quote: "The 24-nail set made finding a fit feel less stressful.",
    name: "First-time press-on buyer"
  }
];

const faqs = [
  "What comes with each set?",
  "How long do press-ons last?",
  "Can I reuse them?"
];

export function HomePage() {
  return (
    <main id="home">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Handmade ready-to-wear press-ons</p>
          <h1>Art on Miniature Canvases</h1>
          <p>
            Pretty press-on sets made for everyday style, special plans, and salon-looking moments
            at home.
          </p>
          <a className="primary-button" href="#shop-collections">
            Shop ready-to-wear
          </a>
        </div>
        <div className="hero-product-spread" aria-label="Spring and summer nail set spread">
          <span className="nail-tile nail-tile--coral">Coral</span>
          <span className="nail-tile nail-tile--mint">Mint</span>
          <span className="nail-tile nail-tile--sky">Sky</span>
          <span className="nail-tile nail-tile--peach">Peach</span>
        </div>
      </section>

      <ProductCarousel eyebrow="Fresh sets" title="New Arrivals" products={newArrivals} />
      <CollectionFilters />
      <ProductCarousel eyebrow="Customer moodboard" title="Featured Sets" products={featuredProducts} />
      <KitContents />

      <section className="section-block steps-section">
        <div className="section-heading">
          <p className="eyebrow">Simple wear</p>
          <h2>How it works</h2>
        </div>
        <ol className="steps-list">
          {howItWorks.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="section-block reviews-section">
        <div className="section-heading">
          <p className="eyebrow">Placeholder reviews</p>
          <h2>Pretty notes from future customers</h2>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <figure key={review.quote}>
              <blockquote>{review.quote}</blockquote>
              <figcaption>{review.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section-block faq-teaser">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Quick answers</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <a key={faq} href="#faq">
              {faq}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
```

Modify `src/App.tsx`:

```tsx
import { BrandHeader } from "./components/BrandHeader";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <div className="site-shell">
      <BrandHeader />
      <HomePage />
      <footer className="site-footer">
        <a href="#home">Home</a>
        <a href="#shop-collections">Shop Collections</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#faq">FAQ</a>
        <a href="#contact">Contact placeholder</a>
        <a href="#instagram">Instagram placeholder</a>
      </footer>
    </div>
  );
}

export default App;
```

- [ ] **Step 4: Add Home page styling**

Append to `src/styles.css`:

```css
.hero-section {
  display: grid;
  gap: clamp(28px, 5vw, 64px);
  grid-template-columns: minmax(0, 0.95fr) minmax(280px, 1.05fr);
  min-height: 72vh;
  padding: clamp(42px, 7vw, 88px) clamp(18px, 4vw, 56px) clamp(36px, 6vw, 72px);
}

.hero-copy {
  align-self: center;
  display: grid;
  gap: 20px;
}

.hero-copy p {
  font-size: 1.08rem;
  line-height: 1.7;
  margin: 0;
  max-width: 640px;
}

.hero-product-spread {
  align-self: center;
  aspect-ratio: 1 / 1;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 111, 97, 0.32), transparent 24%),
    radial-gradient(circle at 82% 24%, rgba(98, 210, 190, 0.34), transparent 25%),
    radial-gradient(circle at 56% 78%, rgba(246, 216, 92, 0.42), transparent 22%),
    #ffffff;
  border: 1px solid rgba(217, 79, 124, 0.14);
  border-radius: 8px;
  box-shadow: 0 30px 80px rgba(93, 48, 67, 0.12);
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: clamp(18px, 4vw, 42px);
}

.nail-tile {
  align-items: center;
  border-radius: 999px 999px 42px 42px;
  color: #392a31;
  display: flex;
  font-size: 0.8rem;
  font-weight: 900;
  justify-content: center;
  min-height: 128px;
}

.nail-tile--coral {
  background: #ff9b8a;
}

.nail-tile--mint {
  background: #b7efd8;
}

.nail-tile--sky {
  background: #bde8ff;
}

.nail-tile--peach {
  background: #ffd7a8;
}

.steps-section {
  background: #fff6ed;
}

.steps-list {
  counter-reset: steps;
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  list-style: none;
  margin: 0 auto;
  max-width: 1180px;
  padding: 0;
}

.steps-list li {
  background: #ffffff;
  border-radius: 8px;
  font-weight: 800;
  line-height: 1.35;
  min-height: 120px;
  padding: 18px;
}

.reviews-section {
  background: #fffaf8;
}

.review-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0 auto;
  max-width: 1180px;
}

.review-grid figure {
  background: #ffffff;
  border: 1px solid rgba(217, 79, 124, 0.16);
  border-radius: 8px;
  margin: 0;
  padding: 22px;
}

.review-grid blockquote {
  font-size: 1.02rem;
  font-weight: 800;
  line-height: 1.45;
  margin: 0 0 18px;
}

.review-grid figcaption {
  color: #118a88;
  font-size: 0.9rem;
  font-weight: 900;
}

.faq-list {
  display: grid;
  gap: 12px;
  margin: 0 auto;
  max-width: 920px;
}

.faq-list a {
  background: #ffffff;
  border: 1px solid rgba(17, 138, 136, 0.16);
  border-radius: 8px;
  font-weight: 900;
  padding: 18px;
}

.site-footer {
  align-items: center;
  background: #2f2630;
  color: #fffaf8;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  padding: 30px clamp(18px, 4vw, 56px);
}

@media (max-width: 860px) {
  .hero-section {
    grid-template-columns: 1fr;
  }

  .steps-list,
  .review-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Run Home tests**

Run:

```bash
npm test -- src/pages/HomePage.test.tsx src/App.test.tsx
```

Expected:

- Home and App tests pass.

- [ ] **Step 6: Run full verification**

Run:

```bash
npm test
npm run build
```

Expected:

- All tests pass.
- Build exits 0.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/App.tsx src/App.test.tsx src/pages src/styles.css
git commit -m "Compose home page experience"
```

Expected:

- Commit succeeds.

## Task 5: Visual QA And Dev Server

**Files:**

- Modify only if verification finds layout or accessibility problems.

- [ ] **Step 1: Start the dev server**

Run:

```bash
npm run dev
```

Expected:

- Vite prints a local URL, usually `http://localhost:5173/`.

- [ ] **Step 2: Inspect the Home page in a browser**

Use the in-app browser or Playwright to inspect desktop and mobile widths.

Check:

- Header links fit on mobile.
- Hero content does not overlap the product spread.
- Product carousel scrolls horizontally on mobile.
- Product cards keep stable dimensions.
- Section text does not overflow cards.
- Palette feels spring/summer, not beige or cold.
- Footer links wrap cleanly.

- [ ] **Step 3: Fix any visual defects**

If defects are found, adjust `src/styles.css` only unless component markup is the real issue.

Example acceptable fix:

```css
@media (max-width: 520px) {
  .brand-header nav {
    gap: 10px;
  }

  .brand-header nav a {
    font-size: 0.84rem;
  }
}
```

- [ ] **Step 4: Run final verification**

Run:

```bash
npm test
npm run build
git status --short
```

Expected:

- Tests pass.
- Build passes.
- `git status --short` shows only intentional changes, or no changes after the final commit.

- [ ] **Step 5: Commit QA fixes if any were made**

If files changed:

```bash
git add src/styles.css src
git commit -m "Polish home page responsive layout"
```

Expected:

- Commit succeeds.

## Subagent Execution Notes

- Do not dispatch multiple implementers at the same time for this plan. Tasks are sequential because each task depends on files created earlier.
- Each implementer receives only the current task text, the source docs list, and a reminder that other agents may work later.
- After every implementation task, run spec compliance review first, then code quality review.
- Do not let reviewers approve checkout behavior, real product claims, or final logo/palette decisions that are still open.
- After Task 5, run a final full-code review agent before reporting the Home page foundation as complete.

## Self-Review

Spec coverage:

- Home page is first build target and visual reference: Tasks 1, 3, 4, 5.
- Central product data: Task 2.
- Shared components: Task 3.
- Long-scroll Home sections: Task 4.
- Data/structure first with acceptable polish: Tasks 2, 3, 4, 5.
- Checkout remains untouched: no checkout task included.
- Open decisions remain open: no task finalizes logo, checkout, exact palette, cancellation policy, or real photos.

Placeholder scan:

- This plan intentionally uses placeholder product copy and image descriptions because the approved brief calls for realistic placeholder products.
- No placeholder markers or unspecified implementation steps are present.

Type consistency:

- Product type fields are defined in Task 2 and consumed in Tasks 3 and 4.
- Component names and import paths match the file structure.
