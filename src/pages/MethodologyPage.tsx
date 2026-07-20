import { SEO } from "@/components/site/SEO";

const MethodologyPage = () => (
  <>
    <SEO title="Methodology" description="How AntiNationals verifies, sources and preserves records." path="/methodology" />
    <article className="container-editorial py-16 max-w-3xl">
      <p className="kicker">Standards</p>
      <h1 className="mt-2 font-serif text-4xl lg:text-6xl font-semibold text-foreground leading-tight">Methodology</h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        The value of an archive is the discipline behind it. This page describes how records enter the AntiNationals archive,
        how they are verified, and how they can be corrected.
      </p>

      <section className="prose prose-invert mt-12 max-w-none prose-headings:font-serif prose-p:leading-relaxed prose-p:text-foreground">
        <h2>1. Scope</h2>
        <p>We document publicly observable conduct where primary material (photograph, video, court filing, government record, or on-the-record testimony) is available. We do not publish private communications, protected data, or unverified rumor.</p>

        <h2>2. Evidence intake</h2>
        <p>Every submission is filed with its capture context: date, location, source, and — for digital media — a SHA-256 integrity hash calculated at intake and preserved for the life of the record.</p>

        <h2>3. Verification tiers</h2>
        <ul>
          <li><strong>Unverified.</strong> Intake stage. Not visible on the public archive.</li>
          <li><strong>Partially verified.</strong> One primary source confirmed; supporting material pending.</li>
          <li><strong>Corroborated.</strong> Two or more independent sources agree on facts, dates and identities.</li>
          <li><strong>Verified.</strong> Corroborated plus documented review by two archivists.</li>
          <li><strong>Disputed.</strong> Credible counter-evidence has emerged; both sides are preserved on the record.</li>
          <li><strong>Corrected.</strong> A prior version has been amended; the correction is logged and linked.</li>
        </ul>

        <h2>4. Identity discipline</h2>
        <p>Named subjects carry their own identity status: <em>verified</em>, <em>corroborated</em>, or <em>unconfirmed</em>. Records with unconfirmed identity display a prominent notice and are not to be used to identify, contact, or confront the person.</p>

        <h2>5. Right of reply</h2>
        <p>Any named subject or their representative may submit a response. Submitted responses are reviewed for identity and safety, and — if accepted — published alongside the record and never removed from the archival history.</p>

        <h2>6. Corrections</h2>
        <p>All corrections are logged with their timestamp and reasoning. Prior versions remain accessible in the record's history. We do not silently edit.</p>

        <h2>7. What we do not do</h2>
        <p>We do not publish home addresses, contact information, family members who are not themselves named subjects, or protected personal data. We do not host material intended to incite harassment or violence.</p>
      </section>
    </article>
  </>
);

export default MethodologyPage;
