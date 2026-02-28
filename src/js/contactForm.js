/**
 * Contact form logic
 */

export function initContactForm() {
  const form = document.getElementById('contactForm');
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
      // EmailJS integration (if configured)
      if (typeof emailjs !== 'undefined') {
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_CONTACT_TEMPLATE_ID', {
          name: data.name,
          email: data.email,
          message: data.message,
        });
      }

      // Show success message
      let successEl = form.querySelector('.form-success');
      if (!successEl) {
        successEl = document.createElement('div');
        successEl.className = 'form-success';
        form.appendChild(successEl);
      }
      successEl.textContent = 'Message sent successfully! We\'ll get back to you soon.';
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      // Remove success message after 5s
      setTimeout(() => {
        if (successEl) successEl.remove();
      }, 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      let errorEl = form.querySelector('.form-error');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        form.appendChild(errorEl);
      }
      errorEl.textContent = 'Failed to send. Please try again or contact us by phone.';
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
