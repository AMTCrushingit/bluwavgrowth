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
        ['Package', 'Price', 'What It Includes', 'Your Commission'],
        [
          ['Ripple',  '$1,800+', 'Website, Google Business Profile, CRM 14-day trial, on-page SEO, WhatsApp chat button, smart lead automation, performance dashboard.', '$360+'],
          ['Current', '$3,000+', 'Everything in Ripple, plus WhatsApp Business setup, product catalog, advanced lead sequences, local SEO + competitor analysis, 5-star reputation builder, automated lead pipeline, conversion landing page, monthly check-in call.', '$600+'],
          ['Surge',   '$5,000+', 'Everything in Current, plus Google Ads campaign setup, Bing Places + multi-search engine listing, full WhatsApp sales funnel, monthly visibility & performance report, quarterly strategy review, dedicated account manager.', '$1,000+'],
        ],
        [1560, 1200, 4680, 1920]
      ),
      spacer(),
      h2('BluWav CRM Plans'),
      body('The CRM is Pillar 4 of the growth system. Every Growth System client receives a 14-day free trial. After the trial, they choose their CRM plan.'),
      spacer(),
      makeTable(
        ['CRM Plan', 'Onboarding', 'Monthly', 'Annual Option', 'Your Commission'],
        [
          ['CRM Starter',   '$99',  '$59/mo',  '\u2014',          '$12/mo for 3 months'],
          ['CRM Lite',      '$199', '$99/mo',  '$990/yr',         '$20/mo for 3 months'],
          ['CRM Premium',   '$299', '$179/mo', '$1,990/yr',       '$36/mo for 3 months'],
          ['CRM Enterprise','$599', '$499/mo', '\u2014',          '$100/mo for 3 months'],
          ['White-Label',   '$699', '$697/mo', 'Annual contract', '$139/mo for 3 months'],
        ],
        [1800, 1200, 1200, 1800, 3360]
      ),
      spacer(),
      highlight('CRM Premium Introductory Rate: $179/month. When the BluWav Growth Dashboard launches, the price moves to $199/month. Clients who sign now lock in $179 for life. Use this in every CRM conversation.'),
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
      bullet('Package upsell (Ripple to Current, or Current to Surge): +$50 per upsell.', 'bl3'),
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
      h1('Section 5 \u2014 Sales Scripts'),
      body('These scripts are starting points. Adapt the language to your natural style, but keep the core positioning consistent: BluWav Growth is a digital growth systems firm.'),
      spacer(),
      h2('Opening Script (Cold Outreach)'),
      scriptLine('Hi [Name], I work with BluWav Growth. We help businesses like yours get found on Google, build a professional online presence, and automate customer follow-ups \u2014 all in one system. We deliver in 48 to 72 hours and you own everything we build. Would you be open to a quick conversation this week?'),
      spacer(),
      h2('Discovery Call Script'),
      body('Open with a question, not a pitch:'),
      scriptLine('Before I tell you about what we do, can I ask: when someone searches for [their business type] in [their area] on Google, do you show up? And if they find you, is your website doing anything to turn them into a customer?'),
      spacer(),
      body('Listen to their answer. Then:'),
      scriptLine('That is exactly what we fix. BluWav builds the full system: your website, your Google visibility, your WhatsApp setup, and a CRM to track every lead. Most clients go live in 48 to 72 hours. You own everything we build \u2014 no lock-in, ever.'),
      spacer(),
      h2('CRM Introductory Rate Script'),
      scriptLine('CRM Premium is $179 per month right now. That is our introductory rate for early adopters. When we launch the BluWav Growth Dashboard, the price moves to $199. Sign up today and your rate is locked in for life. No exceptions.'),
      spacer(),
      h2('Closing Script'),
      scriptLine('Based on what you have told me, I think [Ripple / Current / Surge] is the right fit. The investment is [price]. We start as soon as your invoice is paid, and you are live within 48 to 72 hours. Shall I send you the details?'),
      spacer(),
      h2('Free Health Check Script'),
      scriptLine('Before we go any further, let me offer you something completely free. It\u2019s a short online form \u2014 takes two minutes \u2014 and it shows you exactly where your business stands online right now. No commitment, no sales pitch. Results come back within 24 hours. Want me to send you the link?'),
      tip('Health Check link: bluwavgrowth.com/free-health-check'),
      spacer(),

      // ── SECTION 6: OBJECTION HANDLER ──────────────────────────────────────
      h1('Section 6 \u2014 Objection Handler'),
      makeTable(
        ['Objection', 'Your Response'],
        [
          ['\u201cIt is too expensive.\u201d',
           '\u201cI understand. Let me put it in perspective. A professional website alone costs $3,000 to $8,000 at most agencies and takes 6 to 12 weeks. With BluWav, you get the website, Google setup, WhatsApp integration, and a CRM trial \u2014 all in 48 hours, starting at $1,800. You are not paying more; you are getting more, faster.\u201d'],
          ['\u201cI can get a website cheaper elsewhere.\u201d',
           '\u201cYou can. But a website on its own does not grow your business. BluWav builds the full system: the website, the Google visibility, the WhatsApp setup, and the CRM. A cheaper website is just a page on the internet. Our system is what turns visitors into customers.\u201d'],
          ['\u201cI need to think about it.\u201d',
           '\u201cOf course. What specifically would help you make the decision? Is it the investment, the timeline, or understanding exactly what you get? I want to make sure you have everything you need.\u201d'],
          ['\u201cI already have a website.\u201d',
           '\u201cGreat. Is it showing up on Google when customers search for you? Is it capturing leads automatically? Is it connected to a CRM? Most websites we see are not doing any of those things. That is what we fix.\u201d'],
          ['\u201cI am not ready yet.\u201d',
           '\u201cI hear that a lot. Can I ask: what would need to change for you to be ready? Because every day you are not online, a competitor is winning the customer that should have been yours. Our free Digital Health Check takes 2 minutes and shows you exactly where you stand \u2014 no commitment.\u201d'],
          ['\u201cI do not need a CRM.\u201d',
           '\u201cMost business owners say that until they see how many leads they are losing. The CRM is not a complicated system; it is the engine that connects everything. Every lead from your website, every WhatsApp message, every referral \u2014 tracked in one place. And the 14-day trial is free.\u201d'],
          ['\u201cWe tried digital marketing before and it didn\u2019t work.\u201d',
           '\u201cI\u2019m sorry to hear that. Can I ask what happened? [Listen] What BluWav does differently is bring everything into one connected system \u2014 website, Google, WhatsApp, CRM \u2014 so nothing falls through the cracks. The free Health Check is a great way to see exactly where the gaps are, with no commitment.\u201d'],
          ['\u201cWe\u2019re a small business, we don\u2019t need all this.\u201d',
           '\u201cThat\u2019s exactly who BluWav is built for. Our Ripple plan starts at $1,800 \u2014 it\u2019s a one-time investment, you own everything forever, and it includes a 14-day free CRM trial. The Health Check just shows you where the biggest opportunity is for your specific business. No commitment.\u201d'],
        ],
        [2800, 6560]
      ),
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
      highlight('3 deals in Month 1 = $1,080 to $1,800 in commission, plus your performance bonus of $150. That is a strong start.'),
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