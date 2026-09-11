import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Suteemon Yodying — Full-Stack Developer',
  description: 'Suteemon Yodying, a Bangkok-based Full-Stack Developer at Bangkok Expressway and Metro. Web and mobile development with React, TypeScript, Node.js, SQL Server, and Flutter.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
