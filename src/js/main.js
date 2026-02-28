/**
 * Main entry point — initializes all modules
 */
import { initSmoothScroll } from './smoothScroll.js';
import { initHeader } from './header.js';
import { initHero3D } from './hero3d.js';
import { initServiceCards } from './serviceCards.js';
import { initBeforeAfter } from './beforeAfter.js';
import { initTestimonialCarousel } from './testimonialCarousel.js';
import { initTrustSection } from './trustSection.js';
import { initCtaEffects } from './ctaEffects.js';
import { initFooterParticles } from './footerParticles.js';
import { initCursor } from './cursor.js';
import { initScrollAnimations } from './scrollAnimations.js';
import { initI18n } from './i18n.js';
import { initBookingForm, initQuickBooking } from './booking.js';
import { initContactForm } from './contactForm.js';
import { initGallery } from './galleryEffects.js';
import { lazyInit } from './utils.js';

/**
 * Initialize everything when DOM is ready
 */
function init() {
  // Core
  initSmoothScroll();
  initHeader();
  initI18n();

  // 3D Hero — lazy init when visible
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    initHero3D();
  }

  // Interactive sections
  initServiceCards();
  initTestimonialCarousel();
  initTrustSection();
  initCtaEffects();
  initGallery();

  // Before/After — lazy init
  lazyInit('#beforeAfter', () => {
    initBeforeAfter();
  }, { threshold: 0.2 });

  // Footer particles — lazy init
  lazyInit('#footerCanvas', () => {
    initFooterParticles();
  }, { threshold: 0.1 });

  // Forms
  initBookingForm();
  initQuickBooking();
  initContactForm();

  // Polish (after main content)
  requestAnimationFrame(() => {
    initCursor();
    initScrollAnimations();
  });
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
