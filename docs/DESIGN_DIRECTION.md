# Antinationals — Design Direction

Phase 0B0 contract. This document freezes the human-facing direction
before Phase 0B routes are built. Every future route must be able to
answer the tests at the end of this file before it is declared done.

## 1. Design read

Antinationals is an **investigative public-record and evidence
publication** with a machine/archive notation layer over it.

It is not:
- a hacker or Matrix aesthetic
- a cyberpunk site
- a military HUD or "wanted" directory
- a SaaS dashboard
- a generic newspaper template

## 2. Actual visitor

Someone who has already encountered a disputed claim, image, video, or
public incident elsewhere and is trying to determine, in this order:

1. what happened
2. what evidence exists
3. where the evidence originated
4. whether the source was preserved
5. what is verified vs uncertain
6. how identities were established or disputed
7. whether corrections were made

They should leave understanding the evidence, not trusting our brand.

## 3. Design dials

| Dial                  | Setting |
|-----------------------|---------|
| Design variance       | 6 / 10  |
| Motion intensity      | 2–3 / 10|
| Information density   | 6 / 10  |

Interpretation: distinctive not chaotic; sparse purposeful motion;
homepage may breathe, archive/detail pages may be dense. Do not
install animation libraries just to satisfy these numbers.

## 4. Domain vocabulary

Derive visual and structural language from:
evidence boxes, contact sheets, chain-of-custody slips, source
ledgers, court exhibits, newsroom copy desks, redaction tape, proof
marks, marginal annotation, case indexes, archive stamps, revision
history, public registries.

Do not derive it from: Matrix hacking, military HUDs, dark-web
clichés, weapons, sensational wanted-poster imagery.

## 5. Signature — the Evidence Spine

The recurring product signature is the **Evidence Spine**: a compact
ASCII relationship diagram that teaches the archive model as it
appears.

```
INC-00031
│
├── EVD-00192
│      ├── ANT-00142
│      ├── ANT-00191
│      └── SRC-00077
│
└── EVD-00217
       ├── ANT-00142
       └── COR-00012
```

Adaptations per surface:

- Incident:   Incident → Evidence → Subjects
- Evidence:   Source → Evidence → Subjects
- Subject:    Evidence → Identity claim → Supporting sources → Review state
- Correction: Previous state → Correction → Current state

Implementation notes:
- `src/components/ascii/AsciiRelationship.tsx` is the current
  primitive. Extend it to cover the four shapes above. Do not
  introduce a graph library.
- Overflow contract stays `scroll` so meaningful IDs are never
  silently clipped on narrow viewports.
- The Spine is functional ASCII (category 2 below), not decoration.
  It should appear at least once on every record page.

## 6. Three defaults to reject

### Reject A — Hacker terminal everywhere
Replace with: human investigative publication + machine/archive
notation where functionally relevant. Do not render marketing copy
as fake terminal output. Strings like `SYSTEM INITIALIZED`,
`DATABASE LOADED`, `INDEXING…`, `PROCESSING RECORD…` must only
appear when a real process is happening.

### Reject B — Card-grid architecture
Avoid `CARD / CARD / CARD` layouts. Prefer, per surface: contact
sheets, source ledgers, evidence strips, chronology rails,
asymmetric editorial spreads, ruled records, metadata columns,
tabular source lists, relationship diagrams. Cards remain valid
only when they represent a genuinely discrete object.

### Reject C — Repeated AI landing-page rhythm
Avoid every section repeating:
`tiny uppercase eyebrow → giant serif heading → paragraph → 3 cards → CTA`.
Guideline: roughly **one editorial eyebrow per three major sections**
unless the IA genuinely requires more. Mono labels should communicate
actual metadata or system state, not decorate every heading.

## 7. Human layer vs machine layer

**Human layer** — page titles, plain-language summaries, methodology
explanations, contextual prose, correction explanations, "what
happened" descriptions. Voice: direct, factual, restrained, specific.

**Machine/archive layer** — public IDs, hashes, timestamps, archive
states, source states, provenance metadata, relationship diagrams,
revision markers.

Sentence case for most human-facing headings. Uppercase mono belongs
to archive metadata.

## 8. Copy anti-slop rules

Ban: *seamless, elevate, unlock, unleash, next-generation, powerful
platform, cutting-edge, revolutionize, delve, tapestry, in today's
fast-paced world, more than just, it is not just X — it is Y.*

Prefer specific statements over slogans.

> Bad: "Empowering truth through cutting-edge evidence technology."
> Good: "Each record links evidence to its original source, preservation
> status and correction history."

Do not force every sentence into the same cadence. Do not overuse em
dashes as an AI prose tic, but do not impose an artificial blanket
punctuation ban either.

## 9. Development-only language

`PHASE 0`, `FOUNDATION`, `IDX`, `INDEX INITIALIZING`, `BACKEND
DEFERRED` are acceptable during Phase 0 scaffolding **and must not
survive into the launch-facing product**. As each Phase 0B route ships:
remove its `IDX` chip, remove phase labels, replace debug copy with
normal human-facing language. Do not remove chips from routes that
are still placeholders.

## 10. Typography decision

**Chosen system (Phase 0B0):**
- Human/editorial display: **Source Serif 4** (opsz 8..60, weights 500/600/700)
- Body/interface: **Source Sans 3** (weights 400/500/600/700)
- Archive/machine notation: **JetBrains Mono** (weights 400/500/700)

**Replaced:** Fraunces + Inter. Fraunces/Inter had drifted into the
generic AI-editorial default; Adobe's Source family reads as
publication typography (Source Serif 4 has real optical-size
variation and less "curvy-magazine" personality than Fraunces) while
Source Sans 3 keeps interface text neutral. Newsreader + Plex Mono
was evaluated as an alternative and rejected: Newsreader's larger
x-height competes with the mono metadata layer for attention.

**Loading:** single Google Fonts `<link>` in `index.html` with
`preconnect` and `display=swap`. No CSS `@import`. No additional
weights unless a specific component demonstrates need.

**Fallback stack:**
- serif → `Source Serif 4, Georgia, serif`
- sans  → `Source Sans 3, system-ui, sans-serif`
- mono  → `JetBrains Mono, ui-monospace, monospace`

Verification checklist when touching type tokens: ASCII alignment
(mono width unchanged), 390 / 768 / 1280 layouts, wordmark
compact-variant fallback, heading wrap on long titles, CLS.

## 11. ASCII role

Three levels, formalized:

1. **Dominant** — one major ASCII identity moment where justified
   (e.g. homepage wordmark). Not more than one per viewport.
2. **Functional** — ASCII that explains something: Evidence Spine,
   relationship diagrams, source flow, chronology, archive state.
   This is the most valuable category and should carry the archive.
3. **Ambient** — sparse decorative motifs (crowd, dossier, scanner,
   CCTV, archive texture). Roughly one per major section/viewport
   at most.

On evidence-heavy pages, real evidence imagery becomes visually
dominant and ASCII recedes to functional/ambient. Never place
sensational/militant/weapon ASCII next to a real subject in a way
that implies a factual characterization.

## 12. Pre-route checklist

Before starting any Phase 0B route, state:

- **Domain** — which real-world archive concept informs this route?
- **Signature** — how does the Evidence Spine (or another archive-
  specific behavior) appear here?
- **Default to reject** — what generic layout would an AI most
  likely produce here, and what replaces it?

## 13. Pre-completion tests

Before declaring a route complete, run all four:

- **Swap test** — could the typography/layout be swapped with a
  generic template without changing the page's identity? (It should
  not survive the swap.)
- **Squint test** — does hierarchy remain clear when blurred?
- **Signature test** — can you point to one element that specifically
  belongs to Antinationals on this page?
- **Token test** — do the tokens and component vocabulary belong to
  an evidence archive, or to any SaaS site?

These tests are internal. They must not appear as visible copy.
