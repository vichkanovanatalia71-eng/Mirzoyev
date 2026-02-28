/**
 * Internationalization (i18n) module — EN/UA bilingual support
 */
import { translations } from './translations.js';

let currentLang = 'en';

/**
 * Get saved language or detect from browser
 */
function getDefaultLang() {
  const saved = localStorage.getItem('lang');
  if (saved && translations[saved]) return saved;

  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang && browserLang.startsWith('uk')) return 'ua';
  return 'en';
}

/**
 * Apply translations to all elements with data-i18n
 */
function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  // Update html lang
  document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';
}

/**
 * Update all language switcher buttons
 */
function updateSwitcherUI(lang) {
  document.querySelectorAll('.lang-switcher__btn').forEach((btn) => {
    btn.classList.toggle('lang-switcher__btn--active', btn.dataset.lang === lang);
  });
}

/**
 * Set language
 */
export function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations(lang);
  updateSwitcherUI(lang);
}

/**
 * Get current language
 */
export function getLanguage() {
  return currentLang;
}

/**
 * Get translation for a key
 */
export function t(key) {
  return translations[currentLang]?.[key] || translations['en']?.[key] || key;
}

/**
 * Initialize i18n system
 */
export function initI18n() {
  currentLang = getDefaultLang();

  // Bind all language switcher buttons
  document.querySelectorAll('.lang-switcher__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // Apply initial translations
  applyTranslations(currentLang);
  updateSwitcherUI(currentLang);
}
