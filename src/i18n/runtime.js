import hi from "./hi.json";
import en from "./en.json";
import sa from "./sa.json";

const TRANSLATIONS = { hi, en, sa };
const LANG_KEY = "kundali_lang";

let currentLang = "hi";

export function t(key) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.hi;
  return dict[key] || TRANSLATIONS.hi[key] || key;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}
  document.documentElement.lang = lang;
  applyTranslations();
  window.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

const DEVANAGARI_DIGITS = "०१२३४५६७८९";

export function localizeDigits(value) {
  const str = String(value);
  return currentLang === "en" ? str : str.replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[d]);
}

export function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const translated = t(key);
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = translated;
    } else if (el.tagName === "OPTION") {
      el.textContent = translated;
    } else {
      el.textContent = translated;
    }
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.getAttribute("data-i18n-title"));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });
  document.querySelectorAll("[data-i18n-num]").forEach((el) => {
    el.textContent = localizeDigits(el.getAttribute("data-i18n-num"));
  });
}

export function initI18n() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && TRANSLATIONS[saved]) currentLang = saved;
  } catch (_) {}
  document.documentElement.lang = currentLang;
  applyTranslations();
}
