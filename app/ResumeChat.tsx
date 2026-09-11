'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Pause, Play, Send, Trash2, X } from 'lucide-react';
import './chat.css';

type Message = { role: 'user' | 'assistant'; content: string };
const questions = ['ตอนนี้ทำงานอะไรอยู่?', 'มีประสบการณ์ C# และ .NET ไหม?', 'เล่าเกี่ยวกับโปรเจกต์ PM', 'What are your main skills?'];

export default function ResumeChat() {
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
  const mood = pending ? 'thinking' : talking ? 'speaking' : 'idle';
  return <aside className={`resume-chat ${motion ? '' : 'still'}`} aria-label="Bubble resume chatbot">
    {open && <section className="chat-panel" aria-labelledby="chat-heading" onKeyDown={event => { if (event.key === 'Escape') close(); }}>
      <div className="chat-header"><div><h2 id="chat-heading">Bubble <span>AI</span></h2><p>ถามเรื่องงาน ทักษะ และผลงาน · TH / EN</p></div><button className="icon-button" onClick={close} aria-label="Close chat"><X size={20}/></button></div>
      <div className="chat-tools"><button onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? <Pause size={14}/> : <Play size={14}/>} {motion ? 'หยุดขยับ / Pause' : 'ขยับ / Animate'}</button><button disabled={!!pending} onClick={() => { setMessages([]); setError(''); setDraft(''); setTalking(false); input.current?.focus(); }}><Trash2 size={14}/> ล้างแชท / Clear</button></div>
      <div className="chat-log" ref={log} role="log" aria-live="polite" aria-relevant="additions text">
        <div className="chat-bubble assistant">สวัสดีค่ะ 🐾 ฉันชื่อ Bubble เป็นผู้ช่วย AI ของ Suteemon ถามเกี่ยวกับประสบการณ์ ทักษะ หรือผลงานได้ทั้งภาษาไทยและอังกฤษค่ะ<br/><br/>Hi! I’m Bubble. Ask me about Suteemon’s resume in Thai or English.</div>
        {messages.map((message, index) => <div key={index} className={`chat-bubble ${message.role}`}><span className="sr-only">{message.role === 'user' ? 'You: ' : 'AI: '}</span>{message.content}</div>)}
        {pending && <><div className="chat-bubble user">{pending}</div><div className="chat-bubble assistant thinking-label">กำลังอ่านเรซูเม่… / Thinking…</div></>}
      </div>
      {!consent ? <div className="chat-consent"><p>เมื่อเริ่มแชท คำถามและประวัติสนทนาล่าสุดจะถูกส่งไปยัง OpenRouter และผู้ให้บริการโมเดลเพื่อสร้างคำตอบ ไม่ควรใส่ข้อมูลลับ<br/><br/>Starting chat sends your questions and recent conversation to OpenRouter and its model provider. Do not include secrets.</p><button className="button primary" onClick={() => setConsent(true)}>เริ่มแชท / Start chat</button></div> : <>
        {messages.length === 0 && !pending && <div className="chat-suggestions">{questions.map(question => <button key={question} onClick={() => send(question)}>{question}</button>)}</div>}
        {error && <p className="chat-error" role="alert">{error}</p>}
        <form className="chat-form" onSubmit={event => { event.preventDefault(); void send(); }}><label className="sr-only" htmlFor="resume-question">คำถามเกี่ยวกับเรซูเม่ / Resume question</label><textarea id="resume-question" ref={input} value={draft} maxLength={1000} disabled={!!pending} onChange={event => setDraft(event.target.value)} placeholder="ถามเกี่ยวกับเรซูเม่… / Ask about the resume…" rows={2} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(); } }}/><button type="submit" aria-label="Send question" disabled={!!pending || !draft.trim()}><Send size={19}/></button></form>
      </>}
      <p className="chat-note">AI อาจตอบผิดได้ โปรดตรวจเทียบเรซูเม่ · AI can make mistakes. <a href="mailto:Suteemon_Yodying@hotmail.com">Contact Suteemon</a></p>
    </section>}
    <button ref={launcher} className="cat-launcher" aria-expanded={open} aria-label={open ? 'Close Bubble chat' : 'Open Bubble chat'} onClick={() => open ? close() : setOpen(true)}><span className={`cat-sprite ${mood}`} aria-hidden="true"/><span className="cat-caption"><MessageCircle size={15}/>{open ? 'Bubble' : 'Ask Bubble'}</span></button>
  </aside>;
}
