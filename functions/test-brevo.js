// Test endpoint: /functions/test-brevo.js
// Visit: https://bluwavgrowth.com/functions/test-brevo to check Brevo connection

export async function onRequestGet(context) {
  const BREVO_KEY = context.env.BREVO_API_KEY;
  
  if (!BREVO_KEY) {
    return new Response(JSON.stringify({ 
      error: 'BREVO_API_KEY not found in environment',
      env_keys: Object.keys(context.env || {})
    }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Send a real test email
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'BluWav Test', email: 'hello@bluwavgrowth.com' },
      to: [{ email: 'hello@bluwavgrowth.com', name: 'Andrea' }],
      subject: 'BluWav Brevo Test - ' + new Date().toISOString(),
      htmlContent: '<p>This is a test email from the BluWav Cloudflare Function. If you receive this, Brevo is working correctly.</p>'
    })
  });

  const body = await res.text();
  
  return new Response(JSON.stringify({
    brevo_status: res.status,
    brevo_ok: res.ok,
    brevo_response: body,
    api_key_length: BREVO_KEY.length,
    api_key_prefix: BREVO_KEY.substring(0, 8) + '...'
  }), { headers: { 'Content-Type': 'application/json' } });
}
