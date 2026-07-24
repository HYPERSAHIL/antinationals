# Antinationals — Discovery Architecture

Phase 0B0 contract. Documents how Antinationals will become
discoverable **after** Phase 0B routes exist and real data is
connected. Nothing in this document is enabled yet.

Indexing remains **off** (`noindex, nofollow` sitewide via
`index.html`, per-route defaults via `SEO.tsx`) until the launch
gate in §7 is satisfied.

## 1. Four discovery surfaces (not one "SEO")

Do not call all four "SEO" internally — the mechanisms differ.

### 1a. Search engines (Google, Bing)
Standard technical SEO fundamentals: crawlable HTML, correct
canonicals, sitemaps, robots policy, structured data where the
page genuinely matches the semantic type, image alt text,
performance.

### 1b. AI-assisted search and citation
Google AI surfaces, ChatGPT search, Bing Copilot, other retrieval
systems. The best AI-readable content is the best human-readable
evidence record — nothing more. See §5.

### 1c. Social sharing and distribution
X, Meta/WhatsApp, Telegram, generic Open Graph consumers. Owned by
the metadata contract (§2) and the share-card system (§4).

### 1d. Community discovery
Reddit and other genuine community discussion. Not a technical
surface; earned by the archive itself. **Never** manufactured with
fake accounts, seeded posts, or brand-mention farms.

## 2. Page metadata contract

Future typed shape (not implemented yet):

```ts
interface PageMetadata {
  title: string;
  description: string;
  canonicalPath?: string;      // path only; origin resolved from env
  shareImage?: string;         // absolute URL when available
  shareImageAlt?: string;
  robots?: "index, follow" | "noindex, nofollow" | "noindex, follow";
  publishedAt?: string;        // ISO 8601
  modifiedAt?: string;         // ISO 8601
  structuredData?: object[];   // JSON-LD blocks, validated per §3
}
```

Rules:
- Origin comes from `VITE_CANONICAL_ORIGIN`. Never hardcode the
  temporary Lovable domain, and never fall back to
  `window.location.origin`.
- `canonicalPath` and `og:url` must self-reference the route, not
  the homepage.
- `modifiedAt` reflects real editorial changes, not build times.
- Per-route `<meta>` tags dedupe by name/property and override
  static `index.html` defaults for JS-executing crawlers; leave
  the sitewide `og:*` in `index.html` as the crawler fallback.

## 3. Structured-data safety

Conservative future palette:

| Type              | When to use                                                        |
|-------------------|--------------------------------------------------------------------|
| `Organization`    | Sitewide, in `index.html`.                                         |
| `WebSite`         | Sitewide, in `index.html`.                                         |
| `BreadcrumbList`  | Any nested route with a real breadcrumb.                           |
| `Article` / `NewsArticle` | Editorial incident/report pages that genuinely match.      |
| Media `CreativeWork` subtypes | Evidence pages, matched to actual media type.          |

**Never automatic:**
- Do **not** emit `Person` structured data for an unidentified,
  proposed, or disputed subject just because a subject page exists.
  Machine-readable identity claims follow the same verification
  standard as visible identity claims. `Person` is allowed only
  when the visible page also asserts a verified identity.
- Do not invent unsupported schema types for SEO reach.
- Validate every JSON-LD block against current official
  documentation at the time it ships.

## 4. Social share cards

Future OG/Twitter card system, derived from the archive itself:

```
ANTINATIONALS

INC-00031
Marketplace incident · 12 MAR 2026

09 EVIDENCE ITEMS
03 DOCUMENTED SUBJECTS
06 SOURCES WITH VERIFIED PROVENANCE

PUBLIC EVIDENCE ARCHIVE
```

Feel: evidence/index artifact. Avoid clickbait, red arrows,
sensational faces, "BREAKING!!!" copy, accusation-heavy phrasing.

Dynamic OG generation is not required for Phase 0B0. A single
static archive card is acceptable at launch; per-route generation
is a later step.

## 5. AI-search principle

No "AI SEO" copy. The best AI-readable content is the best
human-readable evidence record. Every public record should
naturally expose:

- concise factual summary
- specific dates
- location where appropriate
- source attribution and original source links
- preservation/archive status
- verification state
- correction history
- last-reviewed/modified date
- explicit uncertainty where facts remain unresolved

Forbidden:
- keyword-stuffed AI paragraphs
- fake FAQ sections written for retrieval
- fake brand mentions
- seeded Reddit/community posts
- mass near-duplicate pages
- hidden AI-targeted text

`llms.txt` is not a Google ranking mechanism. It may be added
later as optional machine-readable guidance for third-party
systems if it proves useful.

## 6. Copy anti-slop (discovery-specific)

See `DESIGN_DIRECTION.md` §8 for the full ban list. Discovery
copy in `<title>` / `<meta description>` / share cards must
follow the same rules — no "seamless", "cutting-edge",
"revolutionize", etc.

## 7. Crawlable-HTML launch gate (blocker)

Public content routes must serve useful crawlable first-response
HTML **before** indexing is enabled. The current Vite/React SPA
is acceptable during development.

Before launch, evaluate a compatible approach:
- build-time prerendering (e.g. static pre-rendering plugin)
- static generation for public routes
- SSR-compatible public-route output

Do **not** migrate frameworks in Phase 0B. Do **not** implement
bot-specific cloaking or dynamic rendering. Recorded here as a
launch blocker.

## 8. Future discovery infrastructure

Documented, not implemented:

- XML sitemap covering incidents, evidence, subjects, methodology,
  corrections
- RSS/Atom feed for new incidents and major corrections
  (legitimate syndication infrastructure, not an SEO hack)
- route-aware social preview images
- Google Search Console verification
- Bing Webmaster Tools verification
- IndexNow submissions where useful
- automated JSON-LD schema validation in CI
- image/media metadata and responsive sources
- crawl and performance monitoring (LCP, INP, CLS budgets)

## 9. SEO audit workflow

Roles:
- Primary product implementation → **Lovable**
- Heavy technical implementation → **Codex CLI**
- Independent SEO audit → prefer the Codex-native SEO suite
  derived from `AgriciDaniel/codex-seo`. Do not copy an external
  framework into the app; use it to audit from outside.

Audit coverage: technical SEO, crawlability, content, schema,
sitemaps, performance, AI-search readiness, image optimization,
visual/SXO.

Audit cadence:
1. after Phase 0B public routes exist
2. after real data is connected
3. before indexing is enabled
4. periodically after launch

Every recommendation that concerns changing search-engine
behavior must be verified against current primary documentation
before implementation.

## 10. What is not enabled in Phase 0B0

- indexing (still `noindex, nofollow`)
- canonical URLs (only emitted when `VITE_CANONICAL_ORIGIN` is set)
- sitemap.xml
- RSS/Atom
- production structured data for unbuilt routes
- dynamic OG image generation
- SSR / prerendering
- Search Console / Bing Webmaster / IndexNow submissions
- any "AI SEO" copy
