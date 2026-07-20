import { SEO } from "@/components/site/SEO";
const PrivacyPage = () => (
  <>
    <SEO title="Privacy" description="Privacy policy." path="/privacy" />
    <article className="container-editorial py-16 max-w-3xl">
      <p className="kicker">Legal</p>
      <h1 className="mt-2 font-serif text-4xl lg:text-6xl font-semibold text-foreground leading-tight">Privacy</h1>
      <div className="prose prose-invert mt-10 max-w-none prose-p:text-foreground prose-headings:font-serif">
        <p>We collect the minimum data required to run the archive. We do not sell data, ever.</p>
        <h2>What we collect</h2>
        <p>Account information for editorial staff; email addresses attached to corrections and right-of-reply submissions; standard server logs. No behavioral advertising trackers.</p>
        <h2>What we publish</h2>
        <p>Only material relevant to a documented public incident. Home addresses, personal contact details and unrelated private information are excluded by policy.</p>
      </div>
    </article>
  </>
);
export default PrivacyPage;
