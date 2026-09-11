import http from 'node:http';
import { systemPrompt } from './resume.mjs';

const key = process.env.OPENROUTER_API_KEY?.trim();
const model = process.env.OPENROUTER_MODEL?.trim() || 'openrouter/free';
const freeModel = model === 'openrouter/free' || model.endsWith(':free');
const clients = new Map();
let minute = { start: Date.now(), count: 0 };
let day = { date: new Date().toISOString().slice(0, 10), count: 0 };
let active = 0;
const json = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(payload));
};
function reserve(ip) {
  const now = Date.now(), today = new Date().toISOString().slice(0, 10);
  for (const [address, bucket] of clients) if (now - bucket.start >= 60000) clients.delete(address);
  if (now - minute.start >= 60000) minute = { start: now, count: 0 };
  if (today !== day.date) day = { date: today, count: 0 };
  const bucket = clients.get(ip) || { start: now, count: 0 };
  if (bucket.count >= 5 || minute.count >= 15 || day.count >= 40 || active >= 3) return false;
  bucket.count++; minute.count++; day.count++; clients.set(ip, bucket);
  return true;
}
const server = http.createServer(async (req, res) => {
  if (req.url === '/health' && req.method === 'GET') return json(res, 200, { status: 'ok' });
  if (req.url !== '/api/chat') return json(res, 404, { error: 'Not found' });
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return json(res, 405, { error: 'Method not allowed' }); }
  if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) return json(res, 415, { error: 'JSON required' });
  // Nginx replaces these headers. This service must not be exposed directly.
  const origin = req.headers.origin;
  if (origin) {
    try { if (new URL(origin).host !== req.headers['x-forwarded-host']) return json(res, 403, { error: 'Origin not allowed' }); }
    catch { return json(res, 403, { error: 'Origin not allowed' }); }
  }
  if (!key || !freeModel) return json(res, 503, { error: 'แชทยังไม่พร้อม กรุณาติดต่อทางอีเมล / Chat is not configured. Please use email.' });
  let body;
  try {
    const chunks = []; let bytes = 0;
    for await (const chunk of req) { bytes += chunk.length; if (bytes > 16384) { json(res, 413, { error: 'ข้อความยาวเกินไป / Message too large' }); return; } chunks.push(chunk); }
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return json(res, 400, { error: 'Invalid request' }); }
  const messages = body?.messages;
  if (!Array.isArray(messages) || !messages.length || messages.length > 9 || messages.at(-1)?.role !== 'user' ||
      messages.some((m, i) => !m || m.role !== (i % 2 === 0 ? 'user' : 'assistant') || typeof m.content !== 'string' || !m.content.trim() || m.content.length > (m.role === 'user' ? 1000 : 5000)) ||
      messages.reduce((n, m) => n + m.content.length, 0) > 10000) return json(res, 400, { error: 'ข้อความยาวเกินไปหรือรูปแบบไม่ถูกต้อง / Invalid or oversized conversation' });
  if (!reserve(req.headers['x-real-ip'] || req.socket.remoteAddress)) {
    res.setHeader('Retry-After', '60');
    return json(res, 429, { error: 'พักสักครู่แล้วลองใหม่ หากโควตาวันนี้หมด กรุณาติดต่อทางอีเมล / Please try later or contact by email.' });
  }
  active++;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  res.on('close', () => { if (!res.writableEnded) controller.abort(); });
  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST', signal: controller.signal,
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'X-OpenRouter-Title': 'Suteemon Portfolio Cat' },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, ...messages.map(({ role, content }) => ({ role, content }))], stream: false, max_tokens: 650, temperature: 0.2 }),
    });
    if (!upstream.ok) return json(res, upstream.status === 429 ? 429 : 503, { error: 'โมเดลฟรีไม่พร้อมหรือโควตาหมด กรุณาลองภายหลัง / The free model is unavailable or its quota is exhausted. Please try later.' });
    const result = await upstream.json();
    const answer = result.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) return json(res, 503, { error: 'ยังไม่ได้รับคำตอบ กรุณาลองใหม่ / No answer received. Please try again.' });
    json(res, 200, { answer: answer.trim().slice(0, 5000) });
  } catch {
    if (!res.destroyed) json(res, 503, { error: 'การเชื่อมต่อขัดข้องหรือใช้เวลานานเกินไป กรุณาลองใหม่ / Connection failed or timed out. Please try again.' });
  } finally { clearTimeout(timer); active--; }
});
server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.listen(3001, '0.0.0.0', () => console.log('Resume chat service listening on port 3001'));
