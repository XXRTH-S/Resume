import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Suteemon Yodying — Full-Stack Developer',
  description: 'Portfolio of Suteemon Yodying. Full-stack web and mobile development with React, TypeScript, Node.js, SQL Server, and Flutter.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
