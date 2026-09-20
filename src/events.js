import { DOM } from "./dom.js";
import { state, syncState } from "./state.js";
import { $$ } from "./ui/helpers.js";
import { toggleTheme } from "./ui/theme.js";
import { updatePanchangPlace } from "./panchang/places.js";
import { loadPanchangForDate } from "./panchang/loader.js";
import {
  showManualPanchang,
  saveManualPanchang,
  clearManualPanchangForm,
  closeManualPanchang,
} from "./panchang/manual.js";
import { calculateKundali, resetForm } from "./init.js";
import { exportKundaliPDF } from "./export/pdf.js";
import { setLang, getLang } from "./i18n/runtime.js";
import { initCitySearch } from "./birthplace/search.js";

export function setupInputEvents() {
  $$("input, select, textarea").forEach((input) => {
    input.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
    });
    input.addEventListener("change", () => {
      input.removeAttribute("aria-invalid");
    });
  });
}

export function bindEvents() {
  DOM.calculateBtn?.addEventListener("click", calculateKundali);
  DOM.bottomCalculateBtn?.addEventListener("click", calculateKundali);
  DOM.resetBtn?.addEventListener("click", resetForm);
  DOM.bottomResetBtn?.addEventListener("click", resetForm);
  DOM.themeBtn?.addEventListener("click", toggleTheme);

  DOM.form?.addEventListener("submit", (event) => {
    event.preventDefault();
    calculateKundali();
  });

  DOM.panchangPlace?.addEventListener("change", () => {
    updatePanchangPlace();
    if (DOM.birthDate?.value) {
      loadPanchangForDate(DOM.birthDate.value, true);
    }
  });

  DOM.birthDate?.addEventListener("change", (event) => {
    state.settings.panchangMode = "local";
    loadPanchangForDate(event.target.value);
  });

  DOM.birthSpecialPlace?.addEventListener("input", (event) => {
    state.birthPlace = {
      ...state.birthPlace,
      specialPlace: event.target.value.trim(),
    };
    syncState();
  });

  const exportBtn = document.getElementById("exportPdfBtn");
  exportBtn?.addEventListener("click", exportKundaliPDF);

  DOM.manualPanchangBtn?.addEventListener("click", showManualPanchang);
  DOM.saveManualPanchangBtn?.addEventListener("click", saveManualPanchang);
  DOM.clearManualPanchangBtn?.addEventListener("click", clearManualPanchangForm);
  DOM.closeManualPanchangBtn?.addEventListener("click", closeManualPanchang);

  initCitySearch();

  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.value = getLang();
    langSelect.addEventListener("change", (e) => setLang(e.target.value));
  }

  const fontDecBtn = document.getElementById("fontDecBtn");
  const fontIncBtn = document.getElementById("fontIncBtn");
  if (fontDecBtn && fontIncBtn) {
    let fontScale = parseInt(localStorage.getItem("kundali-font-scale") || "0", 10);
    const applyScale = () => {
      document.documentElement.classList.remove("font-scale-1", "font-scale-2", "font-scale-3");
      if (fontScale > 0) document.documentElement.classList.add(`font-scale-${fontScale}`);
      localStorage.setItem("kundali-font-scale", fontScale);
    };
    applyScale();
    fontDecBtn.addEventListener("click", () => { if (fontScale > 0) { fontScale--; applyScale(); } });
    fontIncBtn.addEventListener("click", () => { if (fontScale < 3) { fontScale++; applyScale(); } });
  }
}
