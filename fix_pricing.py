with open('pricing.html', 'r', encoding='utf-8') as f:
    html = f.read()

original = html

# 1. Fix SVG case attributes
html = html.replace('viewbox="', 'viewBox="')
html = html.replace('preserveaspectratio="', 'preserveAspectRatio="')

# 2. Fix icon grid - replace Tailwind classes with explicit inline styles
# The icon wrapper divs use Tailwind flex classes that may not render
html = html.replace(
    '<div class="flex flex-col items-center gap-3" data-id="158">',
    '<div data-id="158" style="display:flex;flex-direction:column;align-items:center;gap:12px;">'
)
html = html.replace(
    '<div class="flex flex-col items-center gap-3" data-id="161">',
    '<div data-id="161" style="display:flex;flex-direction:column;align-items:center;gap:12px;">'
)
html = html.replace(
    '<div class="flex flex-col items-center gap-3" data-id="164">',
    '<div data-id="164" style="display:flex;flex-direction:column;align-items:center;gap:12px;">'
)
html = html.replace(
    '<div class="flex flex-col items-center gap-3" data-id="170">',
    '<div data-id="170" style="display:flex;flex-direction:column;align-items:center;gap:12px;">'
)
html = html.replace(
    '<div class="flex flex-col items-center gap-3" data-id="173">',
    '<div data-id="173" style="display:flex;flex-direction:column;align-items:center;gap:12px;">'
)

# 3. Fix icon-circle margin conflict - remove margin:0 auto since parent uses align-items:center
# Also replace the class with inline style for guaranteed rendering
html = html.replace(
    '.icon-circle {\n        width: 56px; height: 56px; background: rgba(0,212,255,0.1);\n        border-radius: 50%; display: flex; align-items: center; justify-content: center;\n        font-size: 24px; margin: 0 auto;\n      }',
    '.icon-circle {\n        width: 56px; height: 56px; background: rgba(0,212,255,0.1);\n        border-radius: 50%; display: flex; align-items: center; justify-content: center;\n        font-size: 24px;\n      }'
)

# 4. Fix icon grid container - replace Tailwind grid class with inline style
html = html.replace(
    '<div class="grid gap-6 mx-auto fade-in" data-id="157" id="icon-grid-w3x4" style="grid-template-columns:repeat(5,1fr);max-width:800px;">',
    '<div class="fade-in" data-id="157" id="icon-grid-w3x4" style="display:grid;grid-template-columns:repeat(5,1fr);gap:24px;max-width:800px;margin:0 auto;">'
)

if html != original:
    with open('pricing.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("✅ pricing.html updated")
else:
    print("⚠️ No changes made")

# Verify
import re
remaining = re.findall(r'viewbox=|preserveaspectratio=', html, re.IGNORECASE)
print(f"Remaining lowercase SVG attrs: {len(remaining)}")
