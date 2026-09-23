// Cloudflare Pages Function: /functions/send-review-request.js
// Handles Free Digital Presence Review form submissions
// - Validates form fields
// - Saves lead to StratiixOne CRM via API
// - Sends confirmation email to prospect (via Brevo)
// - Sends notification email to BluWav sales inbox (via Brevo)
// - Structured for future WhatsApp notification integration
//
// Required environment variables (Cloudflare Pages > Settings > Environment Variables):
//   BREVO_API_KEY        — Brevo transactional email API key
//   STRATIIXONE_API_KEY  — StratiixOne CRM API key
//   STRATIIXONE_API_URL  — StratiixOne CRM API base URL (e.g. https://api.stratiixone.com)
//   SALES_EMAIL          — Sales inbox (e.g. hello@bluwavgrowth.com)
//   WHATSAPP_API_URL     — (optional) WhatsApp notification webhook URL

export async function onRequestPost(context) {
  const BREVO_KEY        = context.env.BREVO_API_KEY;
  const CRM_KEY          = context.env.STRATIIXONE_API_KEY;
  const CRM_URL          = context.env.STRATIIXONE_API_URL;
  const SALES_EMAIL      = context.env.SALES_EMAIL || 'hello@bluwavgrowth.com';
  const WA_URL           = context.env.WHATSAPP_API_URL || null;

  if (!BREVO_KEY) {
    return jsonResponse({ success: false, error: 'Email service not configured.' }, 500);
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ success: false, error: 'Invalid request body.' }, 400);
  }

  const {
    first_name, last_name, business_name, business_email,
    whatsapp_phone, country, website_social, help_area, consent
  } = body;

  // ── Validation ────────────────────────────────────────────────────────────
  const errors = [];
  if (!first_name?.trim())     errors.push('First name is required.');
  if (!last_name?.trim())      errors.push('Last name is required.');
  if (!business_name?.trim())  errors.push('Business name is required.');
  if (!business_email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business_email))
                               errors.push('A valid business email is required.');
  if (!whatsapp_phone?.trim()) errors.push('WhatsApp or telephone number is required.');
  if (!country?.trim())        errors.push('Country is required.');
  if (!help_area?.trim())      errors.push('Please select your main area where help is needed.');
  if (!consent)                errors.push('Please confirm your consent to proceed.');

  if (errors.length) {
    return jsonResponse({ success: false, errors }, 422);
  }

  const fullName    = `${first_name.trim()} ${last_name.trim()}`;
  const firstName   = first_name.trim();
  const submittedAt = new Date().toISOString();

  // ── 1. Save to StratiixOne CRM ────────────────────────────────────────────
  let crmLeadId = null;
  if (CRM_KEY && CRM_URL) {
    try {
      const crmPayload = {
        source:        'bluwavgrowth.com - Free Digital Presence Review',
        lead_type:     'digital_presence_review',
        first_name:    first_name.trim(),
        last_name:     last_name.trim(),
        business_name: business_name.trim(),
        email:         business_email.trim(),
        phone:         whatsapp_phone.trim(),
        country:       country.trim(),
        website:       website_social?.trim() || null,
        help_area:     help_area.trim(),
        consent:       consent ? 'yes' : 'no',
        submitted_at:  submittedAt,
        status:        'new',
        assigned_to:   null, // future: auto-assign by country/region
        tags:          ['digital-presence-review', country.trim().toLowerCase().replace(/\s+/g, '-')]
      };
      const crmRes = await fetch(`${CRM_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CRM_KEY}`,
          'Content-Type':  'application/json'
        },
        body: JSON.stringify(crmPayload)
      });
      if (crmRes.ok) {
        const crmData = await crmRes.json();
        crmLeadId = crmData?.id || crmData?.lead_id || null;
      }
    } catch (e) {
      // CRM save failure is non-fatal — log but continue
      console.error('CRM save failed:', e.message);
    }
  }

  // ── 2. Build email content ────────────────────────────────────────────────
  const adminHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <div style="font-size:24px;font-weight:900;color:#0a0f1e;margin-bottom:4px;">BluWav Growth</div>
      <div style="font-size:10px;font-weight:700;color:#00C8E0;letter-spacing:3px;text-transform:uppercase;margin-bottom:24px;">Get Found. Get Chosen. Grow.</div>
      <h2 style="color:#0a0f1e;font-size:20px;margin-bottom:8px;">New Digital Presence Review Request</h2>
      <p style="color:#64748b;font-size:13px;margin-bottom:20px;">Submitted: ${submittedAt}${crmLeadId ? ` &nbsp;|&nbsp; CRM Lead ID: <strong>${crmLeadId}</strong>` : ''}</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        ${row('Name',          fullName)}
        ${row('Business',      business_name.trim())}
        ${row('Email',         `<a href="mailto:${business_email.trim()}">${business_email.trim()}</a>`)}
        ${row('WhatsApp/Tel',  whatsapp_phone.trim())}
        ${row('Country',       country.trim())}
        ${row('Website/Social',website_social?.trim() || 'Not provided')}
        ${row('Help Needed',   help_area.trim())}
        ${row('Consent',       consent ? 'Yes' : 'No')}
      </table>
      <div style="margin-top:24px;padding:16px 20px;background:#f8fafc;border-radius:10px;border-left:4px solid #ff6535;">
        <div style="font-size:12px;font-weight:700;color:#ff6535;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Action Required</div>
        <p style="font-size:14px;color:#334155;margin:0;">Contact ${firstName} within 24 hours via WhatsApp: <strong>${whatsapp_phone.trim()}</strong> or email: <strong>${business_email.trim()}</strong></p>
      </div>
      <p style="color:#94a3b8;font-size:12px;margin-top:24px;">BluWav Growth &middot; bluwavgrowth.com</p>
    </div>`;

  const confirmHtml = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="font-size:26px;font-weight:900;color:#0a0f1e;margin-bottom:4px;">BluWav Growth</div>
      <div style="font-size:10px;font-weight:700;color:#00C8E0;letter-spacing:3px;text-transform:uppercase;margin-bottom:24px;">Get Found. Get Chosen. Grow.</div>
      <h2 style="color:#0a0f1e;font-size:20px;margin-bottom:14px;">Your Free Digital Presence Review is Confirmed</h2>
      <p style="color:#374151;font-size:15px;line-height:1.75;margin-bottom:12px;">Hi ${firstName},</p>
      <p style="color:#374151;font-size:15px;line-height:1.75;margin-bottom:12px;">Thank you for requesting your Free Digital Presence Review. We have received your details and a member of the BluWav team will be in touch within 24 hours.</p>
      <p style="color:#374151;font-size:15px;line-height:1.75;margin-bottom:20px;">We will review your current online presence, identify gaps, and share practical recommendations tailored to your business in ${country.trim()}.</p>
      <div style="background:#f8fafc;border-radius:12px;padding:20px 24px;margin-bottom:24px;border-left:4px solid #00C8E0;">
        <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#ff6535;margin-bottom:10px;">Your Review Summary</div>
        <div style="font-size:14px;color:#374151;line-height:1.9;">
          <strong>Business:</strong> ${business_name.trim()}<br/>
          <strong>Country:</strong> ${country.trim()}<br/>
          <strong>Main area of focus:</strong> ${help_area.trim()}
        </div>
      </div>
      <p style="color:#374151;font-size:15px;line-height:1.75;margin-bottom:20px;">While you wait, you can <a href="https://bluwavgrowth.com/pricing.html" style="color:#ff6535;font-weight:600;">explore our membership plans</a> to see how BluWav helps Caribbean businesses get found, get chosen, and grow.</p>
      <p style="color:#64748b;font-size:12px;line-height:1.7;border-top:1px solid #e2e8f0;padding-top:16px;">
        You are receiving this email because you requested a Free Digital Presence Review at bluwavgrowth.com and consented to email communications. To withdraw consent, email <a href="mailto:hello@bluwavgrowth.com" style="color:#ff6535;">hello@bluwavgrowth.com</a>.
      </p>
      <p style="color:#94a3b8;font-size:12px;margin-top:8px;">BluWav Growth &middot; bluwavgrowth.com</p>
    </div>`;

  // ── 3. Send emails ────────────────────────────────────────────────────────
  const sends = [
    brevoSend(BREVO_KEY, {
      sender:      { name: 'BluWav Growth - Review Form', email: 'hello@bluwavgrowth.com' },
      to:          [{ email: SALES_EMAIL, name: 'BluWav Sales' }],
      replyTo:     { email: business_email.trim(), name: fullName },
      subject:     `New Digital Presence Review - ${business_name.trim()} (${country.trim()})`,
      htmlContent: adminHtml
    }),
    brevoSend(BREVO_KEY, {
      sender:      { name: 'BluWav Growth', email: 'hello@bluwavgrowth.com' },
      to:          [{ email: business_email.trim(), name: fullName }],
      replyTo:     { email: SALES_EMAIL, name: 'BluWav Growth' },
      subject:     'Your Free Digital Presence Review is Confirmed',
      htmlContent: confirmHtml
    })
  ];

  // ── 4. WhatsApp notification (future integration) ─────────────────────────
  if (WA_URL) {
    try {
      await fetch(WA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:          'new_review_lead',
          name:          fullName,
          business:      business_name.trim(),
          phone:         whatsapp_phone.trim(),
          country:       country.trim(),
          help_area:     help_area.trim(),
          crm_lead_id:   crmLeadId,
          submitted_at:  submittedAt
        })
      });
    } catch (e) {
      console.error('WhatsApp notification failed:', e.message);
    }
  }

  const results  = await Promise.all(sends);
  const allOk    = results.every(r => r.ok);

  if (allOk) {
    return jsonResponse({ success: true, lead_id: crmLeadId });
  }
  const errs = await Promise.all(results.map(r => r.text()));
  return jsonResponse({ success: false, error: errs.join(' | ') }, 500);
}

function row(label, value) {
  return `<tr>
    <td style="padding:8px 12px;font-weight:700;color:#0a0f1e;width:140px;border-bottom:1px solid #f1f5f9;">${label}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#334155;">${value}</td>
  </tr>`;
}

async function brevoSend(key, payload) {
  return fetch('https://api.brevo.com/v3/smtp/email', {
    method:  'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload)
  });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
