# Next.js Performance & Scalability — Gap Analysis & Next Steps

## What You've Built Well
- React 19 `use cache` + `cacheLife()` with 3-tier TTLs (minutes/hours/days) in [product.service.ts](src/features/product/services/product.service.ts)
- Server-first component split — minimal client JS bundle
- Server-rendered initial feed + React Query infinite scroll on client ([product-load-more.tsx](src/components/shared/product-feed/product-load-more.tsx))
- CloudFront CDN for media + remote image patterns
- `next/image` with placeholder skeletons
- Server actions for auth, voting, S3 uploads — no sensitive logic on client
- Token rotation with request queuing (thundering herd prevention) in [api-server.ts](src/utils/api/api-server.ts) and [axios/index.ts](src/lib/axios/index.ts)
- Optimistic vote updates with rollback
- React Compiler for auto-memoization
- Zod validation on API responses

---

## Gaps by Impact Tier

### Tier 1 — High Impact for Traffic Scale

**1. ISR + `generateStaticParams` for product pages**
- [/launch/[id]/page.tsx](src/app/(pages)/(home)/launch/[id]/page.tsx) has no `generateStaticParams` and no `revalidate` export
- At scale, every product page hit goes to your origin. With ISR, the CDN serves cached HTML and Next.js revalidates in background
- Add `export const revalidate = 60` + `generateStaticParams` for top N products — the rest fall back to on-demand ISR

**2. `revalidateTag` / `revalidatePath` in server actions**
- You have `use cache` on fetchers but no cache invalidation on mutations
- When a user votes or submits a product, the cached server data goes stale silently
- Server actions ([vote.ts](src/features/product/actions/vote.ts), [submit.ts](src/features/views/home/submit/actions/submit.ts)) should call `revalidateTag('products')` after mutations

**3. `loading.tsx` per route segment for streaming**
- No `loading.tsx` files exist anywhere — users see blank until the full server render completes
- Add `loading.tsx` next to each `page.tsx` to stream the shell instantly and progressively fill content
- This directly improves LCP (largest contentful paint) at high latency

**4. React Query `HydrationBoundary` + `prefetchQuery`**
- Auth state and votes are fetched client-side after hydration (waterfall: page load → hydrate → fetch user → fetch votes)
- Prefetch `['me']` and `['users', 'me', 'votes']` on the server, dehydrate state, and pass via `HydrationBoundary` in the layout
- Eliminates the auth waterfall entirely

**5. Dynamic imports for heavy client components**
- No `next/dynamic` usage anywhere
- The submit form, image upload, and dialog components load in the initial bundle even for users who never open them
- `next/dynamic` with `{ ssr: false }` for dialogs, modals, and the submit form would cut the client bundle

---

### Tier 2 — SEO & Discoverability

**6. Dynamic `generateMetadata` for product pages**
- Currently only a static `"LaunchZap"` title in [layout.tsx](src/app/layout.tsx)
- Product pages need `generateMetadata` pulling product name/description/image for Open Graph — critical for social sharing virality on a launch platform

**7. `sitemap.ts` + `robots.ts`**
- No sitemap — search engines can't discover product pages efficiently
- Add `app/sitemap.ts` (dynamic, pulling product IDs) and `app/robots.ts`

**8. JSON-LD structured data on product pages**
- `Product` or `SoftwareApplication` schema lets Google show rich results
- One `<script type="application/ld+json">` in the product page server component

---

### Tier 3 — Observability & Resilience

**9. Web Vitals monitoring**
- No vitals tracking — you're flying blind on real-user performance
- Vercel Analytics + SpeedInsights is zero-config if deploying to Vercel; otherwise `web-vitals` package with a `reportWebVitals` export in layout

**10. Error tracking (Sentry or similar)**
- No error boundary reporting — errors are caught visually but not recorded
- Add Sentry with `@sentry/nextjs` — it instruments both server and client automatically

**11. `middleware.ts` for edge auth**
- Currently auth state is checked client-side after hydration
- A lightweight `middleware.ts` (Edge Runtime) can read the auth cookie and redirect unauthenticated users to login before the page even renders — saves a full round-trip for protected routes

**12. Image `sizes` attribute**
- [image-avatar.tsx](src/components/ui/image-avatar.tsx) uses fixed `width`/`height` props, which is correct for avatars
- For product thumbnail images (if any), ensure `sizes` is set so Next.js generates the right srcset — prevents serving 1200px images on mobile

---

### Tier 4 — Bundle & Build

**13. Bundle analyzer**
- Add `@next/bundle-analyzer` to understand what's in your client bundle
- Run it once to find any server-only packages accidentally shipped to client (e.g. AWS SDK leaking)

**14. Server-only imports guard**
- `@aws-sdk/client-s3` and `@aws-sdk/client-secrets-manager` are in dependencies
- Add `import 'server-only'` at the top of [s3.ts](src/lib/aws/s3.ts) and any other server-only modules to get a build error if they ever get imported client-side

---

## Recommended Order

```
Week 1: loading.tsx files + revalidateTag in mutations (quick wins)
Week 2: generateStaticParams + ISR for product pages
Week 3: generateMetadata + sitemap.ts + robots.ts
Week 4: HydrationBoundary prefetch + dynamic imports
Ongoing: web vitals + Sentry + bundle analyzer
```

## Files to Touch

| File | Change |
|------|--------|
| [/launch/[id]/page.tsx](src/app/(pages)/(home)/launch/[id]/page.tsx) | Add `generateStaticParams`, `revalidate`, `generateMetadata` |
| [vote.ts](src/features/product/actions/vote.ts) | Add `revalidateTag` |
| [submit.ts](src/features/views/home/submit/actions/submit.ts) | Add `revalidateTag` |
| [product.service.ts](src/features/product/services/product.service.ts) | Add `cacheTag` to fetchers |
| `app/(pages)/(home)/loading.tsx` | New — streaming shell |
| `app/sitemap.ts` | New |
| `app/robots.ts` | New |
| [s3.ts](src/lib/aws/s3.ts) | Add `import 'server-only'` |
| [provider-wrapper.tsx](src/components/shared/providers/provider-wrapper.tsx) | Add HydrationBoundary |
