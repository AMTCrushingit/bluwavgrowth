const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
        VerticalAlign, PageBreak, Header, Footer, ImageRun } = require('docx');
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

function h1(text, bookmarkId) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun(text)],
    pageBreakBefore: true,
  });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function body(text) {
  return new Paragraph({ children: [new TextRun({ text, size: 24, font: 'Cambria' })] });
}
function bodyBold(label, rest) {
  return new Paragraph({ children: [
    new TextRun({ text: label, size: 24, font: 'Cambria', bold: true }),
    new TextRun({ text: rest || '', size: 24, font: 'Cambria' }),
  ]});
}
function spacer() { return new Paragraph({ children: [new TextRun('')] }); }
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
      new TextRun({ text: rest || '', size: 24, font: 'Cambria' }),
    ],
  });
}
function tip(text) {
  return new Paragraph({
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: '00C2D8' } },
    indent: { left: 480 },
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: '\uD83D\uDCA1 ' + text, size: 22, font: 'Cambria', italics: true, color: '003d5c' })],
  });
}
function agentLine(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: 'AGENT: ', size: 24, font: 'Cambria', bold: true, color: '002B49' }),
      new TextRun({ text, size: 24, font: 'Cambria', bold: true, color: '002B49' }),
    ],
    spacing: { before: 80, after: 80 },
  });
}
function prospectLine(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 24, font: 'Cambria', italics: true, color: '64748B' })],
    spacing: { before: 40, after: 40 },
  });
}
function sectionLabel(num, title) {
  return new Paragraph({
    children: [
      new TextRun({ text: 'SECTION ' + num + '  \u2014  ', size: 20, font: 'Cambria', bold: true, color: '64748B', allCaps: true }),
      new TextRun({ text: title, size: 20, font: 'Cambria', bold: true, color: '64748B', allCaps: true }),
    ],
    spacing: { before: 120, after: 60 },
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
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      left: { style: BorderStyle.SINGLE, size: 16, color: 'FF5500' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
    indent: { left: 360 },
    spacing: { before: 120, after: 120 },
    shading: { type: 'clear', color: 'auto', fill: 'FFF8F5' },
    children: [new TextRun({ text, size: 24, font: 'Cambria', bold: true, color: '002B49' })],
  });
}

function objectionTable(rows) {
  const colW1 = 3120, colW2 = 6240;
  return new Table({
    borders: hideAllBorders,
    columnWidths: [colW1, colW2],
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({ borders: headerBorder, width: { size: colW1, type: WidthType.DXA },
            shading: { type: 'clear', color: 'auto', fill: 'EBF5FB' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Objection', bold: true, size: 22, font: 'Cambria', color: '002B49' })] })] }),
          new TableCell({ borders: headerBorder, width: { size: colW2, type: WidthType.DXA },
            shading: { type: 'clear', color: 'auto', fill: 'EBF5FB' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Response', bold: true, size: 22, font: 'Cambria', color: '002B49' })] })] }),
        ],
      }),
      ...rows.map((row, ri) => new TableRow({
        children: [
          new TableCell({ borders: hideAllBorders, width: { size: colW1, type: WidthType.DXA },
            shading: { type: 'clear', color: 'auto', fill: ri % 2 === 0 ? 'FFFFFF' : 'F8FBFF' },
            children: [new Paragraph({ children: [new TextRun({ text: row[0], size: 21, font: 'Cambria', bold: true, color: '374151' })] })] }),
          new TableCell({ borders: hideAllBorders, width: { size: colW2, type: WidthType.DXA },
            shading: { type: 'clear', color: 'auto', fill: ri % 2 === 0 ? 'FFFFFF' : 'F8FBFF' },
            children: [new Paragraph({ children: [new TextRun({ text: row[1], size: 21, font: 'Cambria', color: '374151' })] })] }),
        ],
      })),
    ],
  });
}

function callFlowTable() {
  const cols = [1560, 1560, 6240];
  return new Table({
    borders: hideAllBorders,
    columnWidths: cols,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({ borders: headerBorder, width: { size: cols[0], type: WidthType.DXA }, shading: { type: 'clear', color: 'auto', fill: 'EBF5FB' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Stage', bold: true, size: 22, font: 'Cambria', color: '002B49' })] })] }),
          new TableCell({ borders: headerBorder, width: { size: cols[1], type: WidthType.DXA }, shading: { type: 'clear', color: 'auto', fill: 'EBF5FB' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Time', bold: true, size: 22, font: 'Cambria', color: '002B49' })] })] }),
          new TableCell({ borders: headerBorder, width: { size: cols[2], type: WidthType.DXA }, shading: { type: 'clear', color: 'auto', fill: 'EBF5FB' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Goal', bold: true, size: 22, font: 'Cambria', color: '002B49' })] })] }),
        ],
      }),
      ...([
        ['Open',    '0\u20131 min',  'Earn attention. Lead with the free Health Check and the competitor angle immediately.'],
        ['Engage',  '1\u20132 min',  'Get a \u201cyes, I\u2019m open to that.\u201d Confirm they\u2019re the decision-maker.'],
        ['Discover','2\u20135 min',  'Ask 2\u20133 open questions about their online presence and lead capture. Listen actively.'],
        ['Present', '5\u20137 min',  'Bridge 1\u20132 BluWav solutions to their specific pain. Reference Ripple / Current / Surge briefly.'],
        ['Close',   '7\u20139 min',  'Complete the Health Check form together now, OR send the link immediately.'],
        ['Wrap',    '9\u201310 min', 'Confirm form submitted or link sent. Remind them: results in 24 hours. No meeting needed.'],
      ]).map((row, ri) => new TableRow({
        children: row.map((cell, ci) => new TableCell({
          borders: hideAllBorders,
          width: { size: cols[ci], type: WidthType.DXA },
          shading: { type: 'clear', color: 'auto', fill: ri % 2 === 0 ? 'FFFFFF' : 'F8FBFF' },
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 21, font: 'Cambria', color: ci === 0 ? '002B49' : '374151', bold: ci === 0 })] })],
        })),
      })),
    ],
  });
}

function bridgeTable() {
  const cols = [2340, 7020];
  return new Table({
    borders: hideAllBorders,
    columnWidths: cols,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    rows: [
      new TableRow({ tableHeader: true, children: [
        new TableCell({ borders: headerBorder, width: { size: cols[0], type: WidthType.DXA }, shading: { type: 'clear', color: 'auto', fill: 'EBF5FB' },
          children: [new Paragraph({ children: [new TextRun({ text: 'Step', bold: true, size: 22, font: 'Cambria', color: '002B49' })] })] }),
        new TableCell({ borders: headerBorder, width: { size: cols[1], type: WidthType.DXA }, shading: { type: 'clear', color: 'auto', fill: 'EBF5FB' },
          children: [new Paragraph({ children: [new TextRun({ text: 'What to Say', bold: true, size: 22, font: 'Cambria', color: '002B49' })] })] }),
      ]}),
      ...([
        ['1. Echo the pain',         '\u201cYou mentioned that [pain point]\u2026\u201d'],
        ['2. Introduce the solution', '\u201cOne of the things BluWav does really well is [capability]\u2026\u201d'],
        ['3. Paint the outcome',      '\u201cWhat that means for you is [specific benefit] \u2014 so you get [time/money/customers] back.\u201d'],
        ['4. Tie to the Health Check','\u201cThat\u2019s exactly the kind of thing we\u2019d map out in your free Health Check.\u201d'],
      ]).map((row, ri) => new TableRow({
        children: row.map((cell, ci) => new TableCell({
          borders: hideAllBorders,
          width: { size: cols[ci], type: WidthType.DXA },
          shading: { type: 'clear', color: 'auto', fill: ri % 2 === 0 ? 'FFFFFF' : 'F8FBFF' },
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 21, font: 'Cambria', bold: ci === 0, color: ci === 0 ? '002B49' : '374151' })] })],
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
    ],
  },
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
      { id: 'Hyperlink', name: 'Hyperlink', basedOn: 'Normal',
        run: { color: '00C2D8', underline: { type: 'single' } } },
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({ children: [new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' } },
        children: [new TextRun({ text: 'BluWav Growth  \u00b7  Sales Script  \u00b7  Confidential \u2014 Agent Use Only', size: 18, font: 'Cambria', color: '64748B' })],
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
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'S A L E S   S C R I P T', size: 36, font: 'Calibri', bold: true, color: '00C2D8', letterSpacing: 200 })] }),
      spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Free Health Check Lead  \u00b7  Updated July 2026', size: 22, font: 'Cambria', color: '64748B', italics: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 480 }, children: [new TextRun({ text: 'Confidential \u2014 Agent Use Only', size: 22, font: 'Cambria', color: '64748B' })] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: '00C2D8' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: '00C2D8' } },
        spacing: { before: 120, after: 120 },
        children: [new TextRun({ text: 'Get Found. Get Chosen. Grow.', size: 32, font: 'Calibri', bold: true, color: '002B49' })],
      }),
      spacer(),

      // ── WHAT'S NEW ─────────────────────────────────────────────────────────
      h2("What's New in This Version"),
      body('Updated to reflect BluWav Growth\'s current global positioning: tagline \u201cGet Found. Get Chosen. Grow.\u201d, three Growth Systems (Ripple / Current / Surge), five CRM tiers (Starter / Lite / Premium / Enterprise / White-Label), 14-day free CRM trial included in every plan, Health Check results delivered within 24 hours, global audience focus (no Caribbean-specific language), and updated objection responses throughout.'),
      spacer(),

      // ── HOW TO USE ─────────────────────────────────────────────────────────
      h2('How to Use This Script'),
      body('This is a guide, not a word-for-word read. Internalise the flow, adapt the language to your natural voice, and let the conversation breathe.'),
      bullet('Bold navy = Agent speaking', 'bullet-list'),
      bullet('Italics = prospect response', 'bullet-list'),
      bullet('Coaching notes appear indented in teal', 'bullet-list'),
      bullet('The Free Health Check is a short online form \u2014 no meeting or scheduling required', 'bullet-list'),
      bullet('You can fill it out on the prospect\u2019s behalf during the call, or send them the link to complete themselves', 'bullet-list'),
      spacer(),

      // ── TABLE OF CONTENTS ──────────────────────────────────────────────────
      h2('Table of Contents'),
      body('1. Pre-Call Preparation'),
      body('2. Opening \u2014 The Free Health Check Hook'),
      body('3. Discovery Questions'),
      body('4. Presenting BluWav Growth Systems'),
      body('5. Objection Handling'),
      body('6. Closing Techniques'),
      body('7. Follow-Up Language'),
      body('8. Voicemail Script'),
      body('9. Quick Reference \u2014 At-a-Glance Call Flow'),
      spacer(),

      // ── SECTION 1 ──────────────────────────────────────────────────────────
      h1('1. Pre-Call Preparation'),
      body('Before dialling, spend 2\u20133 minutes on the following so the conversation feels personal and informed.'),
      spacer(),
      h2('Know Your Prospect'),
      bullet('Business name, industry, and approximate size', 'bullet-list-2'),
      bullet('Are they showing up on Google Search and Google Maps? (Quick search to check)', 'bullet-list-2'),
      bullet('Do they have a website? Is it mobile-friendly and professional?', 'bullet-list-2'),
      bullet('Are they on WhatsApp Business? Do they have a Google Business Profile?', 'bullet-list-2'),
      bullet('Pain points common to their sector \u2014 who are their likely competitors?', 'bullet-list-2'),
      spacer(),
      h2('Set Your Mindset'),
      bullet('You are calling to give something away \u2014 a Free Digital Health Check. Lead with generosity.', 'bullet-list-3'),
      bullet('Your goal for this call: secure the Health Check, not close a sale.', 'bullet-list-3'),
      bullet('The Health Check shows them exactly why customers are choosing their competitor right now \u2014 that is the hook.', 'bullet-list-3'),
      bullet('Smile before you dial \u2014 it carries through in your voice.', 'bullet-list-3'),
      spacer(),
      h2('Free Health Check \u2014 What It Is'),
      highlight('A no-cost, no-obligation form that gives BluWav a snapshot of the prospect\u2019s online presence. The client can fill it out themselves online, or you can fill it out on their behalf during the call. No meeting, no scheduling, no commitment. Once submitted, BluWav analyses the results and shows them exactly what\u2019s missing and what it\u2019s costing them. Results delivered within 24 hours. Zero pressure. Pure value.'),
      spacer(),
      h2('BluWav Growth Systems \u2014 Know These'),
      bulletBold('RIPPLE ($1,800+): ', 'Website + Google Business Profile + CRM trial + smart automation. Gets them found and looking professional. Delivered in 48\u201372 hours.', 'bullet-list-4'),
      bulletBold('CURRENT ($3,000+): ', 'Everything in Ripple + WhatsApp Business setup, advanced lead sequences, local SEO + competitor analysis, reputation builder, automated lead pipeline, conversion landing page, monthly check-in call.', 'bullet-list-4'),
      bulletBold('SURGE ($5,000+): ', 'Full system with Google Ads, multi-search engine listing, full WhatsApp sales funnel, monthly visibility reports, quarterly strategy reviews, dedicated account manager.', 'bullet-list-4'),
      spacer(),
      body('Every plan includes a 14-day free CRM trial \u2014 so even Ripple clients experience the full automation from day one.'),
      spacer(),
      h2('CRM Plans \u2014 Know the Tiers'),
      bulletBold('CRM Starter: ', '$59/mo + $99 onboarding. 25 contacts, lead tracking, 1 user.', 'bullet-list-5'),
      bulletBold('CRM Lite: ', '$99/mo + $199 onboarding. 250 contacts, pipeline, basic automation, 2 team members.', 'bullet-list-5'),
      bulletBold('CRM Premium: ', '$179/mo + $299 onboarding. Unlimited contacts, full pipeline, WhatsApp integration, 5 team members. Introductory rate \u2014 locks in for life.', 'bullet-list-5'),
      bulletBold('CRM Enterprise: ', '$499/mo + $599 onboarding. Unlimited team, custom workflows, API access, dedicated account manager.', 'bullet-list-5'),
      bulletBold('White-Label: ', '$697/mo + $699 onboarding. For agencies \u2014 your brand, unlimited client accounts.', 'bullet-list-5'),
      spacer(),

      // ── SECTION 2 ──────────────────────────────────────────────────────────
      h1('2. Opening \u2014 The Free Health Check Hook'),
      body('The opening has one job: earn 60 more seconds. Lead with the free offer and the competitor angle immediately \u2014 do not bury it.'),
      spacer(),
      h2('Gatekeeper / Receptionist'),
      agentLine('Hi there! This is [your name] calling from BluWav Growth. Could I speak with [Owner\u2019s Name] please? I\u2019m reaching out about a free online Health Check we\u2019re offering businesses \u2014 it\u2019s a short form, and it shows them exactly why customers might be choosing a competitor right now. Completely free, no strings attached.'),
      tip('If asked what it\u2019s about: \u201cIt\u2019s a free check of their online presence \u2014 Google, website, lead capture. We show them what\u2019s missing and what it\u2019s costing them. No sales pitch, just the facts.\u201d'),
      spacer(),
      h2('Decision-Maker Answers \u2014 Cold Open'),
      agentLine('Hi [Name], this is [your name] from BluWav Growth \u2014 hope I\u2019ve caught you at an okay moment? [Pause] Great. The reason I\u2019m calling is we\u2019re offering businesses a completely free Digital Health Check \u2014 no cost, no obligation. It\u2019s a short form about your business, and we use the answers to show you exactly why customers might be choosing a competitor right now instead of you. I can walk you through it right now in two minutes, or send you the link to do it yourself. Most business owners are genuinely surprised by what we find. Would you be open to that?'),
      tip('Pause after \u201copen to?\u201d \u2014 silence is your friend. If they say yes, offer to fill it out together on the call right now \u2014 it takes 2 minutes and locks in the engagement immediately.'),
      spacer(),
      h2('Warm / Referred Lead Open'),
      agentLine('Hi [Name], this is [your name] from BluWav Growth. [Referrer\u2019s Name] suggested I give you a call \u2014 they thought you\u2019d find our free Digital Health Check really valuable. It\u2019s a short form about your business \u2014 no cost, no commitment. I can walk you through it right now, or send you the link. [Referrer] found the results really eye-opening. Would you be open to that?'),
      spacer(),
      h2('Power Phrases'),
      bullet('\u201cOur free Health Check shows you exactly why customers are choosing your competitor right now \u2014 not you.\u201d', 'bullet-list-6'),
      bullet('\u201cThe businesses that get online first \u2014 and get it right \u2014 win. We want to make sure that\u2019s you.\u201d', 'bullet-list-6'),
      bullet('\u201cIt\u2019s completely free \u2014 we\u2019re not here to sell you anything today. We just want to show you what\u2019s possible.\u201d', 'bullet-list-6'),
      bullet('\u201cResults come back within 24 hours \u2014 no meeting, no commitment.\u201d', 'bullet-list-6'),
      spacer(),

      // ── SECTION 3 ──────────────────────────────────────────────────────────
      h1('3. Discovery Questions'),
      body('Once the prospect is engaged, ask open questions to understand their world. Listen more than you talk. These questions also prime them to feel the pain points BluWav solves.'),
      spacer(),
      h2('Online Presence & Visibility'),
      bullet('If someone searched for [their type of business] in [their area] right now, do you think they\u2019d find you easily?', 'bullet-list-7'),
      bullet('Do you have a Google Business Profile set up \u2014 the listing that shows up on Google Maps?', 'bullet-list-7'),
      bullet('How are customers finding you at the moment \u2014 mostly word of mouth, referrals, or online?', 'bullet-list-7'),
      bullet('When did you last update your website? Is it mobile-friendly?', 'bullet-list-7'),
      spacer(),
      h2('Lead Capture & Follow-Up'),
      bullet('When someone contacts you \u2014 by WhatsApp, phone, or your website \u2014 what happens next? Is there a system, or does it depend on who picks it up?', 'bullet-list-8'),
      bullet('How are you managing enquiries and following up with potential customers right now?', 'bullet-list-8'),
      bullet('Do you feel like you\u2019re missing leads or enquiries that never convert into customers?', 'bullet-list-8'),
      spacer(),
      h2('Growth & Challenges'),
      bullet('What\u2019s the biggest challenge you\u2019re facing in the business right now?', 'bullet-list-2'),
      bullet('If you could fix one thing that\u2019s slowing you down or costing you customers, what would it be?', 'bullet-list-2'),
      bullet('Where do you want the business to be in the next 12 months?', 'bullet-list-2'),
      spacer(),
      tip('Reflect back what you hear: \u201cSo it sounds like most of your customers come through word of mouth, but you\u2019re not sure how many you\u2019re missing online \u2014 is that right?\u201d This builds trust and shows you\u2019re genuinely listening, not just running through a checklist.'),
      spacer(),

      // ── SECTION 4 ──────────────────────────────────────────────────────────
      h1('4. Presenting BluWav Growth Systems'),
      body('Only present solutions after you\u2019ve listened. Tie every BluWav capability directly to something the prospect just told you. Avoid feature-dumping \u2014 lead with outcomes. The Health Check is always the next step, not a full pitch.'),
      spacer(),
      h2('The One System, Every Channel Message'),
      body('Use this framing when they ask what BluWav does:'),
      agentLine('What BluWav does is bring everything together into one system \u2014 your website, your Google listing, WhatsApp, your CRM, and automation \u2014 so they all work together to bring you more customers. Right now, most businesses have bits and pieces that don\u2019t talk to each other. We fix that. And every plan includes a 14-day free CRM trial so you can see the automation working from day one.'),
      spacer(),
      h2('Bridge Formula \u2014 Pain to Solution'),
      body('Use this structure for every solution you introduce:'),
      spacer(),
      bridgeTable(),
      spacer(),
      h2('Example Bridges by Pain Point'),
      spacer(),
      bodyBold('Pain: \u201cPeople can\u2019t find us online\u201d'),
      agentLine('You mentioned people mostly find you through word of mouth. The problem is, right now someone is searching for exactly what you offer on Google \u2014 and they\u2019re finding your competitor instead of you. BluWav sets up and optimises your Google Business Profile so you show up on Google Search, Google Maps, and Bing. What that means is customers who are ready to buy can actually find you. That\u2019s exactly what the free Health Check looks at \u2014 we show you where you\u2019re invisible right now and how to fix it.'),
      spacer(),
      bodyBold('Pain: \u201cWe\u2019re missing leads / no follow-up system\u201d'),
      agentLine('You mentioned enquiries come in but sometimes fall through the cracks. That\u2019s actually one of the most common things we see. BluWav includes a CRM and automated follow-ups in every plan \u2014 so when someone contacts you through your website or WhatsApp, the system captures them and follows up automatically. What that means is you stop losing leads to slow response times. And every plan includes a 14-day free CRM trial so you can see it working from day one.'),
      tip('If they ask what a CRM is: \u201cA CRM \u2014 Customer Relationship Manager \u2014 is basically a smart contact book that tracks every lead and customer automatically. Instead of relying on memory or a notebook, it reminds you who to follow up with, when, and how. Think of it as your business\u2019s memory. BluWav\u2019s CRM is included free for 14 days so you can see exactly how it works for your business before committing to anything.\u201d'),
      spacer(),
      bodyBold('Pain: \u201cOur website is outdated / we don\u2019t have one\u201d'),
      agentLine('You mentioned your website hasn\u2019t been updated in a while \u2014 and honestly, customers judge a business in about three seconds online. BluWav builds modern, mobile-first websites that are designed to convert visitors into real enquiries, and we deliver them in 48 to 72 hours. What that means is you could have a professional online presence working for you by the end of this week. The Health Check would show you exactly what your current site is costing you in lost customers.'),
      spacer(),
      bodyBold('Pain: \u201cWe tried digital marketing before and it didn\u2019t work\u201d'),
      agentLine('I\u2019m sorry to hear that \u2014 that\u2019s really frustrating. Can I ask what happened? [Listen] That\u2019s helpful context. What BluWav does differently is bring everything into one connected system \u2014 website, Google, WhatsApp, CRM \u2014 so nothing falls through the cracks. The Health Check is a great way to see exactly where the gaps are, with no commitment.'),
      spacer(),

      // ── SECTION 5 ──────────────────────────────────────────────────────────
      h1('5. Objection Handling'),
      body('Objections are not rejections \u2014 they are requests for more information or reassurance. Acknowledge, empathise, and redirect.'),
      spacer(),
      objectionTable([
        ['\u201cI\u2019m too busy right now.\u201d', '\u201cI completely understand \u2014 that\u2019s actually exactly why I\u2019m calling. The Health Check is a short form \u2014 no meeting, no scheduling. I can walk you through it right now in two minutes, or send you the link and you do it whenever suits you. We do all the analysis, you get the results in 24 hours.\u201d'],
        ['\u201cWe\u2019re not interested in buying anything.\u201d', '\u201cThat\u2019s totally fine \u2014 this isn\u2019t a sales call. The Health Check is genuinely free with no obligation. It\u2019s a short form and we show you what we find \u2014 where you\u2019re invisible online, what\u2019s costing you customers \u2014 and you decide what, if anything, you want to do with it. Would you be open to that?\u201d'],
        ['\u201cWe already have a website / we\u2019re already online.\u201d', '\u201cThat\u2019s great \u2014 and honestly, that makes the Health Check even more useful. A lot of businesses have a website but it\u2019s not showing up on Google, or it\u2019s not capturing leads properly. We look at the full picture \u2014 Google, Maps, Bing, WhatsApp \u2014 and flag anything that could be working harder for you. It\u2019s free, so there\u2019s nothing to lose.\u201d'],
        ['\u201cHow much does it cost?\u201d', '\u201cThe Health Check itself is completely free \u2014 no catch. If you decide you\u2019d like to explore BluWav\u2019s Growth Systems after, we have three plans \u2014 Ripple from $1,800, Current from $3,000, and Surge from $5,000 \u2014 and every single one includes a 14-day free CRM trial. But there\u2019s zero pressure and zero cost for the Health Check.\u201d'],
        ['\u201cSend me some information first.\u201d', '\u201cAbsolutely, I can do that. I\u2019ll send something over right now. The Health Check link is in there too \u2014 it\u2019s a short form and takes two minutes. Have a look and if you have any questions, just reach out.\u201d'],
        ['\u201cWe tried digital marketing before and it didn\u2019t work.\u201d', '\u201cI\u2019m sorry to hear that \u2014 that\u2019s really frustrating. Can I ask what happened? [Listen] What BluWav does differently is bring everything into one connected system \u2014 website, Google, WhatsApp, CRM \u2014 so nothing falls through the cracks. The Health Check is a great way to see exactly where the gaps are, with no commitment.\u201d'],
        ['\u201cI don\u2019t think our customers use Google.\u201d', '\u201cThat\u2019s a really common assumption \u2014 and it\u2019s almost always wrong. Modern customers search Google before they call, visit, or buy. If your business isn\u2019t showing up, they\u2019re choosing someone who is. The Health Check would actually show you exactly how many people are searching for what you offer right now. Would you be open to seeing that?\u201d'],
        ['\u201cWe\u2019re a small business, we don\u2019t need all this.\u201d', '\u201cThat\u2019s exactly who BluWav is built for. Our Ripple plan starts at $1,800 \u2014 it\u2019s a one-time investment, you own everything forever, and it includes a 14-day free CRM trial. The Health Check just shows you where the biggest opportunity is for your specific business. No commitment.\u201d'],
      ]),
      spacer(),

      // ── SECTION 6 ──────────────────────────────────────────────────────────
      h1('6. Closing Techniques'),
      body('The close for this call is simple: get the Health Check form completed \u2014 either together on the call right now, or by sending them the link. No scheduling, no meeting.'),
      spacer(),
      h2('Assumptive Close \u2014 Do It Now Together'),
      agentLine('Brilliant \u2014 let\u2019s do it right now, it only takes two minutes. I\u2019ll ask you the questions and fill it in as we go. First one: what\u2019s your business name and what do you do?'),
      tip('This is the strongest close \u2014 completing the form together on the call locks in engagement immediately and means you control the quality of the answers. Move straight into the questions without waiting.'),
      spacer(),
      h2('Send the Link Close \u2014 If They Prefer to Do It Themselves'),
      agentLine('No problem at all \u2014 I\u2019ll send you the link right now. It\u2019s a short form, takes about two minutes. Once you submit it, we\u2019ll analyse your online presence and come back to you with the results within 24 hours. What\u2019s the best email or number to send it to?'),
      tip('Send the link immediately while they\u2019re on the call. Follow up within 24 hours if the form hasn\u2019t been submitted.'),
      spacer(),
      h2('Urgency / Competitor Close'),
      agentLine('Here\u2019s the thing \u2014 every day your business isn\u2019t showing up on Google, a competitor is getting that customer instead of you. The Health Check is a short form and it\u2019s completely free. Let\u2019s do it right now \u2014 it takes two minutes and I\u2019ll have results back to you within 24 hours.'),
      spacer(),
      h2('Soft Close \u2014 If They\u2019re Hesitant'),
      agentLine('Look, I don\u2019t want to push you into anything. How about this \u2014 I\u2019ll send you the link and you can fill it in whenever suits you. It\u2019s a short form. If you have any questions after, just reach out. Does that work?'),
      spacer(),
      h2('Health Check Link'),
      highlight('bluwavgrowth.com/free-health-check'),
      spacer(),

      // ── SECTION 7 ──────────────────────────────────────────────────────────
      h1('7. Follow-Up Language'),
      body('Most conversions happen on the follow-up. Be persistent without being pushy. Always give a reason for calling back.'),
      spacer(),
      h2('Same-Day Follow-Up (After Sending Info)'),
      agentLine('Hi [Name], [your name] from BluWav Growth here. I sent over the info and the Health Check link earlier today \u2014 just wanted to make sure it landed okay. It\u2019s a short form, takes two minutes. Did you get a chance to have a look?'),
      tip('If they haven\u2019t filled it in yet, offer to do it together right now on the call. \u201cI can walk you through it now if you like \u2014 takes two minutes.\u201d'),
      spacer(),
      h2('24-Hour Follow-Up (Form Not Submitted)'),
      agentLine('Hi [Name], [your name] from BluWav Growth again. I know you\u2019re busy so I\u2019ll keep this quick \u2014 I just wanted to follow up on the free Health Check link I sent. It\u2019s a short form and we do all the analysis for you \u2014 results back within 24 hours. Want me to walk you through it now? Takes two minutes.'),
      spacer(),
      h2('One-Week Follow-Up \u2014 Competitor Angle'),
      agentLine('Hi [Name], it\u2019s [your name] from BluWav Growth. I\u2019ve been thinking about what you mentioned regarding [specific pain point] \u2014 and I actually did a quick check on your online presence. I found a couple of things I think you\u2019d want to know about. The Health Check is a short form \u2014 can I send you the link right now, or shall we do it together quickly?'),
      tip('If you actually did a quick Google search on their business before calling back, this is even more powerful \u2014 you can reference something specific you noticed.'),
      spacer(),
      h2('Follow-Up Cadence'),
      bullet('Day 0: Call + send link with info and Health Check URL', 'bullet-list-3'),
      bullet('Day 1: Follow-up call \u2014 offer to complete form together', 'bullet-list-3'),
      bullet('Day 5: Message nudge with competitor angle', 'bullet-list-3'),
      bullet('Day 10: Final call', 'bullet-list-3'),
      bullet('After 3 no-responses: move to nurture sequence, revisit in 30 days', 'bullet-list-3'),
      spacer(),

      // ── SECTION 8 ──────────────────────────────────────────────────────────
      h1('8. Voicemail Script'),
      body('Keep voicemails under 30 seconds. Create curiosity, not information overload. Always end with a clear call to action.'),
      spacer(),
      h2('Voicemail \u2014 First Attempt'),
      agentLine('Hi [Name], this is [your name] calling from BluWav Growth. I\u2019m reaching out because we\u2019re offering businesses a completely free Digital Health Check \u2014 it\u2019s a short form, and it shows you exactly why customers might be choosing a competitor right now instead of you. No meeting, no commitment, results in 24 hours. I\u2019ll send you the link as well. Feel free to call me back on [your number]. Have a great day!'),
      spacer(),
      h2('Voicemail \u2014 Second Attempt'),
      agentLine('Hi [Name], [your name] from BluWav Growth again. I don\u2019t want to keep bothering you, so this will be my last message for now. I sent the free Health Check link \u2014 it\u2019s a short form and takes two minutes. A lot of businesses have been really surprised by what we find. If you have any questions, just reach out. Hope to speak soon!'),
      spacer(),
      tip('Smile while you record \u2014 it genuinely changes your tone. Speak at 80% of your normal pace. Say your phone number slowly and repeat it once.'),
      spacer(),

      // ── SECTION 9: QUICK REFERENCE ─────────────────────────────────────────
      h1('9. Quick Reference \u2014 At-a-Glance Call Flow'),
      spacer(),
      callFlowTable(),
      spacer(),
      highlight('Four questions. 24 hours. No meeting. Just results. Make sure your prospect gets theirs.'),
      spacer(),
      divider(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 120 },
        children: [new TextRun({ text: 'BluWav Growth  \u00b7  Sales Script  \u00b7  July 2026', size: 22, font: 'Cambria', color: '64748B' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Confidential \u2014 Agent Use Only  \u00b7  bluwavgrowth.com', size: 22, font: 'Cambria', color: '64748B', italics: true })],
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
  console.log('BluWav Sales Script generated successfully.');
});