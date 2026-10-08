import { resume } from './resume.mjs';

// Deliberately match complete, standalone questions only. Compound questions
// and follow-ups stay with the model rather than silently dropping their intent.
export function verifiedAnswer(messages) {
  const question = messages.at(-1)?.content?.trim().replace(/[?？!。]+$/u, '').trim();
  if (!question) return null;
  const current = resume.employment[0];
  if (/^(ตอนนี้ทำงานอะไรอยู่|ตอนนี้ทำงานอะไร ที่บริษัทไหน|ปัจจุบันทำงานที่ไหน|ตอนนี้ทำงานที่ไหน)(คะ|ครับ|ค่ะ)?$/u.test(question)) {
    return `ปัจจุบัน Suteemon เป็น ${current.role} ที่ ${current.company} ค่ะ รับผิดชอบพัฒนาและดูแลเว็บแอปพลิเคชัน รวมถึง frontend, backend, ฐานข้อมูล และการเชื่อมต่อระบบ ตลอดจนปรับปรุงระบบเดิมตามความต้องการของธุรกิจและผู้ใช้ค่ะ\n\nที่มา: เรซูเม่ที่ให้ไว้`;
  }
  if (/^(what is (suteemon'?s?|her) current (job|role)|where does suteemon (currently )?work)$/i.test(question)) {
    return `Suteemon is a ${current.role} at ${current.company}. Her work covers web application development and maintenance, databases, system integration, and improvements to existing systems.\n\nSource: supplied resume`;
  }
  if (/^มีประสบการณ์ C# (และ|กับ) \.NET (ไหม|หรือไม่)(คะ|ครับ|ค่ะ)?$/iu.test(question)) {
    return 'C# และ .NET อยู่ในรายการทักษะของ Suteemon ค่ะ แต่ข้อมูลที่ให้ไว้ยังไม่ได้ระบุโปรเจกต์ บริษัท หรือจำนวนปีที่ใช้เทคโนโลยีสองรายการนี้ จึงยังยืนยันรายละเอียดเหล่านั้นไม่ได้ค่ะ\n\nที่มา: เรซูเม่ที่ให้ไว้';
  }
  if (/^Bubble (กับ|และ) Rag playground ต่างกัน(อย่างไร|ยังไง)( ใช้ OCR ทั้งคู่ไหม)?$/iu.test(question)) {
    return 'Bubble เป็นผู้ช่วยตอบคำถามเกี่ยวกับเรซูเม่ โดยใช้ข้อมูลที่เตรียมไว้ส่งให้โมเดลผ่าน OpenRouter และไม่มีขั้นตอน OCR ค่ะ\n\nRag playground เป็นระบบถามตอบจากเอกสาร รองรับ OCR เฉพาะหน้าที่จำเป็น แล้วค้นหาด้วย vector และ keyword search ก่อนสร้างคำตอบพร้อมแหล่งอ้างอิง ใช้ FastAPI, Next.js และ PostgreSQL กับ pgvector ค่ะ\n\nที่มา:\nhttps://github.com/XXRTH-S/Resume\nhttps://github.com/XXRTH-S/Rag_Project_2026';
  }
  return null;
}
