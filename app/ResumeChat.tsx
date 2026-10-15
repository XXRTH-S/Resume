'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Pause, Play, Send, Trash2, X } from 'lucide-react';
import { useLanguage } from './Language';
import ChatMarkdown from './ChatMarkdown';
import './chat.css';

type Message = { role: 'user' | 'assistant'; content: string };


export default function ResumeChat() {
  const { language } = useLanguage();
  const text = (en: string, th: string) => language === 'th' ? th : en;
  const questions = language === 'th' ? ['ตอนนี้ทำงานอะไรอยู่?', 'มีประสบการณ์ C# และ .NET ไหม?', 'เล่าเกี่ยวกับโปรเจกต์ PM', 'มีทักษะอะไรบ้าง?'] : ['What is your current role?', 'Do you have C# and .NET experience?', 'Tell me about PM Management', 'What are your main skills?'];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState('');
  const [error, setError] = useState('');
  const [motion, setMotion] = useState(true);
  const [talking, setTalking] = useState(false);
  const [consent, setConsent] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotion(!media.matches);
    update(); media.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); controller.current?.abort(); };
  }, []);
  useEffect(() => { if (open) input.current?.focus(); }, [open, consent]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, pending, error, open]);
  useEffect(() => { if (!talking) return; const timer = setTimeout(() => setTalking(false), 2500); return () => clearTimeout(timer); }, [talking]);
  function close() { setOpen(false); launcher.current?.focus(); }
  async function send(question = draft) {
    const content = question.trim();
    if (!content || content.length > 1000 || controller.current || !consent) return;
    const request = new AbortController(); controller.current = request;
    setError(''); setPending(content); setDraft(''); setTalking(false);
    // Retain complete user/assistant pairs; limit context without persisting chat in storage.
    let history = messages.slice(-8);
    const requestBytes = () => new TextEncoder().encode(JSON.stringify({ messages: [...history, { role: 'user', content }] })).length;
    while (history.length && (history.reduce((n, m) => n + m.content.length, content.length) > 9000 || requestBytes() > 15000)) history = history.slice(2);
    const timer = setTimeout(() => request.abort(), 50000);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...history, { role: 'user', content }] }), signal: request.signal });
      const data = await response.json().catch(() => null);
      if (!response.ok || typeof data?.answer !== 'string') throw new Error(data?.error || 'แชทไม่พร้อมใช้งาน กรุณาลองใหม่ / Chat unavailable. Please try again.');
      setMessages(previous => [...previous, { role: 'user', content }, { role: 'assistant', content: data.answer }].slice(-40) as Message[]);
      setTalking(true);
    } catch (reason) {
      setDraft(content);
      setError(request.signal.aborted ? 'หมดเวลารอ กรุณาลองใหม่ / Request timed out. Please try again.' : reason instanceof Error ? reason.message : 'เกิดข้อผิดพลาด / Something went wrong.');
    } finally { clearTimeout(timer); controller.current = null; setPending(''); }
  }
  const mood = pending || talking ? 'typing' : 'idle';
  return <aside className={`resume-chat ${motion ? '' : 'still'}`} aria-label={text('Bubble resume chatbot', 'แชทบอทเรซูเม่ Bubble')}>
    {open && <section className="chat-panel" aria-labelledby="chat-heading" onKeyDown={event => { if (event.key === 'Escape') close(); }}>
      <div className="chat-header"><div><h2 id="chat-heading">Bubble <span>AI</span></h2><p>{text("Ask about experience, skills, and projects", "ถามเรื่องงาน ทักษะ และผลงาน")}</p></div><button className="icon-button" onClick={close} aria-label={text('Close chat', 'ปิดแชท')}><X size={20}/></button></div>
      <div className="chat-tools"><button onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? <Pause size={14}/> : <Play size={14}/>} {motion ? text('Pause', 'หยุดขยับ') : text('Animate', 'ขยับ')}</button><button disabled={!!pending} onClick={() => { setMessages([]); setError(''); setDraft(''); setTalking(false); input.current?.focus(); }}><Trash2 size={14}/> {text("Clear chat", "ล้างแชท")}</button></div>
      <div className="chat-log" ref={log} role="log" aria-live="polite" aria-relevant="additions text">
        <div className="chat-bubble assistant">{text('Hi! I’m Bubble, Suteemon’s AI assistant. Ask about experience, skills, or projects in Thai or English.', 'สวัสดีค่ะ ฉัน Bubble ผู้ช่วย AI ของสุธีมนต์ ยศยิ่ง ถามเรื่องประสบการณ์ ทักษะ หรือผลงานได้ทั้งไทยและอังกฤษค่ะ')}</div>
        {messages.map((message, index) => <div key={index} className={`chat-bubble ${message.role}`}><span className="sr-only">{message.role === 'user' ? 'You: ' : 'AI: '}</span>{message.role === 'assistant' ? <ChatMarkdown>{message.content}</ChatMarkdown> : message.content}</div>)}
        {pending && <><div className="chat-bubble user">{pending}</div><div className="chat-bubble assistant thinking-label">{text("Bubble is typing…", "Bubble กำลังพิมพ์คำตอบ…")}</div></>}
      </div>
      {!consent ? <div className="chat-consent"><p>{text('Starting chat sends your questions and recent conversation to OpenRouter and its model provider. Do not include secrets.', 'เมื่อเริ่มแชท คำถามและประวัติสนทนาล่าสุดจะถูกส่งไปยัง OpenRouter และผู้ให้บริการโมเดลเพื่อสร้างคำตอบ ไม่ควรใส่ข้อมูลลับ')}</p><button className="button primary" onClick={() => setConsent(true)}>{text("Start chat", "เริ่มแชท")}</button></div> : <>
        {messages.length === 0 && !pending && <div className="chat-suggestions">{questions.map(question => <button key={question} onClick={() => send(question)}>{question}</button>)}</div>}
        {error && <p className="chat-error" role="alert">{error}</p>}
        <form className="chat-form" onSubmit={event => { event.preventDefault(); void send(); }}><label className="sr-only" htmlFor="resume-question">{text("Resume question", "คำถามเกี่ยวกับเรซูเม่")}</label><textarea id="resume-question" ref={input} value={draft} maxLength={1000} disabled={!!pending} onChange={event => setDraft(event.target.value)} placeholder={text('Ask about the resume…', 'ถามเกี่ยวกับเรซูเม่…')} rows={2} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(); } }}/><button type="submit" aria-label={text('Send question', 'ส่งคำถาม')} disabled={!!pending || !draft.trim()}><Send size={19}/></button></form>
      </>}
      <p className="chat-note">{text("AI can make mistakes. Please check the resume.", "AI อาจตอบผิดได้ โปรดตรวจเทียบเรซูเม่")} <a href="mailto:Suteemon_Yodying@hotmail.com">{text("Contact Suteemon", "ติดต่อสุธีมนต์")}</a></p>
    </section>}
    <button ref={launcher} className="cat-launcher" aria-expanded={open} aria-label={open ? text('Close Bubble chat', 'ปิดแชท Bubble') : text('Open Bubble chat', 'เปิดแชท Bubble')} onClick={() => open ? close() : setOpen(true)}><span className={`cat-sprite ${mood}`} aria-hidden="true"/><span className="cat-caption"><MessageCircle size={15}/>{open ? 'Bubble' : text('Ask Bubble', 'ถาม Bubble')}</span></button>
  </aside>;
}
