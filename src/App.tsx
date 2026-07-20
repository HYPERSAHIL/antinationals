import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { SiteLayout } from "@/components/site/SiteLayout";

import HomePage from "./pages/HomePage";
import DirectoryPage from "./pages/DirectoryPage";
import PersonPage from "./pages/PersonPage";
import IncidentsPage from "./pages/IncidentsPage";
import IncidentPage from "./pages/IncidentPage";
import TimelinePage from "./pages/TimelinePage";
import SearchPage from "./pages/SearchPage";
import MethodologyPage from "./pages/MethodologyPage";
import AboutPage from "./pages/AboutPage";
import CorrectionsPage from "./pages/CorrectionsPage";
import ReplyPage from "./pages/ReplyPage";
import EditorialPolicyPage from "./pages/EditorialPolicyPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import AuthPage from "./pages/AuthPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminSubjectEdit from "./pages/admin/AdminSubjectEdit";
import AdminIncidents from "./pages/admin/AdminIncidents";
import AdminIncidentEdit from "./pages/admin/AdminIncidentEdit";
import AdminEvidence from "./pages/admin/AdminEvidence";
import AdminCorrections from "./pages/admin/AdminCorrections";
import AdminReplies from "./pages/admin/AdminReplies";
import NotFound from "./pages/NotFound";

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
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/person/:slug" element={<PersonPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/incident/:slug" element={<IncidentPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/methodology" element={<MethodologyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/corrections" element={<CorrectionsPage />} />
              <Route path="/right-of-reply" element={<ReplyPage />} />
              <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="subjects" element={<AdminSubjects />} />
              <Route path="subjects/new" element={<AdminSubjectEdit />} />
              <Route path="subjects/:id" element={<AdminSubjectEdit />} />
              <Route path="incidents" element={<AdminIncidents />} />
              <Route path="incidents/new" element={<AdminIncidentEdit />} />
              <Route path="incidents/:id" element={<AdminIncidentEdit />} />
              <Route path="evidence" element={<AdminEvidence />} />
              <Route path="corrections" element={<AdminCorrections />} />
              <Route path="replies" element={<AdminReplies />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
