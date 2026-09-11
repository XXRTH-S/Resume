import { systemPrompt } from './resume.mjs';

export const defaultModel = 'google/gemma-4-31b-it:free';
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
