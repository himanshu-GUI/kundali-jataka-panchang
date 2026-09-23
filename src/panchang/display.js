import { DOM } from "../dom.js";
import { state, syncState } from "../state.js";
import { setText, showMessage } from "../ui/helpers.js";
import { formatGhatiPal, formatGhatiDecimal } from "./format.js";
import { animatePanchangDetails } from "../ui/animate.js";
import { displayGraha, clearGraha } from "../graha/display.js";
import { t } from "../i18n/runtime.js";
import { localizeName } from "../i18n/names.js";

function fillAng(nameId, ghatiPalId, decimalId, data) {
  if (!data) {
    setText(nameId, "—");
    setText(ghatiPalId, "—");
    setText(decimalId, "—");
    return;
  }
  setText(nameId, localizeName(data.name));
  setText(ghatiPalId, formatGhatiPal(data.ghati, data.pal));
  setText(decimalId, formatGhatiDecimal(data.ghati, data.pal));
}

export function displayPanchang(data) {
  if (!data) {
    clearPanchangDetails();
    showMessage(DOM.panchangDetailsMessage, t("msg_panchang_unavailable"), "error");
    return;
  }

  setText("shakaSamvat", data.shakaSamvat);
  setText("vikramSamvat", data.vikramSamvat);
  setText("samvatsara", localizeName(data.samvatsara));
  setText("ayana", localizeName(data.ayana));
  setText("gola", data.gola);
  setText("ritu", localizeName(data.ritu));
  setText("masa", localizeName(data.masaNote || data.masa));
  setText("paksha", localizeName(data.paksha));

  const tithiList = Array.isArray(data.tithi) ? data.tithi : [];

  if (tithiList.length > 0) {
    setText("tithi1", localizeName(tithiList[0].name));
    setText("tithiTime1", tithiList[0].endTime);
  } else {
    setText("tithi1", "—");
    setText("tithiTime1", "—");
  }

  if (tithiList.length > 1) {
    setText("tithi2", localizeName(tithiList[1].name));
    setText("tithiTime2", tithiList[1].endTime);
    if (DOM.tithiRow2) DOM.tithiRow2.style.display = "grid";
  } else {
    setText("tithi2", "—");
    setText("tithiTime2", "—");
    if (DOM.tithiRow2) DOM.tithiRow2.style.display = "none";
  }

  fillAng("vara", "varaGhatiPal", "varaDecimal", data.vara);
  fillAng(
    "previousNakshatra",
    "previousNakshatraGhatiPal",
    "previousNakshatraDecimal",
    data.previousNakshatra
  );
  fillAng(
    "currentNakshatra",
    "currentNakshatraGhatiPal",
    "currentNakshatraDecimal",
    data.currentNakshatra
  );
  fillAng(
    "nextNakshatra",
    "nextNakshatraGhatiPal",
    "nextNakshatraDecimal",
    data.nextNakshatra
  );
  fillAng("yoga", "yogaGhatiPal", "yogaDecimal", data.yoga);
  fillAng("karana", "karanaGhatiPal", "karanaDecimal", data.karana);

  const manual = state.settings.panchangMode === "manual";
  setText("panchangSource", t(manual ? "src_manual" : "src_computed"));
  setText("panchangSourceStatus", t("status_ready"));
  document.getElementById("panchangSourceStatus")?.classList.add("ready");

  state.panchang = {
    ...data,
    date: DOM.birthDate?.value || "",
    source: state.settings.panchangMode,
  };
  syncState();

  showMessage(
    DOM.panchangDetailsMessage,
    t(manual ? "msg_panchang_manual_shown" : "msg_panchang_details_auto"),
    "success"
  );

  if (data.grahas || data.lagna) {
    displayGraha(data.grahas, data.lagna, data.usedPanchang || data.nearestPanchang);
  }

  animatePanchangDetails();
}

window.addEventListener("langchange", () => {
  if (state.panchang && Object.keys(state.panchang).length) displayPanchang(state.panchang);
});

export function clearPanchangDetails() {
  const ids = [
    "shakaSamvat", "vikramSamvat", "samvatsara", "ayana", "gola",
    "ritu", "masa", "paksha", "tithi1", "tithiTime1", "tithi2",
    "tithiTime2", "vara", "varaGhatiPal", "varaDecimal",
    "previousNakshatra", "previousNakshatraGhatiPal",
    "previousNakshatraDecimal", "currentNakshatra",
    "currentNakshatraGhatiPal", "currentNakshatraDecimal",
    "nextNakshatra", "nextNakshatraGhatiPal", "nextNakshatraDecimal",
    "yoga", "yogaGhatiPal", "yogaDecimal", "karana", "karanaGhatiPal",
    "karanaDecimal",
  ];
  ids.forEach((id) => setText(id, "—"));
  if (DOM.tithiRow2) DOM.tithiRow2.style.display = "none";
  setText("panchangSource", "—");
  setText("panchangSourceStatus", t("status_waiting"));
  document.getElementById("panchangSourceStatus")?.classList.remove("ready");
  clearGraha();
  state.panchang = {};
  syncState();
}

export function showPanchangMessage(text, type = "success") {
  showMessage(DOM.panchangDetailsMessage, text, type);
}
