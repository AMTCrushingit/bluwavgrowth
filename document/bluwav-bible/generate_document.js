const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, LevelFormat, ExternalHyperlink,
        InternalHyperlink, Bookmark, HeadingLevel, BorderStyle, WidthType,
        VerticalAlign, PageBreak, Header, Footer } = require('docx');
const fs = require('fs');

const hideAllBorders = {
  top:    { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};
const headerBorder = {
  top:    { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.SINGLE, size: 6, color: '002B49' },
  left:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};
const accentBorder = {
  top:    { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left:   { style: BorderStyle.SINGLE, size: 12, color: '00C2D8' },
  right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

function h1(text, bookmarkId) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: bookmarkId
      ? [new Bookmark({ id: bookmarkId, children: [new TextRun(text)] })]
      : [new TextRun(text)],
  });
}
function h2(text, bookmarkId) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: bookmarkId
      ? [new Bookmark({ id: bookmarkId, children: [new TextRun(text)] })]
      : [new TextRun(text)],
  });
}
function body(text) {
  return new Paragraph({ children: [new TextRun({ text, size: 24, font: 'Cambria' })] });
}
function bodyBold(text) {
  return new Paragraph({ children: [new TextRun({ text, size: 24, font: 'Cambria', bold: true })] });
}
function spacer() {
  return new Paragraph({ children: [new TextRun('')] });
}
function bullet(text, ref) {
  return new Paragraph({
    numbering: { reference: ref || 'bullet-list', level: 0 },
    children: [new TextRun({ text, size: 24, font: 'Cambria' })],
  });
}
function bulletBold(label, rest, ref) {
  return new Paragraph({
    numbering: { reference: ref || 'bullet-list', level: 0 },
    children: [
      new TextRun({ text: label, size: 24, font: 'Cambria', bold: true }),
      new TextRun({ text: rest, size: 24, font: 'Cambria' }),
    ],
  });
}
function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' } },
    children: [new TextRun('')],
    spacing: { before: 120, after: 120 },
  });
}
function tocEntry(text, anchor, indent) {
  return new Paragraph({
    indent: indent ? { left: 360 } : undefined,
    children: [new InternalHyperlink({
      children: [new TextRun({ text, style: 'Hyperlink', size: 22, font: 'Cambria' })],
      anchor,
    })],
  });
}
function infoBox(label, value) {
  return new Table({
    borders: hideAllBorders,
    columnWidths: [2340, 7020],
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    rows: [new TableRow({
      children: [
        new TableCell({
          borders: hideAllBorders,
          width: { size: 2340, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22, font: 'Cambria', color: '002B49' })] })],
        }),
        new TableCell({
          borders: hideAllBorders,
          width: { size: 7020, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: value, size: 22, font: 'Cambria' })] })],
        }),
      ],
    })],
  });
}

function featureTable(headers, rows) {
  const colW = Math.floor(9360 / headers.length);
  const colWidths = headers.map(() => colW);
  return new Table({
    borders: hideAllBorders,
    columnWidths: colWidths,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(h => new TableCell({
          borders: headerBorder,
          width: { size: colW, type: WidthType.DXA },
          shading: { type: 'clear', color: 'auto', fill: 'EBF5FB' },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, font: 'Cambria', color: '002B49' })] })],
        })),
      }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map(cell => new TableCell({
          borders: hideAllBorders,
          width: { size: colW, type: WidthType.DXA },
          shading: { type: 'clear', color: 'auto', fill: ri % 2 === 0 ? 'FFFFFF' : 'F8FBFF' },
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, font: 'Cambria' })] })],
        })),
      })),
    ],
  });
}

const doc = new Document({
  numbering: {
    config: [
      { reference: 'bullet-list', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-2', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-3', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-4', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-5', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-6', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-7', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-8', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-9', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-10', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-11', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-12', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
      { reference: 'bullet-list-13', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 480 } } } }] },
    ],
  },
  styles: {
    default: {
      document: {
        run: { font: 'Cambria', size: 24 },
        paragraph: { spacing: { before: 120, after: 120 } },
      },
    },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal',
        run: { size: 52, bold: true, color: '002B49', font: 'Calibri' },
        paragraph: { spacing: { before: 480, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 34, bold: true, color: '002B49', font: 'Calibri' },
        paragraph: { spacing: { before: 480, after: 120 } } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, color: '00C2D8', font: 'Calibri' },
        paragraph: { spacing: { before: 280, after: 80 } } },
      { id: 'Hyperlink', name: 'Hyperlink', basedOn: 'Normal',
        run: { color: '00C2D8', underline: { type: 'single' } } },
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    
    children: [

      // ── COVER ──────────────────────────────────────────────────────────────
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('The BluWav Bible')] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Primary Business Reference Document', size: 28, font: 'Cambria', color: '64748B', italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 480 },
        children: [new TextRun({ text: 'Version 2.0  \u00b7  July 2026  \u00b7  Confidential', size: 22, font: 'Cambria', color: '64748B' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: {
          top: { style: BorderStyle.SINGLE, size: 4, color: '00C2D8' },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: '00C2D8' },
        },
        spacing: { before: 120, after: 120 },
        children: [new TextRun({ text: 'Get Found. Get Chosen. Grow.', size: 32, font: 'Calibri', bold: true, color: '002B49' })],
      }),
      spacer(),

      // ── TABLE OF CONTENTS ──────────────────────────────────────────────────
      h1('Table of Contents'),
      tocEntry('1. Company Overview & Mission', 'sec1'),
      tocEntry('2. Brand Identity & Corporate Colours', 'sec2'),
      tocEntry('3. Value Proposition', 'sec3'),
      tocEntry('4. Business Model Canvas', 'sec4'),
      tocEntry('5. Growth Systems — Service Packages', 'sec5'),
      tocEntry('6. CRM Products — Full Tier Structure', 'sec6'),
      tocEntry('7. Target Market & Customer Segments', 'sec7'),
      tocEntry('8. Technology Stack', 'sec8'),
      tocEntry('9. Operations & Delivery', 'sec9'),
      tocEntry('10. Marketing & Growth Strategy', 'sec10'),
      tocEntry('11. Key Metrics & KPIs', 'sec11'),
      tocEntry('12. Team & Culture', 'sec12'),
      tocEntry('13. Partner Strategy & Channel Development', 'sec13'),
      spacer(),

      // ── SECTION 1 ──────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('1. Company Overview & Mission', 'sec1'),
      infoBox('Legal Name', 'BluWav Growth'),
      infoBox('Trading As', 'BluWav Growth (formerly BluWav Caribbean)'),
      infoBox('Parent Company', 'A Stratiix Group Company'),
      infoBox('Website', 'bluwavgrowth.com'),
      infoBox('Founded', '2021'),
      infoBox('Headquarters', 'Trinidad & Tobago (globally delivered)'),
      infoBox('Contact', 'hello@bluwavgrowth.com  \u00b7  +1 (868) 297-9960'),
      infoBox('WhatsApp', 'wa.me/18682979960'),
      infoBox('Tagline', 'Get Found. Get Chosen. Grow.'),
      spacer(),

      h2('Mission Statement'),
      new Paragraph({
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: '00C2D8' } },
        indent: { left: 480 },
        spacing: { before: 120, after: 120 },
        children: [new TextRun({ text: 'To help modern service businesses get found online, be chosen first, and grow automatically \u2014 by delivering professional websites, Google visibility, WhatsApp Business systems, CRM, and automation in 48 hours or less.', size: 24, font: 'Cambria', italics: true })],
      }),
      spacer(),

      h2('Vision'),
      body('To be the world\'s most trusted digital growth partner for service businesses \u2014 the first call every business owner makes when they\'re ready to grow online.'),
      spacer(),

      h2('Core Values'),
      bulletBold('Global-first \u2014 ', 'every product and decision built for how modern businesses actually operate, wherever they are.', 'bullet-list'),
      bulletBold('Speed \u2014 ', '48-hour delivery is a promise, not a target.', 'bullet-list'),
      bulletBold('Ownership \u2014 ', 'clients own everything, forever. No lock-in. No subscriptions unless chosen.', 'bullet-list'),
      bulletBold('Transparency \u2014 ', 'clear pricing, clear deliverables, signed agreements before work begins.', 'bullet-list'),
      bulletBold('Continuous improvement \u2014 ', 'CRM Premium clients get every upgrade, every month.', 'bullet-list'),
      spacer(),

      // ── SECTION 2 ──────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('2. Brand Identity & Corporate Colours', 'sec2'),

      h2('Logo & Typography'),
      featureTable(
        ['Element', 'Specification'],
        [
          ['Logo Wordmark', '"Blu" in white, "Wav" in cyan (#00E0FF), Kaushan Script font'],
          ['Tagline Font', 'Plus Jakarta Sans, 8px, uppercase, letter-spaced'],
          ['Heading Font', 'Manrope / Calibri \u2014 700\u2013900 weight'],
          ['Body Font', 'Plus Jakarta Sans / Cambria \u2014 400\u2013600 weight'],
          ['Display Font', 'Playfair Display \u2014 hero headlines only'],
          ['Accent Font', 'Sora \u2014 statistics and large numbers only'],
        ]
      ),
      spacer(),

      h2('Corporate Colour Palette'),
      featureTable(
        ['Colour', 'Hex', 'Usage'],
        [
          ['Navy Blue', '#002B49', 'Primary brand colour. Backgrounds, nav bar, footer, headings, cards.'],
          ['Coral Orange', '#FF5500', 'Primary CTA colour. Buttons, highlights, ticker strip, urgency elements.'],
          ['Electric Cyan', '#00E0FF', 'Accent colour. Logo "Wav", links, icons, The Wave branding.'],
          ['Turquoise', '#00C2D8', 'Secondary cyan. CRM branding, checkmarks, secondary CTAs.'],
          ['Gold', '#F7C873', 'Premium accent. Pricing highlights, "Most Popular" badges, star elements.'],
          ['Sand', '#F4F2ED', 'Page background. Warm off-white for content sections.'],
          ['Slate', '#64748B', 'Body text secondary. Subtitles, captions, muted labels.'],
          ['Dark', '#1E1E1E', 'Primary body text colour.'],
        ]
      ),
      spacer(),

      h2('Brand Voice'),
      featureTable(
        ['Attribute', 'Specification'],
        [
          ['Tone', 'Warm, direct, confident \u2014 never corporate or jargon-heavy'],
          ['Audience', 'Modern service business owners \u2014 practical, results-driven, mobile-first'],
          ['Style', 'Short sentences. Active voice. Real-world context always.'],
          ['Avoid', 'Generic marketing templates, tech jargon without explanation, regional clich\u00e9s'],
        ]
      ),
      spacer(),

      // ── SECTION 3 ──────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('3. Value Proposition', 'sec3'),

      new Paragraph({
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'FF5500' } },
        indent: { left: 480 },
        spacing: { before: 120, after: 240 },
        children: [new TextRun({ text: 'BluWav Growth delivers complete digital growth systems for modern service businesses \u2014 website, Google visibility, WhatsApp Business, CRM, and automation \u2014 in 48 hours or less, at a price point accessible to small and medium businesses, with full client ownership and no lock-in.', size: 24, font: 'Cambria', bold: true })],
      }),

      h2('The Problem We Solve'),
      body('Service businesses lose customers every day to competitors who got online first. The three core problems:'),
      bulletBold('Invisibility \u2014 ', 'no Google Business Profile, or a neglected one. Customers search and find competitors instead.', 'bullet-list-2'),
      bulletBold('Poor first impression \u2014 ', 'outdated websites that don\'t work on mobile, load slowly, or have no clear call to action.', 'bullet-list-2'),
      bulletBold('No follow-up system \u2014 ', 'leads come in via WhatsApp or web forms and are forgotten. No CRM, no automation, no pipeline.', 'bullet-list-2'),
      spacer(),

      h2('Why BluWav Wins'),
      featureTable(
        ['Advantage', 'Detail'],
        [
          ['Speed', '48\u201372 hour delivery. Competitors take weeks or months.'],
          ['Built for modern businesses', 'Every system designed for how customers actually search and communicate today.'],
          ['WhatsApp-first', 'Integrates with how customers communicate globally.'],
          ['Full ownership', 'Clients own their website, CRM, and data forever. No monthly lock-in unless chosen.'],
          ['All-in-one', 'Website + Google + WhatsApp + CRM + Automation in one system.'],
          ['Transparent pricing', 'Fixed prices. No hidden fees. Signed agreement before work starts.'],
          ['14-day CRM trial', 'Every client experiences the full CRM before committing to a plan.'],
        ]
      ),
      spacer(),

      h2('Unique Selling Points'),
      bullet('The only digital growth agency offering a complete system (not just a website) in 48 hours.', 'bullet-list-3'),
      bullet('CRM available in four tiers \u2014 Starter, Lite, Premium, and Enterprise \u2014 to match every stage of growth.', 'bullet-list-3'),
      bullet('CRM Premium evolves every month \u2014 new features, new dashboards, new automation templates.', 'bullet-list-3'),
      bullet('Free Digital Health Check \u2014 lowest-friction entry point in the market.', 'bullet-list-3'),
      bullet('A Stratiix Group Company \u2014 institutional credibility behind a startup-speed agency.', 'bullet-list-3'),
      spacer(),

      // ── SECTION 4 ──────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('4. Business Model Canvas', 'sec4'),

      h2('Customer Segments'),
      bullet('Modern service businesses \u2014 restaurants, salons, contractors, retailers, professional services', 'bullet-list-4'),
      bullet('Businesses with 1\u201350 employees, $50K\u2013$2M annual revenue', 'bullet-list-4'),
      bullet('Owners aged 28\u201355, mobile-first, WhatsApp-primary', 'bullet-list-4'),
      bullet('Global reach: Caribbean, North America, UK, and beyond', 'bullet-list-4'),
      spacer(),

      h2('Value Propositions'),
      bullet('Complete digital system in 48 hours', 'bullet-list-5'),
      bullet('WhatsApp-first, mobile-optimised, globally delivered', 'bullet-list-5'),
      bullet('Full client ownership \u2014 no lock-in', 'bullet-list-5'),
      bullet('Transparent fixed pricing with signed agreements', 'bullet-list-5'),
      bullet('14-day free CRM trial before commitment', 'bullet-list-5'),
      spacer(),

      h2('Revenue Streams'),
      featureTable(
        ['Stream', 'Detail'],
        [
          ['Growth System setup fees', 'Ripple $1,800 / Current $3,000 / Surge $5,000+'],
          ['CRM Starter', '$99 onboarding + $59/month'],
          ['CRM Lite', '$199 onboarding + $99/month (or $990/year)'],
          ['CRM Premium', '$299 onboarding + $179/month (or $1,990/year)'],
          ['CRM Enterprise', '$799 white-glove onboarding + $499/month'],
          ['White-Label CRM', '$499 onboarding + $697/month (annual contract)'],
          ['Hosting renewals', '$200 per 6 months after Year 1'],
        ]
      ),
      spacer(),

      h2('Key Partners'),
      bullet('Supabase (CRM database)', 'bullet-list-6'),
      bullet('Cloudflare Pages (hosting and CDN)', 'bullet-list-6'),
      bullet('Google (GBP, Analytics, Search Console)', 'bullet-list-6'),
      bullet('WhatsApp Business API partners', 'bullet-list-6'),
      bullet('Zapier / Make.com (automation)', 'bullet-list-6'),
      bullet('Stratiix Group (parent company)', 'bullet-list-6'),
      spacer(),

      // ── SECTION 5 ──────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('5. Growth Systems \u2014 Service Packages', 'sec5'),

      body('Every BluWav Growth System includes a 14-day free trial of CRM Premium. After the trial, clients choose their CRM plan.'),
      spacer(),

      featureTable(
        ['Feature', 'Ripple (Starter)', 'Current (Growth)', 'Surge (Full)'],
        [
          ['Price', '$1,800+', '$3,000+', '$5,000+'],
          ['Modern website (owned forever)', '\u2713', '\u2713', '\u2713'],
          ['Google Business Profile setup', '\u2713', '\u2713', '\u2713'],
          ['14-day CRM Premium trial', '\u2713', '\u2713', '\u2713'],
          ['Smart lead automation', '\u2713', '\u2713', '\u2713'],
          ['Performance dashboard', '\u2713', '\u2713', '\u2713'],
          ['On-page SEO essentials', '\u2713', '\u2713', '\u2713'],
          ['Google Search Console + GA4', '\u2713', '\u2713', '\u2713'],
          ['WhatsApp chat button', '\u2713', '\u2713', '\u2713'],
          ['Mobile-optimised design', '\u2713', '\u2713', '\u2713'],
          ['Fast, secure hosting (6 months)', '\u2713', '\u2713', '\u2713'],
          ['WhatsApp Business profile setup', '\u2014', '\u2713', '\u2713'],
          ['WhatsApp product catalog setup', '\u2014', '\u2713', '\u2713'],
          ['Quick replies & automated messages', '\u2014', '\u2713', '\u2713'],
          ['Local SEO + competitor gap analysis', '\u2014', '\u2713', '\u2713'],
          ['5-star reputation builder', '\u2014', '\u2713', '\u2713'],
          ['Automated lead pipeline', '\u2014', '\u2713', '\u2713'],
          ['Conversion-optimised landing page', '\u2014', '\u2713', '\u2713'],
          ['Monthly performance check-in call', '\u2014', '\u2713', '\u2713'],
          ['Priority support', '\u2014', '\u2713', '\u2713'],
          ['Full WhatsApp sales funnel', '\u2014', '\u2014', '\u2713'],
          ['Google Ads campaign setup & launch', '\u2014', '\u2014', '\u2713'],
          ['Bing Places + multi-search engine listing', '\u2014', '\u2014', '\u2713'],
          ['Monthly visibility & performance report', '\u2014', '\u2014', '\u2713'],
          ['Quarterly strategy review call', '\u2014', '\u2014', '\u2713'],
          ['Dedicated account manager', '\u2014', '\u2014', '\u2713'],
        ]
      ),
      spacer(),

      h2('Hosting Policy'),
      featureTable(
        ['Period', 'Policy'],
        [
          ['Year 1', 'Hosting included free in all Growth Systems'],
          ['After Year 1', '$200 per 6 months (secure hosting, SSL, updates, support)'],
          ['Platform', 'Cloudflare Pages \u2014 global CDN, automatic HTTPS, near-zero downtime'],
        ]
      ),
      spacer(),

      // ── SECTION 6 ──────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('6. CRM Products \u2014 Full Tier Structure', 'sec6'),

      body('Every BluWav CRM plan includes a 14-day free trial. No credit card required. Full access. After the trial, clients choose their plan.'),
      spacer(),

      h2('CRM Starter \u2014 $59/month'),
      body('$99 one-time onboarding fee. Cancel anytime.'),
      featureTable(
        ['Feature', 'Status'],
        [
          ['25 contacts', '\u2713 Included'],
          ['Lead tracking', '\u2713 Included'],
          ['Basic contact management', '\u2713 Included'],
          ['Basic reporting', '\u2713 Included'],
          ['1 user only', '\u2713 Included'],
          ['Email support (72hr response)', '\u2713 Included'],
          ['Automation', '\u2014 Not included'],
          ['Pipeline tracking', '\u2014 Not included'],
          ['WhatsApp integration', '\u2014 Not included'],
          ['Team members', '\u2014 Not included'],
        ]
      ),
      spacer(),

      h2('CRM Lite \u2014 $99/month'),
      body('$199 one-time onboarding fee. Or $990/year (2 months free).'),
      featureTable(
        ['Feature', 'Status'],
        [
          ['Everything in CRM Starter', '\u2713 Included'],
          ['Up to 250 contacts', '\u2713 Included'],
          ['Pipeline tracking', '\u2713 Included'],
          ['Basic automation', '\u2713 Included'],
          ['2 team members', '\u2713 Included'],
          ['Standard reporting', '\u2713 Included'],
          ['Priority email support (48hr)', '\u2713 Included'],
        ]
      ),
      spacer(),

      h2('CRM Premium \u2014 $179/month (Introductory Rate)'),
      body('$299 one-time onboarding fee. Or $1,990/year (2 months free). Introductory rate \u2014 locks in for life. Price increases to $199/month when the Growth Dashboard launches.'),
      featureTable(
        ['Feature', 'Status'],
        [
          ['Everything in CRM Lite', '\u2713 Included'],
          ['Unlimited contacts', '\u2713 Included'],
          ['Full pipeline (Lead \u2192 Quote \u2192 Won)', '\u2713 Included'],
          ['Automated follow-ups (30/60/90 days)', '\u2713 Included'],
          ['WhatsApp integration', '\u2713 Included'],
          ['Revenue & aging reports', '\u2713 Included'],
          ['5 team members', '\u2713 Included'],
          ['Document storage', '\u2713 Included'],
          ['Data export', '\u2713 Included'],
          ['All future features included', '\u2713 Included'],
          ['Priority support (24hr \u00b7 email & SMS)', '\u2713 Included'],
          ['Growth Dashboard Pro (when launched)', '\u2713 Included'],
        ]
      ),
      body('Nonprofit Community Rate: Registered nonprofits qualify for $99/month (no setup fee). Email hello@bluwavgrowth.com with registration number.'),
      spacer(),

      h2('CRM Enterprise \u2014 $499/month'),
      body('$799 white-glove onboarding. Covers full team setup, data migration, and training.'),
      featureTable(
        ['Feature', 'Status'],
        [
          ['Everything in CRM Premium', '\u2713 Included'],
          ['Unlimited team members', '\u2713 Included'],
          ['Custom workflows', '\u2713 Included'],
          ['Advanced analytics', '\u2713 Included'],
          ['API access', '\u2713 Included'],
          ['Data migration support', '\u2713 Included'],
          ['Custom integrations', '\u2713 Included'],
          ['Dedicated account manager', '\u2713 Included'],
          ['SLA guarantee', '\u2713 Included'],
          ['Quarterly strategy calls', '\u2713 Included'],
          ['Priority 12hr support', '\u2713 Included'],
        ]
      ),
      spacer(),

      h2('White-Label CRM \u2014 $697/month'),
      body('$499 one-time onboarding. Annual contract required. White-glove setup included.'),
      featureTable(
        ['Feature', 'Status'],
        [
          ['Your logo & domain \u2014 clients never see BluWav', '\u2713 Included'],
          ['Unlimited client accounts', '\u2713 Included'],
          ['Charge $297\u2013$997/mo per client', '\u2713 Included'],
          ['Super Admin dashboard', '\u2713 Included'],
          ['85\u201395% client retention', '\u2713 Included'],
          ['White-glove onboarding', '\u2713 Included'],
          ['Dedicated account manager', '\u2713 Included'],
        ]
      ),
      spacer(),

      // ── SECTION 7 ──────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('7. Target Market & Customer Segments', 'sec7'),

      h2('Primary Market \u2014 Global Service Businesses'),
      featureTable(
        ['Attribute', 'Detail'],
        [
          ['Business size', '1\u201350 employees'],
          ['Revenue range', '$50,000 \u2013 $2,000,000 annually'],
          ['Owner profile', '28\u201355 years old, mobile-first, WhatsApp-primary'],
          ['Sectors', 'Salons, restaurants, contractors, retailers, service businesses, professional services'],
          ['Pain points', 'Invisible on Google, outdated website, no lead follow-up system'],
          ['Decision driver', 'Word of mouth + social media + WhatsApp'],
        ]
      ),
      spacer(),

      h2('Geographic Markets'),
      bullet('Primary: Caribbean (Trinidad & Tobago, Barbados, Jamaica, Guyana, Eastern Caribbean)', 'bullet-list-7'),
      bullet('Secondary: North America \u2014 diaspora communities and service businesses', 'bullet-list-7'),
      bullet('Tertiary: United Kingdom, Canada, and global English-speaking markets', 'bullet-list-7'),
      bullet('Enterprise & White-Label: Global agencies and consultants', 'bullet-list-7'),
      spacer(),

      h2('Ideal Customer Profile'),
      new Paragraph({
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: '00C2D8' } },
        indent: { left: 480 },
        spacing: { before: 120, after: 120 },
        children: [new TextRun({ text: 'The BluWav Ideal Client: A service business owner who has been operating for 2+ years, gets most customers through word of mouth, knows they need to "get online properly" but hasn\'t done it yet, and is losing customers to competitors who got there first. They want it done fast, done right, and they want to own it.', size: 24, font: 'Cambria', italics: true })],
      }),
      spacer(),

      // ── SECTION 8 ──────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('8. Technology Stack', 'sec8'),

      featureTable(
        ['Layer', 'Technology'],
        [
          ['Frontend', 'Pure HTML/CSS/JavaScript \u2014 no framework, no build step'],
          ['Hosting', 'Cloudflare Pages \u2014 global CDN, automatic HTTPS, free tier'],
          ['Source control', 'GitHub (AMTCrushingit/clientflow)'],
          ['Deployment', 'Automatic on every GitHub push \u2014 live in ~60 seconds via Vercel'],
          ['CRM database', 'Supabase (PostgreSQL)'],
          ['Form capture', 'Google Forms + Google Apps Script webhook'],
          ['Automation bridge', 'Zapier / Make.com (Google Form \u2192 Supabase \u2192 WhatsApp)'],
          ['Analytics', 'Google Analytics 4 + Google Search Console'],
          ['Email/Newsletter', 'Mailchimp / ConvertKit (planned)'],
          ['Domain', 'bluwavgrowth.com (Cloudflare DNS)'],
          ['SSL', 'Automatic via Cloudflare'],
        ]
      ),
      spacer(),

      h2('Technical Strengths'),
      bullet('Static HTML = extremely fast load times on mobile networks globally', 'bullet-list-8'),
      bullet('Cloudflare CDN = 190+ edge locations, fast everywhere in the world', 'bullet-list-8'),
      bullet('No server-side logic = very secure, no database exposed to public', 'bullet-list-8'),
      bullet('Zero hosting cost on Cloudflare free tier', 'bullet-list-8'),
      bullet('Any developer can edit \u2014 no proprietary CMS lock-in', 'bullet-list-8'),
      spacer(),

      // ── SECTION 9 ──────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('9. Operations & Delivery', 'sec9'),

      h2('48-Hour Delivery Process'),
      featureTable(
        ['Timeframe', 'Activity'],
        [
          ['Hour 0\u20132', 'Client completes Health Check form. BluWav responds via WhatsApp within 2 hours.'],
          ['Hour 2\u20134', 'Discovery call. Scope confirmed. Contract signed. Invoice issued.'],
          ['Hour 4\u201324', 'Website built. Google Business Profile set up. WhatsApp Business configured.'],
          ['Hour 24\u201336', 'CRM trial activated. Client walkthrough via WhatsApp or video call.'],
          ['Hour 36\u201348', 'Final review. Client approves. Site goes live. Handover complete.'],
          ['Post-delivery', '14-day CRM trial period. Client chooses plan at day 14.'],
        ]
      ),
      spacer(),

      h2('Quality Standards'),
      bullet('Signed agreement before any work begins \u2014 no exceptions', 'bullet-list-9'),
      bullet('Client approval required before launch', 'bullet-list-9'),
      bullet('All assets (website files, GBP access, WhatsApp account) transferred to client on completion', 'bullet-list-9'),
      bullet('Hosting included for 6 months \u2014 renewal reminder sent at month 5', 'bullet-list-9'),
      bullet('CRM trial activation within 24 hours of project completion', 'bullet-list-9'),
      spacer(),

      // ── SECTION 10 ─────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('10. Marketing & Growth Strategy', 'sec10'),

      h2('Acquisition Channels'),
      featureTable(
        ['Channel', 'Detail'],
        [
          ['Facebook Ads', 'Primary paid channel. Two-phase: Awareness \u2192 Lead Generation. Target: business owners 28\u201355.'],
          ['Free Health Check', 'Primary lead magnet. Lowest-friction offer. Results via WhatsApp in 24 hours.'],
          ['The Wave Blog', 'SEO articles targeting digital growth search terms. Internal link network.'],
          ['WhatsApp Broadcast', 'Newsletter distribution. Client nurture. Referral requests.'],
          ['Google Search', 'Organic via GBP + blog SEO. Long-term compounding channel.'],
          ['Referrals', 'Client referral programme (see Commission Structure document).'],
        ]
      ),
      spacer(),

      h2('Content Strategy \u2014 The Wave'),
      body('The Wave is BluWav\'s content hub \u2014 a blog and monthly newsletter delivering practical digital growth advice for modern businesses. It serves three purposes: SEO (ranking for digital growth search terms), trust-building (demonstrating expertise), and lead generation (every article links to the Health Check).'),
      featureTable(
        ['Attribute', 'Detail'],
        [
          ['Articles published', '7 (as of July 2026)'],
          ['Topics covered', 'Google Business Profile, WhatsApp Business, CRM, Local SEO, Website mistakes, First customer in 48 hours'],
          ['Newsletter', 'Monthly \u2014 The Wave Newsletter (flipbook format via Issuu/Publuu)'],
          ['Distribution', 'WhatsApp broadcast + email + Facebook'],
          ['Internal linking', 'Full article-to-page and page-to-article link network'],
        ]
      ),
      spacer(),

      // ── SECTION 11 ─────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('11. Key Metrics & KPIs', 'sec11'),

      h2('Current Metrics (July 2026)'),
      featureTable(
        ['Metric', 'Value'],
        [
          ['Businesses served', '50+'],
          ['Countries served', '5+'],
          ['Average delivery time', '48 hours'],
          ['Years of experience', '5+'],
          ['Client data ownership', '100% \u2014 always'],
          ['Pages on bluwavgrowth.com', '35 HTML pages'],
          ['Wave articles published', '7'],
        ]
      ),
      spacer(),

      h2('Target KPIs \u2014 Next 12 Months'),
      featureTable(
        ['KPI', 'Target', 'Measurement'],
        [
          ['New Growth System clients', '50 (founding cohort campaign)', 'CRM pipeline'],
          ['CRM Premium conversions', '30% of trial users', 'CRM data'],
          ['CRM Enterprise clients', '5 signed accounts', 'CRM pipeline'],
          ['White-Label partners', '3 active agencies', 'Partner agreements'],
          ['Cost per lead (Facebook)', 'Under $6 USD', 'Ads Manager'],
          ['Health Check completions', '200+', 'Google Forms'],
          ['The Wave subscribers', '500+', 'Email platform'],
          ['Monthly recurring revenue', '$5,000+ (CRM combined)', 'Accounting'],
        ]
      ),
      spacer(),

      // ── SECTION 12 ─────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('12. Team & Culture', 'sec12'),

      h2('Culture Principles'),
      bulletBold('Global-first in every decision \u2014 ', 'if it doesn\'t work for modern businesses worldwide, it doesn\'t ship.', 'bullet-list-10'),
      bulletBold('Speed is a value, not a feature \u2014 ', '48 hours is the standard, not the exception.', 'bullet-list-10'),
      bulletBold('Clients are partners \u2014 ', 'we succeed when they succeed.', 'bullet-list-10'),
      bulletBold('Ownership matters \u2014 ', 'we build things clients own, not things they rent from us.', 'bullet-list-10'),
      bulletBold('Continuous improvement \u2014 ', 'CRM Premium is a promise to keep getting better every month.', 'bullet-list-10'),
      spacer(),

      h2('Operating Principles'),
      bullet('WhatsApp-first communication \u2014 with clients, with leads, with partners.', 'bullet-list-11'),
      bullet('Signed agreements before work begins \u2014 always.', 'bullet-list-11'),
      bullet('Transparent pricing \u2014 no hidden fees, no surprises.', 'bullet-list-11'),
      bullet('Results-driven \u2014 every deliverable is measured against client outcomes.', 'bullet-list-11'),
      spacer(),

      // ── SECTION 13 ─────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('13. Partner Strategy & Channel Development', 'sec13'),

      body('BluWav Growth operates a four-tier partner programme designed to build a distributed sales network globally. Partners earn commission on Growth System setup fees, CRM subscriptions, and hosting renewals. The programme rewards both one-time referrals and long-term recurring income.'),
      spacer(),

      h2('13.1 Partner Tier Overview'),
      featureTable(
        ['Tier', 'Description', 'Commission'],
        [
          ['Tier 1 \u2014 Referral Friend', 'Existing clients or contacts who refer one business. No agreement needed.', '10%'],
          ['Tier 2 \u2014 Affiliate Partner', 'Individuals who actively promote BluWav. Signed affiliate agreement + unique referral link.', '15%'],
          ['Tier 3 \u2014 Sales Agent', 'Freelance sales professionals closing deals. Sales agent agreement required.', '20% + bonus'],
          ['Tier 4 \u2014 Strategic Partner', 'Agencies, associations, advisors. Formal partnership agreement + co-branding.', '20% + volume bonuses'],
        ]
      ),
      spacer(),

      h2('13.2 Commission Rate Summary'),
      body('All tiers earn commission on collected revenue only. CRM recurring commission is paid monthly for as long as the client remains active \u2014 uncapped for Tiers 2\u20134.'),
      featureTable(
        ['Product / Revenue', 'Tier 1 (10%)', 'Tier 2 (15%)', 'Tier 3\u20134 (20%)'],
        [
          ['Ripple setup ($1,800)', '$180', '$270', '$360'],
          ['Current setup ($3,000)', '$300', '$450', '$600'],
          ['Surge setup ($5,000)', '$500', '$750', '$1,000'],
          ['CRM Starter /month ($59)', '$5.90/mo', '$8.85/mo', '$11.80/mo'],
          ['CRM Lite /month ($99)', '$9.90/mo', '$14.85/mo', '$19.80/mo'],
          ['CRM Premium /month ($179)', '$17.90/mo', '$26.85/mo', '$35.80/mo'],
          ['CRM Enterprise /month ($499)', '$49.90/mo', '$74.85/mo', '$99.80/mo'],
          ['White-Label /month ($697)', '$69.70/mo', '$104.55/mo', '$139.40/mo'],
          ['Hosting renewal ($200)', '$20', '$30', '$40'],
        ]
      ),
      spacer(),

      h2('13.3 Global Partner Categories'),
      featureTable(
        ['Partner Category', 'Why They Refer', 'Tier', 'Priority'],
        [
          ['Business Coaches & Consultants', 'BluWav implements the digital strategy they design', '2\u20133', 'High'],
          ['Marketing Consultants & Freelancers', 'Refer implementation they don\'t offer', '2\u20133', 'High'],
          ['Freelance Web Designers', 'Refer Google, WhatsApp, CRM they don\'t build', '2\u20133', 'High'],
          ['IT Support Companies / MSPs', 'Trusted tech advisors to SMEs', '2\u20133', 'High'],
          ['Accountants & Financial Advisors', 'Deep trusted relationships with business owners', '2', 'High'],
          ['Business Lawyers & Attorneys', 'Work with growing businesses needing CRM', '2', 'High'],
          ['Business Associations & Chambers', 'Refer members as part of their service offering', '4', 'High'],
          ['Sector Associations (Salon, Restaurant, Trades)', 'High-volume segments with clear digital need', '2', 'High'],
          ['Caribbean Export Dev. Agency', 'Regional development \u2014 Caribbean-wide reach', '4', 'High'],
          ['Real Estate Agents & Brokers', 'Need CRM + website; refer business owner clients', '2', 'Medium'],
          ['HR Consultants', 'Work with growing businesses needing CRM', '2', 'Medium'],
          ['Business Influencers & Creators', 'Engaged audiences of BluWav\'s exact target customer', '2', 'Medium'],
          ['Startup Incubators & Accelerators', 'Access to early-stage businesses needing digital', '2', 'Medium'],
        ]
      ),
      spacer(),

      h2('13.4 Partner Retention Principles'),
      bullet('Build a commission calculator \u2014 visual tool showing annual income at 5/10/20/50 clients.', 'bullet-list-12'),
      bullet('Create a "BluWav Certified Partner" badge for Tier 3+ \u2014 public credential on LinkedIn.', 'bullet-list-12'),
      bullet('Add a partner directory page to bluwavgrowth.com \u2014 drives inbound leads to partners.', 'bullet-list-12'),
      bullet('Build a 2-hour partner training (video + quiz) \u2014 increases confidence and close rates.', 'bullet-list-12'),
      bullet('Assign a named support contact to all Tier 3+ partners \u2014 reduces friction, increases loyalty.', 'bullet-list-12'),
      bullet('Add a monthly partner section to The Wave newsletter \u2014 keeps BluWav top of mind.', 'bullet-list-12'),
      bullet('Create a "first deal in 90 days" activation programme \u2014 the single highest-impact retention lever.', 'bullet-list-12'),
      bullet('Run a quarterly partner WhatsApp group \u2014 community building, tactic sharing, recognition.', 'bullet-list-12'),
      spacer(),

      new Paragraph({
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'FF5500' } },
        indent: { left: 480 },
        spacing: { before: 120, after: 120 },
        children: [new TextRun({ text: 'The Single Most Powerful Retention Tool: Partners who close their first deal within 90 days of joining have a 70%+ retention rate at 12 months. Partners who don\'t close in 90 days churn at 80%+. Prioritise partner activation over partner recruitment.', size: 24, font: 'Cambria', bold: true })],
      }),
      spacer(),

      h2('13.5 90-Day Partner Activation Roadmap'),
      featureTable(
        ['Phase', 'Activity'],
        [
          ['Month 1 \u2014 Infrastructure', 'Build partner toolkit (PDF, WhatsApp templates, referral links). Build commission calculator. Create deal registration form.'],
          ['Month 1 \u2014 First Outreach', 'Contact 5 accountants + 10 freelance web designers. Personal WhatsApp outreach. Target: 7 signed agreements.'],
          ['Month 2 \u2014 Sector Push', 'Contact sector associations. Reach out to business development organisations. Target: 1 association MOU + 3 more affiliates.'],
          ['Month 2 \u2014 Coaches', 'Identify 5 business coaches via LinkedIn + WhatsApp. Target: 3 signed Tier 2 affiliates.'],
          ['Month 3 \u2014 Regional/Global', 'Contact regional development agencies. Propose partnership. Launch "BluWav Certified Partner" badge.'],
          ['Month 3 \u2014 Review', 'Identify which partners have closed deals. Double down on active ones. Target: >50% first-deal activation rate.'],
        ]
      ),
      spacer(),

      // ── CLOSING ────────────────────────────────────────────────────────────
      divider(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 120 },
        children: [new TextRun({ text: 'BluWav Growth  \u00b7  The BluWav Bible  \u00b7  Version 2.0  \u00b7  July 2026', size: 22, font: 'Cambria', color: '64748B' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Confidential \u2014 Internal Use Only', size: 22, font: 'Cambria', color: '64748B', italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new ExternalHyperlink({
          children: [new TextRun({ text: 'bluwavgrowth.com', style: 'Hyperlink', size: 22, font: 'Cambria' })],
          link: 'https://bluwavgrowth.com',
        })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('document.docx', buffer);
  console.log('BluWav Bible generated successfully.');
});