const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
        PageBreak, Header, Footer, ImageRun } = require('docx');
const fs = require('fs');
const logoBuffer = fs.readFileSync('../bluwav-logo.png');

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

const b = (text, color) => new TextRun({ text, size: 24, font: 'Cambria', bold: true, color: color || '1E1E1E' });
const r = (text, color) => new TextRun({ text, size: 24, font: 'Cambria', color: color || '1E1E1E' });
const ri = (text) => new TextRun({ text, size: 24, font: 'Cambria', italics: true, color: '64748B' });

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function body(text) { return new Paragraph({ children: [r(text)] }); }
function spacer() { return new Paragraph({ children: [new TextRun('')] }); }

function bullet(text, ref) {
  return new Paragraph({
    numbering: { reference: ref || 'bl', level: 0 },
    children: [r(text)],
  });
}
function bulletBold(label, rest, ref) {
  return new Paragraph({
    numbering: { reference: ref || 'bl', level: 0 },
    children: [b(label), r(rest || '')],
  });
}
function numbered(text, ref) {
  return new Paragraph({
    numbering: { reference: ref || 'num', level: 0 },
    children: [r(text)],
  });
}
function tip(text) {
  return new Paragraph({
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: '00C2D8' } },
    indent: { left: 480 },
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, font: 'Cambria', italics: true, color: '003d5c' })],
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
function scriptLine(text) {
  return new Paragraph({
    border: { left: { style: BorderStyle.SINGLE, size: 8, color: '002B49' } },
    indent: { left: 480 },
    spacing: { before: 80, after: 80 },
    shading: { type: 'clear', color: 'auto', fill: 'F0F9FF' },
    children: [new TextRun({ text: '\u201c' + text + '\u201d', size: 24, font: 'Cambria', color: '002B49' })],
  });
}
function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' } },
    children: [new TextRun('')],
    spacing: { before: 120, after: 120 },
  });
}

function makeTable(headers, rows, colWidths) {
  const total = colWidths.reduce((a, b) => a + b, 0);
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

function infoTable(rows) {
  return new Table({
    borders: hideAllBorders,
    columnWidths: [2340, 7020],
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    rows: rows.map((row, ri) => new TableRow({
      children: [
        new TableCell({ borders: hideAllBorders, width: { size: 2340, type: WidthType.DXA },
          shading: { type: 'clear', color: 'auto', fill: ri % 2 === 0 ? 'F8FBFF' : 'FFFFFF' },
          children: [new Paragraph({ children: [b(row[0], '002B49')] })] }),
        new TableCell({ borders: hideAllBorders, width: { size: 7020, type: WidthType.DXA },
          shading: { type: 'clear', color: 'auto', fill: ri % 2 === 0 ? 'F8FBFF' : 'FFFFFF' },
          children: [new Paragraph({ children: [r(row[1])] })] }),
      ],
    })),
  });
}

// Numbering references
const numbering = { config: [] };
for (let i = 1; i <= 15; i++) {
  numbering.config.push({
    reference: 'bl' + (i === 1 ? '' : i),
    levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 480 } } } }],
  });
  numbering.config.push({
    reference: 'num' + (i === 1 ? '' : i),
    levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 480 } } } }],
  });
}

const doc = new Document({
  numbering,
  styles: {
    default: {
      document: { run: { font: 'Cambria', size: 24 }, paragraph: { spacing: { before: 120, after: 120 } } },
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
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({ children: [new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' } },
        children: [new TextRun({ text: 'BluWav Growth  \u00b7  Sales Agent Onboarding Package  \u00b7  Confidential', size: 18, font: 'Cambria', color: '64748B' })],
      })]}),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' } },
        children: [new TextRun({ text: 'BluWav Growth  \u00b7  Get Found. Get Chosen. Grow.  \u00b7  bluwavgrowth.com', size: 18, font: 'Cambria', color: '64748B' })],
      })]}),
    },
    children: [

      // ── COVER ──────────────────────────────────────────────────────────────
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 120 }, children: [new ImageRun({ data: logoBuffer, transformation: { width: 140, height: 140 }, type: 'png' })] }),
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('BluWav Growth')] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'SALES AGENT ONBOARDING PACKAGE', size: 32, font: 'Calibri', bold: true, color: '00C2D8', allCaps: true })] }),
      spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tier 2  \u00b7  Sales Agent  \u00b7  Confidential  \u00b7  July 2026', size: 22, font: 'Cambria', color: '64748B', italics: true })] }),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: '00C2D8' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: '00C2D8' } },
        spacing: { before: 120, after: 120 },
        children: [new TextRun({ text: 'Get Found. Get Chosen. Grow.', size: 32, font: 'Calibri', bold: true, color: '002B49' })],
      }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240 }, children: [new TextRun({ text: 'bluwavgrowth.com  \u00b7  hello@bluwavgrowth.com', size: 20, font: 'Cambria', color: '64748B' })] }),
      spacer(),

      // ── SECTION 1: ABOUT ───────────────────────────────────────────────────
      h1('Section 1 \u2014 About BluWav Growth'),
      body('BluWav Growth is a digital growth systems firm. We help modern businesses get found online, get chosen by customers, and grow with clarity and confidence.'),
      spacer(),
      body('We are not a website agency. We are not a marketing shop. We are not a CRM company. We build integrated digital growth systems across four pillars:'),
      spacer(),
      makeTable(
        ['Pillar', 'What It Delivers'],
        [
          ['Digital Presence',  'Professional website \u2014 fast, mobile-ready, built to convert.'],
          ['Google Visibility', 'Google Business Profile, local search, maps presence, Bing listing.'],
          ['Search Performance','Impressions, clicks, keyword trends, competitor gap analysis.'],
          ['Digital Systems',   'CRM, automation, lead capture, follow-up flows.'],
        ],
        [3120, 6240]
      ),
      spacer(),
      body('The BluWav CRM connects all four pillars into one working growth engine. It is not the product \u2014 the growth system is the product. The CRM is how we make that system real.'),
      spacer(),
      highlight('Position BluWav Growth as a digital growth systems firm, not a website agency or CRM company. This distinction is what separates us from every competitor.'),
      spacer(),
      body('A Stratiix Group Company  \u00b7  bluwavgrowth.com  \u00b7  hello@bluwavgrowth.com'),
      spacer(),

      // ── SECTION 2: YOUR ROLE ───────────────────────────────────────────────
      h1('Section 2 \u2014 Your Role as a Sales Agent'),
      body('As a Tier 2 Sales Agent, your job is to identify business owners who need a stronger digital presence, introduce them to the BluWav Growth system, and close the deal. You do not build websites. You do not set up CRMs. You sell the system and hand the client to the BluWav team.'),
      spacer(),
      h2('What You Do'),
      bullet('Identify prospects: small and medium business owners who are invisible online or losing leads.', 'bl'),
      bullet('Pitch the BluWav Growth system using the scripts and materials in this package.', 'bl'),
      bullet('Close the deal and submit the lead through the BluWav team contact.', 'bl'),
      bullet('Follow up with prospects who did not close on the first conversation.', 'bl'),
      bullet('Refer CRM clients for recurring commission.', 'bl'),
      spacer(),
      h2('What You Do Not Do'),
      bullet('You do not onboard clients or set up any technical systems.', 'bl2'),
      bullet('You do not make promises beyond what is in the approved materials.', 'bl2'),
      bullet('You do not negotiate pricing without prior approval from the VP, Sales & Marketing.', 'bl2'),
      bullet('You do not represent BluWav Growth on social media without approval.', 'bl2'),
      spacer(),

      // ── SECTION 3: PRODUCTS & PRICING ─────────────────────────────────────
      h1('Section 3 \u2014 Products and Pricing'),
      body('Always present BluWav as a system, not a menu of services. Clients who understand the system stop asking \u201ccan I just get the website?\u201d and start asking \u201chow do I get the full system?\u201d'),
      spacer(),
      h2('Growth Systems'),
      makeTable(
        ['Package', 'Price', 'What It Includes', 'Months 1–3 Commission', 'Residual After Month 3'],
        [
          ['Launch™',  '$397/mo + $900 setup', 'Website, Google Business Profile, CRM 14-day trial, on-page SEO, WhatsApp chat button, smart lead automation, performance dashboard.', '$79.40/mo + $180 setup', '5% ($19.85/mo)'],
          ['Momentum™', '$697/mo + $1,250 setup', 'Everything in Launch™, plus WhatsApp Business setup, product catalog, advanced lead sequences, local SEO + competitor analysis, 5-star reputation builder, automated lead pipeline, conversion landing page, monthly check-in call.', '$139.40/mo + $250 setup', '5% ($34.85/mo)'],
          ['Accelerate™',   '$1,497/mo + $2,500 setup', 'Everything in Momentum™, plus Google Ads campaign setup, Bing Places + multi-search engine listing, full WhatsApp sales funnel, monthly visibility & performance report, quarterly strategy review, dedicated account manager.', '$299.40/mo + $500 setup', '5% ($74.85/mo)'],
        ],
        [1200, 1100, 3960, 1440, 1200]
      ),
      spacer(),
      h2('BluWav CRM Plans'),
      body('The CRM is Pillar 4 of the growth system. Every Growth System client receives a 14-day free trial. After the trial, they choose their CRM plan.'),
      spacer(),
      makeTable(
        ['CRM Plan', 'Onboarding', 'Monthly', 'Annual Option', 'Your Commission'],
        [
          ['Foundation Plan™',   '$99',  '$59/mo',  '\u2014',          '$12/mo for 3 months'],
          ['Growth Plan™',      '$199', '$99/mo',  '$990/yr',         '$20/mo for 3 months'],
          ['Founder Plan™',   '$299', '$199/mo', '$1,990/yr',       '$40/mo for 3 months'],
          ['Enterprise Plan™','$599', '$399/mo', '\u2014',          '$80/mo for 3 months'],
          ['Agency Edition™',   '$699', '$899/mo', 'Annual contract', '$180/mo for 3 months'],
        ],
        [1800, 1200, 1200, 1800, 3360]
      ),
      spacer(),
      highlight('Founder Plan™: $199/month. Unlimited contacts, full pipeline, WhatsApp integration, 5 team members, and all future features included.'),
      spacer(),
      h2('CRM Performance Reward'),
      body('Bring 3 or more CRM clients within 60 days and your commission rate upgrades from 20% to 25% for 3 months on all CRM clients in that cohort.'),
      spacer(),

      // ── SECTION 4: COMMISSION & BONUSES ───────────────────────────────────
      h1('Section 4 \u2014 Commission and Bonuses'),
      h2('Performance Bonuses'),
      makeTable(
        ['Deals Closed Per Month', 'Flat Bonus'],
        [
          ['3 to 4 deals',    '+$150'],
          ['5 to 6 deals',    '+$400'],
          ['7 to 9 deals',    '+$750'],
          ['10 or more deals','+$1,000'],
        ],
        [4680, 4680]
      ),
      spacer(),
      h2('Additional Bonuses'),
      bullet('Package upsell (Launch™ to Momentum™, or Momentum™ to Accelerate™): +$50 per upsell.', 'bl3'),
      bullet('Second-generation referral (your client refers another client): +$75.', 'bl3'),
      spacer(),
      h2('Payment Rules'),
      bullet('Commission is earned when the client payment clears, not when the deal is signed.', 'bl4'),
      bullet('Payouts are processed within 7 business days of payment clearance.', 'bl4'),
      bullet('Minimum payout threshold: $50 USD.', 'bl4'),
      bullet('If a client cancels or requests a full refund within 14 days, the commission is reversed.', 'bl4'),
      bullet('No commission is payable on setup or onboarding fees for any CRM package.', 'bl4'),
      bullet('Payment methods: WiPay, PayPal, bank transfer, Linx, or other methods confirmed at time of payout.', 'bl4'),
      spacer(),
      h2('Payout Requests'),
      body('Submit all payout requests through the BluWav Agent Portal:'),
      spacer(),
      infoTable([
        ['Agent Portal',  'bluwavgrowth.com/commission-calculator.html'],
        ['Access Code',   'BLUWAV2026'],
        ['Response Time', 'Confirmation within 24 hours of submission'],
      ]),
      spacer(),
      body('Use the Commission Calculator to calculate your earnings, then submit a Payout Request. You will receive a confirmation email within 24 hours.'),
      spacer(),

      // ── SECTION 5: SALES SCRIPTS ───────────────────────────────────────────
      h1('Section 5 \\u2014 Sales Scripts'),
      body('These scripts are starting points. Adapt the language to your natural style, but keep the core positioning consistent: BluWav Growth is a digital growth systems firm.'),
      spacer(),

      h2('Opening Script (Cold Outreach)'),
      scriptLine('Hi [Name], I work with BluWav Growth. We help businesses get found online, get chosen by more customers, and grow through connected digital systems. Most businesses struggle because their website, Google profile, WhatsApp, and customer follow-up aren\\u2019t working together. That\\u2019s exactly what we fix. Are you open to a quick conversation this week?'),
      spacer(),

      h2('Digital Health Check Script'),
      scriptLine('Before we talk about any package, I\\u2019d love to send you our Free Digital Health Check. It only takes a couple of minutes to complete, and it identifies strengths, gaps, and opportunities across your online presence. There\\u2019s no obligation and no commitment. It simply gives you clarity. Would you like the link?'),
      spacer(),

      h2('Discovery Questions'),
      body('Avoid pitching too early. Ask questions.'),
      spacer(),
      h2('Visibility'),
      bullet('How do most customers find you today?', 'bl'),
      bullet('Do you show up on Google when people search for your services?', 'bl'),
      bullet('Are you happy with your Google Business Profile?', 'bl'),
      bullet('How many online enquiries do you receive monthly?', 'bl'),
      spacer(),
      h2('Website'),
      bullet('When was your website last updated?', 'bl2'),
      bullet('Do you know how many leads come from your website?', 'bl2'),
      bullet('Is your website mobile-friendly?', 'bl2'),
      spacer(),
      h2('Follow-Up'),
      bullet('What happens after someone contacts you?', 'bl3'),
      bullet('How quickly do you respond to enquiries?', 'bl3'),
      bullet('Do you have a system for following up with leads?', 'bl3'),
      spacer(),
      h2('CRM'),
      bullet('Where do you currently keep customer information?', 'bl4'),
      bullet('How do you track opportunities?', 'bl4'),
      bullet('Have you ever lost a customer because someone forgot to follow up?', 'bl4'),
      spacer(),
      h2('Growth Goals'),
      bullet('What are your growth goals over the next 12 months?', 'bl5'),
      bullet('If you could fix one thing about your marketing, what would it be?', 'bl5'),
      bullet('What\\u2019s stopping growth today?', 'bl5'),
      spacer(),
      tip('These questions line up directly with BluWav\\u2019s visibility, credibility, conversion, and systems pillars.'),
      spacer(),

      h2('Growth Sprint Script'),
      body('For prospects who are unsure what they need:'),
      scriptLine('Based on our conversation, I don\\u2019t think the first step is choosing a package. I think the first step is clarity. That\\u2019s exactly why we created the 30-Day Growth Sprint.'),
      spacer(),
      scriptLine('Over 30 days, we assess where your business is today, identify opportunities, build a practical roadmap, and help you prioritize what matters most. Then you can decide whether Launch\u2122, Momentum\u2122, Accelerate\u2122, or a CRM plan makes sense.'),
      spacer(),
      scriptLine('The investment is $2,500 and gives you a clear growth plan instead of guesswork.'),
      spacer(),

      h2('Launch\u2122 Script'),
      scriptLine('Launch\u2122 is designed for businesses that need a professional presence and a stronger online foundation.'),
      spacer(),
      scriptLine('You get a modern website, Google Business Profile optimization, SEO foundations, WhatsApp integration, automation, performance reporting, and a free CRM trial.'),
      spacer(),
      scriptLine('For many clients, Launch\u2122 is the fastest path from invisible to visible.'),
      spacer(),

      h2('Momentum\u2122 Script'),
      scriptLine('Momentum\u2122 is our most popular package because it moves beyond visibility and focuses on consistent lead generation.'),
      spacer(),
      scriptLine('In addition to everything in Launch\u2122, you get advanced lead nurturing, conversion-focused landing pages, reputation management, competitor analysis, and stronger local SEO.'),
      spacer(),
      scriptLine('It\\u2019s ideal for businesses ready to grow consistently, not just look professional.'),
      spacer(),

      h2('Accelerate\u2122 Script'),
      scriptLine('Accelerate\u2122 is for businesses with aggressive growth goals.'),
      spacer(),
      scriptLine('It includes everything in Momentum\u2122, plus advertising setup, advanced funnel automation, strategic reporting, dedicated support, and quarterly reviews.'),
      spacer(),
      scriptLine('If Launch\u2122 gets you visible and Momentum\u2122 gets you growing, Accelerate\u2122 is designed to accelerate growth.'),
      spacer(),

      h2('CRM Standalone Script'),
      scriptLine('A lot of business owners think they need more leads. What they actually need is better follow-up.'),
      spacer(),
      scriptLine('The BluWav CRM helps you organize contacts, automate follow-up, manage opportunities, and track every customer interaction.'),
      spacer(),
      scriptLine('It\\u2019s often the fastest way to improve results without spending more money on marketing.'),
      spacer(),

      h2('Upsell Script'),
      scriptLine('Before we finalize, let me ask one question.'),
      spacer(),
      scriptLine('If Launch\u2122 helps you get found online, what happens after those new leads start coming in?'),
      spacer(),
      scriptLine('That\\u2019s why most clients add the CRM. It ensures every lead is captured, followed up, and tracked.'),
      spacer(),

      h2('Closing Script'),
      scriptLine('Based on everything you\\u2019ve shared, I believe [Package Name] is the best fit.'),
      spacer(),
      scriptLine('The investment is [Price].'),
      spacer(),
      scriptLine('We can get started immediately once payment is received. Would you like me to send the proposal and next steps?'),
      spacer(),

      h2('Free Health Check Script'),
      scriptLine('Before we go any further, let me offer you something completely free. It\\u2019s a short online form \\u2014 takes two minutes \\u2014 and it shows you exactly where your business stands online right now. No commitment, no sales pitch. Results come back within 24 hours. Want me to send you the link?'),
      tip('Health Check link: bluwavgrowth.com/free-health-check'),
      spacer(),

      // ── SECTION 6: OBJECTION HANDLER ─────────────────────────────────────
      h1('Section 6 \\u2014 Objection Handler (Expanded)'),
      body('Objections are not rejections. They are requests for more information or reassurance. Acknowledge, respond, and redirect.'),
      spacer(),

      h2('\\u201cIt\\u2019s too expensive.\\u201d'),
      scriptLine('I understand. Compared to what? A website? A marketing agency? Hiring staff?'),
      scriptLine('BluWav isn\\u2019t a website package. It\\u2019s a growth system designed to help your business get found, get chosen, and grow. The question isn\\u2019t the monthly investment. The question is what missed opportunities are costing you today.'),
      spacer(),

      h2('\\u201cI can get a cheaper website.\\u201d'),
      scriptLine('You absolutely can.'),
      scriptLine('But websites don\\u2019t generate growth by themselves. The real question is whether that website includes Google visibility, automation, lead capture, WhatsApp integration, reporting, and CRM connectivity.'),
      scriptLine('Most don\\u2019t. That\\u2019s the difference.'),
      spacer(),

      h2('\\u201cI already have a website.\\u201d'),
      scriptLine('That\\u2019s great.'),
      scriptLine('How many leads did it generate last month?'),
      scriptLine('Is it connected to a CRM?'),
      scriptLine('Does it automatically follow up?'),
      scriptLine('Is it ranking in local search?'),
      scriptLine('Most business owners discover they don\\u2019t actually need another website. They need a better growth system.'),
      spacer(),

      h2('\\u201cI already have a CRM.\\u201d'),
      scriptLine('Excellent. What are you using?'),
      scriptLine('Are your team members actively using it?'),
      scriptLine('Is it connected to your website, WhatsApp, and lead sources?'),
      scriptLine('If your current CRM is doing everything you need, we\\u2019ll tell you. But many clients come to us because the CRM isn\\u2019t being fully used.'),
      spacer(),

      h2('\\u201cWe\\u2019re too small.\\u201d'),
      scriptLine('Launch\u2122 was designed specifically for businesses in that situation.'),
      scriptLine('Small businesses need systems even more because every missed lead hurts.'),
      scriptLine('The earlier you build the foundation, the easier growth becomes.'),
      spacer(),

      h2('\\u201cWe\\u2019re too busy.\\u201d'),
      scriptLine('That\\u2019s usually a sign that better systems are needed.'),
      scriptLine('Most business owners aren\\u2019t too busy because they have too many customers. They\\u2019re too busy because too many things depend on them personally.'),
      scriptLine('That\\u2019s exactly what automation helps solve.'),
      spacer(),

      h2('\\u201cWe\\u2019ve tried marketing before.\\u201d'),
      scriptLine('I hear that often.'),
      scriptLine('Can I ask what happened?'),
      tip('Listen.'),
      scriptLine('Most marketing problems aren\\u2019t actually marketing problems. They\\u2019re system problems.'),
      scriptLine('Traffic without follow-up doesn\\u2019t work. Leads without a process don\\u2019t work. That\\u2019s why BluWav connects everything.'),
      spacer(),

      h2('\\u201cSend me some information.\\u201d'),
      scriptLine('I\\u2019d be happy to.'),
      scriptLine('Before I do, what specifically would you like information about?'),
      tip('That keeps the conversation open rather than ending it.'),
      spacer(),

      h2('\\u201cI need to talk to my partner/spouse/team.\\u201d'),
      scriptLine('Absolutely.'),
      scriptLine('What questions do you think they\\u2019ll ask?'),
      scriptLine('Let\\u2019s make sure you have those answers before you leave.'),
      spacer(),

      h2('\\u201cWe\\u2019re not ready.\\u201d'),
      scriptLine('What needs to happen before you\\u2019re ready?'),
      tip('Listen.'),
      scriptLine('That\\u2019s exactly why many businesses start with the Free Digital Health Check or the 30-Day Growth Sprint. It gives you clarity before making bigger decisions.'),
      spacer(),

      h2('\\u201cI don\\u2019t want a contract.\\u201d'),
      scriptLine('That\\u2019s completely understandable.'),
      scriptLine('The focus is results and partnership. We want clients to stay because they\\u2019re seeing value, not because they\\u2019re trapped.'),
      spacer(),

      h2('\\u201cAI will replace all of this.\\u201d'),
      scriptLine('AI is a powerful tool, but tools still need strategy, systems, and execution.'),
      scriptLine('BluWav helps businesses use technology effectively rather than trying to figure everything out themselves.'),
      spacer(),

      h2('\\u201cCan I just get the CRM?\\u201d'),
      scriptLine('Absolutely.'),
      scriptLine('But let me ask: how are you generating leads today?'),
      tip('If lead generation is weak: The CRM can help manage leads, but Growth Systems help create them. That\\u2019s why many clients combine both.'),
      spacer(),

      h2('\\u201cCan I just get the website?\\u201d'),
      scriptLine('You can, but that\\u2019s usually not the real problem.'),
      scriptLine('The real problem is being found, being chosen, and following up consistently.'),
      scriptLine('The website is one part of that. BluWav builds the complete system.'),
      spacer(),

      h2('\\u201cWhat makes BluWav different?\\u201d'),
      scriptLine('Most companies sell individual services.'),
      scriptLine('Some sell websites. Some sell marketing. Some sell CRM software.'),
      scriptLine('BluWav connects everything into one growth system designed to help businesses get found, get chosen, and grow.'),
      spacer(),

      // ── SECTION 7: 30-DAY ACTION PLAN ─────────────────────────────────────
      h1('Section 7 \u2014 Your 30-Day Action Plan'),
      body('Your first 30 days set the foundation. Follow this plan and you will have your first deals closed before the month is out.'),
      spacer(),
      h2('Week 1: Learn and Prepare'),
      numbered('Read this package in full. Know the products, prices, and scripts.', 'num'),
      numbered('Complete your onboarding call with the VP, Sales & Marketing.', 'num'),
      numbered('Access the Agent Portal and run through the Commission Calculator.', 'num'),
      numbered('Identify your first 10 prospects: business owners you know personally or in your network.', 'num'),
      numbered('Practice the opening script out loud until it feels natural.', 'num'),
      spacer(),
      h2('Week 2: First Conversations'),
      numbered('Contact your first 10 prospects via email, phone, or in person.', 'num2'),
      numbered('Aim for 3 discovery conversations this week.', 'num2'),
      numbered('Send the free Digital Health Check link to every prospect: bluwavgrowth.com/free-health-check', 'num2'),
      numbered('Submit any warm leads to the VP, Sales & Marketing immediately.', 'num2'),
      spacer(),
      h2('Week 3: Follow Up and Close'),
      numbered('Follow up with every prospect from Week 2 who did not respond.', 'num3'),
      numbered('Aim to close your first deal this week.', 'num3'),
      numbered('Identify 10 more prospects and begin outreach.', 'num3'),
      numbered('Ask every conversation: \u201cDo you know any other business owners who might need this?\u201d', 'num3'),
      spacer(),
      h2('Week 4: Build Momentum'),
      numbered('Review your pipeline. Who is close to closing? Follow up.', 'num4'),
      numbered('Aim for 3 closed deals by end of Month 1.', 'num4'),
      numbered('Submit your first payout request if you have cleared commissions.', 'num4'),
      numbered('Book your Month 2 check-in with the VP, Sales & Marketing.', 'num4'),
      spacer(),
      highlight('3 deals in Month 1 = $238 to $898 in monthly recurring commission, plus setup commissions and your performance bonus of $150. That is a strong start.'),
      spacer(),

      // ── SECTION 8: KEY CONTACTS & RESOURCES ───────────────────────────────
      h1('Section 8 \u2014 Key Contacts and Resources'),
      h2('Your Primary Contact'),
      infoTable([
        ['Title',         'VP, Sales & Marketing \u2014 BluWav Growth'],
        ['Email',         'hello@bluwavgrowth.com'],
        ['Response Time', 'Within 24 hours on business days'],
      ]),
      spacer(),
      h2('Key Links'),
      infoTable([
        ['Main website',            'bluwavgrowth.com'],
        ['Free Digital Health Check','bluwavgrowth.com/free-health-check'],
        ['Agent Portal',            'bluwavgrowth.com/commission-calculator.html'],
        ['Agent Portal Code',       'BLUWAV2026'],
        ['Sales Agent Agreement',   'bluwavgrowth.com/sales-agent-agreement.html'],
        ['Apply page (clients)',     'bluwavgrowth.com/apply.html'],
        ['Pricing page',            'bluwavgrowth.com/pricing.html'],
        ['BluWav CRM page',         'bluwavgrowth.com/crm.html'],
        ['Contract page',           'bluwavgrowth.com/contract.html'],
      ]),
      spacer(),
      h2('Submitting a Lead'),
      body('When you have a warm or closed lead, contact the VP, Sales & Marketing immediately with:'),
      bullet('Client name and business name.', 'bl5'),
      bullet('Country or region.', 'bl5'),
      bullet('Package they are interested in.', 'bl5'),
      bullet('Their email and preferred contact method.', 'bl5'),
      bullet('Any notes on their situation or timeline.', 'bl5'),
      spacer(),
      body('The BluWav team will take it from there. You will be notified when the invoice is sent and when payment clears.'),
      spacer(),
      h2('What Happens After You Close a Deal'),
      numbered('You submit the lead to the VP, Sales & Marketing.', 'num5'),
      numbered('BluWav sends the client a scope and invoice within 48 hours.', 'num5'),
      numbered('Client pays. BluWav builds and delivers within 48 to 72 hours.', 'num5'),
      numbered('Your commission is processed within 7 business days of payment clearance.', 'num5'),
      numbered('You receive a confirmation when your payout is sent.', 'num5'),
      spacer(),
      divider(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 120 },
        children: [new TextRun({ text: 'BluWav Growth  \u00b7  Sales Agent Onboarding Package  \u00b7  Confidential  \u00b7  July 2026', size: 20, font: 'Cambria', color: '64748B' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'This document is the property of BluWav Growth. Not to be distributed without permission.', size: 20, font: 'Cambria', color: '64748B', italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120 },
        children: [new TextRun({ text: 'Ride the wave. \uD83C\uDF0A', size: 24, font: 'Cambria', bold: true, color: '002B49' })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('document.docx', buffer);
  console.log('Sales Agent Onboarding Package generated successfully.');
});