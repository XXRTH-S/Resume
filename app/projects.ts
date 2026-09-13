import { Code2, Database, Layers, Smartphone, Sparkles, type LucideIcon } from 'lucide-react';

export type Project = {
  id: string;
  title: string;
  name: string;
  category: 'Web' | 'Mobile' | 'Game' | 'AI';
  year: string;
  type: string;
  tags: string[];
  description: string;
  details: string[];
  icon: LucideIcon;
  repositoryUrl?: string;
};

// Add completed projects here. Link only to the actual project repository.
export const projects: Project[] = [
  { id: '01', title: 'IT equipment maintenance and reporting.', name: 'PM Management', category: 'Web', year: '2026', type: 'Full-stack application', tags: ['React', 'TypeScript', 'Node.js', 'SQL Server', 'Docker'], description: 'An IT equipment maintenance platform with role-based access, configurable checklists, and a clear audit trail.', details: ['Built the full stack with React, TypeScript, Node.js, Express, Prisma, and SQL Server.', 'Implemented JWT authentication, role-based access, configurable PM checklists, and activity logging.', 'Created Excel reports with ExcelJS and cost-summary visualizations with Recharts.', 'Containerized the application stack with Docker Compose.'], icon: Database },
  { id: '02', title: 'Mobile application and companion website.', name: 'Mobile Application', category: 'Mobile', year: '2025', type: 'KCE Electronics PCL', tags: ['Mobile development', 'UX/UI', 'Database design'], description: 'End-to-end mobile development, paired with a website for data visualization.', details: ['Designed the database and UX/UI for every screen of the mobile application and accompanying website.', 'Developed image uploads, search, data sorting, and personalized screens for each user.', 'Created a companion website for data visualization.'], icon: Smartphone },
  { id: '03', title: 'Maintenance and feature development.', name: 'Web Application Enhancement', category: 'Web', year: '2025', type: 'KCE Electronics PCL', tags: ['Web development', 'Excel export', 'Data sorting'], description: 'Reviewed an inherited codebase and delivered improvements shaped by client requirements.', details: ['Inherited and reviewed an existing application from a previous developer.', 'Added Excel file export, data sorting, and additional data columns.', 'Enhanced the web application to match client requirements.'], icon: Code2 },
  { id: '04', title: 'Inventory, skills, and in-game economy.', name: 'Turn-Based Strategy Game', category: 'Game', year: '2023–2024', type: 'Game development project', tags: ['Inventory', 'Skill systems', 'Game UI'], description: 'Connected inventory, upgradable skills, and an in-game economy in a turn-based strategy game.', details: ['Designed and developed a character inventory system.', 'Built an upgradable skill system with usage conditions.', 'Created a shop for purchasing and upgrading weapons and integrated it with the in-game currency.', 'Designed a user-friendly, visually appealing game interface.'], icon: Layers },
  { id: '05', title: 'Resume questions answered with public portfolio context.', name: 'Bubble Resume Assistant', category: 'AI', year: '2026', type: 'AI integration / Live portfolio feature', tags: ['Next.js', 'OpenRouter', 'LLM API', 'React'], description: 'A bilingual resume assistant with an animated mascot, server-side model integration, and contextual answers about experience and projects.', details: ['Connected a Next.js server-side API to OpenRouter using public resume context.', 'Implemented Thai and English conversation support with limited recent message history.', 'Added free-model fallback, request validation, timeouts, and per-instance rate limits.', 'Kept the API key in server-side environment variables and added animated laptop-typing states for Bubble.', 'Integrated existing language models; this project does not train a custom model.'], icon: Sparkles, repositoryUrl: 'https://github.com/XXRTH-S/Resume' },
];
