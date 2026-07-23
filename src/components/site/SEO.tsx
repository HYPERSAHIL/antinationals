import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}

/**
 * SEO — runtime-origin aware. Never hardcodes a domain so hosting/domain
 * can change (Lovable preview, Lovable subdomain, future custom domain)
 * without code changes.
 */
export const SEO = ({ title, description, path, image, type = "website" }: SEOProps) => {
  const fullTitle = title.includes("Antinationals") ? title : `${title} — Antinationals`;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = path ? `${origin}${path.startsWith("/") ? path : `/${path}`}` : origin || undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
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
