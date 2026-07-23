import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  /** Path (e.g. "/about"). Only used when VITE_CANONICAL_ORIGIN is configured. */
  path?: string;
  image?: string;
  type?: "website" | "article";
  /**
   * Per-route index posture. Defaults to the app-wide posture derived from
   * VITE_ALLOW_INDEXING. Explicit `noindex` (e.g. on the 404 page) is always
   * respected regardless of environment.
   */
  noindex?: boolean;
}

/**
 * SEO — canonical/OG author for a route.
 *
 * Canonical strategy (Phase 1B):
 *  - Emits <link rel="canonical"> and og:url ONLY when an explicit
 *    VITE_CANONICAL_ORIGIN is configured at build time.
 *  - Never uses window.location.origin — the temporary Lovable preview
 *    hostname must not silently become canonical.
 *  - No hardcoded domain.
 *
 * Robots strategy:
 *  - The entire Phase 0 foundation defaults to `noindex, nofollow`.
 *    Set VITE_ALLOW_INDEXING="true" at launch time to opt the site in.
 *  - Individual routes may force `noindex` (e.g. NotFound).
 */
const CANONICAL_ORIGIN = (import.meta.env.VITE_CANONICAL_ORIGIN as string | undefined)?.replace(/\/+$/, "");
const INDEXING_ALLOWED = import.meta.env.VITE_ALLOW_INDEXING === "true";

export const SEO = ({ title, description, path, image, type = "website", noindex }: SEOProps) => {
  const fullTitle = title.includes("Antinationals") ? title : `${title} — Antinationals`;
  const url = CANONICAL_ORIGIN && path
    ? `${CANONICAL_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
    : undefined;

  const blockIndex = noindex === true || !INDEXING_ALLOWED;
  const robots = blockIndex ? "noindex, nofollow" : "index, follow";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={robots} />
      {url && <link rel="canonical" href={url} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};
