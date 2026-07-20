
# AntiNationals — Public Accountability Directory

Full rebuild of the project. The current ColorPlay gambling app (pages, DB tables, styles, auth flow) will be removed and replaced with an investigative-journalism style evidence archive.

## Phase 0 — Clean Rebuild

**Delete from repo:**
- All `src/pages/*` (HomePage, ColourGame, DiceGame, WalletPage, HistoryPage, ProfilePage, AuthPage, AdminDashboard, Index)
- `src/components/BottomNav.tsx`, `TopBar.tsx`, `NavLink.tsx`
- `src/contexts/AuthContext.tsx` (replaced by new AntiNationals auth)
- `src/lib/supabase.ts` re-export (keep only auto-generated `src/integrations/supabase/client.ts`)
- Old CSS tokens in `index.css` (neon colors, Orbitron font, glow utilities)

**Drop from DB (via migration):**
- `profiles.wallet_balance` column (repurpose profiles for admins)
- Table `game_history`
- `handle_new_user` trigger reference to old profile shape
- `get_admin_stats` function (replace with new admin stats)

**Preserve:**
- Vite / TS / Tailwind / shadcn config
- `src/integrations/supabase/client.ts` and `types.ts` (auto-gen)
- `.env`, `supabase/config.toml`
- `user_roles` table + `has_role()` function (reused for admin auth)
- shadcn `src/components/ui/*` primitives
- `src/hooks/*`, `src/lib/utils.ts`

## Design system

- **Palette:** near-black background (`#0a0a0a`), off-white text, layered neutral grays, single deep-red accent (`#a01515`-ish) reserved for verification badges, destructive actions, and key CTAs.
- **Type:** editorial serif for headings (e.g. Fraunces or Instrument Serif) + neutral sans (Inter) for body/UI. Large tracking-tight display sizes on hero, tabular numerals for stats.
- **Layout:** wide dense grids, hairline dividers, generous whitespace around evidence media, no gradients/glass. Subtle 150ms transitions only.
- Rewrites `src/index.css` and `tailwind.config.ts` with new semantic tokens: `--bg`, `--surface`, `--ink`, `--muted-ink`, `--rule`, `--accent`, `--verified`, `--corroborated`, `--partial`, `--unverified`, `--disputed`, `--corrected`.
- Global `<SiteHeader>` (logo "ANTI NATIONALS" + nav: Directory / Incidents / Timeline / Methodology / About) and `<SiteFooter>` (policies, editorial principle, correction link).

## Database schema (new migration)

Tables (all in `public`, with GRANTs + RLS):

- `subjects` (slug, display_name, subject_number auto seq, role, organization, department, identity_status enum, identity_notes, bio_summary, primary_image, published bool)
- `incidents` (slug, title, summary, incident_date, start_time, end_time, country, state, city, location_description, latitude, longitude, verification_status enum, cover_media, published bool)
- `subject_incidents` (subject_id, incident_id, relation_note) — join
- `evidence` (incident_id, subject_id nullable, title, media_type enum, public_media_url, private_original_path, original_filename, file_size, mime_type, sha256, source_name, source_url, archive_url, attribution, capture_time, upload_time, location, verification_status, notes, redactions_applied bool, copyright_status, permission_status, published bool)
- `sources` (incident_id, evidence_id nullable, publisher, title, url, archived_url, publication_date, source_type enum, reliability_notes)
- `identity_evidence` (subject_id, evidence_id, basis_note)
- `corrections` (type, related_subject_id nullable, related_incident_id nullable, submitter_contact, message, evidence_urls[], status enum, admin_notes, published bool)
- `replies` (subject_id, submitter_name, submitter_contact private, response_text, supporting_urls[], status enum, published bool)
- `audit_log` (actor_id, action, entity_type, entity_id, diff jsonb) — admin-read only
- `profiles` (id, display_name, is_admin computed via `has_role`) — kept minimal

**Enums:** `identity_status` (verified/corroborated/unconfirmed), `verification_status` (verified/corroborated/partially_verified/unverified/disputed/corrected), `media_type` (photo/video/document/audio), `source_type` (primary/reputable_media/eyewitness/social_media/government_record/legal_court_record), `correction_status` (pending/accepted/rejected/applied), `reply_status` (pending/approved/rejected).

**RLS:**
- Anonymous + authenticated: SELECT only where `published = true` on subjects, incidents, evidence, sources, subject_incidents, identity_evidence.
- Admins (via `has_role(uid, 'admin')`): full CRUD on everything, read audit_log.
- Corrections/replies: anonymous INSERT allowed (rate-limited via server-side edge function) but SELECT restricted so submitter_contact is never public.

**Storage buckets:**
- `evidence-originals` — PRIVATE, admin-only via signed URLs
- `evidence-public` — public read, admin write

## Public routes

- `/` Home — hero, live stats (real counts from DB or 0), latest incidents, recently indexed subjects, geographic archive tree.
- `/directory` — searchable/filterable subject grid.
- `/person/:slug` — subject profile: header, identity confidence block, documented incidents timeline, evidence gallery, identification basis, right-of-reply CTA.
- `/incidents` — filterable incident list.
- `/incident/:slug` — summary, timeline, evidence, people, sources, competing accounts.
- `/timeline` — chronological archive grouped by date, filterable.
- `/methodology` — evidence + identity standards.
- `/corrections` — public correction log + submission form.
- `/right-of-reply` — submission form (contact private).
- `/about`, `/editorial-policy`, `/privacy`, `/terms`
- `/search` — global search across subjects/incidents/evidence
- `*` — 404

## Admin routes (protected — require `has_role admin`)

- `/admin/login`
- `/admin` — dashboard: counts, drafts, unverified identities, pending corrections/replies, recent edits
- `/admin/incidents` (list + wizard: details → evidence upload → sources → link subjects → preview → publish)
- `/admin/subjects` (list + create/edit with explicit identity status selection)
- `/admin/evidence` (upload, SHA-256 hashing client-side, redaction disclosure field, dual bucket handling)
- `/admin/corrections`, `/admin/replies` (moderation queues)
- `/admin/audit-log`

## Evidence integrity

- Client computes SHA-256 on upload; both original and public derivative stored.
- Publish checklist component surfaces warnings (missing source, missing caption, identity default, missing incident date) but doesn't hard-block.
- All admin mutations write to `audit_log` via DB trigger.

## Editorial safety principle (site-wide)

- Footer + methodology banner: **"Document the conduct. Preserve the evidence. Let the record speak."**
- Legal line on every subject/incident page: "Inclusion in this archive documents an incident or allegation supported by the cited material. It does not by itself constitute a finding of criminal or civil liability."
- Non-verified identity pages show prominent warning: "Identity has not been independently verified. Do not attempt to identify, contact or confront this person."
- No comments, no voting, no crowdsourced ID, no maps of individuals, no bounty/wanted UI.

## SEO + sharing

- `react-helmet-async` for per-route title/description/canonical/og.
- Sitewide `index.html`: title "AntiNationals — Public Accountability Directory", description, OG basics.
- `public/robots.txt` allow all, `sitemap.xml` generator script (`predev`/`prebuild`) covering static routes + dynamic subjects/incidents from DB.
- Share buttons: copy link, X, WhatsApp, native share.

## Empty states

Real DB counts. When empty: polished "No incidents documented yet" states; admin sees "Create first incident" CTA.

## Performance / a11y

Responsive `<picture>` + thumbnail derivatives, lazy loading, skeleton loaders, pagination on directory/incidents (20/page). Semantic HTML, focus rings, alt text required in evidence upload form, keyboard-navigable menus.

## Error handling

Route-level `<ErrorBoundary>`, custom 404, media-failed fallback, upload-error toasts, no raw stack traces.

## Deliverables

1. Delete old files, drop old DB objects.
2. New migration (schema + enums + RLS + GRANTs + audit trigger + storage buckets via tool).
3. New design tokens (`index.css`, `tailwind.config.ts`).
4. All public + admin routes wired in `App.tsx` with new layout.
5. `BUILD_AUDIT.md` at repo root documenting removals, new architecture, tables, RLS, buckets, routes, workflows, known limitations, manual setup (creating first admin user via SQL: `INSERT INTO user_roles (user_id, role) VALUES (...)`).
6. Run `tsgo` typecheck and fix errors before finishing.

## Explicit non-goals / safeguards

- No sample/fake incidents or people are seeded.
- No public write access to any table except moderated `corrections`/`replies` inserts.
- No exposure of `private_original_path` URLs to non-admins.
- The brand name "AntiNationals" is never programmatically applied as a label to any listed subject.
