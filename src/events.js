import { DOM } from "./dom.js";
import { state, syncState } from "./state.js";
import { $$ } from "./ui/helpers.js";
import { toggleTheme } from "./ui/theme.js";
import { updatePanchangPlace } from "./panchang/places.js";
import { loadPanchangForDate } from "./panchang/loader.js";
import {
  loadBirthStates,
  loadBirthDistricts,
  loadBirthCities,
  loadBirthCoordinates,
} from "./birthplace/cascade.js";
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

  DOM.birthCountry?.addEventListener("change", (event) => {
    loadBirthStates(event.target.value);
  });

  DOM.birthState?.addEventListener("change", (event) => {
    loadBirthDistricts(DOM.birthCountry?.value, event.target.value);
  });

  DOM.birthDistrict?.addEventListener("change", (event) => {
    loadBirthCities(
      DOM.birthCountry?.value,
      DOM.birthState?.value,
      event.target.value
    );
  });

  DOM.birthCity?.addEventListener("change", (event) => {
    loadBirthCoordinates(
      DOM.birthCountry?.value,
      DOM.birthState?.value,
      DOM.birthDistrict?.value,
      event.target.value
    );
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
}
