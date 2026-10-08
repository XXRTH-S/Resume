import { resume } from './resume.mjs';
import { answerLanguage } from './answer-language.mjs';

// Presentation groups, not proficiency ratings. Filter through the resume so
// removing a skill from the factual source also removes it from these answers.
const groups = [
  ['ภาษาโปรแกรม', 'Programming languages', ['C', 'C#', 'Java', 'Python', 'JavaScript', 'TypeScript', 'PHP', 'Dart', 'SQL']],
  ['เว็บและมือถือ', 'Web and mobile', ['HTML', 'CSS', 'React', 'Vite', 'Flutter']],
  ['ระบบหลังบ้านและข้อมูล', 'Backend and data', ['Node.js', 'Express', 'Prisma', '.NET', 'Laravel', 'SQL Server', 'MySQL']],
  ['เครื่องมือพัฒนา', 'Development tools', ['Docker', 'Git', 'VS Code', 'Visual Studio', 'Android Studio', 'Unity', 'SSMS']],
];

export function skillSummary(messages) {
  const raw = messages.at(-1)?.content || '';
  const question = raw.trim().replace(/[?？!.。]+$/u, '').replace(/\s+/g, ' ');
  const thai = /^(?:(?:Suteemon|สุธีมน|คุณ|เธอ)\s*)?(?:(?:มี)?(?:ทักษะ|สกิล)(?:หลัก|ด้านเทคนิค)?(?:อะไรบ้าง|อะไร|มีอะไรบ้าง)|(?:ช่วย)?(?:สรุป|บอก|เล่า)(?:เกี่ยวกับ)?(?:ทักษะ|สกิล)(?:หลัก)?(?:ให้หน่อย)?)(?:คะ|ค่ะ|ครับ)?$/iu;
  const english = /^(?:(?:what are|list|summarize|describe|tell me about) (?:suteemon['’]?s|your|her|the) (?:main |technical |programming )?skills|what skills does (?:suteemon|she) have|skills|ทักษะ|สกิล)$/iu;
  if (!thai.test(question) && !english.test(question)) return null;
  const isThai = answerLanguage(messages) === 'th';
  const allowed = new Set([...resume.skills, ...resume.tools]);
  const rows = groups.map(([th, en, items]) => `- **${isThai ? th : en}:** ${items.filter(item => allowed.has(item)).join(', ')}`);
  const intro = isThai ? 'ทักษะและเครื่องมือที่ Suteemon ระบุไว้มีดังนี้ค่ะ' : 'Suteemon lists the following skills and tools:';
  const evidence = isThai
    ? '**ตัวอย่างการใช้งาน:** PM Management ใช้ React, TypeScript, Node.js และ SQL Server ส่วน Rag playground ใช้ Python, FastAPI, Next.js และ pgvector ค่ะ'
    : '**Project examples:** PM Management uses React, TypeScript, Node.js, and SQL Server. Rag playground uses Python, FastAPI, Next.js, and pgvector.';
  const limit = isThai ? 'ข้อมูลไม่ได้ระบุระดับความชำนาญหรือจำนวนปีที่ใช้แต่ละเทคโนโลยีค่ะ' : 'Proficiency levels and years of use for each technology are not specified.';
  return `${intro}\n\n${rows.join('\n')}\n\n${evidence}\n\n${limit}`;
}
