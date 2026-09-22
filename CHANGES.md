# BluWav Growth — Change Tracker

> **Workflow**: All changes MUST go through `staging` → approval → `main` (production).
> No change moves to `main` until it is approved and verified in staging.

---

## How to Use This Tracker

1. **Add a new change** under `## Pending Changes` with status `[ ] Staging`
2. After staging is deployed and reviewed, update to `[ ] Approved`
3. Run `python verify.py` to confirm staging ≠ main (change exists in staging)
4. Merge to main, then run `python verify.py --check-merged` to confirm
5. Move the entry to `## Completed Changes` with status `[x] Merged to Main`

---

## Status Key

| Symbol | Meaning |
|--------|---------|
| `[ ] Staging` | Change is in staging branch, not yet approved |
| `[ ] Approved` | You have approved — ready to merge to main |
| `[x] Merged to Main` | Confirmed live in production |

---

## Pending Changes

### 🔸 CHANGE-003 — index.html: Caribbean SMB repositioning
- **Date**: 2026-09-22
- **Branch**: staging
- **Files Changed**: `index.html`
- **Description**:
  - Hero: new headline, body copy, pill badge, CTAs (View Plans / Book a Consultation)
  - Metrics bar: updated to Caribbean-focused stats (6+ countries, 50+ businesses)
  - "How BluWav Helps" section: Get Found / Get Chosen / Grow framework with checklist
  - Pricing: replaced 3-plan grid with 4 new plans (Launch US$99 / Presence US$149 / Growth US$249 / Pro US$399) with enrollment fees
  - "Why Businesses Choose BluWav" section: 6 reasons replacing old transparency section
  - Final CTA: "Become a Member" replacing "Get My Free Health Score"
  - Footer: updated description to Caribbean-focused messaging
  - All em dashes removed throughout
  - Boxes reduced; checklist-style layout used instead
- **Commit (staging)**: `4bf2211`
- **Status**: `[ ] Staging` — awaiting Thursday presentation and your approval
- **Staging URL**: https://clientflow-2wy.pages.dev (pending push — GitHub 503 in progress)

---


- **Date**: 2026-09-22
- **Branch**: staging
- **Files Changed**: `signup.html` (new), `login.html` (link updates)
- **Description**: Add signup.html with working password toggles, email confirmation, direct sign-in link; update login.html links
- **Commit (staging)**: `41939c1`
- **Commit (main)**: `192c2eb`
- **Status**: `[x] Merged to Main`
- **Verified**: ✅ Confirmed in main on 2026-09-22

---

_Last updated: 2026-09-22_