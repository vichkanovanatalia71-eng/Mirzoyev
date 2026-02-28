/**
 * Lenis smooth scroll initialization
 */
import Lenis from 'lenis';
import { isReducedMotion } from './utils.js';

let lenis = null;

export function initSmoothScroll() {
  if (isReducedMotion()) return null;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
}

export function getLenis() {
  return lenis;
}
