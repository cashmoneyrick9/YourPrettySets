# Session Handoff

Last updated: 2026-06-09

This handoff summarizes the current project state and the latest CEO feedback so the next chat or agent can continue without restarting the conversation.

## Current Goal

YourPrettySets is being built as a from-scratch brand and ecommerce prototype for handmade ready-to-wear press-on nails.

This is not a public launch MVP yet. It is a structured prototype for the CEO and agents to shape the brand, product system, Home page, and future shop pages.

## New Chat Starting Point

Start the next chat from the Home page UI pass, not from UX restructuring.

Before starting a section pass, read `docs/brief/section-pass-template.md` and use that CEO checklist. The founder wants planning chats to stay nontechnical: discuss what feels right or wrong, use image mockups when appearance is unclear, then write a plain-English handoff for the web dev to review and build.

Current CEO direction:

- Emergency palette reset on 2026-06-08 supersedes the warm blush/cream/dusty berry global visual system. Stop footer/email-capture design work until the foundation is stable. `src/styles.css` now uses a cleaner cool-neutral ecommerce base: white and cool off-white surfaces, very light cool gray page/soft surfaces, charcoal text, muted slate secondary text, and restrained blue-gray accent. Product images and nail designs should carry most of the color.
- Footer email capture update on 2026-06-08 keeps the footer structure unchanged but switches only the email module to a compact, centered, dark black-and-white image-background treatment. The temporary background is `public/assets/hero-s3-summer.png` with CSS grayscale plus a dark overlay; the locked copy is `Get 15% off your first order`, the email-list body, `Get 15% Off`, `No spam. Unsubscribe anytime.`, and submitted copy `You’re on the list. Your code is coming soon.`
- Follow-up code-structure cleanup on 2026-06-08 separates that email module into `FooterEmailCapture`, rendered immediately before `SiteFooter` in `App`. `SiteFooter` now owns only the actual footer navigation, policy links, socials, love note, and copyright; the visual stack is intended to remain unchanged.
- Actual footer polish on 2026-06-09 leaves `FooterEmailCapture` unchanged and simplifies `SiteFooter` to the brand wordmark, exact love note `made for you, with love`, three text columns (`Shop`, `Help`, `Policies`), text-based social/contact links, and dynamic current-year copyright. Social account URLs remain placeholders until real brand accounts exist.
- Mobile footer correction on 2026-06-09 rejects the prior two-column mobile footer direction. Keep the three `Shop`, `Help`, and `Policies` pillars on mobile and desktop; social/contact links remain text-only in a centered row with natural wrapping instead of a 2x2 grid. `FooterEmailCapture` remains unchanged.
- Latest footer refinement on 2026-06-09 keeps the same three-pillar `SiteFooter` structure and separated `FooterEmailCapture`, but centers each pillar heading/link list, tightens footer vertical gaps, and makes the social/contact row smaller and more intentional while still using text links with flex wrapping rather than icons, pills, dividers, or a forced 2x2 grid.
- Latest CEO direction on 2026-06-07 is a Home/Header/Footer polish pass: remove the temporary bare-bones review mode and bring the Home page into the same restrained soft-neutral visual system as the polished Shop page.
- The live app no longer uses `site-shell--barebones` or `storefront-barebones`. Shared tokens in `src/styles.css` now drive page background, surfaces, text, borders, accent, and subtle shadows so the color system can be swapped later without scattered section colors.
- The hero image asset remains preserved in `public/assets/hero-s3-summer.png`; `.hero-photo` stays `aria-hidden` as decorative imagery, but the Home hero is visible again with neutral overlay/readability treatment.
- The How It Works cards now contain the concise 3-step content requested for this pass: `Pick your set`, `Choose glue or tabs`, and `Apply and wear`.
- Collections UI pass on 2026-05-22 replaces the old static three-tile grid with a horizontal mood-picker carousel. Latest browser annotations shorten the heading to `Browse`, keep `COLLECTIONS` and `See all`, render seven blank accessible collection cards from central collection labels (`Everyday`, `Date Night`, `Vacation`, `Bridal`, `Birthday`, `Work/Neutral`, `Statement`), and keep visual pagination dots with the `Swipe to explore` hint moved here from How It Works. The lane has mouse grab-drag on `.collection-track`, native touch swipes, accidental-click suppression after drag, smooth-settle to the nearest card on mouse release, and active pagination dots from scroll position. A later glide fix removes mandatory CSS snap from `.collection-track` and uses a debounced JS settle after native scroll idle so CSS snap and smooth scrolling do not fight each other. Real collection images/icons, visible card copy, and richer dot/progress behavior are still placeholders/future work.
- Phase 4B carousel cleanup replaces that custom collection drag/settle code with the shared Embla-backed `MobileCarousel` foundation. The collection cards, active collection behavior, `Swipe to explore` hint, product-row visuals, and `See all` / `See more` links stay intact.
- Latest shopping-path refactor on 2026-05-24 makes shopping come first after the hero: Collections now render as slim filter cards, the active collection immediately shows a 2x2 blank product-card wireframe from central product data, `See all` points to that product row, and the undecided third shopping/editorial slot is intentionally left out for later CEO decision.
- Follow-up product-preview pass on 2026-06-07 replaces the Home collection blank product-card wireframes with compact real product preview cards from the existing central `products` data. Home shows the first four products for the active collection with the product image placeholder/well, product name, and price; the intentional `.collection-product-teaser` fade row remains under the grid as a subordinate hint that more products exist before the `See more` CTA. Shop and Home now share `ProductPreviewCard`, while Shop search/filter/sort behavior and product data remain unchanged.
- Phase 4C FAQ cleanup replaces the FAQ topic picker’s custom drag/click-suppression logic with the shared Embla-backed `MobileCarousel` foundation. Topic cards keep the same visual style, active topic behavior, question open/close behavior, `View all ... questions`, Help Center, and Contact Support CTAs.
- Follow-up FAQ cleanup replaces the FAQ question-row `openQuestionIndex` logic with the shared shadcn/Radix Accordion foundation. The list still allows one open answer at a time, clears the open answer when the active topic changes, preserves the right-chevron row treatment, and keeps the `View all ... questions`, Help Center, and Contact Support CTAs unchanged.
- 2026-06-08 Homepage FAQ refinement replaces the mini-help-center topic carousel with a compact conversion-focused FAQ layout: dark slate intro/CTA card, white Radix accordion card with seven immediate ordering questions, and compact dark trust strip. The old topic selection behavior, `Top questions in ...` heading, fake `View all ... questions` link, and placeholder/future-direction wording are removed; `Contact Support` remains `mailto:hello@yourprettysets.com`, while `View Full FAQ` is a safe in-page placeholder until a real route exists.
- 2026-06-09 homepage typography-token cleanup reduces the active `--type-*` roles to eight shared sizes: hero title, section title, subsection title, product title, body, caption, button, and display special. `--type-card-title`, `--type-body-large`, `--type-nav`, `--type-footer-title`, and `--type-review-quote` are retired. Header nav/menu links now use `--type-button`, footer brand and review quote share `--type-display-special`, and FAQ heading/subcopy/questions/answers/buttons use existing title/body/button roles instead of FAQ-specific font-size clamps.
- 2026-06-09 low-risk typography drift patch moves raw tiny kit/review label sizes and footer legal text to `--type-caption`, moves the footer love note to `--type-body`, and moves Shop empty-state and sort option controls to `--type-button`. Footer link aliases, footer email title alias, fullscreen menu clamp, tiny-screen `h1`, shop tab rail, sort value, product back control, brand mark sizes, story title, and icon/glyph sizes remain intentionally unchanged for later review.
- 2026-06-09 Product page selector polish upgrades the existing Length and Shape button groups into visual selector tiles while preserving the same option state and button semantics. Length tiles now show progressively taller nail silhouettes plus mobile helper copy; Shape tiles show distinct CSS nail silhouettes for Almond, Coffin, Square, Round, Stiletto, and Oval; a subtle live summary confirms the current `Selected: Length Shape` choice. Desktop uses a compact tile treatment so the summary and add-to-cart row stay visible in the first product viewport. Product imagery, routing, add-to-cart behavior, product data, and FAQ/home typography remain unchanged.
- Phase 4D footer cleanup replaces the footer’s custom open-group state with the shared shadcn/Radix Accordion foundation. The footer still defaults to `Shop`, keeps one group open at a time, preserves the same group labels and links, and keeps the current dark footer styling rather than default shadcn visuals.
- Follow-up carousel controls cleanup on 2026-05-28 removed the visible progress bars/dots and arrow buttons from the How It Works, Collections, Reviews, and FAQ topic carousels. The carousels keep their cards, native swipe/drag behavior, labels, and section layout.
- Follow-up carousel motion cleanup on 2026-05-28 turns on Embla `loop: true` and shared continuous auto-rotation for the How It Works, Collections, Reviews, and FAQ topic carousels. There are still no visible arrows or progress bars. Auto-rotation moves the Embla location at the shared `24px/second` speed, pauses immediately on pointer, hover, or focus interaction, resumes after a short delay, and stays off for reduced-motion users. Do not reintroduce manual loop-buffer DOM copies for this pass.
- Browser comment on 2026-05-28 normalized the Review carousel card footprint: numbered placeholder cards and the real reviewed-set card now share the same `452px` minimum card height through `--review-card-min-height`, including the narrow mobile override. The review-card peek scale was removed so inactive cards keep the same visible footprint while using opacity only for depth.
- Follow-up browser comment on 2026-05-28 made the mobile carousel clipping windows full-bleed for Collections, How It Works, Reviews, and FAQ topics. The cards still keep internal spacing/peeks, but the overflow now clips at the phone edge instead of inside a padded section box.
- Footer UI pass on 2026-05-28 replaces the previous large email-only footer surface with a semantic, mobile-first footer based on the approved mockup direction. The live footer now has a centered `YPS` text mark with a small heart, four full-width shop rows (`Shop All`, `New Arrivals`, `Best Sellers`, `Accessories`), a compact light grey policy icon bar (`Shipping`, `Returns`, `Privacy`, `Terms`), a slim optional email strip using the existing submitted-state logic, centered social links, the `made for you, with love. ♡` note, `© 2024 YourPrettySets. All rights reserved.`, and a responsive trust strip that becomes 2x2 on very narrow mobile. Social links are placeholder anchors except the email link until real brand accounts exist.
- Follow-up browser comment on 2026-05-28 replaces the top `YPS` footer brand mark with the previous large `Get 15% off your first set` email capture and removes the lower slim email strip so the footer does not repeat two email forms. The shop rows, policy icon bar, socials, love note, copyright, and trust strip stay in place.
- Stop spending more time on the hero-to-How-It-Works gradient transition unless the CEO explicitly reopens it.
- The latest approved How It Works direction is a polished luxury clean-beauty section, not the old continuous auto-strip.
- The live section now uses centered `HOW IT WORKS` / `3 easy steps` heading copy, three swipeable mobile cards, Embla looped continuous auto-rotation, no visible progress bars, no arrows, no swipe hint, and desktop three-column layout.
- The latest mobile polish keeps the hero-to-section gradient, centers the first real card on load, adds loop-buffer side cards so both edges visibly peek, softens the active card shadow, separates the card lane from the controls block, and spaces the progress/hint/Collections handoff cleanly.
- The latest transition/shadow repair keeps the current layout and copy, uses a 105px mobile hero bottom fade into `#fbf6ee`, keeps the How It Works section at `margin-top: 0`, and keeps the active card shadow softer/shorter so it does not fight the controls.
- Latest CEO feedback on 2026-05-18 asked to remove all content inside the How It Works cards. The live cards are now intentionally blank shells; keep them blank until the CEO chooses what belongs inside them.
- Latest mobile gradient fix on 2026-05-18 keeps the fade attached to the outer hero container, but overrides the mobile fade to a 105px layer with gradual `#fbf6ee` opacity stops and no negative How It Works overlap.
- Latest mobile carousel shadow/control fix on 2026-05-18 separates the card lane and controls area: the lane has 52px bottom breathing room, a 52px cream fade at the bottom, and the progress/swipe hint sit on their own solid `#fbf6ee` controls block.
- Latest carousel behavior decision on 2026-05-28: use Embla's built-in loop mode and shared continuous auto-rotation instead of custom repeated-card loop buffers or snap timers. Shopper interaction owns the carousel: pointer, hover, and focus pause auto-rotation immediately, resume only after a short delay, and `prefers-reduced-motion` disables auto-rotation.
- Latest page-load fix on 2026-05-19 keeps the Home page loading at the very top. The How It Works carousel now centers its initial card by setting the horizontal track `scrollLeft` directly instead of calling `scrollIntoView()`, because `scrollIntoView()` could move the whole document down to the carousel on load.
- Latest phone-swipe fix on 2026-05-19 keeps mouse drag support on desktop but lets touch/pen input use native horizontal scrolling. Touch pointers now only pause the drift and do not enter the custom drag state, capture the pointer, call `preventDefault()`, or settle with `scrollTo()` on release. The track uses `touch-action: pan-x pan-y` and `-webkit-overflow-scrolling: touch` so phone swipes feel native instead of locked into click-and-drag behavior.
- Latest true-loop fix on 2026-05-19 keeps the 9-card repeated lane but prevents the physical strip from ending. Native scrolling still passes naturally from slide 3 into the next physical slide 1, then when the shopper reaches the outer buffer near either hard end, the track silently re-centers to the matching middle visual position. This keeps the loop continuous without giving the progress pills or the immediate 3-to-1 boundary control over the lane.
- Latest mobile safe-area/header pivot on 2026-05-18 keeps `viewport-fit=cover` and body-level header state classes, but no longer lets the mobile header float transparently over the hero. Mobile now uses a fixed cream top nav bar that owns the safe-area/status space, keeps square top corners, stays cream after scroll, and offsets the hero image below the bar so there is no nav/hero overlap. Follow-up tightened the mobile top-bar padding so the notch safe area does not create a double-tall-feeling header, then matched the hero offset to the real header height so no cream sliver shows between the nav and hero.
- Latest mobile header layout tweak on 2026-05-18 removes the separate mobile `Shop` pill from the top bar and balances the bar as menu / centered brand / bag. Shop access still lives in desktop navigation, the mobile menu, and the hero `Shop sets` CTA.
- Mobile header menu cleanup on 2026-06-06 replaces the plain dropdown panel with a full-screen blurred overlay. When open, the page behind remains faintly visible through a white translucent blur, the brand mark and bag icon are hidden, only the top-right close `X` and centered destination links are visible, body/root scrolling is locked, Escape closes the overlay, and destination clicks close the menu. The overlay destinations are Home, Shop Collections, How It Works, FAQ, Reviews, and Contact.
- Latest hero cleanup on 2026-05-18 removes the small berry divider between the hero headline and `Shop sets` CTA so the CTA sits directly under the headline.
- Latest mobile hero copy-position cleanup on 2026-05-18 keeps the React markup unchanged and uses mobile CSS variables for `--hero-mobile-min-height`, `--hero-copy-top`, `--hero-copy-gap`, and `--hero-button-offset`. The current mobile target moves the headline/CTA block higher into the upper-left/mid-left hero area without changing the nav, image, copy, button styling, or hero/How-It-Works handoff.
- Implementation note: the drift keeps a virtual scroll position so sub-pixel frame movement accumulates across whole-pixel browser `scrollLeft` updates; the three progress pills are tied to normalized carousel position, not hidden loop-card state.
- The old repeating `01 / 02 / 03 / 01 / 02 / 03` strip, transform-based auto-scroll behavior, and text-only fast cleanup baseline are superseded.
- Do not restore the prior card copy or code-native line visuals without CEO approval.
- The approved UX spec is saved at `docs/superpowers/specs/2026-05-11-how-it-works-ux-pass-design.md`.

## What Has Been Built

The project now has a Vite React TypeScript app.

Implemented:

- React/Vite/TypeScript app foundation.
- Central placeholder product data in `src/data/products.ts`.
- Shop All / Catalog page at `/shop` as the first real destination page after Home.
- Catalog placeholder data expanded to 33 ready-to-wear products, with all products still supporting every launch length and shape option.
- Balanced Shop All layout: `Shop All`, search, Filter + Sort row, inline filter panel, collection tab rail, and a practical product grid.
- Inline filter panel is the approved v1 filter pattern for Shop All; it pushes the catalog down and includes Collection, Price, Detail level, Clear, and Apply controls.
- Minimal Shop All product cards show only a plain image placeholder, product name, and price. They now navigate through React Router to the first base Product Detail route at `/products/:slug`.
- Shared components:
  - `BrandHeader`
  - `ProductCard`
  - `ProductCarousel`
  - `CollectionFilters`
  - `KitContents`
- Long-scroll Home page in `src/pages/HomePage.tsx`.
- Accordion footer with grouped shop/help/policy/social links.
- Responsive CSS, including a dedicated `@media (max-width: 360px)` layer for 320px screens.
- Accessibility improvements:
  - stronger contrast for key text/buttons
  - keyboard-focusable product carousel regions
- Compact mobile header:
  - brand text, menu, and bag stay usable when the viewport is narrow
  - full desktop nav is hidden on mobile
  - mobile menu opens/closes through a full-screen blurred overlay with only destination links and the close `X`
- Regression test for 320px mobile CSS rules.
- Mobile Home page shopping path:
  - hero leads with product/lifestyle visual treatment and a direct `Shop sets` CTA
  - S3 header/hero UI pass adds the real `public/assets/hero-s3-summer.png` background, transparent-at-top header, sage/pistachio scrolled header, and fixed-header anchor offset
  - S3 fidelity correction makes the mobile hero background full-bleed from the top under the transparent header, softens the temporary brand mark, refines the sage/berry accents, and adds the small divider before the hero CTA
  - latest mockup-alignment pass centers the mobile brand mark over the full hero image, keeps menu/Shop/bag on one row, removes the heavy dark hero overlay, and uses the softer berry serif headline treatment from the approved direction
  - accent correction moves the green from the minty `#cce7ca` family toward the inspo's dustier `#adba85`
  - 319px header overlap fix keeps the larger brand mark in the protected middle grid column so the `Shop` pill cannot cover it
  - CTA typography pass gives the header `Shop` pill and hero `Shop sets` button a softer rounded sans stack instead of the heavier generic app-button text
  - scrolled-header correction rounds the sage bar, restores berry brand text, and keeps menu/bag as outline-only icons while `Shop` stays in a white pill
  - safe-area/header pivot makes mobile use a real cream top app bar with matching safe-area paint; the hero begins below the nav instead of sitting behind it, the mobile scrolled state no longer becomes a floating sage rounded card, and the final follow-up tightens the top-bar padding around the notch area and removes the offset mismatch that exposed a thin cream sliver above the hero image
  - hero divider was later removed so the CTA sits directly under the headline
  - slim confidence strip now follows the first shopping module instead of leading the page before products
  - How It Works carousel UI pass overlaps the hero, uses a warm-white card with a thin berry outline, places arrows just outside the card edges, gives each slide its own code-native visual, and has a softened hero/card transition after several visual review passes
  - latest How It Works UI pass replaces the continuous text-only strip with a polished luxury clean-beauty card carousel: centered editorial heading, swipeable mobile cards with side peeks, three dynamic progress pills, swipe hint, and desktop three-column layout
  - collections appear before How It Works and include the first product browsing row
  - sizing-kit language is intentionally excluded for now
  - latest fidelity pass makes the mobile hero a single image-led panel, attaches the confidence strip, and uses three visual collection tiles
  - the former weekly-set slot is removed for now; the CEO does not want to decide that third section yet
  - What's included now uses a compact kit summary with an image-tab/detail-panel module instead of bulky accordion rows
  - reviews now use a compact trust-chip row, single featured review carousel, product thumbnail/detail, dots, and a `See more reviews` link
  - FAQ now uses a beginner help strip, accordion answers, a care-tips cue, and a contact CTA
  - footer now uses a compact brand intro, grouped accordion links, and tiny legal text instead of placeholder link piles
  - Home UX bug pass fixed broken or incomplete prototype destinations, including collection `See all`, bag, review, and footer policy links
  - mobile overflow polish hides native row scrollbars, lets review trust chips wrap, and tightens small-screen spacing
  - review follow-up spaced review arrows away from the card and made the FAQ start strip an in-page CTA link
  - carousel regression cleanup removed the unwanted weekly `Up next` CTA module and kept the weekly carousel as real product slides with simple controls and dots
  - narrow footer overflow cleanup removed the global 320px body minimum so 319px-class in-app browser widths do not clip the footer or show a horizontal scrollbar
  - 2026-05-22 bare-bones review mode strips the visible site to black and white and hides the hero background image from presentation while preserving the asset and hero container for reversibility
- 2026-05-22 browser review deleted the `Shop more` section, and the 2026-05-24 refactor deleted `This week's set`; Home now moves from Collections/product browsing to How It Works to What's included, and links no longer target `#shop-more` or `#this-weeks-set`
- 2026-06-06 Shop All destination pass adds the first post-Home shopping page. Header `Shop Collections`, footer `Shop All`, Home `Shop sets`, Home collection `See all`, and Home collection `See more` point to `/shop`.
- 2026-06-07 page-change flash fix replaces the old `window.location.pathname` switch in `src/App.tsx` with React Router routes for `/` and `/shop`, wraps the app in `BrowserRouter`, redirects unknown routes to `/`, and converts root/shop internal navigation to React Router `Link` while preserving `mailto:` and hash anchors as normal anchors. Mobile menu destination clicks still close the overlay and clean up body/root scroll locks.
- Future internal pages should follow that routing standard: add pages through React Router routes in `src/App.tsx`, use `Link`/`NavLink` for internal page navigation, and keep plain anchors only for external URLs, `mailto:`, `tel:`, and hash links such as `#faq` or `/#reviews`.
- 2026-06-06 Shop All browser comment pass fixed two mobile review issues: the inline filter `Apply` button now stays readable as black background with white text under the global bare-bones overrides, and the collection tab rail now supports mouse drag in the in-app review viewport while preserving native horizontal touch scrolling.
- 2026-06-06 Shop All follow-up fixed the tab rail drag/click conflict by delaying pointer capture until a real drag threshold is crossed, so ordinary tab clicks and tiny pointer drift still select the collection. The Sort control now reads as one compact bordered mobile control with the label inside the field instead of a separate `Sort:` label beside a native select box.
- 2026-06-06 Shop All Sort UX follow-up replaces the native select with a real `Sort` button. Tapping it opens a compact black-and-white option panel with radio-style choices for Newest, Price: Low to High, Price: High to Low, and Most Popular. Choosing an option updates product order, updates the button value, and closes the panel.
- 2026-06-06 Shop All Sort panel polish keeps selected, hovered, and keyboard-focused sort options black with white text, overriding bare-bones global text color so the active option stays readable.
- 2026-06-06 Shop All search keeps search as a lightweight finder rather than a heavy modal/dropdown. Current behavior is a plain search field with inline clear control while typing, result-count feedback, structured matching across product name, collection, detail tier, popularity/newness, and price labels, plus a compact no-results state with `Clear search`. Do not reintroduce starter chips or description-based search matching unless the CEO explicitly asks for that behavior.
- 2026-06-06 mobile menu close-position follow-up collapses the hidden bag action while the full-screen mobile menu is open and moves the close button container to `right: 8px`, so the 44px close tap target sits near the actual right edge instead of being offset by the hidden bag slot.
- 2026-06-07 Shop All visual polish removes `storefront-barebones` from the Shop page and narrows the broad bare-bones CSS flattening so Home can stay in review mode without forcing the Shop page into pure black/white/no-shadow styling. The Shop page skeleton and behavior are unchanged: heading/count, search, Filter, Sort, inline filter panel, tab rail, product grid, and empty state stay in place. Search/filter/sort controls, collection tabs, product cards, and empty state now use a soft neutral shop-specific surface, subtle borders, 8px-or-smaller radius, and restrained shadows without adding product copy, fake recommendations, starter chips, or description-based search matching.
- 2026-06-07 Home/Header/Footer polish removes `site-shell--barebones` and `storefront-barebones`, deletes the temporary bare-bones CSS overrides, maps the shared visual system to soft neutral tokens, restores the Home hero/image presentation, restyles Collections, How It Works, Kit, Reviews, FAQ, and Footer to match Shop's restrained surfaces, and adds concise 3-step How It Works card content without changing Shop page behavior.
- 2026-06-08 Product Detail base pass adds `/products/:slug` with the existing product placeholder art, product title, price, one existing data description, length selector, shape selector, add-to-cart/favorite UI buttons without cart infrastructure, compact reassurance, and simple set details. Shop cards link to the route via React Router while Shop search/filter/sort behavior stays unchanged.
- 2026-06-08 Product Detail return pass adds a visible `Back to shop` control. Shop product links pass `{ fromShop: true }` in React Router state; product pages opened from Shop use browser history for the back control so Shop scroll position can restore, while direct product visits fall back to `/shop`. `ScrollToTop` now skips POP navigations but still resets normal PUSH/REPLACE route changes.
- 2026-06-08 Home collection routing fix changes visible Home collection product cards from same-page `#product-*` anchors to React Router `/products/:slug` links with `{ fromHome: true }` state. Product detail back handling now uses browser history for both Shop-origin and Home-origin visits, preserving the prior page scroll position; direct product visits still fall back to `/shop`. The faded `.collection-product-teaser` cards remain visual-only.
- 2026-06-08 Product Detail image placeholder pass removes the page-specific five-span fake nail-art renderer from `ProductPage` and replaces the media area with a plain accessible gray empty-state well using existing surface tokens. Product Detail layout, routing, selectors, Add to Cart, favorite, reassurance, and details remain unchanged.
- Bag, checkout, policy pages, Help Center, and Contact remain future pages. Size and adhesive are not primary Product Detail selectors; length and shape own the base buying flow.

Latest known verification before handoff:

- Home/Header/Footer polish verification on 2026-06-07: focused red pass first failed while `site-shell--barebones`, `storefront-barebones`, and empty How It Works cards were still present. After the polish pass, `npm run test -- src/App.test.tsx src/pages/HomePage.test.tsx src/styles-responsive.test.ts --run` passed with 3 files and 47 tests, `npm test -- --run` passed with 15 files and 102 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and `git diff --check` passed. Browser verification on Vite `http://localhost:5174/` captured Home mobile, Shop mobile, Home desktop, Shop desktop, mobile menu open, and story viewer open screenshots. DOM checks confirmed `.site-shell` has no bare-bones modifier, `#home` exists with no `storefront-barebones` class, Home has no bare-bones class matches, the 3 How It Works cards render `Pick your set`, `Choose glue or tabs`, and `Apply and wear`, Home/Shop mobile and desktop have no page-level horizontal overflow, Shop still renders 33 product cards, the mobile menu opens with six destination links and blur overlay, and the story viewer opens as a `dialog` with 10 progress segments and body scroll locked.
- Page-change flash fix verification on 2026-06-07: TDD red pass showed the old plain `/shop` anchor attempted document navigation in JSDOM and left the React tree on Home. `npm test -- --run` passed with 15 files and 104 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and `git diff --check` passed. Browser verification on Vite `http://localhost:5174/` confirmed the Home hero `Shop sets` link routed to `/shop` and rendered `Shop All` with 33 sets without leaving the SPA; opening the mobile menu and selecting `Shop Collections` routed to `/shop`, hid the overlay, removed `mobile-menu-open`, and restored body/root overflow styles.
- Shop All visual polish verification on 2026-06-07: focused ShopPage red pass first failed because `#shop` still had `storefront-barebones`, then `npm test -- src/pages/ShopPage.test.tsx --run` passed with 14 tests, `npm test -- --run` passed with 15 files and 104 tests, `npm run build` passed, and `git diff --check` passed. Browser verification at `http://localhost:5173/shop` confirmed `#shop` has only `shop-page`, 33 cards, 9 tabs, no starter chips, soft neutral computed backgrounds, 8px computed radii on search/filter/sort/cards/active tab, visible card shadows, and unchanged interactions for Sort, Filter, and a no-match `zebra` search empty state.
- Mobile header menu cleanup verification on 2026-06-06: `npm test` passed with 15 files and 95 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and `git diff --check` passed. Browser verification at a 375px viewport on `http://localhost:5173/` confirmed the hamburger opens a fixed full-screen overlay with `backdrop-filter: blur(18px)`, translucent white wash, top-right 44px close `X`, hidden brand/bag, six centered links, no page-level horizontal overflow, scroll gestures do not move the page while open, and tapping Reviews closes the menu and restores body/root overflow. Follow-up font correction lightened the overlay links from the heavier initial treatment to `27px` at `font-weight: 400` on a 375px viewport, then increased link spacing from `24px` to `36px`.
- Shop All browser comment verification on 2026-06-06: `npm test -- --run` passed with 15 files and 92 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and browser verification at a 375px viewport on `http://localhost:5173/shop` confirmed the `Apply` button computed as black background, white text, black border, transparent tap highlight, no page-level horizontal overflow, and the collection tab rail moved from `scrollLeft: 0` to `scrollLeft: 240` under mouse drag.
- Shop All tab/sort follow-up verification on 2026-06-06: `npm test -- --run` passed with 15 files and 94 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and browser verification at a 375px viewport on `http://localhost:5173/shop` confirmed direct `Bridal` tab click filters to 6 sets, a click after 6px pointer drift still filters to `Bridal`, real rail drag still moves to `scrollLeft: 240`, the Sort control computes as a single bordered grid control, and page-level horizontal overflow remains 0.
- Shop All real Sort button verification on 2026-06-06: `npm test -- --run` passed with 15 files and 95 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and browser verification at a 375px viewport on `http://localhost:5173/shop` confirmed `Sort Newest` opens the option panel, Newest is checked by default, Price: Low to High changes the first product to `Glossy Bare` and closes the panel, Most Popular changes the first product to `Blush Crush`, and page-level horizontal overflow remains 0.
- Shop All Sort panel polish verification on 2026-06-06: `npm test -- --run` passed with 15 files and 95 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and browser verification confirmed selected `Newest`, hovered `Price: Low to High`, and selected `Price: Low to High` all compute as black background with white text, with page-level horizontal overflow still 0.
- Shop All smarter search verification on 2026-06-06: focused TDD red pass failed on the old plain search field, then `npm run test -- src/pages/ShopPage.test.tsx --run` passed with 12 tests, `npm run test -- --run` passed with 15 files and 99 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and `git diff --check` passed. Browser automation could not be run in that turn because the browser-control tools were unavailable and Playwright was not installed in the workspace.
- Mobile menu close-position verification on 2026-06-06: `npm test -- --run` passed with 15 files and 96 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and browser verification at a 375px viewport on `http://localhost:5173/` confirmed the close button rect is `left: 323`, `right: 367`, `width: 44`, with an 8px right gap, the hidden bag action computes `display: none`, and page-level horizontal overflow remains 0.
- Shop All destination verification on 2026-06-06: `npm test -- --run` passed with 15 files and 89 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and `git diff --check` passed. In-app browser verification at a mobile viewport on `http://localhost:5173/shop` found the Shop All page loaded, header visible, search near the top, Filter + Sort row visible, 9 collection tabs in a horizontally scrollable rail, 33 catalog cards, a 2-column mobile grid, only black/white/light-gray visible Shop colors, no page-level horizontal overflow, no checkout/add-to-cart behavior, and minimal product card text limited to name and price. Opening Filter showed the inline panel and pushed the product grid down; selecting Bridal reduced results to 6 sets.
- `npm test`: 10 files, 46 tests passed.
- `npm run build`: passed.
- `npm audit --audit-level=moderate`: 0 vulnerabilities.
- `git diff --check`: passed.
- Footer UI verification on 2026-05-28: `npm test -- --run` passed with 12 files and 56 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and `git diff --check` passed.
- Reviews story wireframe verification on 2026-05-29: `npm test -- --run` passed with 12 files and 57 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and `git diff --check` passed. In-app browser verification at `375x667` on `http://localhost:5175/` found the Reviews heading present, 5 `.review-story-item` buttons, 5 `.review-story-bubble` circles, no `.review-card`, no `.review-carousel`, horizontally scrollable story-row overflow only (`rowScrollWidth` 400 vs `rowClientWidth` 324), and no page-level horizontal overflow.
- Reviews Phase 2 verification on 2026-05-29: `npm test -- --run` passed with 12 files and 57 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and `git diff --check` passed. In-app browser verification at `375x667` on `http://localhost:5175/` found 10 story items, 10 bubbles, 72px bubble diameter, 4 visible items at the left edge, row-only horizontal overflow (`rowScrollWidth` 930 vs `rowClientWidth` 324), no old review cards/carousel, and no page-level horizontal overflow.
- Reviews story-strip polish verification on 2026-05-29: `npm test -- --run` passed with 12 files and 57 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and `git diff --check` passed. In-app browser verification at `375x667` on `http://localhost:5175/` found 10 `.review-story-item` wrappers, 10 `button.review-story-bubble` controls, 0 `button.review-story-item` controls, first bubble `82px` square after follow-up tuning, first button named `Open Sarah review story`, label outside the button, row full-bleed to the viewport, row-only horizontal scrolling, no old review cards/carousel, and no page-level horizontal overflow.
- Reviews Phase 3 viewer verification on 2026-05-29: in-app browser verification at `375x667` on `http://localhost:5175/` opened `Birthday Set` from its circular story button and found a fullscreen `role="dialog"` named `Birthday Set review story`, a static progress rail, close button, selected placeholder quote, 10 circular story buttons, 0 item-wrapper buttons, a `328px` by `631px` story frame, no page-level horizontal overflow, and the close button removed the viewer. No timer, auto-advance, swipe gestures, product links, or real images were added.
- Reviews Phase 4 viewer verification on 2026-05-29: in-app browser verification at `375x667` on `http://localhost:5175/` opened `Birthday Set` and found a light near-white fullscreen viewer background, warm-white story frame, 10 segmented progress rails with `complete` / `active` / `upcoming` states, left/right invisible tap-zone buttons, 10 circular strip buttons, 0 item-wrapper buttons, body scroll locked, and no page-level horizontal overflow. The next tap zone moved to `Bridal Nails`, progress updated, repeated previous taps stayed bounded at `Sarah`, and close removed the viewer. Automated tests cover Escape plus ArrowLeft/ArrowRight navigation.
- Reviews Phase 5 timer verification on 2026-05-29: `npm test -- --run` passed with 12 files and 67 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, and `git diff --check` passed. In-app browser verification at `375x667` on `http://localhost:5175/` opened `Birthday Set`, found 10 progress segments, active `review-story-progress` animation at `6s`, body scroll locked, no page-level horizontal overflow, and after 6.2 seconds the viewer auto-advanced to `Bridal Nails` with previous segments completed. Closing removed the viewer and restored body overflow.
- Reviews tap-zone and press-hold pause fix on 2026-05-29 keeps the fullscreen story viewer but makes the left/right tap-zone buttons visually inert in normal, active, focus, and focus-visible states. The root cause was the visible `.review-story-viewer__tap-zone:focus-visible` outline plus missing explicit tap-highlight/active/focus resets for these invisible buttons. The tap zones now keep transparent background, no border, no shadow, no outline, `appearance: none`, and `-webkit-tap-highlight-color: transparent`; the close button keeps its visible focus styling. Pressing and holding a tap zone or the story card pauses the timer/progress, release/cancel/leave resumes it, quick tap zones still navigate, and keyboard/Escape behavior is unchanged. Verification: `npm test` passed with 12 files and 70 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, `git diff --check` passed, and in-app browser verification on `http://localhost:5173/` opened `Birthday Set`, confirmed large transparent tap zones with no border/shadow/outline, next/previous navigation, close cleanup, and body scroll restoration.
- Reviews long-press selection fix on 2026-05-29 scopes `user-select: none`, `-webkit-user-select: none`, and `-webkit-touch-callout: none` to `.review-story-viewer` and `.review-story-viewer *` only, so press-and-hold pause does not invite text selection/copy UI inside the story overlay. Normal page text outside the viewer remains selectable. Verification: `npm test` passed with 12 files and 70 tests, `npm run build` passed, `npm audit --audit-level=moderate` found 0 vulnerabilities, `git diff --check` passed, and in-app browser computed styles showed viewer/story text/tap zones at `user-select: none` while the outside Reviews heading stayed `user-select: auto`.
- Temporary Reviews hitbox debug mode was removed on 2026-05-29 after the fullscreen layout and 48/4/48 hitbox split were approved. The viewer no longer applies `.story-debug-hitboxes`, and the temporary debug outline/fill CSS was deleted; the invisible tap-zone buttons remain active.
- Browser/dev server check on 2026-05-22: `http://localhost:5173/` responded from this repo after starting `npm run dev -- --host 0.0.0.0`. In-app browser verification confirmed `.hero-photo` has `aria-hidden="true"` and `background-image: none`, `#home` has `storefront-barebones`, sampled visible page styles resolved only to black, white, or transparent, and the annotated mobile elements computed as requested at the 375px viewport: `.hero-copy` `padding: 23px 29px 1px` with height `263.359px`; `.hero-section` `padding-top: 45px` with height now adjusted to `635px`; `.confidence-section__heading` height `85.047px`; `.confidence-section__heading .eyebrow` height `20.469px` with `translateY(-3px)`; `.brand-mark` font-size `25px`.
- Browser/dev server check: `http://localhost:5173/` responded. Automated DOM tests confirm the How It Works cards render as blank shells with no visible card copy or code-native visual nodes, continuous drift advances the card lane at a visible 36px/second pace, passive drift still resets at a matching visual loop point, manual/native scroll from slide 3 into the next physical slide 1 keeps the forward scroll position while progress resets, outer-buffer native scroll re-centers before either hard end, drag past slide 3 settles onto the next physical slide 1 instead of snapping back, touch/focus interaction pauses drift for 3 seconds, touch pointers stay out of the custom mouse-drag path, the old dot controls are replaced by three dynamic progress pills, reduced-motion users do not get the drifting class, and initial carousel centering does not call page-scrolling APIs. In-app browser verification at a 390px mobile viewport confirmed repeated drags advance 1 -> 2 -> 3 -> 1 -> 2, then re-center to an equivalent slide-3 position before the hard end instead of exhausting the physical strip.
- The in-app browser viewport override was reset after verification.
- Git working tree has the known unrelated untracked `.claude/` directory.

## Important Commits

- `dbccdbf` - Add YourPrettySets site brief
- `b6a16dc` - Add home page foundation plan
- `1487fff` - Add React app foundation
- `203d74b` - Add central placeholder product data
- `c834697` - Add shared home components
- `15b9181` - Compose home page experience
- `451e523` - Add home footer and FAQ placeholders
- `1b4cb1f` - Polish home page responsive layout
- `9a570d3` - Improve carousel keyboard access
- `a5ad744` - Optimize home page for 320px screens
- `dec6bd1` - Complete compact mobile header implementation
- `49fe905` - Build weekly set home flow
- `9c10732` - Build kit contents accordion
- `bb70650` - Build review carousel foundation
- `84dc479` - Build FAQ accordion foundation
- `6d14f94` - Build accordion footer foundation
- `937d495` - Remove standalone footer contact CTA
- `e7a11df` - Fix home UX bug pass
- `ad09ef5` - Address home UX review comments
- `ca8a0b9` - Build real weekly set carousel
- `00afc7c` - Restore richer home carousels
- `24efa30` - Remove weekly up-next module
- `341fe95` - Fix narrow footer overflow
- `643319f` - Add S3 header hero implementation plan
- `f7947ea` - Add S3 summer hero asset
- `a20aef3` - Add transparent header scroll state
- `cf8d825` - Style S3 header and hero
- `9c8782e` - Polish S3 hero sizing and anchors
- `01a43d3` - Refine S3 hero fidelity
- `ef26a39` - Align S3 hero with approved mockup
- `423953a` - Tune S3 sage accent color
- `45d00bc` - Fix mobile header brand overlap
- `33cc27f` - Soften S3 CTA typography
- `4ffe5f6` - Fix scrolled S3 header styling
- `81d2ce1` - Refine hero sparkle divider
- `90afd57` - Add how it works carousel UI plan
- `dc47bce` - Refine how it works carousel UI
- `15d1ef4` - Soften hero carousel transition

## CEO Feedback And Preferences

The CEO is nontechnical and wants to make brand/product decisions through conversation and visual review. They prefer direct, practical language and dislike low-value repeated questions.

Established preferences:

- Build one page at a time.
- Use smaller section/component ownership for agents.
- Keep central placeholder data.
- Structure/data correctness matters, but the result should not look bad.
- Placeholder products/images are acceptable for now.
- The site should feel spring/summer, colorful, feminine, polished, boutique, and friendly.
- Avoid beige/cold/luxury-spa styling.
- Avoid overly cute, childish, or generic beauty-template styling.

## Latest Discussion: Header

The CEO selected the mobile header layout as the next improvement area.

Confirmed direction:

- Use a compact mobile ecommerce header.
- Keep `YourPrettySets` visible as a text brand mark for now.
- Show compact mobile actions for menu and bag; shopping access stays in the menu, desktop nav, and page CTAs.
- Put secondary links inside a simple menu panel.
- Do not redesign the logo yet.
- Do not use overly decorative boutique details.

The design spec is saved at:

- `docs/superpowers/specs/2026-05-06-compact-mobile-header-design.md`

Latest CEO review:

- The compact mobile header behaves much better when squished together.
- The remaining concern is the menu panel visual treatment.
- The menu panel can be polished later during a broader UI pass.
- The later UI pass should make the menu feel less big/blocky and less plain/dev-like.
- Do not reopen the header UX implementation unless the CEO asks; the current priority was fixing usability.

## Latest Discussion: Mobile Home Shopping Path

The CEO approved moving the mobile Home page toward a more shoppable opening sequence.

Confirmed direction:

- Use a photo-led hero direction instead of the old four placeholder nail tiles.
- Keep the hero CTA direct: `Shop sets`.
- Do not force a traditional "How it works" section yet.
- Do not mention sizing kits because sizing kits are not part of the current product flow.
- Use a slim three-step confidence strip:
  - `Pick your set`
  - `Choose your wear`
  - `Press on pretty`
- Put Collections before New Arrivals so customers can choose a mood or occasion before individual products.
- Keep New Arrivals directly after Collections as the first product shopping section.

The design spec is saved at:

- `docs/superpowers/specs/2026-05-07-mobile-home-shopping-path-design.md`

The implementation plan is saved at:

- `docs/superpowers/plans/2026-05-07-mobile-home-shopping-path.md`

Follow-up correction:

- The first implementation matched the section order but not the mockup UX closely enough.
- A second mockup-fidelity pass was approved to make the mobile hero feel like one image-led panel, not a split layout.
- Collections are now intentionally reduced at the top of the Home page to `Everyday`, `Date Night`, and `Vacation`, with `See all` linking down to Featured Sets.
- The correction spec is saved at `docs/superpowers/specs/2026-05-07-mobile-home-mockup-fidelity-design.md`.
- The correction plan is saved at `docs/superpowers/plans/2026-05-07-mobile-home-mockup-fidelity.md`.

Second inspiration fidelity pass:

- The CEO compared the current page against two inspiration screenshots and noted that the UX still did not match closely enough.
- The main missing pieces were real-photo feeling, softer/smaller hero hierarchy, visual step cards, denser spacing, compact Collections heading, and fuller nail-set visuals in tiles.
- The latest pass keeps code-native temporary visuals but moves closer to the inspiration by:
  - reducing mobile hero headline/body dominance
  - tightening top-section vertical rhythm
  - turning the three-step row into visual carousel-style cards with dots and an arrow cue
  - making Collections feel more like a compact shop module
  - rendering five nail shapes per collection tile instead of three abstract marks
- The pass is documented at `docs/superpowers/specs/2026-05-07-home-inspo-ux-fidelity-design.md` and `docs/superpowers/plans/2026-05-07-home-inspo-ux-fidelity.md`.

Latest How It Works decision:

- The CEO asked to remake the card shape/UX and then provided a direct build brief for a polished mobile-first How It Works section.
- Ignore the brief line that suggested changing homepage order to add a trust/benefits bar; the CEO explicitly said to ignore that section.
- The current Home page keeps the section in place between hero and Collections and only changes the How It Works section.
- Mobile now uses a horizontal swipeable carousel with one prominent centered card, partial side-card peeks, and three dynamic progress pills. The old `Swipe to explore` hint has been moved to the Collections carousel because How It Works auto-scrolls.
- The 2026-05-18 polish fixes the remaining mobile layout issue: the active card is centered at roughly three-quarters viewport width, the previous and next cards both peek from the edges, the card shadow has vertical room to fade, and the progress/hint no longer collide with the shadow.
- The follow-up 2026-05-18 repair narrows only the transition and active-card shadow: the hero now uses a 105px absolute full-width bottom fade into the How It Works cream, the How It Works section starts without negative overlap, and the carousel uses ordinary bottom padding plus a separate cream controls block below it.
- The latest 2026-05-18 card-content cleanup keeps the carousel shells, peeks, and progress pills, but removes every visible element inside each card.
- The latest mobile gradient cleanup changes only the mobile hero fade and section spacing: the fade is 105px, opacity reaches the section-start cream `#fbf6ee` at the bottom, and mobile How It Works uses `margin-top: 0` with `padding: 22px 0 0` or `20px 0 0` at the smallest breakpoint; desktop/tablet layout and section order are unchanged.
- The latest mobile carousel controls cleanup changes only the shadow/control handoff: card-lane bottom padding is 52px, a 52px `#fbf6ee` fade dissolves the shadow before the controls, and the controls use `padding: 8px 0 34px` on a solid cream background.
- The latest carousel behavior pass uses Embla loop mode plus shared continuous auto-rotation for the blank How It Works card lane. Auto-rotation moves at `24px/second`, pauses on shopper interaction, resumes after a short delay, and does not add manual loop-buffer card copies.
- Desktop/tablet now uses the same card system as a clean three-column layout.
- Current step cards are blank. The previous step copy was removed from the live section.
- The section styling intentionally shifts toward warm ivory, muted taupe, nude blush, soft brown, champagne beige, and charcoal with editorial serif headings.
- Code-native minimal visuals were removed from the live cards.

Latest collection/product flow decision:

- The CEO liked the full-page direction that removes duplicate `New Arrivals` and `Featured Sets` sections.
- The Home page now moves from Collections into product cards belonging to the active collection, then How It Works, then What's included.
- Browser feedback on 2026-05-24 simplified the Collection filter cards to centered collection names only, with no visible set counts in each card.
- The active collection product row is now a 2x2 blank-card wireframe. It shows up to four actual product links with accessible product labels, fills short collections with blank placeholder slots, and includes a small `See more` CTA with a temporary `#` destination.
- `This week's set` was removed on 2026-05-24 because the CEO does not like that concept yet. Do not link to `#this-weeks-set` unless that section is intentionally rebuilt.
- `Shop more` was removed after the 2026-05-22 browser review. Do not link to `#shop-more` unless that section is intentionally rebuilt.
- Product tiles no longer show visible `Clean background placeholder...` copy; the active collection row is intentionally blank until the CEO decides the product-card content system.
- The design spec is saved at `docs/superpowers/specs/2026-05-07-weekly-set-home-flow-design.md`.
- The implementation plan is saved at `docs/superpowers/plans/2026-05-07-weekly-set-home-flow.md`.

Latest What's included decision:

- The CEO replaced the accordion-style kit UX direction with a compact image-first tab/detail module under the existing kit image.
- The section now uses:
  - eyebrow `THE COMPLETE SET`
  - heading `What’s Included`
  - summary message `Everything you need for your set.`
  - a real kit flat-lay image at `/assets/kit-contents-spread-v2.png`
  - four compact visual tabs: `Nails`, `Glue / tabs`, `Prep tools`, and `Case + care`
  - `Nails` selected by default, with one compact detail panel updating below the tabs
  - `Nails` uses the real nail-size image at `/assets/nail-size-set.png`, replacing the old CSS-built black size tiles
  - `Glue / tabs`, `Prep tools`, and `Case + care` reuse the existing individual kit assets without adding new imagery
  - latest tab-row refinement makes the four tabs image-led mini cards with larger scaled thumbnails, secondary labels, light unselected borders, and a softer detail tray
  - a primary `HOW TO APPLY & CARE` link to `#faq`
- The latest prep-kit decision removes the bulky accordion/card area only. Do not redesign the section heading, subtitle, main kit image, or CTA links during this pass.

Latest reviews decision:

- The CEO selected the carousel direction from the review mockup: a centered featured review card, left/right neighboring peeks, five-star row, customer label, and product/shape tag. Later CEO feedback removed the arrows, dots, and `READ MORE REVIEWS`.
- The Home page review section now uses:
  - eyebrow `CUSTOMER LOVE`
  - heading `Loved by first-time press-on buyers`
  - one centered active review card with left/right peeks on mobile
  - native horizontal swipe/scroll on the review track
  - no dot controls or decorative dot cue under the carousel
  - no bottom review CTA while the destination is undecided
  - believable placeholder quotes from the existing in-file review data
  - no product thumbnail/icon art inside the review cards after the 2026-05-26 browser comment
- Browser verification at 390px and 360px confirmed visible card peeks, working dots, and no horizontal page overflow before the icon-art removal; recheck the shortened cards visually if more spacing tweaks are requested.
- Follow-up arrow removal on 2026-05-26 removed review arrow buttons, their previous/next handlers, and the arrow-specific CSS.
- Follow-up review auto-scroll on 2026-05-26 added the same 36px/second continuous drift used by How It Works. Focus/touch interaction pauses the review drift briefly, reduced-motion disables it, and native swipe still owns manual movement.
- Follow-up placeholder expansion on 2026-05-26 changed Reviews to 12 blank reference cards numbered `01` through `12`.
- Follow-up repeat removal on 2026-05-26 removed the hidden repeated review loop-buffer cards entirely. Reviews now renders exactly 12 physical cards, so there are no blank repeat cards while scrolling.
- Follow-up product-card test on 2026-05-27 applies a `Reviewed set + Shop this set` layout only to review slide `02`, using placeholder copy for `Taylor K.`, `Soft Pink`, `Square Short · From $35`, and `/shop`. The other 11 slides remain the numbered reference cards for comparison.
- Follow-up on 2026-05-27 removed the `READ MORE REVIEWS` CTA, then removed all review dots. The carousel still renders all 12 cards and keeps native swipe/auto-scroll behavior.
- Follow-up browser comment on 2026-05-28 converted all 12 review slides to the same five-star review/product-card format, using realistic positive placeholder copy, central product names/prices, per-set `SHOP THIS SET` links, and no numbered placeholder cards.
- Follow-up browser comment on 2026-05-28 made the review product thumbnails product-specific. Each review thumbnail now uses a `reviewed-set__thumbnail--[product-id]` class and matching CSS color treatment so sets such as `Golden Hour`, `Sea Glass`, and `Main Character` no longer share the same pink placeholder art.
- Follow-up browser comment on 2026-05-28 fixed uneven review card heights after longer quotes made some cards expand past the previous `min-height`. Review cards now use a fixed shared `478px` card height, and browser verification at `375x667` measured all 12 cards at `478px`.
- Follow-up browser comment on 2026-05-28 aligned review CTAs across all cards by pinning `.reviewed-set` to the bottom of each flex card. Browser verification at `375x667` measured all 12 `SHOP THIS SET` links at the same top position and bottom gap.
- Follow-up browser comment on 2026-05-28 added a one-card customer-photo prototype to the first review only. It uses an extra `reviewed-set__thumbnail--customer-photo` class on review index `0`; the other 11 review cards keep their product-specific thumbnail treatments.
- Current first-principles Reviews reset on 2026-05-29 removes the rendered review carousel/cards entirely and keeps only the `CUSTOMER LOVE` / `Loved by first-time press-on buyers` heading plus a raw horizontal story-circle placeholder row. The temporary labels are `Sarah`, `Custom Set`, `Birthday Nails`, `Etsy Review`, and `Bridal Set`. This is intentionally not wired to real review data and has no modal, timer, animation, swipe-gesture logic, or click behavior beyond plain tappable-looking buttons.
- Reviews Phase 2 on 2026-05-29 keeps the same static/no-viewer scope but makes the story strip feel more intentional: 10 placeholder story buttons, larger 72px mobile bubbles, a more premium neutral ring/fill treatment, small balanced labels, and accessible placeholder button names. Still no fullscreen story viewer, timers, animations, click handlers, product links, real review data wiring, or image assets.
- Reviews story-strip polish on 2026-05-29 keeps the static/no-viewer scope but changes each `.review-story-item` back to a non-clickable wrapper. Only the circular `.review-story-bubble` is now a button with labels like `Open Sarah review story`; the visible label below is plain text and outside the button. Mobile bubbles are now 82px, the row breaks out full-bleed from the padded Reviews section, and only the row scrolls horizontally.
- Reviews Phase 3 on 2026-05-29 adds the first interaction layer: tapping a circular story bubble opens a fullscreen static story viewer for the selected placeholder story. The viewer is a simple custom React `role="dialog"` overlay because no shadcn Dialog component exists in the repo. It has selected-story placeholder copy, a static non-animated progress rail, close button, and Escape-to-close behavior. There is still no timer, auto-advance, swipe navigation, real review data, real images, product links, or next/previous controls.
- Reviews Phase 4 on 2026-05-29 changes the story viewer from black theater mode to a light mobile-web-friendly fullscreen viewer so it blends with white mobile browser chrome. It adds manual bounded story navigation through invisible left/right tap-zone buttons and ArrowLeft/ArrowRight keys, plus segmented progress rails that reflect the active story index with no animation or timing. The viewer still has no timer, auto-advance, swipe gestures, real images, product links, CTA buttons, or auto-close at the final story.
- Reviews Phase 5 on 2026-05-29 adds timed story progression only. Each open story runs a 6-second timer, the active progress segment fills with a CSS animation, previous segments stay filled, future segments stay muted, manual next/previous restarts the timer for the new story, and the final story auto-closes when its timer finishes. Close, Escape, and unmount clean up the timer. Reduced-motion users do not get the auto-advance timer or progress animation. There are still no swipe gestures, real images, product links, CTA buttons, or timer controls.

Latest FAQ decision:

- Follow-up FAQ UI pass on 2026-05-27 replaces the old compact FAQ accordion with a mobile-first `FAQ & Help` section based on the supplied bare UI mockup direction.
- The Home page FAQ now renders from `src/components/FaqSection.tsx` and uses:
  - thin black-and-white intro card with the heading `How Can We Help?`
  - tappable issue/topic cards for `Sizing`, `Application`, `Wear & Care`, `Shipping`, `Returns`, `Removal`, and `Custom Orders`
  - no topic selected by default, with topic taps revealing the `Top questions in [Topic]` card and the view-all link text
  - one compact FAQ support footer instead of the old two stacked CTA cards
  - `Visit Help Center →` pointing to `#help-center` as the primary outlined action and `Contact Support` as a secondary underlined `mailto:hello@yourprettysets.com` placeholder link
- Follow-up CEO feedback on 2026-05-27 removed all pink/blush accents from this section. Keep FAQ styling basic black, white, and light gray unless the CEO reopens color.
- Follow-up size pass on 2026-05-27 reduced the FAQ section footprint so it sits closer to the scale of neighboring Home sections: smaller intro padding/title, shorter topic cards, tighter question rows, and more compact CTA cards.
- Follow-up accordion pass on 2026-05-27 made the `Top questions in [Topic]` rows expand in place with short placeholder answers. One quick answer opens at a time, changing topic resets the open answer, and the category grid plus Help Center / Contact Support cards stay unchanged.
- Follow-up category-grid pass on 2026-05-27 changed `Custom Orders` from a full-width card to the same square topic card style as the others, leaving it as the first item on the next row under `Shipping`.
- Follow-up intro-card pass on 2026-05-27 removed the visible `Need help?`, `FAQ & Help`, and support copy from the intro card, then added the compact visible heading `How Can We Help?`.
- Follow-up topic-picker pass on 2026-05-27 changed the FAQ category picker from a multi-row grid to a one-row horizontal swipe carousel to reduce vertical space while preserving the same topic buttons and selected-topic behavior.
- Follow-up carousel setup pass on 2026-05-27 installed Embla via `embla-carousel-react`, added reusable `src/components/MobileCarousel.tsx`, and placed a blank spare carousel instance above the FAQ `How Can We Help?` heading for future section/card work. It is intentionally empty content-wise for now.
- Follow-up support CTA pass on 2026-05-28 removed the two large FAQ CTA cards (`Need more detail?` / `Still need help?`) and replaced them with a lighter centered divider, one short support line, a full-width outlined Help Center button, and a quiet Contact Support text link. The FAQ accordion data and topic behavior stay unchanged.
- Follow-up FAQ topic behavior pass on 2026-05-28 changed the topic carousel so no topic is selected by default. The `Top questions in ...` card stays hidden until a shopper taps a topic, passive carousel auto-rotation no longer changes FAQ content, selecting a topic freezes carousel auto-rotation, smoothly centers the selected topic card, and tapping the selected topic again clears the selection, hides the questions, and resumes topic motion.
- FAQ Home section rebuild on 2026-06-05 keeps `How Can We Help?`, the existing seven topic labels, topic selection, and the Radix/shadcn single-open question accordion, but removes topic icons and replaces the old tall icon cards with shorter, wider text-only rounded-square filter tabs. The selected tab uses a subtle light-gray fill and stronger black border with no underline. The question area now reads as a thin divided FAQ tray instead of a large rounded Help Center card, row affordances use one plus/minus marker, `Visit Help Center` is a smaller outlined button, and `Contact Support` remains a quiet text link. FAQ topic auto-rotation is disabled so the tabs behave like stable filters while still using the shared `MobileCarousel` rail for horizontal mobile use and selected-topic centering.
- FAQ light-card refactor on 2026-06-08 keeps the seven simplified homepage FAQ questions, Radix single-open accordion behavior, `Contact Support`, `View Full FAQ`, and the three trust notes, but removes the dark intro card, decorative oval visuals, separate accordion card, and dark trust strip. The section now reads as one cohesive light FAQ card with a header/action row, clean divided accordion rows, and a subtle in-card trust row.
- FAQ compact-spacing pass on 2026-06-08 keeps the light card structure but reduces the section/header/button/row/answer/trust-row spacing so the FAQ reads as a compact support section. On mobile, the trust notes remain in one short horizontal rail instead of stacking into three tall rows.
- FAQ branded-header pass on 2026-06-08 keeps the simplified seven-question accordion but restores an image-backed intro using the existing `/assets/hero-s3-summer.png` brand image behind only the heading/copy/CTA area. It removes the trust badges entirely and tightens the divided FAQ list further so the section reads as branded ecommerce support rather than a generic Help Center card.
- FAQ full-bleed header pass on 2026-06-09 separates the branded image intro from the FAQ list container. `.faq-image-header` now sits above `.faq-card`, owns the top radius and image treatment, and the compact Radix accordion card below owns only the bottom radius, avoiding the image-trapped-inside-a-card look while keeping trust badges removed.
- FAQ width correction on 2026-06-09 moves `.faq-image-header` out of the narrow `.faq-help` wrapper. The image header now uses the wider `1040px` homepage section rhythm, while `.faq-help` keeps the compact `760px` accordion list below it; the header no longer has its own competing card shadow.
- FAQ mobile layout correction on 2026-06-09 removes the image header's card-like radius, breaks the image band out to the padded section edges on mobile, and adds breathing room before the independent white FAQ list. The list keeps compact divided rows and trust badges remain removed.
- FAQ image-band spacing pass on 2026-06-09 makes the image header taller and vertically balanced by increasing its minimum height and top/bottom padding while centering the heading, copy, and CTAs within the band.
- FAQ list flattening pass on 2026-06-09 removes the rounded/shadowed FAQ list capsule below the image band. The question fold is separated by a simple top underline and tighter divided rows to reduce wasted vertical space.
- FAQ white-space pass on 2026-06-09 increases the white gap between the image band and question fold, and also increases the bottom white gap after the final FAQ row before the email capture.
- FAQ typography regression fix on 2026-06-09 restores readable FAQ question, answer, CTA, and subcopy sizing after the overly compact pass, while keeping the current layout, image header, removed trust badges, and accordion behavior unchanged.
- This pass intentionally stays section-scoped; it does not create a real Help Center page, full FAQ routes, or finalized policy answers.

Latest footer decision:

- Latest approved footer direction on 2026-05-28 keeps only the email capture CTA at the bottom of `App.tsx` and removes the visible footer below it.
- `SiteFooter` now renders only the email capture CTA card: eyebrow `YOURPRETTYSETS`, headline `Get 15% off your first set`, drops/restocks/offers copy, native email input, shadcn `Button`, and placeholder success copy after submit.
- The visible accordion footer, social/contact row, copyright line, and payment badges were removed after CEO feedback. Do not reintroduce footer navigation unless the CEO explicitly asks for a new footer direction.
- The old standalone `FooterEmailCapture`, `CohesiveFooterPreview`, and FAQ CTA-card components were removed. Do not reintroduce duplicate footer previews unless the CEO explicitly asks for side-by-side comparison again.
- Newsletter/email capture is visual-only for now; it is not connected to a real email provider.
- Follow-up browser comments on 2026-05-28 slightly spread out the mobile email capture copy and then hid the `YOURPRETTYSETS` eyebrow on mobile. Mobile content gap is `8px`, padding is `30px 20px 16px`, form top margin is `14px`, and note top margin is `6px`.
- Follow-up footer-divider decision on 2026-05-28 uses the email signup itself as the bottom module boundary. On mobile, `.site-footer-system` no longer draws the partial rounded divider; `.site-footer-email` owns the full rounded top border.
- Follow-up browser comment on 2026-05-28 changed the mobile email signup from an outlined light card to a filled magenta block (`#b31567`) with no module border, restored the rounded top corners, removed the bottom page gap below the module, and increased the module's internal bottom padding to `28px`.
- Follow-up browser comment on 2026-05-28 removed the bottom footer trust strip (`Mobile First`, `Easy To Scan`, `Brand Aligned`, `Built To Last`) while keeping the shop rows, policy row, socials, love note, and copyright.

Latest typography decision:

- Typography system pass on 2026-05-28 keeps the intended current fonts and loads them explicitly from Google Fonts: Manrope for body/CTA/nav and Fraunces for display. No new brand fonts were chosen.
- `src/styles.css` now defines role tokens for hero title, section title, subsection title, card/product title, body, caption/eyebrow, button, nav, footer title, weights, line heights, and caption tracking. Future Home and new-page typography should use those tokens instead of adding more one-off font sizes and weights.
- Home section headings now intentionally share the Fraunces display treatment; body, nav, buttons, inputs, and shadcn `Button` text resolve through the Manrope stack. The footer signup title was reduced from the oversized desktop display scale to the footer-title role.
- Follow-up typography debt cleanup on 2026-05-28 removed dead homepage text selectors for the old collection-card internals, old review-card number, old accordion-style visible footer, and stale footer trust/brand-lockup rules no longer rendered by `SiteFooter`. The current restored footer email capture is still live and keeps tokenized typography. Remaining one-off typography rules in `src/styles.css` are down to 40 by the style-test counter; the intentionally kept one-offs are mostly decorative stars/arrows/check badges, alignment-sensitive kit chevrons, and the current footer's compact micro labels.
- Remaining manual design judgment: whether every section heading should stay Fraunces long term, and whether the temporary text brand mark should stay display-serif or be replaced once the final logo direction is chosen.

Latest spacing decision:

- Spacing system pass on 2026-05-29 adds homepage spacing role tokens in `src/styles.css` for page inline padding, section vertical padding, compact/tight sections, heading gaps, card padding, card gaps, carousel gaps, form gaps, footer vertical padding, and footer email-card padding.
- The pass remaps normal homepage spacing for hero desktop padding, Collections/Browse, How It Works, What's Included, Reviews, FAQ/Help, and the restored footer email capture while preserving carousel edge bleed, safe-area/header offsets, icon/chevron/star alignment nudges, and bare-bones hero annotations.
- Confirmed stale spacing CSS for old collection-card visual internals, old section-specific carousel controls, old review product tag, and the removed footer signup strip was removed. Remaining one-off spacing is mostly product-art internals, carousel slide peek values, tiny decorative offsets, and footer micro-label/icon alignment.

Latest UX bug pass:

- The CEO approved fixing UX bugs and incomplete builds before the later full UI pass.
- The approved design and implementation plan are saved at:
  - `docs/superpowers/specs/2026-05-08-home-ux-bug-pass-design.md`
  - `docs/superpowers/plans/2026-05-08-home-ux-bug-pass.md`
- This pass was limited to behavior and usability plumbing, not final visual polish.
- Completed scope:
  - fixed broken/incomplete navigation targets for collection `See all`, bag, review CTA, footer links, and FAQ beginner strip
  - replaced fake carousel affordances with real controls where needed
  - the later 2026-05-24 refactor removed the weekly-set carousel and moved How It Works below the first product browsing row
  - the later 2026-05-22 browser review removed `Shop more`, and the current Home flow skips directly from active collection products to How It Works
  - separated review arrows from the quote card so they do not collide on narrow mobile
  - removed global `body` 320px minimum so the footer does not clip at 319px-class in-app browser widths
- This UX bug pass is complete. The next chat should start the full UI pass, which is a broader visual/taste pass rather than another structural UX bug pass.
- For the UI pass, preserve the approved behavior unless the CEO explicitly reopens it. In particular:
  - do not bring back the weekly `Up next` module
  - do not bring back `This week's set` unless the CEO asks for it again
  - do not bring back `Shop more` unless the CEO asks for it again
  - do not reopen checkout, final product photography, final logo, or policy/legal copy unless asked
  - use the current Home page as the working surface, but expect substantial visual refinement section by section

## Latest Discussion: S3 Header And Hero UI

The CEO locked S3 as the direction for the first-viewport UI pass after imagegen exploration.

Confirmed direction:

- Use the B-style header/hero structure, not the later P1 tabletop direction.
- Use a summer sorbet garden feel anchored by pistachio/sage, with soft strawberry-sorbet, lilac, mint, warm white, and small golden warmth.
- Header behavior: transparent at the top of the page, then sage/pistachio accent surface after scrolling away from the top.
- Hero direction: real generated background asset at `public/assets/hero-s3-summer.png`, with the current direct `Shop sets` CTA.
- Product-card visuals, checkout, final logo, final photography, footer, and policy wording remain open and should not be reopened unless the CEO asks.

Implemented scope:

- Added the generated S3 hero background as a project asset.
- Added scroll-state behavior to `BrandHeader`.
- Replaced the code-native hero hand illustration with the image-backed S3 hero treatment.
- Added CSS protections for fixed-header anchor jumps and tablet/desktop hero height.
- Added regression coverage for header scroll state and S3 header/hero CSS rules.
- Follow-up fidelity corrections made the mobile hero image full-bleed behind the transparent header, refined the temporary brand mark and accent values, moved the green accent to `#adba85`, protected the larger mobile brand mark from the earlier `Shop` pill, softened CTA typography, rounded the scrolled sage header, kept scrolled menu/bag icons outline-only, and later removed the hero divider entirely.

Current CEO review state:

- The first viewport is still in visual polish mode, not final branding mode.
- The CEO has been judging mockup fidelity at mobile width around 319px.
- The temporary text logo is intentionally still not final, but the current larger serif mark is preferred over the earlier heavier sans mark.
- The green accent should stay closer to dusty olive sage `#adba85`, not the minty `#cce7ca` family.
- The first How It Works carousel build failed founder review because the cards were uneven heights and the motion felt like a sudden swap. The approved repair is one real horizontal track with equal-height cards, fixed visual frames, a next-card peek, and slower soft slide motion.
- Follow-up repair fixed slide 2 and 3 positioning. The percentage `margin-left` movement caused later slides to clip instead of aligning; the track now measures the actual rendered card width plus gap and moves by pixel offset.
- The How It Works UX repair is about structure only. Do not treat the current card colors, placeholder copy, or placeholder visuals as final UI direction.
- The next useful visual question is still the actual card UI after the repaired structure is judged. The CEO asked for card-only mockups, then rejected multiple imagegen pivots. Treat those rejected imagegen outputs as discarded directions, not approved specs.

## Open Product/Site Decisions

Still open:

- Checkout provider/path.
- Final logo.
- Exact color palette.
- Real product names and photos.
- Exact product count.
- How It Works page depth.
- Cancellation policy.
- Final shipping and policy wording.
- Final mobile menu visual polish.

## Latest Discussion: Barebones Home UI Pass

The latest chat continued the mobile-first barebones Home page review. The CEO requested direct visual edits from the in-app browser rather than a broad redesign.

Implemented scope:

- Made the collection selector feel edge-to-edge on mobile.
- Removed visible black outlines/circles from the mobile header menu and bag controls in barebones review mode.
- Tightened and resized the collection product card grid, then added the partial/faded teaser row under the visible product cards to imply a larger shop page.
- Replaced the old `KitContents` / “What’s Included” accordion area with the approved compact image-tab/detail-panel module while preserving the centered header, real kit image, primary care CTA, and required FAQ link.
- Added the updated kit image asset at `public/assets/kit-contents-spread-v2.png` plus individual prep-kit assets for adhesive tabs, nail glue, nail file, cuticle pusher, alcohol wipe, and storage case/card.

Current review state:

- The “What’s Included” structure is now the active section direction. The current kit detail layout is a four-tab selector with one compact detail panel, not an accordion or carousel.
- The kit visual is a real PNG asset rather than CSS-built shapes. Future edits should adjust the image/card sizing in `.kit-spread`, `.kit-spread__image`, `.kit-detail-tab`, `.kit-detail-tab__visual`, `.kit-detail-panel`, and `.kit-detail-panel__visual` before changing the section structure.
- The current product grid is intentionally placeholder/blank for layout review; do not treat it as final product photography.
- Reviews story viewer debug hitbox visuals are now removed. The approved current map at 375px remains a true fullscreen story canvas: viewer/frame/stage/card are 375px by 667px from x0/y0 with no side margin or bottom gap; progress and topbar float over the canvas from x10 to x365; the protected top area is 68px high; previous and next invisible tap zones each cover 48% of the canvas body from y68 to the bottom; and the center no-navigation gap is about 15px wide. Press-and-hold pause remains duration-based across the story body, including the left/right tap zones; holds resume without changing stories.
- Reviews story controls now suppress the mobile tap/click afterimage only on the story bubble and close controls. `.review-story-bubble` and `.review-story-viewer__close` set transparent WebKit tap highlight and `touch-action: manipulation`; their `:active` states remove shadow/filter artifacts, and the close active state stays transparent. Existing `:focus-visible` accessibility styling remains intact.
- Reviews story code is now split into reusable `StoryStrip` and `StoryViewer` components under `src/components/story/`. HomePage still owns the placeholder review story data and the active story index; `StoryViewer` owns the approved fullscreen mechanics, timer, progress, hold-to-pause, keyboard controls, body scroll lock, reduced-motion handling, and close behavior. The refactor kept the existing story CSS class names and visual layout unchanged.

## Suggested Next Agent Flow

1. Read `docs/brief/README.md`, `docs/brief/brand.md`, `docs/brief/page-home.md`, `docs/brief/open-decisions.md`, and this file.
2. Inspect the current Home page in `src/pages/HomePage.tsx`, `src/components/`, and `src/styles.css`.
3. Start from the current mobile UX foundation; avoid reopening final branding, logo, photography, checkout, or policy copy unless the CEO asks.
4. If more implementation is approved, keep changes section-scoped and update this handoff before ending the chat.
5. Use test-driven changes where possible.
6. Verify with `npm test`, `npm run build`, `npm audit --audit-level=moderate`, `git diff --check`, and `git status --short`.

## Dev Server Note

The Home page is currently being reviewed at:

```text
http://localhost:5173/
```

If the server is not running in a future chat, start it with:

```bash
npm run dev -- --host 0.0.0.0
```
