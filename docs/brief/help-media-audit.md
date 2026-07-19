# Help and Site Media Audit

Date: 2026-07-19

This audit supports the task-first mobile Help pass. It separates assets that clarify a customer task from media that adds scrolling, repetition, or mismatched visual language.

## Replace in this pass

| Current media | Used by | Finding | Decision |
| --- | --- | --- | --- |
| `kit-contents-spread-v2.png` and the older individual kit PNGs | Home `What’s Included` | The large spread repeats the tab content, while the individual files mix crops, scales, and lighting. | Remove the redundant spread from the layout and connect the four newer cohesive kit photographs to the four existing tabs. |
| `nail-size-set.png` | Home kit, Help hub, Sizing | The fruit-art set is reused for several different jobs and no longer matches the cool neutral education imagery. | Replace its Home and Help presentation with the newer 24-nail kit photograph. Keep the old file on disk until no remaining route depends on it. |
| `apply-press-on-alignment.jpg` | Help hub and Application | The image is useful instructionally but belongs to the older warm, prop-heavy Help set. | Replace it with the new cool-neutral application image and show it only at the alignment step. |
| `remove-adhesive-tabs-warm-water.jpg` | Application and Removal | The action is useful, but the older image does not match the newer kit campaign. | Replace it with the new cool-neutral removal image and show it only with adhesive-tab removal guidance. |
| `hero-s3-summer.png` inside Help | Help hub order path | A product hero does not explain an order-support task and pushes answers down. | Remove it from Help. The footer/hero uses remain outside this pass. |

## Remove from the Help layout

- The three image-led Help hub paths. They require customers to interpret categories before seeing an answer.
- Article hero images. Sizing, Application, and Removal should lead with the immediate answer; instructional media belongs beside the exact step it teaches.
- The extra full-width kit spread above the Home kit tabs. The active image panel already explains the selected group.

## Preserve for now

- The 33 canonical product images in `public/assets/products/`. They are centrally mapped and belong to the active Product work.
- The four newer kit images in `public/assets/kit/`. They form one coherent cool-neutral series and are suitable for the first replacement pass.
- Product option samples in `public/assets/product-options/`; they serve a specific selector function.
- `hero-s3-summer.png` where it still supports the Home/footer presentation. Replacing that campaign asset should be a separate section pass.

## Defer to later image passes

- Collection-card placeholders and review placeholders. They need real destination/product decisions before generation.
- Editorial product gallery, video, and customer-worn placeholders in the uncommitted Product-page work.
- Footer campaign imagery and any remaining legacy assets after their consuming sections are approved.

## New image system for this pass

- Cool white or very light cool-gray backgrounds.
- Soft natural window light and restrained shadows.
- Realistic skin and material texture, with short pale blush press-ons for education.
- No text, logos, excessive props, warm beige cast, CGI polish, or generic stock-photo staging.
- One image per task, lazy-loaded below the fold, with central paths and meaningful alt text.
