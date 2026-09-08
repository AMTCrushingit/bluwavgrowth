const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
        ImageRun, Header, Footer, PageBreak } = require('docx');
const fs = require('fs');

// Load logo
const logoBuffer = fs.readFileSync('../../document/bluwav-logo.png');

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

const r = (text, opts) => new TextRun({ text, size: 24, font: 'Cambria', ...opts });
const b = (text, color) => new TextRun({ text, size: 24, font: 'Cambria', bold: true, color: color || '1E1E1E' });
function spacer() { return new Paragraph({ children: [new TextRun('')] }); }
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function body(text, opts) {
  return new Paragraph({ children: [r(text, opts)] });
}
function check(text, ref) {
  return new Paragraph({
    numbering: { reference: ref || 'check', level: 0 },
    children: [r(text)],
  });
}
function cross(text, ref) {
  return new Paragraph({
    numbering: { reference: ref || 'cross', level: 0 },
    children: [r(text, { color: '94A3B8' })],
  });
}
function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' } },
    children: [new TextRun('')],
    spacing: { before: 120, after: 120 },
  });
}
function highlight(text) {
  return new Paragraph({
    border: { left: { style: BorderStyle.SINGLE, size: 16, color: 'FF5500' } },
    indent: { left: 360 },
    spacing: { before: 120, after: 120 },
    shading: { type: 'clear', color: 'auto', fill: 'FFF8F5' },
    children: [b(text, '002B49')],
  });
}
function makeTable(headers, rows, colWidths) {
  return new Table({
    borders: hideAllBorders,
    columnWidths: colWidths,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => new TableCell({
          borders: headerBorder,
          width: { size: colWidths[i], type: WidthType.DXA },
          shading: { type: 'clear', color: 'auto', fill: 'EBF5FB' },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 22, font: 'Cambria', color: '002B49' })] })],
        })),
      }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((cell, ci) => new TableCell({
          borders: hideAllBorders,
          width: { size: colWidths[ci], type: WidthType.DXA },
          shading: { type: 'clear', color: 'auto', fill: ri % 2 === 0 ? 'FFFFFF' : 'F8FBFF' },
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 21, font: 'Cambria', bold: ci === 0, color: ci === 0 ? '002B49' : '374151' })] })],
        })),
      })),
    ],
  });
}

// Numbering configs
const numbering = { config: [] };
for (let i = 1; i <= 20; i++) {
  numbering.config.push({
    reference: 'check' + (i === 1 ? '' : i),
    levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2713', alignment: AlignmentType.LEFT,
      style: { run: { color: '00C2D8', bold: true }, paragraph: { indent: { left: 720, hanging: 480 } } } }],
  });
  numbering.config.push({
    reference: 'cross' + (i === 1 ? '' : i),
    levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2717', alignment: AlignmentType.LEFT,
      style: { run: { color: 'DC2626', bold: true }, paragraph: { indent: { left: 720, hanging: 480 } } } }],
  });
  numbering.config.push({
    reference: 'bullet' + (i === 1 ? '' : i),
    levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 480 } } } }],
  });
}

const doc = new Document({
  numbering,
  styles: {
    default: {
      document: { run: { font: 'Cambria', size: 24 }, paragraph: { spacing: { before: 100, after: 100 } } },
    },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal',
        run: { size: 52, bold: true, color: '002B49', font: 'Calibri' },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, color: '002B49', font: 'Calibri' },
        paragraph: { spacing: { before: 360, after: 120 } } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, color: '00C2D8', font: 'Calibri' },
        paragraph: { spacing: { before: 240, after: 80 } } },
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
    headers: {
      default: new Header({ children: [new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' } },
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: 'BluWav Growth  \u00b7  Products & Services Overview  \u00b7  bluwavgrowth.com', size: 18, font: 'Cambria', color: '64748B' })],
      })]}),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' } },
        children: [new TextRun({ text: 'BluWav Growth  \u00b7  A Stratiix Group Company  \u00b7  hello@bluwavgrowth.com  \u00b7  bluwavgrowth.com', size: 18, font: 'Cambria', color: '64748B' })],
      })]}),
    },
    children: [

      // ── COVER ──────────────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 240 },
        children: [new ImageRun({
          data: logoBuffer,
          transformation: { width: 160, height: 160 },
          type: 'png',
        })],
      }),
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('Products & Services Overview')] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 80 },
        children: [new TextRun({ text: 'Digital Growth Systems for Modern Businesses', size: 26, font: 'Cambria', color: '64748B', italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: '00C2D8' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: '00C2D8' } },
        spacing: { before: 120, after: 120 },
        children: [new TextRun({ text: 'Get Found. Get Chosen. Grow.', size: 30, font: 'Calibri', bold: true, color: '002B49' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 480 },
        children: [new TextRun({ text: 'A Stratiix Group Company  \u00b7  bluwavgrowth.com  \u00b7  hello@bluwavgrowth.com', size: 20, font: 'Cambria', color: '64748B' })],
      }),

      // ── ABOUT ──────────────────────────────────────────────────────────────
      h1('About BluWav Growth'),
      body('BluWav Growth is a digital growth systems firm. We help modern service businesses get found online, get chosen by customers, and grow automatically \u2014 through four integrated pillars delivered in 48 hours or less.'),
      spacer(),
      body('We are not a website agency. We are not a marketing shop. We are not a CRM company. We build complete digital growth systems that connect every channel into one working engine.'),
      spacer(),
      makeTable(
        ['Pillar', 'What It Delivers'],
        [
          ['Digital Presence',  'Professional website \u2014 fast, mobile-ready, built to convert visitors into customers.'],
          ['Google Visibility', 'Google Business Profile, local search, Maps presence, Bing listing.'],
          ['Search Performance','Impressions, clicks, keyword trends, competitor gap analysis, GA4 + Search Console.'],
          ['Digital Systems',   'CRM, automation, lead capture, WhatsApp integration, follow-up flows.'],
        ],
        [2800, 6560]
      ),
      spacer(),
      highlight('Every plan includes a signed agreement. You own your website, CRM, and data forever. No lock-in. Ever.'),
      spacer(),

      // ── GROWTH SYSTEMS ─────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('Growth Systems \u2014 Choose Your Level'),
      body('Every Growth System includes a 14-day free CRM trial. Delivered in 48\u201372 hours. You own everything we build.'),
      spacer(),

      // Ripple
      h2('\uD83C\uDF0A BluWav Ripple \u2014 Starter  |  From $1,800  |  One-time investment'),
      body('Your digital foundation. Website, Google visibility, and smart automation working together from day one.'),
      check('Modern website (you own it forever)', 'check'),
      check('Google Business Profile setup', 'check'),
      check('14-day CRM trial included', 'check'),
      check('Smart lead automation', 'check'),
      check('Performance dashboard', 'check'),
      check('On-page SEO essentials', 'check'),
      check('Google Search Console + Analytics 4 setup', 'check'),
      check('WhatsApp chat button', 'check'),
      check('Mobile-optimized design', 'check'),
      check('Fast, secure hosting (6 months included)', 'check'),
      check('Standard support', 'check'),
      spacer(),

      // Current
      h2('\u26A1 BluWav Current \u2014 Growth  |  From $3,000  |  One-time investment'),
      body('The complete growth system. All four pillars activated. Everything in Ripple, plus:'),
      check('WhatsApp Business profile setup', 'check2'),
      check('WhatsApp product catalog setup', 'check2'),
      check('Quick replies & automated messages', 'check2'),
      check('Advanced WhatsApp lead sequences', 'check2'),
      check('Local SEO + competitor gap analysis', 'check2'),
      check('5-star reputation builder', 'check2'),
      check('Automated lead pipeline', 'check2'),
      check('Conversion-optimized landing page', 'check2'),
      check('Monthly performance check-in call', 'check2'),
      check('Priority support', 'check2'),
      spacer(),

      // Surge
      h2('\uD83D\uDE80 BluWav Surge \u2014 Full Transformation  |  From $5,000+  |  Setup + Monthly Plan'),
      body('Full-scale growth system deployment. Every pillar maximised. Everything in Current, plus:'),
      check('Full WhatsApp sales funnel', 'check3'),
      check('Google Ads campaign setup & launch', 'check3'),
      check('Bing Places + multi-search engine listing', 'check3'),
      check('Bing Webmaster Tools setup', 'check3'),
      check('Ad-ready setup (Google + Bing Ads)', 'check3'),
      check('Monthly visibility & performance report', 'check3'),
      check('Quarterly strategy review call', 'check3'),
      check('Dedicated account manager', 'check3'),
      spacer(),
      highlight('Every Growth System Includes: Website \u00b7 Google \u00b7 WhatsApp \u00b7 14-Day CRM Trial \u00b7 Automation \u00b7 Delivered in 48\u201372 hours'),
      spacer(),

      // ── CRM PLANS ──────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('BluWav CRM \u2014 Plans & Pricing'),
      body('Every BluWav Growth plan includes a 14-day free CRM trial \u2014 experience the full CRM before you choose your plan. No credit card required.'),
      spacer(),
      makeTable(
        ['Plan', 'Monthly', 'Onboarding', 'Annual Option', 'Key Features'],
        [
          ['CRM Starter',   '$59/mo',  '$99',  '\u2014',          '25 contacts, lead tracking, 1 user, email support'],
          ['CRM Lite',      '$99/mo',  '$199', '$990/yr',         '250 contacts, pipeline, basic automation, 2 team members'],
          ['CRM Premium \u2b50', '$179/mo', '$299', '$1,990/yr',  'Unlimited contacts, full pipeline, WhatsApp, 5 team members, all future features'],
          ['CRM Enterprise','$499/mo', '$599', '\u2014',          'Unlimited team, custom workflows, API access, dedicated account manager, SLA'],
          ['White-Label',   '$697/mo', '$699', 'Annual contract', 'Your brand, unlimited client accounts, Super Admin dashboard, agency revenue model'],
        ],
        [1560, 1200, 1200, 1560, 3840]
      ),
      spacer(),
      highlight('CRM Premium Introductory Rate: $179/month. Price rises to $199/month when the BluWav Growth Dashboard launches. Sign up now and your rate is locked in for life. No exceptions.'),
      spacer(),
      body('Nonprofit Community Rate: Registered nonprofits qualify for CRM Premium at $99/month (no setup fee). Email hello@bluwavgrowth.com with your registration number.'),
      spacer(),

      // CRM Starter detail
      h2('\uD83C\uDF0A CRM Starter \u2014 $59/month + $99 onboarding'),
      check('25 contacts', 'check4'),
      check('Lead tracking', 'check4'),
      check('Basic contact management', 'check4'),
      check('Basic reporting', 'check4'),
      check('1 user only', 'check4'),
      check('Email support (72hr response)', 'check4'),
      cross('Automation', 'cross'),
      cross('Pipeline tracking', 'cross'),
      cross('WhatsApp integration', 'cross'),
      cross('Team members', 'cross'),
      spacer(),

      // CRM Lite detail
      h2('\uD83D\uDCBC CRM Lite \u2014 $99/month + $199 onboarding'),
      body('or $990/year \u00b7 2 months free \u00b7 Cancel anytime'),
      check('Everything in CRM Starter', 'check5'),
      check('Up to 250 contacts', 'check5'),
      check('Pipeline tracking', 'check5'),
      check('Basic automation', 'check5'),
      check('2 team members', 'check5'),
      check('Standard reporting', 'check5'),
      check('Priority email support (48hr)', 'check5'),
      spacer(),

      // CRM Premium detail
      h2('\uD83D\uDDA4 CRM Premium \u2014 $179/month + $299 onboarding  \u2b50 Most Popular'),
      body('or $1,990/year \u00b7 2 months free \u00b7 Introductory rate \u2014 locks in for life'),
      check('Everything in CRM Lite', 'check6'),
      check('Unlimited contacts', 'check6'),
      check('Full pipeline (Lead \u2192 Quote \u2192 Won)', 'check6'),
      check('Automated follow-ups (30/60/90 days)', 'check6'),
      check('WhatsApp integration', 'check6'),
      check('Revenue & aging reports', 'check6'),
      check('5 team members', 'check6'),
      check('Document storage & data export', 'check6'),
      check('All future features included', 'check6'),
      check('Priority support (24hr \u00b7 email & SMS)', 'check6'),
      check('Growth Dashboard Pro (when launched)', 'check6'),
      spacer(),

      // CRM Enterprise detail
      h2('\uD83C\uDFDB\uFE0F CRM Enterprise \u2014 $499/month + $599 white-glove onboarding'),
      body('Full team setup, data migration & training included'),
      check('Everything in CRM Premium', 'check7'),
      check('Unlimited team members', 'check7'),
      check('Custom workflows', 'check7'),
      check('Advanced analytics', 'check7'),
      check('API access', 'check7'),
      check('Data migration support', 'check7'),
      check('Custom integrations', 'check7'),
      check('Dedicated account manager', 'check7'),
      check('SLA guarantee', 'check7'),
      check('Quarterly strategy calls', 'check7'),
      check('Priority 12hr support', 'check7'),
      spacer(),

      // White-Label detail
      h2('\uD83C\uDFE2 White-Label CRM \u2014 $697/month + $699 onboarding'),
      body('Annual contract \u00b7 White-glove setup included \u00b7 For agencies and consultants'),
      check('Your logo & domain \u2014 clients never see BluWav', 'check8'),
      check('Unlimited client accounts', 'check8'),
      check('Charge $297\u2013$997/mo per client', 'check8'),
      check('Super Admin dashboard', 'check8'),
      check('85\u201395% client retention', 'check8'),
      check('White-glove onboarding', 'check8'),
      check('Dedicated account manager', 'check8'),
      spacer(),
      new Paragraph({
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'F7C873' } },
        indent: { left: 360 },
        spacing: { before: 80, after: 80 },
        shading: { type: 'clear', color: 'auto', fill: 'FFFBF0' },
        children: [new TextRun({ text: 'Revenue Example: 20 clients \u00d7 $697/mo = $13,940 MRR for your agency', size: 24, font: 'Cambria', bold: true, color: '002B49' })],
      }),
      spacer(),

      // ── WHAT'S INCLUDED ────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1("What's Included in Every Growth System"),
      spacer(),
      makeTable(
        ['Component', 'What You Get'],
        [
          ['Professional Website',    'Modern, mobile-optimized website you own forever. Built for speed, SEO, and conversions. Delivered in 48\u201372 hours.'],
          ['Google Business Profile', 'Full Google Maps & Search setup so customers find you first when searching for what you offer.'],
          ['WhatsApp Business',       'Professional WhatsApp setup with catalog, quick replies, and automated lead sequences.'],
          ['Analytics & SEO',         'Google Analytics 4, Search Console, and on-page SEO so you track and grow your visibility.'],
          ['CRM Trial',               '14-day free trial of CRM Premium \u2014 full access, no credit card required.'],
          ['Smart Automation',        'Lead capture, automated follow-ups, and pipeline management from day one.'],
          ['Signed Agreement',        'Every project starts with a signed agreement. You own everything we build. No exceptions.'],
          ['Hosting',                 '6 months hosting included. After 6 months: $200 per 6 months (SSL, security, support).'],
        ],
        [2800, 6560]
      ),
      spacer(),

      // ── BY THE NUMBERS ─────────────────────────────────────────────────────
      h1('By the Numbers'),
      makeTable(
        ['Metric', 'Value'],
        [
          ['Businesses served globally', '50+'],
          ['Average delivery time',      '48 hours'],
          ['Years of global expertise',  '5+'],
          ['Client data ownership',      '100% \u2014 always'],
          ['Countries served',           '5+'],
        ],
        [4680, 4680]
      ),
      spacer(),

      // ── PAYMENT & CONTACT ──────────────────────────────────────────────────
      h1('Payment & Contact'),
      h2('Accepted Payment Methods'),
      new Paragraph({ numbering: { reference: 'bullet', level: 0 }, children: [r('WiPay (Caribbean cards)')] }),
      new Paragraph({ numbering: { reference: 'bullet', level: 0 }, children: [r('PayPal')] }),
      new Paragraph({ numbering: { reference: 'bullet', level: 0 }, children: [r('Bank transfer')] }),
      new Paragraph({ numbering: { reference: 'bullet', level: 0 }, children: [r('Linx')] }),
      new Paragraph({ numbering: { reference: 'bullet', level: 0 }, children: [r('Other methods confirmed at time of invoice')] }),
      spacer(),
      h2('Split Payment Options'),
      new Paragraph({ numbering: { reference: 'bullet2', level: 0 }, children: [r('50/50: 50% upfront, 50% on delivery')] }),
      new Paragraph({ numbering: { reference: 'bullet2', level: 0 }, children: [r('40/30/30: 40% upfront, 30% mid-project, 30% on delivery')] }),
      spacer(),
      h2('Get in Touch'),
      makeTable(
        ['Channel', 'Details'],
        [
          ['Website',   'bluwavgrowth.com'],
          ['Email',     'hello@bluwavgrowth.com'],
          ['Facebook',  'facebook.com/bluwavgrowth'],
          ['Instagram', 'instagram.com/bluwavgrowth'],
          ['Free Health Check', 'bluwavgrowth.com/free-health-check'],
          ['Apply',     'bluwavgrowth.com/apply.html'],
          ['Pricing',   'bluwavgrowth.com/pricing.html'],
        ],
        [2800, 6560]
      ),
      spacer(),
      divider(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 120 },
        children: [new TextRun({ text: 'Prices in USD. All plans include a signed agreement. Onboarding fees apply to CRM plans. Subject to change without notice.', size: 18, font: 'Cambria', color: '64748B', italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'BluWav Growth  \u00b7  A Stratiix Group Company  \u00b7  bluwavgrowth.com', size: 20, font: 'Cambria', bold: true, color: '002B49' })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('document.docx', buffer);
  console.log('Products & Services Overview generated successfully.');
});