'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMarkdown({ children }: { children: string }) {
  return <div className="chat-markdown"><ReactMarkdown
    remarkPlugins={[remarkGfm]}
    skipHtml
    disallowedElements={['img']}
    components={{
      a: ({ href, children }) => href && /^(https?:\/\/|mailto:)/i.test(href)
        ? <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
        : <span>{children}</span>,
      table: ({ children }) => <div className="chat-table-scroll" role="region" aria-label="Answer table" tabIndex={0}><table>{children}</table></div>,
    }}
  >{children}</ReactMarkdown></div>;
}
