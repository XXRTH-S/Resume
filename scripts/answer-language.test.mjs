import test from 'node:test';
import assert from 'node:assert/strict';
import { answerLanguage } from '../server/answer-language.mjs';
import { completionBody } from '../server/openrouter.mjs';

const history = [{ role: 'user', content: 'ตอนนี้ทำงานอะไรอยู่?' }, { role: 'assistant', content: 'เป็นนักพัฒนาค่ะ' }];
test('English latest question overrides Thai history', () => {
  const messages = [...history, { role: 'user', content: 'What are your main skills?' }];
  assert.equal(answerLanguage(messages), 'en');
  assert.match(completionBody(messages).messages[0].content, /RESPONSE LANGUAGE FOR THIS TURN: English/);
});
test('Thai question containing English technologies stays Thai', () => {
  assert.equal(answerLanguage([{ role: 'user', content: 'Rag playground ใช้ FastAPI หรือเปล่า?' }]), 'th');
});
test('explicit language requests override detected script', () => {
  for (const content of ['ช่วยเล่าเกี่ยวกับงาน Please answer in English', 'ตอบเป็นภาษาอังกฤษ']) assert.equal(answerLanguage([{ role: 'user', content }]), 'en');
  assert.equal(answerLanguage([{ role: 'user', content: 'Explain the RAG project in Thai' }]), 'th');
});
test('short English follow-up does not inherit Thai', () => {
  assert.equal(answerLanguage([...history, { role: 'user', content: 'And education?' }]), 'en');
});
