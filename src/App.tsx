import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";

import HomePage from "./pages/HomePage";
import ArchivePage from "./pages/ArchivePage";
import IncidentsPage from "./pages/IncidentsPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import SubjectsPage from "./pages/SubjectsPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import EvidenceDetailPage from "./pages/EvidenceDetailPage";
import SubmitPage from "./pages/SubmitPage";
import MethodologyPage from "./pages/MethodologyPage";
import CorrectionsPage from "./pages/CorrectionsPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";

/*
 * Antinationals — Phase 0A route shell.
 *
 * AuthProvider is intentionally NOT mounted here. The public Phase 0
 * foundation has no authenticated routes, so initializing Supabase auth
 * on every public visit is unnecessary. Auth code is preserved on disk
 * and will be reintroduced only around the admin route tree in Phase 0C.
 */

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/incidents/:slug" element={<IncidentDetailPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/subjects/:publicId" element={<SubjectDetailPage />} />
            <Route path="/evidence/:id" element={<EvidenceDetailPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/corrections" element={<CorrectionsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
