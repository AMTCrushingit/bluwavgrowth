import re

def fix_file(path, changes):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for old, new in changes:
        content = content.replace(old, new)
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Updated: {path}")
    else:
        print(f"⚠️  No changes: {path}")
    return content != original

# ── index.html ──────────────────────────────────────────────────────────────
fix_file('index.html', [
    # 1. Fix SVG attributes
    ('viewbox="', 'viewBox="'),
    ('preserveaspectratio="', 'preserveAspectRatio="'),
    # 2. Remove "Instant score." from CTA sub-text
    ('Instant score. No commitment. No sales pitch.', 'No commitment. No sales pitch.'),
    # 3. Remove "Results in 48 hours" span + surrounding separators
    ('<span>·</span>\n<span>✓ Results in 48 hours</span>\n<span>·</span>\n', ''),
    # 4. Add "Coming Soon" next to The Wave Newsletter in footer
    ('>The Wave Newsletter</a>',
     '>The Wave Newsletter</a> <span style="font-size:11px;font-weight:700;color:#ff6535;background:rgba(255,101,53,0.15);border:1px solid rgba(255,101,53,0.3);padding:2px 8px;border-radius:100px;vertical-align:middle;">Coming Soon</span>'),
])

# ── pricing.html ─────────────────────────────────────────────────────────────
fix_file('pricing.html', [
    # 1. Fix SVG attributes
    ('viewbox="', 'viewBox="'),
    ('preserveaspectratio="', 'preserveAspectRatio="'),
    # 2. Remove "Get found, get chosen, and grow automatically."
    ('Not just a website. Four pillars. One unified system. Get found, get chosen, and grow automatically.',
     'Not just a website. Four pillars. One unified system.'),
    # 3. Starter → Launch Mode
    ('>Starter</span>', '>Launch Mode</span>'),
    # 4. 6 months → 3 months (all occurrences)
    ('first 6 months', 'first 3 months'),
    ('every 6 months', 'every 3 months'),
    # 5. Remove "Results in 48 hours" span + separators
    ('<span>·</span>\n<span>✓ Results in 48 hours</span>\n<span>·</span>\n', ''),
    # 6. Add "Coming Soon" next to The Wave Newsletter in footer
    ('>The Wave Newsletter</a>',
     '>The Wave Newsletter</a> <span style="font-size:11px;font-weight:700;color:#ff6535;background:rgba(255,101,53,0.15);border:1px solid rgba(255,101,53,0.3);padding:2px 8px;border-radius:100px;vertical-align:middle;">Coming Soon</span>'),
])

# ── health-score.html ────────────────────────────────────────────────────────
fix_file('health-score.html', [
    ('viewbox="', 'viewBox="'),
    ('preserveaspectratio="', 'preserveAspectRatio="'),
    ('Instant score. No commitment. No sales pitch.', 'No commitment. No sales pitch.'),
    ('5 quick questions. Instant score. Find out exactly where your business stands online, no waiting, no sales pitch.',
     '5 quick questions. Find out exactly where your business stands online, no waiting, no sales pitch.'),
    ('5 quick questions. Instant score. Find out exactly how visible your business is online, free, no waiting.',
     '5 quick questions. Find out exactly how visible your business is online, free, no waiting.'),
    ('Answer 5 questions and get your personalised digital health score instantly. Free. No commitment.',
     'Answer 5 questions and get your personalised digital health score. Free. No commitment.'),
    ('For Business Owners · Free · Instant Results', 'For Business Owners · Free'),
    ('Instant score, see where you stand immediately', 'See where you stand immediately'),
    ('<span>·</span>\n      <span>✓ Results in 48 hours</span>\n      <span>·</span>\n', ''),
    ('>The Wave Newsletter</a>',
     '>The Wave Newsletter</a> <span style="font-size:11px;font-weight:700;color:#ff6535;background:rgba(255,101,53,0.15);border:1px solid rgba(255,101,53,0.3);padding:2px 8px;border-radius:100px;vertical-align:middle;">Coming Soon</span>'),
])

# ── health-check.html ────────────────────────────────────────────────────────
fix_file('health-check.html', [
    ('viewbox="', 'viewBox="'),
    ('preserveaspectratio="', 'preserveAspectRatio="'),
    ('Instant score. No commitment. No sales pitch.', 'No commitment. No sales pitch.'),
    ('5 quick questions. Instant score. Find out exactly where your business stands online, no waiting, no sales pitch.',
     '5 quick questions. Find out exactly where your business stands online, no waiting, no sales pitch.'),
    ('5 quick questions. Instant score. Find out exactly how visible your business is online, free, no waiting.',
     '5 quick questions. Find out exactly how visible your business is online, free, no waiting.'),
    ('Answer 5 questions and get your personalised digital health score instantly. Free. No commitment.',
     'Answer 5 questions and get your personalised digital health score. Free. No commitment.'),
    ('For Business Owners · Free · Instant Results', 'For Business Owners · Free'),
    ('Instant score, see where you stand immediately', 'See where you stand immediately'),
    ('<span>·</span>\n      <span>✓ Results in 48 hours</span>\n      <span>·</span>\n', ''),
    ('>The Wave Newsletter</a>',
     '>The Wave Newsletter</a> <span style="font-size:11px;font-weight:700;color:#ff6535;background:rgba(255,101,53,0.15);border:1px solid rgba(255,101,53,0.3);padding:2px 8px;border-radius:100px;vertical-align:middle;">Coming Soon</span>'),
])

print("Done!")
