import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export const SiteLayout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Reset scroll on route change (SPA)
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-2 focus:left-2 focus:bg-background focus:border focus:border-foreground focus:px-3 focus:py-1.5 focus:label-mono"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1 focus:outline-none" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};
