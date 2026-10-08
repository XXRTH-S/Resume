'use client';

import { useEffect } from 'react';

export default function BlockLighting() {
  useEffect(() => {
    const media = window.matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let previous: HTMLElement | null = null;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    const draw = () => {
      if (!previous) return;
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      previous.style.setProperty('--light-x', `${x}px`);
      previous.style.setProperty('--light-y', `${y}px`);
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.5 ? requestAnimationFrame(draw) : 0;
    };
    const clear = () => { cancelAnimationFrame(frame); frame = 0; previous?.classList.remove('light-following'); previous = null; };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== 'mouse') return clear();
      const block = event.target instanceof Element ? event.target.closest<HTMLElement>('.project-card, .skill-card, .system-explorer, .contact, .journey article, .hero-copy, .about-grid > div:first-child') : null;
      if (!block) return clear();
      const rect = block.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      if (previous !== block) { clear(); previous = block; x = targetX; y = targetY; frame = 0; }
      block.classList.add('light-following');
      if (!frame) draw();
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', clear);
    window.addEventListener('blur', clear);
    window.addEventListener('scroll', clear, true);
    media.addEventListener('change', clear);
    return () => { clear(); document.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', clear); window.removeEventListener('blur', clear); window.removeEventListener('scroll', clear, true); media.removeEventListener('change', clear); };
  }, []);
  return null;
}
