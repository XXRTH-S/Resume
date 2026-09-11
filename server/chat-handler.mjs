import { requestCompletion, defaultModel, defaultFallbackModel, isFreeModel } from './openrouter.mjs';

export function createChatHandler(complete = requestCompletion, env = process.env) {
  const key = env.OPENROUTER_API_KEY?.trim();
  const model = env.OPENROUTER_MODEL?.trim() || defaultModel;
  const fallbackModel = env.OPENROUTER_FALLBACK_MODEL?.trim() ?? defaultFallbackModel;
  const freeModel = isFreeModel(model) && (!fallbackModel || isFreeModel(fallbackModel));
  const clients = new Map();
  let minute = { start: Date.now(), count: 0 };
  let day = { date: new Date().toISOString().slice(0, 10), count: 0 };
  let active = 0;
  const json = (status, payload, headers = {}) => Response.json(payload, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
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
  return async function handleChat(req) {
    if (req.method !== 'POST') return json(405, { error: 'Method not allowed' }, { Allow: 'POST' });
    if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json(415, { error: 'JSON required' });
    // Compare against the actual request URL; do not trust a client-supplied forwarded host.
    const origin = req.headers.get('origin');
    if (origin) {
      try { if (new URL(origin).host !== new URL(req.url).host) return json(403, { error: 'Origin not allowed' }); }
      catch { return json(403, { error: 'Origin not allowed' }); }
    }
    if (!key || !freeModel) return json(503, { error: 'แชทยังไม่พร้อม กรุณาติดต่อทางอีเมล / Chat is not configured. Please use email.' });
    let body;
    try {
      const chunks = []; let bytes = 0;
      for await (const chunk of req.body || []) { bytes += chunk.length; if (bytes > 16384) { return json(413, { error: 'ข้อความยาวเกินไป / Message too large' }); } chunks.push(chunk); }
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch { return json(400, { error: 'Invalid request' }); }
    const messages = body?.messages;
    if (!Array.isArray(messages) || !messages.length || messages.length > 9 || messages.at(-1)?.role !== 'user' ||
        messages.some((m, i) => !m || m.role !== (i % 2 === 0 ? 'user' : 'assistant') || typeof m.content !== 'string' || !m.content.trim() || m.content.length > (m.role === 'user' ? 1000 : 5000)) ||
        messages.reduce((n, m) => n + m.content.length, 0) > 10000) return json(400, { error: 'ข้อความยาวเกินไปหรือรูปแบบไม่ถูกต้อง / Invalid or oversized conversation' });
    if (!reserve(env.VERCEL === '1' ? (req.headers.get('x-vercel-forwarded-for') || 'unknown') : 'local')) {
      return json(429, { error: 'พักสักครู่แล้วลองใหม่ หากโควตาวันนี้หมด กรุณาติดต่อทางอีเมล / Please try later or contact by email.' });
    }
    active++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    const abort = () => controller.abort();
    req.signal.addEventListener('abort', abort, { once: true });
    if (req.signal.aborted) abort();
    try {
      const { response: upstream } = await complete({ key, messages, model, fallbackModel, signal: controller.signal });
      if (!upstream.ok) return json(upstream.status === 429 ? 429 : 503, { error: 'โมเดลฟรีไม่พร้อมหรือโควตาหมด กรุณาลองภายหลัง / The free model is unavailable or its quota is exhausted. Please try later.' });
      const result = await upstream.json();
      const answer = result.choices?.[0]?.message?.content;
      if (typeof answer !== 'string' || !answer.trim()) return json(503, { error: 'ยังไม่ได้รับคำตอบ กรุณาลองใหม่ / No answer received. Please try again.' });
      return json(200, { answer: answer.trim().slice(0, 5000) });
    } catch {
      return json(503, { error: 'การเชื่อมต่อขัดข้องหรือใช้เวลานานเกินไป กรุณาลองใหม่ / Connection failed or timed out. Please try again.' });
    } finally { clearTimeout(timer); req.signal.removeEventListener('abort', abort); active--; }
  };
}
