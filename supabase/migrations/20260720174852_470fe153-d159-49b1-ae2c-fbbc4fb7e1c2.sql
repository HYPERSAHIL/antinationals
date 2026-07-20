
-- evidence-public: read for everyone, write admins only
CREATE POLICY "public read evidence-public" ON storage.objects FOR SELECT
  USING (bucket_id = 'evidence-public');
CREATE POLICY "admin write evidence-public" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'evidence-public' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update evidence-public" ON storage.objects FOR UPDATE
  USING (bucket_id = 'evidence-public' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete evidence-public" ON storage.objects FOR DELETE
  USING (bucket_id = 'evidence-public' AND public.has_role(auth.uid(),'admin'));

-- evidence-originals: admin only for everything
CREATE POLICY "admin read evidence-originals" ON storage.objects FOR SELECT
  USING (bucket_id = 'evidence-originals' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write evidence-originals" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'evidence-originals' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update evidence-originals" ON storage.objects FOR UPDATE
  USING (bucket_id = 'evidence-originals' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete evidence-originals" ON storage.objects FOR DELETE
  USING (bucket_id = 'evidence-originals' AND public.has_role(auth.uid(),'admin'));
