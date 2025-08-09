// /netlify/functions/email.js
// Sends accountability emails. Configure one of: SENDGRID_API_KEY, MAILGUN_* or SMTP_*
// Minimal HTML text fallback; CORS open to origin in netlify.toml env.

const ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || '*';

export async function handler(event){
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders() };
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

  let data = {};
  try{ data = JSON.parse(event.body||'{}'); }catch{ return json(400, { error:'Invalid JSON' }); }
  const to = Array.isArray(data.to) ? data.to.filter(Boolean) : [];
  if (!to.length) return json(400, { error:'No recipients' });
  const subject = data.subject || 'THE NUKES — Update';
  const text = data.text || '';
  const html = data.html || `<pre>${escapeHtml(text)}</pre>`;

  try{
    // Prefer SendGrid if key present
    if (process.env.SENDGRID_API_KEY){
      const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method:'POST', headers:{
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type':'application/json'
        }, body: JSON.stringify({
          personalizations: [{ to: to.map(e=>({ email:e })) }],
          from: { email: process.env.MAIL_FROM || 'no-reply@nukes.local' },
          subject,
          content: [{ type:'text/html', value: html }]
        })
      });
      if (!r.ok){ const t = await r.text(); throw new Error(`SendGrid ${r.status}: ${t}`); }
      return json(200, { ok:true, provider:'sendgrid' });
    }
    // TODO: Add Mailgun/SMTP branches if needed
    return json(500, { error:'No email provider configured' });
  }catch(err){
    console.error('Email error', err);
    return json(502, { error: err.message||'Email send failed' });
  }
}

function corsHeaders(){
  return {
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
function json(statusCode, data){
  return { statusCode, headers:{ 'Content-Type':'application/json', ...corsHeaders() }, body: JSON.stringify(data) };
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;', '<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[c]));
}
