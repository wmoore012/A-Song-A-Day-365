// Netlify Function: hidden-vibes
// Returns a private YouTube URL when a correct password is supplied.
// This avoids exposing the URL in client code or commits.

const ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || '*';

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS'){
    return { statusCode: 204, headers: corsHeaders() };
  }
  if (event.httpMethod !== 'POST'){
    return json(405, { error: 'Method Not Allowed' });
  }
  let body;
  try{ body = JSON.parse(event.body||'{}'); }catch{ return json(400, { error: 'Invalid JSON' }); }
  const pw = String(body.password||'');
  const expected = process.env.HIDDEN_VIBES_PASSWORD || '';
  if (!expected){ return json(500, { error: 'Not configured' }); }
  if (pw !== expected){ return json(401, { error: 'Unauthorized' }); }
  const url = process.env.HIDDEN_VIBES_URL || '';
  if (!url){ return json(500, { error: 'Missing URL' }); }
  return json(200, { url });
};

function corsHeaders(){
  return {
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}
function json(statusCode, body){
  return { statusCode, headers: { 'Content-Type':'application/json', ...corsHeaders() }, body: JSON.stringify(body) };
}
