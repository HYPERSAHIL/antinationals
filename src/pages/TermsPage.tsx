import { SEO } from "@/components/site/SEO";
const TermsPage = () => (
  <>
    <SEO title="Terms" description="Terms of use." path="/terms" />
    <article className="container-editorial py-16 max-w-3xl">
      <p className="kicker">Legal</p>
      <h1 className="mt-2 font-serif text-4xl lg:text-6xl font-semibold text-foreground leading-tight">Terms of use</h1>
      <div className="prose prose-invert mt-10 max-w-none prose-p:text-foreground prose-headings:font-serif">
        <p>Records in this archive are provided for public-interest reference. Inclusion does not constitute a finding of criminal or civil liability. Use of the archive to identify, contact, harass or threaten any person is prohibited.</p>
        <h2>Attribution</h2>
        <p>Citing a record? Link directly to the record page. Reproduction of full evidence assets requires written permission.</p>
      </div>
    </article>
  </>
);
export default TermsPage;
