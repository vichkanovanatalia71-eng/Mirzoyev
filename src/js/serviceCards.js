/**
 * 3D Perspective tilt effect on service cards
 */
import { isMobile, lerp } from './utils.js';

export function initServiceCards() {
  if (isMobile()) return;

  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach((card) => {
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;
    let rafId = null;
    let isHovering = false;

    const update = () => {
      if (!isHovering && Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01) {
        card.style.transform = '';
        rafId = null;
        return;
      }

      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);

      card.style.transform = `perspective(800px) rotateX(${currentY}deg) rotateY(${currentX}deg) translateZ(10px)`;

      rafId = requestAnimationFrame(update);
    };

    card.addEventListener('mouseenter', () => {
      isHovering = true;
      if (!rafId) rafId = requestAnimationFrame(update);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetX = (x - 0.5) * 12; // max 6deg
      targetY = -(y - 0.5) * 12;
    });

    card.addEventListener('mouseleave', () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      // Continue animation to smoothly return to 0
      if (!rafId) rafId = requestAnimationFrame(update);
    });
  });
}
