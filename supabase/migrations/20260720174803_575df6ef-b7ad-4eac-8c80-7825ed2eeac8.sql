
-- ============ CLEANUP OLD APP ============
DROP FUNCTION IF EXISTS public.get_admin_stats() CASCADE;
DROP TABLE IF EXISTS public.game_history CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS wallet_balance;

-- ============ ENUMS ============
CREATE TYPE public.identity_status AS ENUM ('verified','corroborated','unconfirmed');
CREATE TYPE public.verification_status AS ENUM ('verified','corroborated','partially_verified','unverified','disputed','corrected');
CREATE TYPE public.media_type AS ENUM ('photo','video','document','audio');
CREATE TYPE public.source_type AS ENUM ('primary','reputable_media','eyewitness','social_media','government_record','legal_court_record');
CREATE TYPE public.correction_status AS ENUM ('pending','accepted','rejected','applied');
CREATE TYPE public.reply_status AS ENUM ('pending','approved','rejected');

-- ============ HELPERS ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Recreate profiles signup trigger (minimal profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SUBJECTS ============
CREATE SEQUENCE IF NOT EXISTS public.subject_number_seq START 1000;

CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  subject_number INTEGER NOT NULL DEFAULT nextval('public.subject_number_seq'),
  display_name TEXT,
  is_unidentified BOOLEAN NOT NULL DEFAULT false,
  role TEXT,
  organization TEXT,
  department TEXT,
  identity_status public.identity_status NOT NULL DEFAULT 'unconfirmed',
  identity_notes TEXT,
  bio_summary TEXT,
  primary_image TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subjects TO anon, authenticated;
GRANT ALL ON public.subjects TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.subjects TO authenticated;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published subjects" ON public.subjects FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage subjects" ON public.subjects FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_subjects_updated BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_subjects_slug ON public.subjects(slug);
CREATE INDEX idx_subjects_published ON public.subjects(published);

-- ============ INCIDENTS ============
CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  incident_date DATE,
  start_time TIME,
  end_time TIME,
  country TEXT,
  state TEXT,
  city TEXT,
  location_description TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  cover_media TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.incidents TO anon, authenticated;
GRANT ALL ON public.incidents TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.incidents TO authenticated;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published incidents" ON public.incidents FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage incidents" ON public.incidents FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_incidents_updated BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_incidents_slug ON public.incidents(slug);
CREATE INDEX idx_incidents_published ON public.incidents(published);
CREATE INDEX idx_incidents_date ON public.incidents(incident_date DESC);
CREATE INDEX idx_incidents_city ON public.incidents(city);
CREATE INDEX idx_incidents_state ON public.incidents(state);

-- ============ SUBJECT_INCIDENTS ============
CREATE TABLE public.subject_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  relation_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(subject_id, incident_id)
);
GRANT SELECT ON public.subject_incidents TO anon, authenticated;
GRANT ALL ON public.subject_incidents TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.subject_incidents TO authenticated;
ALTER TABLE public.subject_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read links to published" ON public.subject_incidents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.incidents i WHERE i.id = incident_id AND (i.published OR public.has_role(auth.uid(),'admin')))
  AND EXISTS (SELECT 1 FROM public.subjects s WHERE s.id = subject_id AND (s.published OR public.has_role(auth.uid(),'admin')))
);
CREATE POLICY "admins manage links" ON public.subject_incidents FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ EVIDENCE ============
CREATE TABLE public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  title TEXT,
  caption TEXT,
  media_type public.media_type NOT NULL,
  public_media_url TEXT,
  private_original_path TEXT,
  original_filename TEXT,
  file_size BIGINT,
  mime_type TEXT,
  sha256 TEXT,
  source_name TEXT,
  source_url TEXT,
  archive_url TEXT,
  attribution TEXT,
  capture_time TIMESTAMPTZ,
  upload_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  location TEXT,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  notes TEXT,
  redactions_applied BOOLEAN NOT NULL DEFAULT false,
  redaction_notes TEXT,
  copyright_status TEXT,
  permission_status TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT (id, incident_id, subject_id, title, caption, media_type, public_media_url, source_name, source_url, archive_url, attribution, capture_time, upload_time, location, verification_status, notes, redactions_applied, redaction_notes, copyright_status, permission_status, sha256, mime_type, published, created_at, updated_at) ON public.evidence TO anon, authenticated;
GRANT ALL ON public.evidence TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.evidence TO authenticated;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published evidence" ON public.evidence FOR SELECT USING (published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage evidence" ON public.evidence FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_evidence_updated BEFORE UPDATE ON public.evidence FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_evidence_incident ON public.evidence(incident_id);
CREATE INDEX idx_evidence_subject ON public.evidence(subject_id);

-- ============ SOURCES ============
CREATE TABLE public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
  evidence_id UUID REFERENCES public.evidence(id) ON DELETE CASCADE,
  publisher TEXT,
  title TEXT,
  url TEXT,
  archived_url TEXT,
  publication_date DATE,
  source_type public.source_type NOT NULL DEFAULT 'reputable_media',
  reliability_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sources TO anon, authenticated;
GRANT ALL ON public.sources TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.sources TO authenticated;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read sources of published" ON public.sources FOR SELECT USING (
  (incident_id IS NULL OR EXISTS (SELECT 1 FROM public.incidents i WHERE i.id = incident_id AND (i.published OR public.has_role(auth.uid(),'admin'))))
  AND (evidence_id IS NULL OR EXISTS (SELECT 1 FROM public.evidence e WHERE e.id = evidence_id AND (e.published OR public.has_role(auth.uid(),'admin'))))
);
CREATE POLICY "admins manage sources" ON public.sources FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ IDENTITY EVIDENCE ============
CREATE TABLE public.identity_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  evidence_id UUID REFERENCES public.evidence(id) ON DELETE SET NULL,
  basis_note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(subject_id, evidence_id)
);
GRANT SELECT ON public.identity_evidence TO anon, authenticated;
GRANT ALL ON public.identity_evidence TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.identity_evidence TO authenticated;
ALTER TABLE public.identity_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read identity basis for published subjects" ON public.identity_evidence FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.subjects s WHERE s.id = subject_id AND (s.published OR public.has_role(auth.uid(),'admin')))
);
CREATE POLICY "admins manage identity evidence" ON public.identity_evidence FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ CORRECTIONS ============
CREATE TABLE public.corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correction_type TEXT NOT NULL,
  related_subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  related_incident_id UUID REFERENCES public.incidents(id) ON DELETE SET NULL,
  page_url TEXT,
  submitter_name TEXT,
  submitter_contact TEXT,
  message TEXT NOT NULL,
  evidence_urls TEXT[],
  status public.correction_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  public_summary TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT (id, correction_type, related_subject_id, related_incident_id, page_url, public_summary, status, published, created_at, updated_at) ON public.corrections TO anon, authenticated;
GRANT INSERT (correction_type, related_subject_id, related_incident_id, page_url, submitter_name, submitter_contact, message, evidence_urls) ON public.corrections TO anon, authenticated;
GRANT ALL ON public.corrections TO service_role;
GRANT UPDATE, DELETE ON public.corrections TO authenticated;
ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published corrections" ON public.corrections FOR SELECT USING (published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "anyone submit corrections" ON public.corrections FOR INSERT WITH CHECK (true);
CREATE POLICY "admins manage corrections" ON public.corrections FOR UPDATE USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete corrections" ON public.corrections FOR DELETE USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_corrections_updated BEFORE UPDATE ON public.corrections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ REPLIES ============
CREATE TABLE public.replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  incident_id UUID REFERENCES public.incidents(id) ON DELETE SET NULL,
  page_url TEXT,
  submitter_name TEXT NOT NULL,
  submitter_role TEXT,
  submitter_contact TEXT NOT NULL,
  response_text TEXT NOT NULL,
  supporting_urls TEXT[],
  status public.reply_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT (id, subject_id, incident_id, submitter_name, submitter_role, response_text, supporting_urls, status, published, created_at) ON public.replies TO anon, authenticated;
GRANT INSERT (subject_id, incident_id, page_url, submitter_name, submitter_role, submitter_contact, response_text, supporting_urls) ON public.replies TO anon, authenticated;
GRANT ALL ON public.replies TO service_role;
GRANT UPDATE, DELETE ON public.replies TO authenticated;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published replies" ON public.replies FOR SELECT USING (published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "anyone submit reply" ON public.replies FOR INSERT WITH CHECK (true);
CREATE POLICY "admins manage replies" ON public.replies FOR UPDATE USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete replies" ON public.replies FOR DELETE USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_replies_updated BEFORE UPDATE ON public.replies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ AUDIT LOG ============
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  diff JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
GRANT INSERT ON public.audit_log TO authenticated;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read audit log" ON public.audit_log FOR SELECT USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins write audit log" ON public.audit_log FOR INSERT WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ ADMIN STATS FUNCTION ============
CREATE OR REPLACE FUNCTION public.get_archive_stats()
RETURNS JSON LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN json_build_object(
    'incidents', (SELECT COUNT(*) FROM public.incidents WHERE published = true),
    'subjects', (SELECT COUNT(*) FROM public.subjects WHERE published = true),
    'evidence', (SELECT COUNT(*) FROM public.evidence WHERE published = true),
    'locations', (SELECT COUNT(DISTINCT city) FROM public.incidents WHERE published = true AND city IS NOT NULL)
  );
END; $$;
GRANT EXECUTE ON FUNCTION public.get_archive_stats() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSON LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Not authorized'; END IF;
  RETURN json_build_object(
    'total_incidents', (SELECT COUNT(*) FROM public.incidents),
    'published_incidents', (SELECT COUNT(*) FROM public.incidents WHERE published),
    'draft_incidents', (SELECT COUNT(*) FROM public.incidents WHERE NOT published),
    'total_subjects', (SELECT COUNT(*) FROM public.subjects),
    'unverified_identities', (SELECT COUNT(*) FROM public.subjects WHERE identity_status <> 'verified'),
    'total_evidence', (SELECT COUNT(*) FROM public.evidence),
    'pending_corrections', (SELECT COUNT(*) FROM public.corrections WHERE status = 'pending'),
    'pending_replies', (SELECT COUNT(*) FROM public.replies WHERE status = 'pending')
  );
END; $$;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats() TO authenticated;
