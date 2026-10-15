// Run with Node.js and Playwright installed. Generates only public portfolio facts.
import { createRequire } from 'node:module';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resume } from '../server/resume.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const font = async name => (await readFile(new URL(`./resume-fonts/${name}.ttf`, import.meta.url))).toString('base64');
const regular = await font('Prompt-Regular'), bold = await font('Prompt-SemiBold');
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const link = (url, label) => `<a href="${esc(url)}">${esc(label)}</a>`;
const copy = {
  en: {
    name: resume.name, location: resume.location,
    summary: 'Full-stack developer building and improving web and mobile applications, from database design and APIs to user interfaces. Project work includes AI assistants, document retrieval, and Thai transcription and summarization.',
    headings: ['PROFILE', 'EXPERIENCE', 'TECHNICAL SKILLS', 'SELECTED PROJECTS', 'EDUCATION & LANGUAGES'],
    jobs: [
      ['Bangkok Expressway and Metro PCL', 'Present', 'Develop and maintain web applications across frontend, backend, databases, and system integrations. Improve existing systems based on business needs; troubleshoot functionality and performance issues.'],
      ['KCE Electronics PCL', '2025', 'Developed a mobile application and companion website, including database and UX/UI design, image uploads, search, sorting, and user-specific screens. Enhanced an existing web application with Excel export and additional data fields.'],
    ],
    skills: [
      ['Languages', 'TypeScript, JavaScript, Python, C#, SQL, Dart, PHP, Java, C'],
      ['Web & mobile', 'React, Next.js (project work), Node.js, Express, Flutter, .NET, Laravel, HTML/CSS'],
      ['Data & tools', 'SQL Server, MySQL, Prisma, Git, Docker; PostgreSQL, pgvector, FastAPI, Redis (project work)'],
    ],
    projects: [
      ['PM Management', '2026', 'React, TypeScript, Node.js, SQL Server', 'IT maintenance platform with role-based access, configurable checklists, activity logs, Excel reporting, and Docker Compose.', 'https://github.com/XXRTH-S/PM_Workshop_2026'],
      ['Rag playground', '2026', 'Python, FastAPI, Next.js, pgvector', 'Thai document Q&A with selective OCR, BGE-M3 embeddings, hybrid keyword/vector retrieval, and streamed answers with source citations.', 'https://github.com/XXRTH-S/Rag_Project_2026'],
      ['Buzzle', '2026', 'Next.js, FastAPI, PostgreSQL, RQ, Redis', 'Thai audio/video transcription, editable timestamped text, seven summary formats, and Thai PDF export using Groq and OpenRouter. Personal project in local Docker preview.', null],
      ['Bubble Resume Assistant', '2026', 'Next.js, React, OpenRouter', 'Bilingual portfolio assistant with grounded resume context, server-side model integration, and an animated mascot.', 'https://github.com/XXRTH-S/Resume'],
    ],
    education: 'Silpakorn University | Computer Science | 2020-2024', languages: 'Thai: Native | English: Good',
  },
  th: {
    name: resume.thaiName, location: 'กรุงเทพฯ ประเทศไทย',
    summary: 'นักพัฒนา Full-stack มีประสบการณ์สร้างและปรับปรุงเว็บกับแอปมือถือ ตั้งแต่ฐานข้อมูลและ API ไปจนถึงหน้าจอการใช้งาน พร้อมพัฒนาโปรเจกต์ด้านผู้ช่วย AI การค้นหาคำตอบจากเอกสาร และการถอดเสียงกับสรุปภาษาไทย',
    headings: ['เกี่ยวกับฉัน', 'ประสบการณ์ทำงาน', 'ทักษะและเทคโนโลยี', 'ผลงานที่เลือกมาแนะนำ', 'การศึกษาและภาษา'],
    jobs: [
      ['บริษัท ทางด่วนและรถไฟฟ้ากรุงเทพ จำกัด (มหาชน)', 'ปัจจุบัน', 'พัฒนาและดูแลเว็บ ทั้งหน้าบ้าน หลังบ้าน ฐานข้อมูล และการเชื่อมต่อระบบ ปรับปรุงระบบเดิมตามความต้องการของธุรกิจ พร้อมแก้ไขปัญหาการทำงานและประสิทธิภาพของระบบ'],
      ['บริษัท เคซีอี อีเลคโทรนิคส์ จำกัด (มหาชน)', '2025', 'พัฒนาแอปมือถือและเว็บไซต์ประกอบ ตั้งแต่ออกแบบฐานข้อมูลและ UX/UI ไปจนถึงอัปโหลดรูป ค้นหา เรียงข้อมูล และหน้าจอเฉพาะผู้ใช้ รวมทั้งเพิ่มการส่งออก Excel และข้อมูลเพิ่มเติมให้เว็บเดิม'],
    ],
    skills: [
      ['ภาษา', 'TypeScript, JavaScript, Python, C#, SQL, Dart, PHP, Java, C'],
      ['เว็บและมือถือ', 'React, Next.js (ใช้ในโปรเจกต์), Node.js, Express, Flutter, .NET, Laravel, HTML/CSS'],
      ['ข้อมูลและเครื่องมือ', 'SQL Server, MySQL, Prisma, Git, Docker; PostgreSQL, pgvector, FastAPI, Redis (ใช้ในโปรเจกต์)'],
    ],
    projects: [
      ['PM Management', '2026', 'React, TypeScript, Node.js, SQL Server', 'ระบบบำรุงรักษาอุปกรณ์ IT มีสิทธิ์ตามบทบาท รายการตรวจสอบที่ปรับได้ ประวัติกิจกรรม และรายงาน Excel ติดตั้งผ่าน Docker Compose', 'https://github.com/XXRTH-S/PM_Workshop_2026'],
      ['Rag playground', '2026', 'Python, FastAPI, Next.js, pgvector', 'ถามตอบจากเอกสารภาษาไทยด้วย OCR ตามความจำเป็นและ BGE-M3 ผสานการค้นหา keyword กับ vector พร้อมแสดงคำตอบต่อเนื่องและแหล่งอ้างอิง', 'https://github.com/XXRTH-S/Rag_Project_2026'],
      ['Buzzle', '2026', 'Next.js, FastAPI, PostgreSQL, RQ, Redis', 'ถอดเสียงภาษาไทยเป็นข้อความที่แก้ไขและฟังย้อนตามเวลาได้ สรุป 7 รูปแบบและส่งออก PDF ผ่าน Groq กับ OpenRouter เป็นโปรเจกต์ส่วนตัวที่ทดลองด้วย Docker ในเครื่อง', null],
      ['Bubble Resume Assistant', '2026', 'Next.js, React, OpenRouter', 'ผู้ช่วยตอบคำถามเรซูเม่สองภาษา ใช้ข้อมูลประสบการณ์และผลงาน เชื่อมต่อโมเดลฝั่งเซิร์ฟเวอร์ พร้อมมาสคอตเคลื่อนไหว', 'https://github.com/XXRTH-S/Resume'],
    ],
    education: 'มหาวิทยาลัยศิลปากร | วิทยาการคอมพิวเตอร์ | 2020-2024', languages: 'ภาษาไทย: ภาษาแม่ | ภาษาอังกฤษ: ระดับดี',
  },
};
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
try {
  await mkdir(`${root}public/downloads`, { recursive: true });
  await mkdir(`${root}output/pdf`, { recursive: true });
  for (const [language, c] of Object.entries(copy)) {
    const section = (i, body) => `<section><h2>${c.headings[i]}</h2>${body}</section>`;
    const html = `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><title>${esc(c.name)} - Resume</title><style>
      @font-face{font-family:Prompt;src:url(data:font/ttf;base64,${regular});font-weight:400}
      @font-face{font-family:Prompt;src:url(data:font/ttf;base64,${bold});font-weight:600}
      @page{size:A4;margin:14mm 16mm}*{box-sizing:border-box}body{margin:0;color:#192d3b;font-family:${language === 'th' ? 'Prompt' : 'Arial'},sans-serif;font-size:9.3pt;line-height:1.48}
      h1{font-size:25pt;line-height:1.25;margin:0;font-weight:600}header{border-bottom:2px solid #16776d;padding-bottom:9pt}.role{font-size:12pt;color:#16776d;margin:4pt 0 7pt}
      .contact{font-size:8.4pt;line-height:1.65}a{color:inherit;text-decoration:none}h2{font-size:10pt;color:#16776d;letter-spacing:${language === 'th' ? '0' : '.9px'};margin:11pt 0 5pt;font-weight:600}p{margin:0 0 4pt}article{break-inside:avoid;margin-bottom:7pt}.row{display:flex;justify-content:space-between;gap:12pt;font-weight:600}.date{white-space:nowrap;font-size:9pt;font-weight:400}.tech{font-size:8pt;color:#506473;margin:1pt 0 2pt}.job-role{font-size:9pt;margin:1pt 0 3pt}strong{font-weight:600}section{break-inside:avoid}footer{border-top:1px solid #d5dfe3;margin-top:10pt;padding-top:5pt;font-size:8pt;color:#506473}
    </style></head><body><header><h1>${esc(c.name)}</h1><p class="role">Full-Stack Developer</p><div class="contact">${esc(c.location)} | ${esc(resume.contact.phone)} | ${link('mailto:'+resume.contact.email,resume.contact.email)}<br>${link('https://resume-psi-neon.vercel.app/','resume-psi-neon.vercel.app')} | ${link(resume.contact.github,'github.com/XXRTH-S')}</div></header>
    ${section(0, `<p>${esc(c.summary)}</p>`)}
    ${section(1, c.jobs.map(([name,date,body])=>`<article><div class="row"><span>${esc(name)}</span><span class="date">${date}</span></div><p class="job-role">Full-Stack Developer</p><p>${esc(body)}</p></article>`).join(''))}
    ${section(2, c.skills.map(([label,body])=>`<p><strong>${esc(label)}:</strong> ${esc(body)}</p>`).join(''))}
    ${section(3, c.projects.map(([name,date,tech,body,url])=>`<article><div class="row"><span>${url?link(url,name):esc(name)}</span><span class="date">${date}</span></div><p class="tech">${esc(tech)}</p><p>${esc(body)}</p></article>`).join(''))}
    ${section(4, `<p>${esc(c.education)}</p><p>${esc(c.languages)}</p>`)}
    </body></html>`;
    const page = await browser.newPage();
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    const name = `Suteemon-Yodying-Resume-${language.toUpperCase()}.pdf`;
    const pdf = await page.pdf({ format: 'A4', printBackground: true, tagged: true });
    const { writeFile } = await import('node:fs/promises');
    await writeFile(`${root}public/downloads/${name}`, pdf);
    await writeFile(`${root}output/pdf/${name}`, pdf);
    console.log(`${name}: ${pdf.length} bytes`);
    await page.close();
  }
} finally { await browser.close(); }
