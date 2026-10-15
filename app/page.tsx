'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './Language';
import { projectThai } from './projects-th';
import ResumeChat from './ResumeChat';
import ResumeDownload from './ResumeDownload';
import SystemExplorer from './SystemExplorer';
import BlockLighting from './BlockLighting';
import { projects } from './projects';
import { ArrowDown, ArrowUpRight, Check, Code2, Copy, Database, Github, Layers, Mail, MapPin, Menu, Moon, Smartphone, Sun, Terminal, Users, X } from 'lucide-react';


const softSkills = ['Self learning', 'Quick learner', 'Attention to detail', 'Team collaboration', 'Adaptability'];
const coreStack = ['TypeScript', 'JavaScript', 'Node.js', 'C#', '.NET', 'SQL', 'Flutter', 'HTML', 'CSS', 'Docker'];
const skills = [
  { title: 'Frontend & mobile', icon: Code2, items: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Dart + Flutter', 'Vite'] },
  { title: 'Backend & data', icon: Database, items: ['Node.js', 'Express', 'Prisma', 'SQL', 'SQL Server', 'MySQL', 'PHP', 'Laravel', '.NET', 'Python', 'C', 'C#', 'Java'] },
  { title: 'Soft skills', icon: Users, items: softSkills },
  { title: 'Tools & workflow', icon: Terminal, items: ['Docker', 'Git', 'VS Code', 'Visual Studio', 'Android Studio', 'Unity', 'SSMS', 'Canva', 'Microsoft Office', 'Antigravity', 'Windsurf'] },
];
export default function Home() {
  const { language, toggleLanguage, t } = useLanguage();
  const localizedProjects = projects.map(p => language === 'th' ? { ...p, ...projectThai[p.id] } : p);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = localizedProjects.find(p => p.id === selectedId) ?? null;
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id); }, { rootMargin: '-20% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  const [filter, setFilter] = useState('All');
  const [light, setLight] = useState(true);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { try { setLight(localStorage.getItem('portfolio-theme') !== 'dark'); } catch {} }, []);
  useEffect(() => { document.documentElement.dataset.theme = light ? 'light' : 'dark'; }, [light]);
  useEffect(() => { if (selected) { dialog.current?.showModal(); const original = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = original; }; } }, [selectedId]);
  function closeProject() { dialog.current?.close(); setSelectedId(null); }
  function toggleTheme() { setLight(!light); try { localStorage.setItem('portfolio-theme', !light ? 'light' : 'dark'); } catch {} }
  async function copyEmail() { try { await navigator.clipboard.writeText('Suteemon_Yodying@hotmail.com'); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { window.location.href = 'mailto:Suteemon_Yodying@hotmail.com'; } }
  return <>
    <ResumeChat/>
    <BlockLighting/>
    <a className="skip" href="#main">{t("Skip to content")}</a>
    <header className="header"><a href="#" className="logo" aria-label={t("Suteemon home")}>{t("SY")}<span>.</span></a>
      <nav aria-label={t("Main navigation")} className={menu ? 'nav open' : 'nav'}>{['Work', 'About', 'Skills', 'Contact'].map(item => <a key={item} href={'#' + item.toLowerCase()} aria-current={activeSection === item.toLowerCase() ? 'location' : undefined} onClick={() => setMenu(false)}>{t(item)}</a>)}</nav>
      <div className="header-actions"><button className="language-toggle" type="button" onClick={toggleLanguage} aria-label={language === "en" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}><span aria-hidden="true" className={language === "th" ? "active" : ""}>TH</span><span aria-hidden="true" className="language-divider">/</span><span aria-hidden="true" className={language === "en" ? "active" : ""}>EN</span></button><button className="icon-button" onClick={toggleTheme} aria-label={t(light ? 'Switch to dark theme' : 'Switch to light theme')}>{light ? <Moon size={19}/> : <Sun size={19}/>}</button><a className="github-link" href="https://github.com/XXRTH-S" target="_blank" rel="noreferrer"><Github size={18}/>{t("GitHub")}<ArrowUpRight size={15}/></a><button className="icon-button mobile-menu" aria-label={t("Toggle navigation")} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></div>
    </header>
    <main id="main">
      <section className="hero wrap">
        <div className="hero-copy"><div className="eyebrow"><span className="little-line"/>{t("FULL-STACK DEVELOPMENT / AI EXPLORATION")}</div><p className="intro">{t("Hello, I’m Suteemon.")}</p><h1>{t("Fullstack")}<br/><span>{t("developer")}</span></h1><p className="hero-description">{t("I develop new web and mobile applications from the ground up, from database design and APIs to user interfaces. I also enhance and maintain existing systems. Currently a Full-Stack Developer at Bangkok Expressway and Metro.")}</p><div className="hero-buttons"><ResumeDownload/><a className="button primary" href="#work">{t("Explore my work")}<ArrowDown size={18}/></a><a className="button secondary" href="#contact">{t("Get in touch")}<Mail size={18}/></a></div><div className="location"><MapPin size={15}/>{t("Bangkok, Thailand")}<span> / </span>{t("Web · Mobile · Full-stack")}</div></div>
        <SystemExplorer/>
      </section>
      <div className="stack-bar"><div className="wrap"><span>{t("MY CORE STACK")}</span>{coreStack.map(s => <strong key={s}>{s}</strong>)}</div></div>
      <section id="work" className="section wrap"><div className="section-heading"><div><div className="eyebrow">{t("01 / SELECTED WORK")}</div><h2>{t("Selected projects")}<span>.</span></h2></div><p>{t("Selected development work, with implementation details and technologies used.")}</p></div><div className="filters" aria-label={t("Filter projects")}>{['All', 'Web', 'Mobile', 'Game', 'AI'].map(f => <button key={f} aria-pressed={f === filter} onClick={() => setFilter(f)}>{t(f)}<span>{String(f === 'All' ? projects.length : projects.filter(p => p.category === f).length).padStart(2, '0')}</span></button>)}</div><div className="project-grid" aria-live="polite">{localizedProjects.filter(p => filter === 'All' || p.category === filter).map(p => <button className={'project-card project-' + p.id} key={p.id} onClick={() => setSelectedId(p.id)} aria-haspopup="dialog"><div className="project-top"><span>{p.category.toUpperCase()} / {p.year}</span><ArrowUpRight size={22}/></div><div className="project-visual"><p.icon size={38} strokeWidth={1.25}/><span>{p.id}</span></div><div className="project-content"><span className="project-type">{p.type}</span><h3>{p.name}</h3><p>{p.description}</p><div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div><div className="project-bottom">{t("Explore project")}<ArrowUpRight size={17}/></div></div></button>)}</div></section>
      <section id="about" className="section about-section"><div className="wrap about-grid"><div><div className="eyebrow">{t("02 / A LITTLE ABOUT ME")}</div><h2>{t("Professional background")}<span>.</span></h2><p className="about-copy">{t("I’m Suteemon Yodying, a full-stack developer with hands-on experience delivering complete web and mobile applications, from database design to user interface.")}</p><p className="muted">{t("I currently work as a Full-Stack Developer at Bangkok Expressway and Metro Public Company Limited, covering frontend, backend, databases, and system integration. My experience includes React and Node.js web platforms, SQL Server, and cross-platform mobile applications with Flutter. I focus on maintainable solutions and continuously expanding my technical knowledge.")}</p><div className="soft-skills">{softSkills.map(s => <span key={s}><Check size={15}/>{t(s)}</span>)}</div><div className="languages"><span>{t("Thai")}<b>{t("Native")}</b></span><span>{t("English")}<b>{t("Good")}</b></span></div></div><div className="journey"><h3>{t("Work experience")}</h3><article><span className="timeline-date">{t("Present")}</span><h4>{t("Bangkok Expressway and Metro Public Company Limited")}</h4><p>{t("Full-Stack Developer")}</p><ul className="muted"><li>{t("Develop and maintain web applications across frontend, backend, databases, and system integration.")}</li><li>{t("Enhance existing systems and codebases based on business requirements and user needs.")}</li><li>{t("Troubleshoot issues and continuously improve functionality, usability, and performance.")}</li></ul></article><article><span className="timeline-date">2025</span><h4>{t("KCE Electronics PCL")}</h4><p>{t("Full-Stack Developer")}</p><span className="muted">{t("End-to-end mobile development and improvements to an existing web application.")}</span></article><h3 className="timeline-group-heading">{t("Education")}</h3><article><span className="timeline-date">2020 — 2024</span><h4>{t("Silpakorn University")}</h4><p>{t("Computer Science")}</p><span className="muted">{t("Education")}</span></article><h3 className="timeline-group-heading">{t("Project timeline")}</h3><article><span className="timeline-date">2026</span><h4>{t("Buzzle")}</h4><p>{t("AI / Thai transcription & summaries")}</p><span className="muted">{t("Editable transcripts, timestamp-linked playback, seven summary formats, and Thai PDF export. Personal project in local Docker preview.")}</span></article><article><span className="timeline-date">2026</span><h4>{t("Rag playground")}</h4><p>{t("AI / Document question answering")}</p><span className="muted">{t("Document ingestion, selective OCR, hybrid retrieval, and source-cited answers. Python, FastAPI, Next.js, and pgvector.")}</span></article><article><span className="timeline-date">2026</span><h4>{t("PM Management Web Application")}</h4><p>{t("Full-stack project")}</p><span className="muted">{t("Role-based workflows, reporting, and Docker deployment for IT equipment maintenance.")}</span></article><article><span className="timeline-date">2023–2024</span><h4>{t("Turn-Based Strategy Game")}</h4><p>{t("Game development project")}</p><span className="muted">{t("Inventory, skill upgrades, and in-game economy systems.")}</span></article></div></div></section>
      <section id="skills" className="section wrap"><div className="section-heading"><div><div className="eyebrow">{t("03 / MY TOOLKIT")}</div><h2>{t("Technical skills & workflow")}<span>.</span></h2></div><p>{t("Technologies used across web, mobile, backend, and development workflows.")}</p></div><div className="skills-grid">{skills.map(s => <article className="skill-card" key={s.title}><s.icon size={25}/><h3>{t(s.title)}</h3><div className="tags">{s.items.map(i => <span key={i}>{t(i)}</span>)}</div></article>)}</div></section>
      <section id="contact" className="contact wrap"><div className="eyebrow">{t("04 / GET IN TOUCH")}</div><h2>{t("Get in touch")}<br/><span>{t("for work and collaboration.")}</span></h2><a className="contact-email" href="mailto:Suteemon_Yodying@hotmail.com">{t("Suteemon_Yodying@hotmail.com")}<ArrowUpRight/></a><div className="contact-actions"><ResumeDownload/><a className="button primary" href="mailto:Suteemon_Yodying@hotmail.com"><Mail size={18}/>{t("Say hello")}</a><button className="button secondary" onClick={copyEmail}>{copied ? <Check size={17}/> : <Copy size={17}/>}<span role="status">{t(copied ? 'Email copied' : 'Copy email')}</span></button><a className="phone" href="tel:+66841015526">+66 84 101 5526</a></div></section>
    </main><footer className="wrap"><span>© {new Date().getFullYear()}{t("Suteemon Yodying")}</span><span>{t("Built with Next.js & React")}</span><a href="#">{t("Back to top ↑")}</a></footer>
    <dialog ref={dialog} onCancel={closeProject} onClick={e => { if (e.target === e.currentTarget) closeProject(); }} aria-labelledby="project-title"><div className="dialog-body"><button className="icon-button close-dialog" onClick={closeProject} aria-label={t("Close project")}><X/></button>{selected && <><div className="eyebrow">{selected.category} / {selected.year}</div><h2 id="project-title">{selected.name}</h2><p className="dialog-subtitle">{selected.title}</p><p>{selected.description}</p><h3>{t("What I built")}</h3><ul>{selected.details.map(d => <li key={d}>{d}</li>)}</ul><div className="tags">{selected.tags.map(t => <span key={t}>{t}</span>)}</div><a className="button secondary" href={selected.repositoryUrl || "https://github.com/XXRTH-S"} target="_blank" rel="noreferrer"><Github size={18}/> {t(selected.repositoryUrl ? "View project on GitHub" : "Visit my GitHub profile")} <ArrowUpRight size={16}/></a></>}</div></dialog>
  </>;
}
