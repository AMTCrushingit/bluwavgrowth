// Cloudflare Pages Function: /functions/send-application.js
// Proxies Brevo API calls server-side (avoids browser CORS)
// BREVO_API_KEY must be set in Cloudflare Pages > Settings > Environment Variables

export async function onRequestPost(context) {
  const BREVO_KEY = context.env.BREVO_API_KEY;
  if (!BREVO_KEY) {
    return new Response(JSON.stringify({ success: false, error: 'API key not configured' }), {
      status: 500, headers: corsHeaders()
    });
  }

  try {
    const body = await context.request.json();
    const { name, email, phone, location, experience, current_role,
            skills, why_bluwav, availability, linkedin, resume_note,
            role, casl_consent } = body;

    const adminHtml = `<h2 style="color:#002B49;font-family:sans-serif;">New Application — ${role}</h2>
      <p style="font-family:sans-serif;font-size:13px;color:#64748b;margin-bottom:16px;">
        CASL email consent: <strong>${casl_consent ? 'YES — applicant consented to email communications' : 'NO — applicant did not consent to email communications'}</strong>
      </p>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
        ${row('Role', role)}${row('Name', name)}
        ${row('Email', '<a href="mailto:'+email+'">'+email+'</a>')}
        ${row('Phone', phone)}${row('Location', location)}
        ${row('Experience', experience)}${row('Current Role', current_role)}
        ${row('Skills', skills)}${row('Why BluWav', why_bluwav)}
        ${row('Availability', availability)}${row('LinkedIn', linkedin)}
        ${row('Resume', resume_note)}
        ${row('CASL Consent', casl_consent ? 'Yes' : 'No')}
      </table>`;

    const confirmHtml = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="font-size:26px;font-weight:900;color:#002B49;margin-bottom:4px;">BluWav Growth</div>
      <div style="font-size:10px;font-weight:700;color:#00d4ff;letter-spacing:3px;text-transform:uppercase;margin-bottom:24px;">Get Found. Get Chosen. Grow.</div>
      <h2 style="color:#002B49;font-size:20px;margin-bottom:14px;">Application Received</h2>
      <p style="color:#374151;font-size:15px;line-height:1.75;margin-bottom:12px;">Hi ${name.split(' ')[0]},</p>
      <p style="color:#374151;font-size:15px;line-height:1.75;margin-bottom:12px;">Thank you for applying for the <strong>${role}</strong> position at BluWav Growth. Your application has been received and our team will review it carefully.</p>
      <p style="color:#374151;font-size:15px;line-height:1.75;margin-bottom:12px;">Should your experience align with what we are looking for, we will reach out directly to discuss next steps. We aim to review all applications within 5-7 business days.</p>
      <div style="background:#F4F2ED;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#FF5500;margin-bottom:8px;">Your Application Summary</div>
        <div style="font-size:13px;color:#374151;line-height:1.8;">
          <strong>Role:</strong> ${role}<br/>
          <strong>Name:</strong> ${name}<br/>
          <strong>Location:</strong> ${location}<br/>
          <strong>Availability:</strong> ${availability}
        </div>
      </div>
      <p style="color:#64748b;font-size:12px;line-height:1.7;border-top:1px solid #e2e8f0;padding-top:16px;">
        You are receiving this email because you applied for a position at BluWav Growth Inc. and consented to email communications during your application. To withdraw consent or request removal of your data, email <a href="mailto:careers@bluwavgrowth.com" style="color:#FF5500;">careers@bluwavgrowth.com</a>.
      </p>
      <p style="color:#94a3b8;font-size:12px;margin-top:8px;">BluWav Growth Inc. · bluwavgrowth.com</p>
    </div>`;

    const { resume_base64, resume_mime, resume_name } = body;

    // Always send admin notification
    const adminPayload = {
      sender: { name: 'BluWav Careers Form', email: 'hello@bluwavgrowth.com' },
      to: [{ email: 'careers@bluwavgrowth.com', name: 'BluWav Careers' }],
      replyTo: { email, name },
      subject: role + ' Application — ' + name,
      htmlContent: adminHtml
    };
    if (resume_base64 && resume_name && resume_name !== 'Not attached') {
      adminPayload.attachment = [{ content: resume_base64, name: resume_name, type: resume_mime || 'application/octet-stream' }];
    }
    const sends = [ brevoSend(BREVO_KEY, adminPayload) ];

    // Only send confirmation if CASL consent given
    if (casl_consent) {
      sends.push(brevoSend(BREVO_KEY, {
        sender: { name: 'BluWav Growth', email: 'hello@bluwavgrowth.com' },
        to: [{ email, name }],
        replyTo: { email: 'careers@bluwavgrowth.com', name: 'BluWav Careers' },
        subject: 'Application Received — ' + role,
        htmlContent: confirmHtml
      }));
    }

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
  return `<tr><td style="padding:8px 12px;font-weight:700;color:#002B49;width:140px;border-bottom:1px solid #f1f5f9;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">${value}</td></tr>`;
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
