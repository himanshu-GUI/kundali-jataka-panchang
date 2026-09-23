import { DOM } from "./dom.js";
import { state, syncState } from "./state.js";
import { showMessage, clearMessage } from "./ui/helpers.js";
import { t } from "./i18n/runtime.js";
import { loadTheme } from "./ui/theme.js";
import { getJatakaData } from "./jataka/data.js";
import { validateJataka, clearValidation } from "./jataka/validate.js";
import { updatePanchangPlace, clearPanchangPlace, populatePanchangPlaces } from "./panchang/places.js";
import { clearPanchangDetails } from "./panchang/display.js";
import { loadPanchangForDate } from "./panchang/loader.js";
import {
  hideManualPanchang,
  hideManualPanchangButton,
  resetManualForm,
} from "./panchang/manual.js";
import { setupInputEvents, bindEvents } from "./events.js";
import { initStepper, resetStepper, showStep, showResultStep } from "./ui/stepper.js";

export async function calculateKundali() {
  clearMessage(DOM.jatakaMessage);

  if (!validateJataka()) {
    showStep(0);
    showMessage(DOM.jatakaMessage, t("msg_validation_error"), "error");
    return;
  }

  state.jataka = getJatakaData();

  if (DOM.panchangPlace?.value) updatePanchangPlace();

  if (DOM.birthDate?.value) {
    await loadPanchangForDate(DOM.birthDate.value, true);
  }

  syncState();

  if (!state.grahas && !state.lagna) {
    showMessage(DOM.panchangDetailsMessage, t("msg_compute_failed"), "error");
    return;
  }

  showResultStep();
}

export function resetForm() {
  if (DOM.form) DOM.form.reset();

  clearValidation();
  clearMessage(DOM.jatakaMessage);
  clearMessage(DOM.panchangMessage);
  clearMessage(DOM.birthPlaceMessage);
  clearMessage(DOM.panchangDetailsMessage);

  clearPanchangDetails();
  clearPanchangPlace();

  resetManualForm();

  state.jataka = {};
  state.birthPlace = {};
  state.panchang = {};
  state.panchangPlace = {};
  state.grahas = null;
  state.lagna = null;
  state.settings.panchangMode = "local";

  hideManualPanchangButton();
  resetStepper();
  syncState();
}

export function initializeApp() {
  loadTheme();
  populatePanchangPlaces();

  hideManualPanchang();
  hideManualPanchangButton();
  clearPanchangDetails();

  setupInputEvents();
  bindEvents();
  initStepper({ compute: calculateKundali, reset: resetForm });

  syncState();
}
