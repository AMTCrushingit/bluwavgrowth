# Shared nav + footer for all BluWav pages

def nav(active=""):
    return f"""<nav id="mainNav">
<div class="nav-logo" style="display:flex;flex-direction:column;align-items:flex-start;line-height:1;padding:4px 0;">
  <div style="font-family:'Kaushan Script',cursive;font-size:26px;line-height:1;color:#fff;">Blu<span style="color:#00E0FF;">Wav</span></div>
  <div style="font-size:8px;font-weight:700;color:#00E0FF;letter-spacing:3px;text-transform:uppercase;line-height:1.4;margin-top:2px;">Get Found. Get Chosen. Grow.</div>
</div>
<div class="nav-links">
  <a class="nav-link{'  nav-active' if active=='systems' else ''}" href="systems.html">Growth Systems</a>
  <a class="nav-link{'  nav-active' if active=='plans' else ''}" href="plans.html">Plans</a>
  <a class="nav-link{'  nav-active' if active=='case-studies' else ''}" href="case-studies.html">Case Studies</a>
  <a class="nav-link{'  nav-active' if active=='health-score' else ''}" href="health-score.html">Health Score</a>
  <a class="nav-link{'  nav-active' if active=='about' else ''}" href="about.html">About</a>
  <a class="nav-link{'  nav-active' if active=='contact' else ''}" href="contact.html">Contact</a>
  <a class="nav-cta" href="https://calendly.com/bluwavgrowth" target="_blank" rel="noopener">Book a Call</a>
</div>
<button aria-label="Menu" class="hamburger" id="hamburgerBtn" onclick="toggleMob()"><span></span><span></span><span></span></button>
</nav>
<div class="mob-nav" id="mobNav">
<div class="mob-nav-inner">
  <a class="mob-link" href="systems.html" onclick="closeMob()">&#127757; Growth Systems</a>
  <a class="mob-link" href="plans.html" onclick="closeMob()">&#128176; Plans</a>
  <a class="mob-link" href="case-studies.html" onclick="closeMob()">&#128202; Case Studies</a>
  <a class="mob-link" href="health-score.html" onclick="closeMob()">&#129658; Health Score</a>
  <a class="mob-link" href="about.html" onclick="closeMob()">&#128100; About</a>
  <a class="mob-link" href="contact.html" onclick="closeMob()">&#128222; Contact</a>
  <a class="mob-cta" href="https://calendly.com/bluwavgrowth" target="_blank" rel="noopener" onclick="closeMob()">&#128197; Book a Call</a>
</div>
</div>"""

def footer():
    return """<footer style="background:rgba(0,43,73,0.97);padding:60px 0 0;width:100%;max-width:100%;box-sizing:border-box;">
<div style="width:100%;max-width:100%;padding:0 64px;box-sizing:border-box;">
<div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;padding-bottom:48px;width:100%;">
<div>
  <div style="font-family:'Kaushan Script',cursive;font-size:34px;color:#fff;line-height:1;margin-bottom:6px;">Blu<span style="color:#00E0FF;">Wav</span></div>
  <div style="font-size:10px;font-weight:700;color:#F7C873;letter-spacing:3px;text-transform:uppercase;margin-top:4px;margin-bottom:12px;">A Stratiix Group Company</div>
  <p style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;max-width:280px;">We build Growth Systems that help businesses become more visible, more trusted, and more profitable.</p>
</div>
<div>
  <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.4);margin-bottom:16px;">Systems</div>
  <div style="display:flex;flex-direction:column;gap:10px;">
    <a href="systems.html" style="font-size:13px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">Growth Systems</a>
    <a href="plans.html" style="font-size:13px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">Plans</a>
    <a href="crm.html" style="font-size:13px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">BluWav CRM</a>
    <a href="health-score.html" style="font-size:13px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">Health Score</a>
  </div>
</div>
<div>
  <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.4);margin-bottom:16px;">Company</div>
  <div style="display:flex;flex-direction:column;gap:10px;">
    <a href="about.html" style="font-size:13px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">About</a>
    <a href="case-studies.html" style="font-size:13px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">Case Studies</a>
    <a href="contact.html" style="font-size:13px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">Contact</a>
    <a href="privacy.html" style="font-size:13px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">Privacy</a>
  </div>
</div>
<div>
  <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.4);margin-bottom:16px;">Get Started</div>
  <div style="display:flex;flex-direction:column;gap:10px;">
    <a href="health-score.html" style="font-size:13px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">Free Health Score</a>
    <a href="https://calendly.com/bluwavgrowth" target="_blank" style="font-size:13px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">Book a Call</a>
    <a href="mailto:hello@bluwavgrowth.com" style="font-size:13px;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.6)'">hello@bluwavgrowth.com</a>
  </div>
</div>
</div>
</div>
<div style="border-top:1px solid rgba(255,255,255,0.06);padding:20px 64px;width:100%;max-width:100%;box-sizing:border-box;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
  <div style="font-size:12px;color:rgba(255,255,255,0.3);">&#169; 2026 <span style="color:#00E0FF;">BluWav Growth</span> &#183; All rights reserved.</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.3);">hello@bluwavgrowth.com</div>
</div>
</footer>"""

def base_css():
    return """<style>
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#F4F2ED;color:#1E1E1E;overflow-x:hidden;}
a{text-decoration:none;color:inherit;}
:root{--navy:#002B49;--coral:#FF5500;--gold:#F7C873;--cyan:#00E0FF;--turquoise:#00C2D8;--sand:#F4F2ED;--dark:#1E1E1E;--slate:#64748b;--mist:#e8e4de;}
nav{position:fixed;top:0;left:0;right:0;z-index:100;height:70px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(0,43,73,0.97);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,224,255,0.15);box-shadow:0 2px 24px rgba(0,0,0,0.3);}
.nav-logo{display:flex;flex-direction:column;align-items:flex-start;line-height:1;padding:4px 0;}
.nav-links{display:flex;align-items:center;gap:20px;}
.nav-link{font-size:12px;font-weight:500;color:rgba(255,255,255,0.65);transition:color 0.2s;text-decoration:none;white-space:nowrap;position:relative;}
.nav-link::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:2px;background:#00E0FF;transition:width 0.3s ease;border-radius:2px;}
.nav-link:hover{color:#fff;}
.nav-link:hover::after{width:100%;}
.nav-link.nav-active{color:#fff!important;font-weight:700!important;}
.nav-link.nav-active::after{width:100%!important;background:#FF5500!important;}
.nav-cta{background:var(--coral);color:#fff;font-size:13px;font-weight:700;padding:10px 24px;border-radius:9px;box-shadow:0 4px 16px rgba(255,85,0,0.35);transition:transform 0.15s;text-decoration:none;}
.nav-cta:hover{transform:translateY(-1px);}
.hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;z-index:1001;background:none;border:none;padding:8px;margin:-8px;touch-action:manipulation;}
.hamburger span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:all 0.3s ease;}
.hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
.hamburger.open span:nth-child(2){opacity:0;}
.hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
.mob-nav{display:none;position:fixed;top:70px;left:0;right:0;background:rgba(0,43,73,0.99);backdrop-filter:blur(20px);padding:20px 24px;flex-direction:column;gap:4px;z-index:10000;border-bottom:1px solid rgba(0,224,255,0.15);max-height:calc(100vh - 70px);overflow-y:auto;}
.mob-nav.open{display:flex!important;}
.mob-link{font-size:15px;font-weight:600;color:rgba(255,255,255,0.85);padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);display:block;text-decoration:none;}
.mob-cta{background:var(--coral);color:#fff;font-weight:700;padding:14px;border-radius:10px;text-align:center;margin-top:8px;font-size:15px;display:block;text-decoration:none;}
.page-hero{padding:140px 64px 80px;background:linear-gradient(135deg,#001828 0%,#002B49 60%,#003d5c 100%);position:relative;overflow:hidden;}
.page-hero::before{content:'';position:absolute;top:-100px;right:-100px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(0,224,255,0.07) 0%,transparent 70%);pointer-events:none;}
.section-white{background:#fff;padding:80px 64px;}
.section-sand{background:#F4F2ED;padding:80px 64px;}
.section-navy{background:#002B49;padding:80px 64px;}
.section-dark{background:#001828;padding:80px 64px;}
.wrap{max-width:1100px;margin:0 auto;}
.eyebrow{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2.5px;color:var(--coral);display:block;margin-bottom:12px;}
.page-h1{font-family:'Manrope',sans-serif;font-size:clamp(32px,5vw,56px);font-weight:900;color:#fff;line-height:1.1;margin-bottom:16px;}
.page-h2{font-family:'Manrope',sans-serif;font-size:clamp(26px,4vw,40px);font-weight:800;color:var(--navy);line-height:1.15;margin-bottom:16px;}
.page-h2.light{color:#fff;}
.page-lead{font-size:18px;color:rgba(255,255,255,0.7);line-height:1.75;max-width:600px;}
.page-lead.dark{color:var(--slate);}
.btn-coral{display:inline-flex;align-items:center;gap:8px;background:var(--coral);color:#fff;font-size:15px;font-weight:800;padding:16px 32px;border-radius:11px;text-decoration:none;transition:all 0.2s;box-shadow:0 4px 20px rgba(255,85,0,0.35);}
.btn-coral:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(255,85,0,0.5);}
.btn-outline{display:inline-flex;align-items:center;gap:8px;background:transparent;color:#fff;font-size:15px;font-weight:700;padding:15px 30px;border-radius:11px;text-decoration:none;border:2px solid rgba(255,255,255,0.3);transition:all 0.2s;}
.btn-outline:hover{border-color:#fff;background:rgba(255,255,255,0.05);}
.card{background:#fff;border-radius:20px;padding:36px;border:1px solid var(--mist);box-shadow:0 2px 16px rgba(0,43,73,0.06);transition:transform 0.2s,box-shadow 0.2s;}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,43,73,0.12);}
.card-dark{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:36px;}
@media(max-width:768px){
  nav{padding:0 16px!important;height:60px!important;}
  .mob-nav{top:60px!important;}
  .hamburger{display:flex!important;}
  .nav-links{display:none!important;}
  .page-hero{padding:100px 20px 60px!important;}
  .section-white,.section-sand,.section-navy,.section-dark{padding:60px 20px!important;}
  footer [style*="padding:0 64px"]{padding:0 20px!important;}
  footer [style*="grid-template-columns:2fr"]{grid-template-columns:1fr 1fr!important;}
}
@media(max-width:480px){
  footer [style*="grid-template-columns:2fr"]{grid-template-columns:1fr!important;}
}
</style>"""

def nav_js():
    return """<script>
function toggleMob(){var n=document.getElementById('mobNav'),b=document.getElementById('hamburgerBtn');n.classList.toggle('open');if(b)b.classList.toggle('open');}
function closeMob(){document.getElementById('mobNav').classList.remove('open');var b=document.getElementById('hamburgerBtn');if(b)b.classList.remove('open');}
document.addEventListener('click',function(e){var n=document.getElementById('mobNav'),b=document.getElementById('hamburgerBtn');if(n&&b&&n.classList.contains('open')&&!n.contains(e.target)&&!b.contains(e.target)){n.classList.remove('open');if(b)b.classList.remove('open');}});
</script>"""

print("✓ Template module ready")
