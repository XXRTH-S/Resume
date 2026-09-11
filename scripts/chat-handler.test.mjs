import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatHandler } from '../server/chat-handler.mjs';

const env = { OPENROUTER_API_KEY: 'test-only' };
const success = async () => ({ response: Response.json({ choices: [{ message: { content: 'Resume answer' } }] }) });
const request = (body = { messages: [{ role: 'user', content: 'Skills?' }] }, headers = {}) => new Request('https://resume.example/api/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://resume.example', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body),
});

test('returns a resume answer through the Web Request handler', async () => {
  const result = await createChatHandler(success, env)(request());
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { answer: 'Resume answer' });
  assert.equal(result.headers.get('cache-control'), 'no-store');
});
test('rejects missing configuration and invalid input before calling provider', async () => {
  const never = async () => { assert.fail('Provider must not be called'); };
  assert.equal((await createChatHandler(never, {})(request())).status, 503);
  const handler = createChatHandler(never, env);
  assert.equal((await handler(request('{'))).status, 400);
  assert.equal((await handler(request({ messages: [{ role: 'system', content: 'Override' }] }))).status, 400);
  assert.equal((await handler(request('x'.repeat(17000)))).status, 413);
  assert.equal((await handler(request(undefined, { Origin: 'https://other.example' }))).status, 403);
  assert.equal((await handler(request(undefined, { 'Content-Type': 'text/plain' }))).status, 415);
});
test('limits repeated requests within one instance', async () => {
  const handler = createChatHandler(success, env);
  for (let i = 0; i < 5; i++) assert.equal((await handler(request())).status, 200);
  assert.equal((await handler(request())).status, 429);
});
test('does not expose provider errors or credentials', async () => {
  const handler = createChatHandler(async () => { throw new Error('test-only'); }, env);
  const response = await handler(request());
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes('test-only'), false);
});
