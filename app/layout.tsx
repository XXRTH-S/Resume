import type { Metadata } from 'next';
import './globals.css';
import { Prompt } from 'next/font/google';
const thaiFont = Prompt({ subsets: ['thai', 'latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-thai' });
import { LanguageProvider } from './Language';
export const metadata: Metadata = {
  title: 'Suteemon Yodying — Full-Stack Developer',
  description: 'Suteemon Yodying, a Bangkok-based Full-Stack Developer at Bangkok Expressway and Metro. Web and mobile development with React, TypeScript, Node.js, SQL Server, and Flutter.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="light"><body className={thaiFont.variable}><LanguageProvider>{children}</LanguageProvider></body></html>;
}
