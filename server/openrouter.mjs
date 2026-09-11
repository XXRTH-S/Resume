import { systemPrompt } from './resume.mjs';

export const defaultModel = 'google/gemma-4-31b-it:free';
export const defaultFallbackModel = 'openrouter/free';
export const isFreeModel = model => typeof model === 'string' && (model === 'openrouter/free' || model.endsWith(':free'));
export function completionBody(messages, model = defaultModel) {
  return {
    model,
    messages: [{ role: 'system', content: systemPrompt }, ...messages.map(({ role, content }) => ({ role, content }))],
    stream: false,
    max_tokens: 650,
    temperature: 0.2,
    reasoning: { enabled: false },
  };
}

// Only fail over for provider-side throttling/outages, never authentication,
// privacy settings, billing, or account-wide quota failures.
export function canFallback(status, error) {
  if ([502, 503, 504].includes(status)) return true;
  return status === 429 && Boolean(error?.metadata?.provider_name) &&
    /temporarily rate.limited upstream/i.test(String(error?.metadata?.raw || ''));
}

export async function requestCompletion({ key, messages, model = defaultModel, fallbackModel = defaultFallbackModel, signal, fetcher = fetch }) {
  if (!key || !isFreeModel(model) || (fallbackModel && !isFreeModel(fallbackModel))) throw new Error('Invalid free-model configuration');
  const send = selected => fetcher('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST', signal,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'X-OpenRouter-Title': 'Bubble Resume Assistant' },
    body: JSON.stringify(completionBody(messages, selected)),
  });
  const primary = await send(model);
  if (!primary.ok && fallbackModel && fallbackModel !== model) {
    const detail = await primary.clone().json().catch(() => null);
    if (canFallback(primary.status, detail?.error)) return { response: await send(fallbackModel), fallbackUsed: true };
  }
  return { response: primary, fallbackUsed: false };
}
