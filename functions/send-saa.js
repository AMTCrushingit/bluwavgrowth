// Cloudflare Pages Function: /functions/send-saa.js
// Handles BluWav Sales Agent Agreement submissions
// Sends signed agreement notification to careers@ and confirmation to agent
// Requires BREVO_API_KEY in Cloudflare Pages > Settings > Environment Variables

export async function onRequestPost(context) {
  const BREVO_KEY = context.env.BREVO_API_KEY;
  if (!BREVO_KEY) {
    return new Response(JSON.stringify({ success: false, error: 'API key not configured' }), {
      status: 500, headers: corsHeaders()
    });
  }

  try {
    const body = await context.request.json();
    const {
      firstName, lastName, email, whatsapp, business, territory, tier,
      sigName, signatureImage, signedDate, signedTime,
      sessionToken, ipAddress, location, userAgent, agreementVersion
    } = body;

    const fullName = `${firstName} ${lastName}`;
    const fName = firstName;

    // ── ADMIN EMAIL (to careers@bluwavgrowth.com) ──
    const adminHtml = `
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:0;">
      <!-- Header -->
      <div style="background:#002B49;padding:28px 32px;border-radius:12px 12px 0 0;">
        <div style="font-size:26px;font-weight:900;color:#fff;margin-bottom:2px;">BluWav Growth</div>
        <div style="font-size:10px;font-weight:700;color:#00E0FF;letter-spacing:3px;text-transform:uppercase;">Get Found. Get Chosen. Grow.</div>
      </div>
      <!-- Alert banner -->
      <div style="background:#FF5500;padding:14px 32px;">
        <div style="font-size:15px;font-weight:800;color:#fff;">🤝 New Sales Agent Agreement Signed</div>
      </div>
      <!-- Body -->
      <div style="background:#fff;padding:32px;border:1px solid #e2e8f0;border-top:none;">
        <h2 style="color:#002B49;font-size:18px;margin:0 0 20px;">Agent Details</h2>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          ${row('Full Name', fullName)}
          ${row('Email', `<a href="mailto:${email}" style="color:#FF5500;">${email}</a>`)}
          ${row('WhatsApp', whatsapp || 'Not provided')}
          ${row('Business', business || 'Not provided')}
          ${row('Territory', territory)}
          ${row('Partner Tier', tier)}
          ${row('Printed Name', sigName)}
          ${row('Signed', `${signedDate} at ${signedTime} UTC`)}
        </table>

        <h2 style="color:#002B49;font-size:18px;margin:28px 0 16px;">Legal Audit Trail</h2>
        <div style="background:#F8FAFC;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;font-size:12px;color:#374151;line-height:1.8;font-family:monospace;">
          Session Token: ${sessionToken}<br/>
          IP Address: ${ipAddress}<br/>
          Location: ${location}<br/>
          Signed: ${signedDate} at ${signedTime} UTC<br/>
          Agreement: ${agreementVersion || 'BluWav Growth Sales Agent Agreement v1.0'}<br/>
          User Agent: ${userAgent}
        </div>

        ${signatureImage ? `
        <h2 style="color:#002B49;font-size:18px;margin:28px 0 16px;">Digital Signature</h2>
        <div style="border:2px solid #e2e8f0;border-radius:8px;padding:12px;background:#F8FAFC;text-align:center;">
          <img src="${signatureImage}" alt="Digital Signature" style="max-width:400px;height:auto;display:block;margin:0 auto;"/>
          <div style="font-size:11px;color:#64748b;margin-top:8px;">Signed as: ${sigName}</div>
        </div>` : ''}

        <div style="background:#EFF6FF;border-left:4px solid #00E0FF;border-radius:0 8px 8px 0;padding:14px 18px;margin-top:28px;font-size:13px;color:#002B49;">
          <strong>Next Step:</strong> Contact ${fName} to schedule their onboarding call and confirm their first 3 prospects.
        </div>
      </div>
      <!-- Footer -->
      <div style="background:#F8FAFC;padding:16px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;text-align:center;">
        <div style="font-size:12px;color:#94a3b8;">BluWav Growth · bluwavgrowth.com · careers@bluwavgrowth.com</div>
      </div>
    </div>`;

    // ── AGENT CONFIRMATION EMAIL ──
    const agentHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:0;">
      <!-- Header -->
      <div style="background:#002B49;padding:28px 32px;border-radius:12px 12px 0 0;">
        <div style="font-size:26px;font-weight:900;color:#fff;margin-bottom:2px;">BluWav Growth</div>
        <div style="font-size:10px;font-weight:700;color:#00E0FF;letter-spacing:3px;text-transform:uppercase;">Get Found. Get Chosen. Grow.</div>
      </div>
      <!-- Body -->
      <div style="background:#fff;padding:36px 32px;border:1px solid #e2e8f0;border-top:none;">
        <h2 style="color:#002B49;font-size:22px;margin:0 0 16px;">Welcome to BluWav Growth, ${fName}! 🎉</h2>
        <p style="color:#374151;font-size:15px;line-height:1.75;margin-bottom:14px;">Your Sales Agent Agreement has been signed and accepted. You are now officially a BluWav Growth <strong>${tier}</strong>.</p>

        <!-- Agreement summary box -->
        <div style="background:#F4F2ED;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
          <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#FF5500;margin-bottom:12px;">Agreement Summary</div>
          <div style="font-size:13px;color:#374151;line-height:1.9;">
            <strong>Name:</strong> ${fullName}<br/>
            <strong>Tier:</strong> ${tier}<br/>
            <strong>Territory:</strong> ${territory}<br/>
            <strong>Signed:</strong> ${signedDate} at ${signedTime} UTC<br/>
            <strong>Session Token:</strong> <span style="font-family:monospace;font-size:11px;">${sessionToken}</span>
          </div>
        </div>

        <!-- Onboarding package -->
        <div style="background:#EFF6FF;border:1px solid rgba(0,224,255,0.3);border-radius:12px;padding:20px 24px;margin-bottom:28px;">
          <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#002B49;margin-bottom:10px;">📦 Your Sales Agent Onboarding Package</div>
          <p style="font-size:13px;color:#374151;line-height:1.7;margin-bottom:14px;">Download your 37-page onboarding package. It includes everything you need to start closing deals:</p>
          <ul style="font-size:13px;color:#374151;line-height:1.9;padding-left:20px;margin-bottom:16px;">
            <li>Welcome letter from Andrea</li>
            <li>Product sheets (Ripple, Current, Surge, CRM, Growth Sprint)</li>
            <li>Sales scripts and objection handler</li>
            <li>Commission structure and earnings scenarios</li>
            <li>Your 30-day action plan</li>
          </ul>
          <a href="https://raw.githubusercontent.com/AMTCrushingit/clientflow/main/sales-package/BluWav-Sales-Agent-Onboarding-Package.pdf"
             style="display:inline-block;background:#FF5500;color:#fff;font-weight:800;font-size:14px;padding:13px 28px;border-radius:9px;text-decoration:none;">
            Download Onboarding Package →
          </a>
        </div>

        <!-- Next steps -->
        <h3 style="color:#002B49;font-size:16px;margin:0 0 14px;">Your Next Steps</h3>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${step(1, 'Download and read your Sales Agent Onboarding Package')}
          ${step(2, 'WhatsApp Andrea to confirm your onboarding call slot')}
          ${step(3, 'Identify your first 3 prospects before the call')}
          ${step(4, 'Start closing deals and earning commissions')}
        </div>

        <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e2e8f0;">
          <p style="color:#374151;font-size:14px;line-height:1.7;margin-bottom:4px;">Questions? Reach out anytime:</p>
          <p style="font-size:14px;margin:0;"><a href="mailto:hello@bluwavgrowth.com" style="color:#FF5500;font-weight:700;">hello@bluwavgrowth.com</a></p>
        </div>

        <div style="margin-top:28px;font-size:16px;font-weight:800;color:#002B49;">Welcome to the team. Let's grow. 🚀</div>
        <div style="margin-top:6px;font-size:13px;color:#64748b;">Andrea M. Tanguay · Founder & CEO, BluWav Growth</div>
      </div>
      <!-- Footer -->
      <div style="background:#F8FAFC;padding:16px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;text-align:center;">
        <div style="font-size:11px;color:#94a3b8;line-height:1.7;">
          You are receiving this email because you signed a Sales Agent Agreement with BluWav Growth.<br/>
          BluWav Growth · bluwavgrowth.com
        </div>
      </div>
    </div>`;

    // ── SEND BOTH EMAILS VIA BREVO ──
    const sends = [
      // Admin notification to careers@
      brevoSend(BREVO_KEY, {
        sender: { name: 'BluWav SAA System', email: 'hello@bluwavgrowth.com' },
        to: [{ email: 'careers@bluwavgrowth.com', name: 'BluWav Careers' }],
        cc: [{ email: 'hello@bluwavgrowth.com', name: 'Andrea' }],
        replyTo: { email, name: fullName },
        subject: `🤝 New Sales Agent Signed: ${fullName} — ${tier}`,
        htmlContent: adminHtml
      }),
      // Agent confirmation
      brevoSend(BREVO_KEY, {
        sender: { name: 'BluWav Growth', email: 'hello@bluwavgrowth.com' },
        to: [{ email, name: fullName }],
        replyTo: { email: 'hello@bluwavgrowth.com', name: 'Andrea at BluWav Growth' },
        subject: `Welcome to BluWav Growth, ${fName}! Your Agreement is Confirmed ✅`,
        htmlContent: agentHtml
      })
    ];

    const results = await Promise.all(sends);
    const allOk = results.every(r => r.ok);

    if (allOk) {
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders() });
    }
    const errors = await Promise.all(results.map(r => r.text()));
    return new Response(JSON.stringify({ success: false, error: errors.join(' | ') }), {
      status: 500, headers: corsHeaders()
    });

  } catch(err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500, headers: corsHeaders()
    });
  }
}

function row(label, value) {
  return `<tr>
    <td style="padding:9px 14px;font-weight:700;color:#002B49;width:150px;border-bottom:1px solid #f1f5f9;font-size:13px;">${label}</td>
    <td style="padding:9px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#374151;">${value}</td>
  </tr>`;
}

function step(num, text) {
  return `<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9;">
    <div style="width:26px;height:26px;border-radius:50%;background:#FF5500;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${num}</div>
    <div style="font-size:14px;color:#374151;padding-top:4px;">${text}</div>
  </div>`;
}

async function brevoSend(key, payload) {
  return fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

function corsHeaders() {
  return { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}