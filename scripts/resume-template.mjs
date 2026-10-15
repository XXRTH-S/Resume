export function renderResume({ language, c, resume, esc, link, regular, bold }) {
 const section = (title, body) => `<section><h2>${esc(title)}</h2>${body}</section>`;
 return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><title>${esc(c.name)} - Resume</title><style>
 @font-face{font-family:Prompt;src:url(data:font/ttf;base64,${regular});font-weight:400}
 @font-face{font-family:Prompt;src:url(data:font/ttf;base64,${bold});font-weight:600}
 @page{size:A4;margin:14mm 16mm}*{box-sizing:border-box}body{margin:0;color:#263440;font-family:Prompt,sans-serif;font-size:9pt;line-height:1.55;word-break:normal;overflow-wrap:normal;word-spacing:normal}
 .resume{min-height:267mm;display:flex;flex-direction:column;justify-content:space-between}header{padding-bottom:8pt;border-bottom:1.5px solid #25475c}h1{font-size:25pt;line-height:1.3;margin:0;font-weight:600;color:#172d3d}.role{font-size:11pt;margin:3pt 0 7pt;color:#415a6b}.contact{font-size:8pt;line-height:1.8}.contact>div{display:block}a{color:inherit;text-decoration:none}h2{font-size:10pt;font-weight:600;color:#25475c;margin:9pt 0 5pt;letter-spacing:${language==='th'?'0':'.6px'}}p{margin:0 0 3pt}article{break-inside:avoid;margin-bottom:6pt}.row{display:flex;justify-content:space-between;gap:12pt;font-weight:600}.row>span:first-child{min-width:0}.date{white-space:nowrap;flex-shrink:0;font-size:8.5pt;font-weight:400}.tech{font-size:7.7pt;color:#566772;margin:1pt 0 2pt}.job-role{font-size:8.5pt;margin:1pt 0 3pt}strong{font-weight:600}section{break-inside:avoid}
 </style></head><body><main class="resume"><header><h1>${esc(c.name)}</h1><p class="role">Full-Stack Developer</p><div class="contact"><div>${esc(c.location)} · ${esc(resume.contact.phone)} · ${link('mailto:'+resume.contact.email,resume.contact.email)}</div><div>${link('https://resume-psi-neon.vercel.app/','resume-psi-neon.vercel.app')} · ${link(resume.contact.github,'github.com/XXRTH-S')}</div></div></header>
 ${section(c.headings[0], `<p>${esc(c.summary)}</p>`)}
 ${section(c.headings[1], c.jobs.map(([name,date,body])=>`<article><div class="row"><span>${esc(name)}</span><span class="date">${esc(date)}</span></div><p class="job-role">Full-Stack Developer</p><p>${esc(body)}</p></article>`).join(''))}
 ${section(c.headings[2], c.skills.map(([label,body])=>`<p><strong>${esc(label)}:</strong> ${esc(body)}</p>`).join(''))}
 ${section(c.headings[3], c.projects.map(([name,date,tech,body,url])=>`<article><div class="row"><span>${url?link(url,name):esc(name)}</span><span class="date">${esc(date)}</span></div><p class="tech">${esc(tech)}</p><p>${esc(body)}</p></article>`).join(''))}
 ${section(c.headings[4], `<p>${esc(c.education)}</p><p>${esc(c.languages)}</p>`)}
 </main></body></html>`;
}
