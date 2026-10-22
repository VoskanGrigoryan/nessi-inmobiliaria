# Pending tasks

## Property detail map

- **Status:** Deferred
- **Plan:** Add an embedded map to the property detail page, with an address line and a location marker.
- **Admin data needed:** An optional street address or coordinates. Decide whether the public page should show the exact address or an approximate location.
- **Blocker:** Google Maps Embed requires a Google Cloud billing account and API key, even though Embed API usage is listed as free. Google Places previously placed a temporary 50.00 authorization charge on the owner's debit card to verify the payment method. Do not set up Google billing or add a card for this task until the owner is comfortable with the verification charge.
- **Follow-up:** Revisit Google Maps setup, or choose a map option that does not require Google billing.

## Performance review

- **Status:** Pending
- **Report:** The owner reports that many observed requests take longer than the 500 ms response-time target.
- **Initial local measurement (2026-10-22):** The first instrumented login POST took about 3.0 s in Next.js; the action itself took 1.4 s. Its Supabase calls took 489 ms (`signInWithPassword`), 8 ms (`getClaims`), and 882 ms (the `admin_users` query). A later login was nearly instant, so the earlier 23.9 s delay has not been reproduced or explained. The browser Network screenshot also shows a separate `admin_users` GET at about 2.9 s, consistent with the header's client-side admin check; the `20.48 s` text is the waterfall scale, not that request's duration.
- **Additional local observation (2026-10-22):** Navigating from the admin table to a published property detail returned an RSC request after about 20.31 s. The detail route fetches the property and checks admin status in parallel; per-step timings are now logged to separate those calls from Next.js route compilation.
- **Scope:** These are local development observations, not production traces. They identify slow first-run behavior and a potentially slow browser-side admin check, but don't establish a persistent production bottleneck.
- **Implemented locally (2026-10-22):** Public published-property reads now use a cookie-free Supabase client and Next.js's data cache, with `updateTag` invalidation after admin saves/deletes. The home page no longer forces request-time rendering. Listing reads select only card fields and apply operation, type, location, and room filters in Supabase. Property detail pages no longer perform a server-side admin lookup just to show the edit link; it uses the shared client admin status while protected admin routes and actions keep their server checks. Static header markup is server-rendered, and the Supabase browser client is loaded only after hydration for the admin check. The header caches the admin-role result per signed-in user, and the first property card on `/propiedades` loads eagerly to address the browser's LCP warning. Property detail requests log the property query and proxy claims timings; the admin-table title link shows a pending indicator while navigation is in progress.
- **Candidates, in priority order:**
  1. **Measure a slow page request end to end.** Compare server TTFB with Supabase query time and image transfer/decoding. This identifies whether the 500 ms is spent rendering, waiting on data, or loading the page's largest image.
  2. **Verify listing query impact.** Compare the reduced card-query response size and filtered query timings. Add pagination only if the catalog size warrants it.
  3. **Verify public data and page caching.** Confirm the home page is served from the route cache, published-property queries are cache hits after the first request, and admin saves/deletes immediately expire the tagged data. Confirm the detail-page edit link appears for admins after the shared client check completes.
  4. **Measure image loading, especially the home hero and listing cards.** The hero uses a 2200 px, quality-90 Unsplash source. The uploader accepts files up to 8 MB but converts them to WebP at a maximum 1600 px before upload. `next/image` is already used, so first inspect delivered image bytes, LCP, and image-optimizer time. If they are high, reduce source dimensions/quality or create appropriately sized listing images at upload time.
  5. **Verify the header admin-check cache.** Confirm route changes no longer repeat the `admin_users` request and that the admin link updates after sign-in and sign-out. Continue enforcing admin access on the server.
  6. **Inspect remaining client JavaScript only if browser metrics point there.** The home hero uses Motion, and the gallery/contact form are client components. Check their contribution to transferred and hydrated JavaScript before replacing or splitting anything.
- **Follow-up:** Recheck the listing LCP and header requests locally, then capture timings for the slowest routes in the deployed environment. Recheck response time and Core Web Vitals after the change.
