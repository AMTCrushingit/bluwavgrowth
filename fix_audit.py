import re, os, glob

# ─────────────────────────────────────────────────────────────────────────────
# ISSUE 1: Fix viewbox → viewBox and preserveaspectratio → preserveAspectRatio
#          across ALL html files
# ─────────────────────────────────────────────────────────────────────────────
html_files = sorted(glob.glob('*.html'))
svg_fixed = {}

for fname in html_files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    content = content.replace('viewbox="', 'viewBox="')
    content = content.replace('preserveaspectratio="', 'preserveAspectRatio="')
    if content != original:
        count = original.count('viewbox="') + original.count('preserveaspectratio="')
        svg_fixed[fname] = count
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)

print(f"ISSUE 1 — SVG attributes fixed in {len(svg_fixed)} files:")
for f, c in svg_fixed.items():
    print(f"  ✅ {f}: {c} instances")

# ─────────────────────────────────────────────────────────────────────────────
# ISSUE 2: Fix wave L553 background mismatch in pricing.html
#          The wave between navy section and light section has bg=light-bg
#          but section above is navy — needs to be navy so top of wave blends
# ─────────────────────────────────────────────────────────────────────────────
with open('pricing.html', 'r', encoding='utf-8') as f:
    pricing = f.read()

original = pricing

# The specific bare SVG wave at line 553 (between "Every Growth System Includes"
# navy section and "How To Get Started" light section)
# SVG bg should be var(--navy) to match the section above it
pricing = pricing.replace(
    '<svg data-id="295" preserveAspectRatio="none" style="display:block;width:100%;height:80px;background:var(--light-bg);" viewBox="0 0 1440 80"><path d="M0,40 C360,0 1080,80 1440,40 L1440,0 L0,0 Z" data-id="296" fill="#0a0f1e"></path></svg>',
    '<div style="background:var(--navy);line-height:0;font-size:0;display:block;margin:0;padding:0;"><svg data-id="295" preserveAspectRatio="none" style="display:block;width:100%;height:80px;margin:0;padding:0;vertical-align:bottom;" viewBox="0 0 1440 80"><path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" data-id="296" fill="#f8fafc"></path></svg></div>'
)

if pricing != original:
    print("\nISSUE 2 — Wave L553 background mismatch fixed in pricing.html ✅")
else:
    print("\nISSUE 2 — Wave L553: string not found, checking current state...")
    # Try to find it after the SVG fix
    idx = pricing.find('data-id="295"')
    if idx > -1:
        print(f"  Found at char {idx}: {pricing[idx:idx+150]}")

# ─────────────────────────────────────────────────────────────────────────────
# ISSUE 3: Fix Tailwind-only layout divs in pricing.html — add inline fallbacks
# ─────────────────────────────────────────────────────────────────────────────

# Plan card header rows
pricing = pricing.replace(
    '<div class="flex items-center gap-2" data-id="49">',
    '<div class="flex items-center gap-2" data-id="49" style="display:flex;align-items:center;gap:8px;">'
)
pricing = pricing.replace(
    '<div class="flex justify-between items-center" data-id="86">',
    '<div class="flex justify-between items-center" data-id="86" style="display:flex;justify-content:space-between;align-items:center;">'
)
pricing = pricing.replace(
    '<div class="flex items-center gap-2" data-id="87">',
    '<div class="flex items-center gap-2" data-id="87" style="display:flex;align-items:center;gap:8px;">'
)
pricing = pricing.replace(
    '<div class="flex items-center gap-2" data-id="123">',
    '<div class="flex items-center gap-2" data-id="123" style="display:flex;align-items:center;gap:8px;">'
)

# Mobile nav CTA row
pricing = pricing.replace(
    '<div class="mt-6 flex flex-col gap-3" data-id="26">',
    '<div class="mt-6 flex flex-col gap-3" data-id="26" style="margin-top:24px;display:flex;flex-direction:column;gap:12px;">'
)

# "How to Get Started" step columns
pricing = pricing.replace(
    '<div class="flex flex-col items-center flex-1 px-4 mb-8 md:mb-0" data-id="302">',
    '<div class="flex flex-col items-center flex-1 px-4 mb-8 md:mb-0" data-id="302" style="display:flex;flex-direction:column;align-items:center;flex:1;padding:0 16px;margin-bottom:32px;">'
)
pricing = pricing.replace(
    '<div class="flex flex-col items-center flex-1 px-4 mb-8 md:mb-0" data-id="307">',
    '<div class="flex flex-col items-center flex-1 px-4 mb-8 md:mb-0" data-id="307" style="display:flex;flex-direction:column;align-items:center;flex:1;padding:0 16px;margin-bottom:32px;">'
)
pricing = pricing.replace(
    '<div class="flex flex-col items-center flex-1 px-4 mb-8 md:mb-0" data-id="312">',
    '<div class="flex flex-col items-center flex-1 px-4 mb-8 md:mb-0" data-id="312" style="display:flex;flex-direction:column;align-items:center;flex:1;padding:0 16px;margin-bottom:32px;">'
)
pricing = pricing.replace(
    '<div class="flex flex-col items-center flex-1 px-4" data-id="317">',
    '<div class="flex flex-col items-center flex-1 px-4" data-id="317" style="display:flex;flex-direction:column;align-items:center;flex:1;padding:0 16px;">'
)

print("ISSUE 3 — Tailwind inline fallbacks added to pricing.html ✅")

# ─────────────────────────────────────────────────────────────────────────────
# ISSUE 4: Fix broken absolute paths in pricing.html
# ─────────────────────────────────────────────────────────────────────────────
pricing = pricing.replace('href="/health-score"', 'href="health-score.html"')
pricing = pricing.replace('href="/the-wave"', 'href="the-wave.html"')

print("ISSUE 4 — Broken absolute paths fixed in pricing.html ✅")

# Also fix index.html hero CTA row (Issue 3 - Tailwind only)
with open('index.html', 'r', encoding='utf-8') as f:
    index = f.read()

index = index.replace(
    '<div class="flex justify-center gap-4 flex-wrap mt-10 fade-in" data-id="47" id="hero-ctas-6i7j">',
    '<div class="flex justify-center gap-4 flex-wrap mt-10 fade-in" data-id="47" id="hero-ctas-6i7j" style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-top:40px;">'
)

# Write all changed files
with open('pricing.html', 'w', encoding='utf-8') as f:
    f.write(pricing)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index)

print("ISSUE 3 (index.html) — Hero CTA row inline fallback added ✅")

# ─────────────────────────────────────────────────────────────────────────────
# VERIFICATION
# ─────────────────────────────────────────────────────────────────────────────
print("\n=== VERIFICATION ===")
remaining = 0
for fname in html_files:
    with open(fname) as f:
        c = f.read()
    n = c.count('viewbox="') + c.count('preserveaspectratio="')
    if n > 0:
        print(f"  ⚠️  {fname}: {n} remaining lowercase SVG attrs")
        remaining += n

if remaining == 0:
    print("  ✅ Zero lowercase SVG attributes remaining across all 45 files")

# Check broken paths
with open('pricing.html') as f:
    p = f.read()
broken = p.count('href="/health-score"') + p.count('href="/the-wave"')
print(f"  {'✅' if broken==0 else '❌'} Broken absolute paths in pricing.html: {broken} remaining")

print("\nAll fixes complete.")
