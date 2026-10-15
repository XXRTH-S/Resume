'use client';

import { Download } from 'lucide-react';
import { useLanguage } from './Language';

export default function ResumeDownload() {
  const { language } = useLanguage();
  const filename = `Suteemon-Yodying-Resume-${language.toUpperCase()}.pdf`;
  return <a className="button secondary resume-download" href={`/downloads/${filename}`} download={filename}>
    <Download size={18} aria-hidden="true"/>
    {language === 'th' ? 'ดาวน์โหลดเรซูเม่' : 'Download resume'}
    <span className="download-format">PDF · {language.toUpperCase()}</span>
  </a>;
}
