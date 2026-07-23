import { Link } from "react-router-dom";
import { SEO } from "@/components/site/SEO";
import { AsciiScene } from "@/components/ascii/AsciiScene";
import { TerminalLabel } from "@/components/primitives/TerminalLabel";

const NotFound = () => (
  <>
    {/* 404 is always noindex, regardless of site-wide indexing posture. */}
    <SEO title="Not found" description="Record not found." noindex />
    <section className="container-editorial py-24 text-center">
      <TerminalLabel tone="accent">HTTP 404 · RECORD NOT FOUND</TerminalLabel>
      <AsciiScene className="mt-6 mx-auto text-muted-foreground">
{`  ┌────────────────────────────┐
  │  ██  NO RECORD  ██         │
  │  ██  MATCHES    ██         │
  │  ██  YOUR QUERY ██         │
  └────────────────────────────┘`}
      </AsciiScene>
      <h1 className="mt-8 font-display text-4xl md:text-5xl text-foreground">Nothing on file.</h1>
      <p className="mt-3 text-muted-foreground">The record you requested does not exist in the archive.</p>
      <Link to="/" className="mt-6 inline-flex label-mono border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors">
        Return to index
      </Link>
    </section>
  </>
);

export default NotFound;
