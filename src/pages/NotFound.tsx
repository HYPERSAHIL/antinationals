import { Link } from "react-router-dom";
import { SEO } from "@/components/site/SEO";

const NotFound = () => (
  <>
    <SEO title="Not found" description="Page not found." path="/404" />
    <div className="container-editorial py-32 max-w-2xl text-center">
      <p className="kicker">Error 404</p>
      <h1 className="mt-4 font-serif text-6xl font-semibold text-foreground">Not on file.</h1>
      <p className="mt-4 text-muted-foreground">
        The record you requested is not in the archive. It may have been unpublished or the address is mistyped.
      </p>
      <Link to="/" className="mt-8 inline-block border border-foreground bg-foreground px-6 py-2.5 text-sm text-background hover:bg-transparent hover:text-foreground transition-colors">
        Return home
      </Link>
    </div>
  </>
);

export default NotFound;
