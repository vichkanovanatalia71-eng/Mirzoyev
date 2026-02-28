/**
 * Gallery: filter, modal, hover effects
 */

export function initGallery() {
  // Filter buttons
  const filterBtns = document.querySelectorAll('.gallery__filter-btn');
  const items = document.querySelectorAll('.gallery__item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach((b) => b.classList.remove('gallery__filter-btn--active'));
      btn.classList.add('gallery__filter-btn--active');

      const filter = btn.dataset.filter;

      items.forEach((item) => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Gallery modal (open on item click)
  items.forEach((item) => {
    item.addEventListener('click', () => {
      // Could open a detailed modal here
      // For now, just a scale effect
    });
  });
}
