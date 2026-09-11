import test from 'node:test';
import assert from 'node:assert/strict';
import { requestCompletion, defaultModel } from '../server/openrouter.mjs';

const messages = [{ role: 'user', content: 'What is her role?' }];
const options = { key: 'test-placeholder', messages };
test('provider throttling falls back once to the free router', async () => {
  const models = [];
  const result = await requestCompletion({ ...options, fetcher: async (_, request) => {
    models.push(JSON.parse(request.body).model);
    return models.length === 1 ? Response.json({ error: { metadata: { provider_name: 'Google AI Studio', raw: 'Model is temporarily rate-limited upstream.' } } }, { status: 429 }) : Response.json({ choices: [{ message: { content: 'A developer.' } }] });
  } });
  assert.deepEqual(models, [defaultModel, 'openrouter/free']);
  assert.equal(result.fallbackUsed, true);
  assert.equal(result.response.status, 200);
});
for (const status of [401, 402, 403, 429]) test(`does not bypass account-level ${status}`, async () => {
  let calls = 0;
  const result = await requestCompletion({ ...options, fetcher: async () => { calls++; return Response.json({ error: { message: 'Account restriction' } }, { status }); } });
  assert.equal(calls, 1); assert.equal(result.fallbackUsed, false);
});
test('paid fallback is rejected before any network call', async () => {
  await assert.rejects(requestCompletion({ ...options, fallbackModel: 'paid/model', fetcher: () => { throw new Error('Network must not run'); } }), /Invalid free-model/);
});
test('an empty fallback setting keeps Gemma only', async () => {
  let calls = 0;
  const result = await requestCompletion({ ...options, fallbackModel: '', fetcher: async () => { calls++; return Response.json({}, { status: 503 }); } });
  assert.equal(calls, 1); assert.equal(result.fallbackUsed, false);
});
