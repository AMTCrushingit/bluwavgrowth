#!/usr/bin/env python3
"""
BluWav Growth — Staging → Production Verification Script
=========================================================
Usage:
  python verify.py                  # Check what's in staging but NOT in main
  python verify.py --check-merged   # Verify staging changes are now in main
  python verify.py --status         # Full status report
"""

import subprocess
import sys
import os
from datetime import datetime

REPO_DIR = os.path.dirname(os.path.abspath(__file__))
CHANGES_FILE = os.path.join(REPO_DIR, "CHANGES.md")

def run(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=REPO_DIR)
    return result.stdout.strip(), result.returncode

def header(title):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def fetch_remote():
    print("🔄 Fetching latest from remote...")
    out, code = run("git fetch origin 2>&1")
    if code != 0:
        print(f"  ⚠️  Could not fetch remote: {out}")
    else:
        print("  ✅ Remote up to date")

def check_staging_vs_main():
    """Show commits in staging that are NOT yet in main."""
    header("STAGING vs MAIN — Pending Changes")

    out, _ = run("git log --oneline origin/main..origin/staging")
    if not out:
        print("\n  ✅ Staging and main are IN SYNC — no pending changes.")
        return []
    
    commits = out.strip().split("\n")
    print(f"\n  ⚠️  {len(commits)} commit(s) in staging NOT yet in main:\n")
    for c in commits:
        print(f"    🔸 {c}")
    
    print("\n  📋 Files changed (staging vs main):")
    diff_stat, _ = run("git diff --stat origin/main origin/staging")
    for line in diff_stat.split("\n"):
        print(f"    {line}")
    
    return commits

def check_merged():
    """Verify that staging changes have been merged into main."""
    header("MERGE VERIFICATION — Confirming Changes in Main")

    out, _ = run("git log --oneline origin/main..origin/staging")
    if not out:
        print("\n  ✅ ALL staging changes are confirmed in main (production).")
        print("  🚀 Safe to proceed to the next change.")
        return True
    else:
        commits = out.strip().split("\n")
        print(f"\n  ❌ BLOCKED — {len(commits)} staging commit(s) NOT yet in main:")
        for c in commits:
            print(f"    🔸 {c}")
        print("\n  ⛔ Do NOT proceed to the next change until these are merged.")
        return False

def full_status():
    """Full status report."""
    header("FULL STATUS REPORT — BluWav Growth")
    print(f"\n  📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")

    # Latest commit on each branch
    main_tip, _ = run("git log --oneline -1 origin/main")
    staging_tip, _ = run("git log --oneline -1 origin/staging")
    print(f"\n  📌 main (production) HEAD:  {main_tip}")
    print(f"  📌 staging HEAD:            {staging_tip}")

    # Pending commits
    pending, _ = run("git log --oneline origin/main..origin/staging")
    if not pending:
        print("\n  ✅ STATUS: Staging and main are IN SYNC")
    else:
        count = len(pending.strip().split("\n"))
        print(f"\n  ⚠️  STATUS: {count} commit(s) pending merge to main")
        for c in pending.strip().split("\n"):
            print(f"    🔸 {c}")

    # Files different between branches
    diff_stat, _ = run("git diff --stat origin/main origin/staging")
    if diff_stat:
        print("\n  📋 Files pending in staging:")
        for line in diff_stat.split("\n"):
            print(f"    {line}")
    
    # CHANGES.md summary
    print("\n  📄 CHANGES.md: See file for full change log and approval status")
    print(f"     Path: {CHANGES_FILE}")

    print("\n" + "=" * 60)

def main():
    args = sys.argv[1:]

    fetch_remote()

    if "--check-merged" in args:
        result = check_merged()
        sys.exit(0 if result else 1)
    elif "--status" in args:
        full_status()
    else:
        # Default: show what's in staging but not main
        pending = check_staging_vs_main()
        if pending:
            print("\n  📌 NEXT STEPS:")
            print("    1. Review changes in staging")
            print("    2. Approve in CHANGES.md (change status to '[ ] Approved')")
            print("    3. Merge staging → main")
            print("    4. Run: python verify.py --check-merged")
            print("    5. Update CHANGES.md status to '[x] Merged to Main'")
            print("    6. Only then move to the next change\n")
        
        print()

if __name__ == "__main__":
    main()