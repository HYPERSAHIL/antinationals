import { SEO } from "@/components/site/SEO";
const EditorialPolicyPage = () => (
  <>
    <SEO title="Editorial policy" description="Editorial policy for AntiNationals." path="/editorial-policy" />
    <article className="container-editorial py-16 max-w-3xl">
      <p className="kicker">Standards</p>
      <h1 className="mt-2 font-serif text-4xl lg:text-6xl font-semibold text-foreground leading-tight">Editorial policy</h1>
      <div className="prose prose-invert mt-10 max-w-none prose-p:text-foreground prose-headings:font-serif">
        <p>The archive is edited by a small independent team. No record is published without primary sourcing and second-archivist review.</p>
        <h2>Independence</h2>
        <p>We accept no advertising, sponsorship or paid placements. We do not endorse political parties or candidates.</p>
        <h2>Conflicts of interest</h2>
        <p>Archivists disclose any personal or professional relationship to a subject and recuse themselves from review of that record.</p>
        <h2>Takedowns</h2>
        <p>We do not remove records to accommodate reputational preference. We correct inaccuracies, add responses, and — in rare cases involving safety — redact identifying detail.</p>
      </div>
    </article>
  </>
);
export default EditorialPolicyPage;
