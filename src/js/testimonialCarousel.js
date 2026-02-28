/**
 * 3D Perspective testimonial carousel
 */

export function initTestimonialCarousel() {
  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;

  const cards = carousel.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('#testimonialDots .testimonials__dot');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (cards.length === 0) return;

  let currentIndex = 1;
  let autoInterval;

  const updateCarousel = (index) => {
    currentIndex = ((index % cards.length) + cards.length) % cards.length;

    cards.forEach((card, i) => {
      card.classList.remove(
        'testimonial-card--active',
        'testimonial-card--prev',
        'testimonial-card--next',
        'testimonial-card--hidden'
      );

      if (i === currentIndex) {
        card.classList.add('testimonial-card--active');
      } else if (i === ((currentIndex - 1 + cards.length) % cards.length)) {
        card.classList.add('testimonial-card--prev');
      } else if (i === ((currentIndex + 1) % cards.length)) {
        card.classList.add('testimonial-card--next');
      } else {
        card.classList.add('testimonial-card--hidden');
      }
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('testimonials__dot--active', i === currentIndex);
    });
  };

  // Navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateCarousel(currentIndex - 1);
      resetAutoRotate();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateCarousel(currentIndex + 1);
      resetAutoRotate();
    });
  }

  // Dot click
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      updateCarousel(i);
      resetAutoRotate();
    });
  });

  // Card click
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index);
      if (idx !== currentIndex) {
        updateCarousel(idx);
        resetAutoRotate();
      }
    });
  });

  // Auto-rotate
  const startAutoRotate = () => {
    autoInterval = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, 5000);
  };

  const resetAutoRotate = () => {
    clearInterval(autoInterval);
    startAutoRotate();
  };

  // Touch/swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex - 1);
      }
      resetAutoRotate();
    }
  });

  // Init
  updateCarousel(currentIndex);
  startAutoRotate();

  // Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(autoInterval));
  carousel.addEventListener('mouseleave', startAutoRotate);
}
