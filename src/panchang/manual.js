import { DOM } from "../dom.js";
import { state, syncState } from "../state.js";
import { displayPanchang, showPanchangMessage } from "./display.js";
import { t } from "../i18n/runtime.js";

function manualValue(id) {
  const element = document.getElementById(id);
  if (!element) return "";
  return element.value.trim();
}

function manualNumber(id) {
  const value = manualValue(id);
  if (value === "") return 0;
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function showManualPanchangButton() {
  if (!DOM.manualPanchangBtn) return;
  DOM.manualPanchangBtn.hidden = false;
}

export function hideManualPanchangButton() {
  if (!DOM.manualPanchangBtn) return;
  DOM.manualPanchangBtn.hidden = true;
}

export function showManualPanchang() {
  if (!DOM.manualPanchangForm) return;
  DOM.manualPanchangForm.hidden = false;
  showManualPanchangButton();
  state.settings.panchangMode = "manual";
  syncState();
  showPanchangMessage(t("msg_manual_active"), "success");
  DOM.manualPanchangForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function hideManualPanchang() {
  if (!DOM.manualPanchangForm) return;
  DOM.manualPanchangForm.hidden = true;
}

function getManualPanchangData() {
  return {
    shakaSamvat: manualValue("manualShakaSamvat"),
    vikramSamvat: manualValue("manualVikramSamvat"),
    samvatsara: manualValue("manualSamvatsara"),
    ayana: manualValue("manualAyana"),
    gola: manualValue("manualGola"),
    ritu: manualValue("manualRitu"),
    masa: manualValue("manualMasa"),
    masaNote: manualValue("manualMasaNote"),
    paksha: manualValue("manualPaksha"),
    tithi: [
      { name: manualValue("manualTithi1"), endTime: manualValue("manualTithiTime1") },
      { name: manualValue("manualTithi2"), endTime: manualValue("manualTithiTime2") },
    ].filter((item) => item.name),
    vara: {
      name: manualValue("manualVara"),
      ghati: manualNumber("manualVaraGhati"),
      pal: manualNumber("manualVaraPal"),
    },
    previousNakshatra: {
      name: manualValue("manualPreviousNakshatra"),
      ghati: manualNumber("manualPreviousNakshatraGhati"),
      pal: manualNumber("manualPreviousNakshatraPal"),
    },
    currentNakshatra: {
      name: manualValue("manualCurrentNakshatra"),
      ghati: manualNumber("manualCurrentNakshatraGhati"),
      pal: manualNumber("manualCurrentNakshatraPal"),
    },
    nextNakshatra: {
      name: manualValue("manualNextNakshatra"),
      ghati: manualNumber("manualNextNakshatraGhati"),
      pal: manualNumber("manualNextNakshatraPal"),
    },
    yoga: {
      name: manualValue("manualYoga"),
      ghati: manualNumber("manualYogaGhati"),
      pal: manualNumber("manualYogaPal"),
    },
    karana: {
      name: manualValue("manualKarana"),
      ghati: manualNumber("manualKaranaGhati"),
      pal: manualNumber("manualKaranaPal"),
    },
  };
}

function validateManualPanchang(data) {
  const required = [
    data.shakaSamvat, data.vikramSamvat, data.ayana, data.ritu,
    data.masa, data.paksha, data.tithi?.[0]?.name, data.vara?.name,
  ];
  return required.every((value) => String(value || "").trim() !== "");
}

export function saveManualPanchang() {
  const data = getManualPanchangData();
  if (!validateManualPanchang(data)) {
    showPanchangMessage(t("msg_manual_required"), "error");
    return;
  }
  state.settings.panchangMode = "manual";
  state.panchang = {
    ...data,
    date: DOM.birthDate?.value || "",
    source: "Manual Panchang",
  };
  syncState();
  displayPanchang(data);
  hideManualPanchang();
  hideManualPanchangButton();
  showPanchangMessage(t("msg_manual_saved"), "success");
}

export function clearManualPanchangForm() {
  if (!DOM.manualPanchangForm) return;
  DOM.manualPanchangForm
    .querySelectorAll("input, select, textarea")
    .forEach((field) => {
      if (field.tagName === "SELECT") field.selectedIndex = 0;
      else field.value = "";
    });
  showPanchangMessage(t("msg_manual_cleared"), "success");
}

export function closeManualPanchang() {
  hideManualPanchang();
  if (state.settings.panchangMode === "manual") showManualPanchangButton();
  showPanchangMessage(t("msg_manual_closed"), "success");
}

export function resetManualForm() {
  if (!DOM.manualPanchangForm) return;
  DOM.manualPanchangForm
    .querySelectorAll("input, select, textarea")
    .forEach((field) => {
      if (field.tagName === "SELECT") field.selectedIndex = 0;
      else field.value = "";
    });
  DOM.manualPanchangForm.hidden = true;
}
