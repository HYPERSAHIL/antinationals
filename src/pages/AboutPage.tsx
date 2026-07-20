import { SEO } from "@/components/site/SEO";

const AboutPage = () => (
  <>
    <SEO title="About" description="About AntiNationals." path="/about" />
    <article className="container-editorial py-16 max-w-3xl">
      <p className="kicker">About</p>
      <h1 className="mt-2 font-serif text-4xl lg:text-6xl font-semibold text-foreground leading-tight">
        A durable record of public conduct.
      </h1>
      <div className="prose prose-invert mt-10 max-w-none prose-p:leading-relaxed prose-p:text-foreground prose-headings:font-serif">
        <p>
          AntiNationals is an independent public-interest archive. The archive exists to preserve significant public events
          in a form that resists distortion: primary evidence, transparent sourcing, disclosed verification state, and a
          permanent history of every change.
        </p>
        <p>
          Records are curated by a small editorial team following the standards described in the <a href="/methodology">methodology</a>.
          We publish nothing that has not been verified against primary material, and we correct anything that turns out to be wrong.
        </p>
        <p>
          The archive does not accept advertising or sponsorship and is not affiliated with any political party, government
          or commercial entity.
        </p>
      </div>
    </article>
  </>
);

export default AboutPage;
