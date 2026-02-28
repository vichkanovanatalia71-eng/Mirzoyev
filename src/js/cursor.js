/**
 * Custom cursor with glow effect (desktop only)
 */
import { isMobile, lerp } from './utils.js';

export function initCursor() {
  if (isMobile()) return;

  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  let cursorX = 0, cursorY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Hover state for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .service-card, .gallery__item, .testimonial-card, input, textarea, select');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('custom-cursor--hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('custom-cursor--hover'));
  });

  function update() {
    cursorX = lerp(cursorX, targetX, 0.15);
    cursorY = lerp(cursorY, targetY, 0.15);
    cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
