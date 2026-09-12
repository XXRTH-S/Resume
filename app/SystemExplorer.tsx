'use client';

import { useState } from 'react';
import { ArrowUpRight, Code2, Database, Layers, Sparkles } from 'lucide-react';

const layers = [
  { title: 'Interface', label: '01 / EXPERIENCE', icon: Code2, tools: 'React · TypeScript · Flutter', description: 'Clear interfaces for the web and mobile. Thoughtful interactions, accessible controls, and responsive layouts.', snippet: 'interface → interaction → experience' },
  { title: 'Services', label: '02 / APPLICATION', icon: Layers, tools: 'Node.js · C# · .NET', description: 'Application logic that connects the pieces: authentication, role-based workflows, integrations, and maintainable APIs.', snippet: 'request → validate → respond' },
  { title: 'Data', label: '03 / FOUNDATION', icon: Database, tools: 'SQL Server · Prisma · Docker', description: 'Structured data and dependable workflows. Database design, reporting, and containerized application delivery.', snippet: 'model → query → insight' },
  { title: 'AI', label: '04 / THIS PORTFOLIO', icon: Sparkles, tools: 'Bubble · OpenRouter · Next.js', description: 'Meet Bubble, this portfolio’s resume assistant. A server-side API connects questions to a language model using public resume context.', snippet: 'question → resume context → answer' },
];

export default function SystemExplorer() {
  const [active, setActive] = useState(0);
  const layer = layers[active];
  return <div className="system-explorer">
    <div className="system-top"><span><i/> SYSTEM EXPLORER</span><span>INTERACTIVE / 01</span></div>
    <div className="system-map" role="group" aria-label="Explore application layers">
      {layers.map((item, index) => <button key={item.title} aria-pressed={active === index} onClick={() => setActive(index)}><item.icon size={22}/><span>{item.title}</span><small>0{index + 1}</small></button>)}
    </div>
    <div className="system-detail" aria-live="polite"><div className="eyebrow">{layer.label}</div><h3>{layer.tools}</h3><p>{layer.description}</p><div className="system-snippet"><span>›</span> {layer.snippet}</div></div>
    <div className="system-bottom"><span>Select a layer to explore</span><ArrowUpRight size={16}/></div>
  </div>;
}
