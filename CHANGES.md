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

### 🔸 CHANGE-002 — sales-agent-agreement.html updates
- **Date**: 2026-09-22
- **Branch**: staging
- **Files Changed**: `sales-agent-agreement.html`
- **Description**:
  - Nav bar re-added to the sales agent agreement page
  - Pricing update: Enterprise Plan monthly `$499 → $399/mo`, annual `$4,990 → $3,990/yr`
  - Pricing update: Agency Edition setup fee `$699 → $499`
  - New clause added: "No commission is payable on setup or onboarding fees" (Section 4)
  - New exclusion added: "Setup or onboarding fees on any CRM package" (Section 6)
- **Commit (staging)**: `a922acc`
- **Status**: `[ ] Staging` — ⏳ Awaiting your approval
- **Verified in staging**: ✅ Confirmed diff reviewed 2026-09-22
- **Action needed**: Reply "approve CHANGE-002" to merge to main

---

## Completed Changes

### ✅ CHANGE-001 — signup.html + login.html update
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