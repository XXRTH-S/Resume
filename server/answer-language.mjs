export function answerLanguage(messages) {
  const latest = messages.filter(message => message.role === 'user').at(-1)?.content || '';
  const requests = [...latest.matchAll(/(?:answer|reply|respond|write|explain|translate)(?:\s+\w+){0,3}\s+(?:in|into)\s+(English|Thai)|(?:ตอบ|อธิบาย|แปล)(?:เป็น)?(?:ภาษา)?\s*(อังกฤษ|ไทย)/gi)];
  const requested = requests.at(-1);
  if (requested) return /english|อังกฤษ/i.test(requested[1] || requested[2]) ? 'en' : 'th';
  // Thai questions commonly include English technology and project names.
  return /[\u0e00-\u0e7f]/u.test(latest) ? 'th' : 'en';
}

export function languageInstruction(messages) {
  return answerLanguage(messages) === 'en'
    ? 'RESPONSE LANGUAGE FOR THIS TURN: English. Write the entire answer in English. Do not use Thai sentences or Thai polite endings. Earlier Thai conversation and Thai examples in the facts must not change this. Preserve proper names and source URLs.'
    : 'RESPONSE LANGUAGE FOR THIS TURN: Thai. Write natural Thai, retaining proper names and technology names in English when appropriate. Earlier English conversation must not change this.';
}
