'use client';

import { useEffect } from 'react';

export default function BlockLighting() {
  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let previous: HTMLElement | null = null;
    const clear = () => { cancelAnimationFrame(frame); previous?.classList.remove('light-following'); previous = null; };
    const move = (event: PointerEvent) => {
      if (!media.matches) return clear();
      const block = event.target instanceof Element ? event.target.closest<HTMLElement>('.project-card, .skill-card, .system-explorer, .contact, .journey article, .hero-copy, .about-grid > div:first-child') : null;
      if (previous !== block) { clear(); previous = block; }
      if (!block) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = block.getBoundingClientRect();
        block.style.setProperty('--light-x', `${event.clientX - rect.left}px`);
        block.style.setProperty('--light-y', `${event.clientY - rect.top}px`);
        block.classList.add('light-following');
      });
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', clear);
    window.addEventListener('blur', clear);
    media.addEventListener('change', clear);
    return () => { clear(); document.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', clear); window.removeEventListener('blur', clear); media.removeEventListener('change', clear); };
  }, []);
  return null;
}
