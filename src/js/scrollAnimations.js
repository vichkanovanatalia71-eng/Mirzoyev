/**
 * GSAP ScrollTrigger animations for all sections
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  if (isReducedMotion()) return;

  // Hero text stagger
  gsap.fromTo('.hero__label', {
    opacity: 0, y: 30
  }, {
    opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out'
  });

  gsap.fromTo('.hero__title span', {
    opacity: 0, y: 50
  }, {
    opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.5, ease: 'power3.out'
  });

  gsap.fromTo('.hero__description', {
    opacity: 0, y: 30
  }, {
    opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'power3.out'
  });

  gsap.fromTo('.hero__actions', {
    opacity: 0, y: 30
  }, {
    opacity: 1, y: 0, duration: 0.8, delay: 1.1, ease: 'power3.out'
  });

  // Section headers
  gsap.utils.toArray('.section-label, .section-title, .section-subtitle').forEach((el) => {
    gsap.fromTo(el, {
      opacity: 0, y: 40
    }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Service cards stagger
  gsap.fromTo('.service-card', {
    opacity: 0, y: 60, scale: 0.95
  }, {
    opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.services__grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });

  // Before/After
  gsap.fromTo('.before-after', {
    opacity: 0, scale: 0.95
  }, {
    opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.before-after',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });

  // Trust section
  gsap.fromTo('.trust__photo-wrapper', {
    opacity: 0, x: -50
  }, {
    opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.trust__grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });

  gsap.fromTo('.trust__info', {
    opacity: 0, x: 50
  }, {
    opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.trust__grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });

  // Trust stats
  gsap.fromTo('.trust__stat', {
    opacity: 0, y: 30
  }, {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.trust__stats',
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  });

  // Certifications
  gsap.fromTo('.trust__cert', {
    opacity: 0, scale: 0.9
  }, {
    opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)',
    scrollTrigger: {
      trigger: '.trust__certs',
      start: 'top 90%',
      toggleActions: 'play none none none',
    }
  });

  // Testimonial section
  gsap.fromTo('.testimonials__carousel', {
    opacity: 0, y: 40
  }, {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.testimonials__carousel',
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  });

  // CTA section
  gsap.fromTo('.cta-section__content', {
    opacity: 0, y: 40
  }, {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });

  // Footer elements
  gsap.fromTo('.footer__grid > *', {
    opacity: 0, y: 30
  }, {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.footer__grid',
      start: 'top 90%',
      toggleActions: 'play none none none',
    }
  });
}
