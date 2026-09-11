// Run explicitly: node --env-file=.env scripts/check-openrouter.mjs
// Makes one live request using the same payload builder as the backend; no Docker needed.
import { requestCompletion, defaultModel, defaultFallbackModel } from '../server/openrouter.mjs';

const key = process.env.OPENROUTER_API_KEY?.trim();
const model = process.env.OPENROUTER_MODEL?.trim() || defaultModel;
if (!key || model !== defaultModel) {
  console.error('Set OPENROUTER_API_KEY and the requested Gemma free model in .env.');
  process.exit(1);
}
const started = Date.now();
try {
  const { response, fallbackUsed } = await requestCompletion({ key, model,
    fallbackModel: process.env.OPENROUTER_FALLBACK_MODEL?.trim() ?? defaultFallbackModel,
    messages: [{ role: 'user', content: 'Suteemon currently works at which company, and what is her role? Answer in one short sentence.' }],
    signal: AbortSignal.timeout(45000),
  });
  const data = await response.json().catch(() => ({}));
  const answer = data.choices?.[0]?.message?.content;
  const hasAnswer = typeof answer === 'string' && answer.trim().length > 0;
  const grounded = hasAnswer && /Bangkok Expressway and Metro/i.test(answer) && /full.stack developer/i.test(answer);
  const errorText = typeof data.error?.message === 'string' ? data.error.message : '';
  const failure = response.ok ? null : /day|daily/i.test(errorText) ? 'daily_quota' : /minute/i.test(errorText) ? 'minute_rate_limit' : response.status === 429 ? 'rate_limited' : 'provider_error';
  console.log(JSON.stringify({ status: response.status, requestedModel: model, fallbackUsed, returnedModel: typeof data.model === 'string' ? data.model : null, hasAnswer, matchesResume: Boolean(grounded), failure, elapsedMs: Date.now() - started }));
  if (!response.ok || !grounded) process.exitCode = 1;
} catch (error) {
  // Never print headers, key, request objects, or provider error bodies.
  console.error(JSON.stringify({ status: 'connection_failed', kind: error?.name || 'Error', elapsedMs: Date.now() - started }));
  process.exitCode = 1;
}
