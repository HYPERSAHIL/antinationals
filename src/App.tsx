import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
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
 * Admin routes are intentionally scheduled for Phase 0C and not wired here.
 * Legacy Supabase-backed pages remain on disk but are decoupled from the
 * active UI per the Phase 0 constraint.
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
        <AuthProvider>
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
