/**
 * Booking form logic + EmailJS integration
 */

const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with actual key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

/**
 * Initialize booking form
 */
export function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // EmailJS integration
      if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          patient_name: data.name,
          patient_phone: data.phone,
          patient_email: data.email,
          service: data.service,
          date: data.date,
          time: data.time,
          message: data.message || '',
        });
      }

      // Redirect to thank you page
      window.location.href = 'thankyou.html';
    } catch (error) {
      console.error('Form submission error:', error);
      // Show inline error
      let errorEl = form.querySelector('.form-error');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        form.appendChild(errorEl);
      }
      errorEl.textContent = 'Something went wrong. Please try again or call us directly.';
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

/**
 * Initialize quick booking modal
 */
export function initQuickBooking() {
  const modal = document.getElementById('quickBookingModal');
  const closeBtn = document.getElementById('closeQuickBooking');
  const form = document.getElementById('quickBookingForm');

  if (!modal) return;

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });

  // Form submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate or send via EmailJS
      try {
        // Success
        setTimeout(() => {
          modal.classList.remove('active');
          window.location.href = 'thankyou.html';
        }, 500);
      } catch (err) {
        submitBtn.textContent = 'Request Callback';
        submitBtn.disabled = false;
      }
    });
  }
}
