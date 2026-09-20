import { DOM } from "../dom.js";
import { state, syncState } from "../state.js";
import { setText, showMessage } from "../ui/helpers.js";
import { formatGhatiPal, formatGhatiDecimal } from "./format.js";
import { animatePanchangDetails } from "../ui/animate.js";
import { displayGraha, clearGraha } from "../graha/display.js";

function fillAng(nameId, ghatiPalId, decimalId, data) {
  if (!data) {
    setText(nameId, "—");
    setText(ghatiPalId, "—");
    setText(decimalId, "—");
    return;
  }
  setText(nameId, data.name);
  setText(ghatiPalId, formatGhatiPal(data.ghati, data.pal));
  setText(decimalId, formatGhatiDecimal(data.ghati, data.pal));
}

export function displayPanchang(data) {
  if (!data) {
    clearPanchangDetails();
    showMessage(
      DOM.panchangDetailsMessage,
      "इस तारीख का पंचांग डेटा उपलब्ध नहीं है।",
      "error"
    );
    return;
  }

  setText("shakaSamvat", data.shakaSamvat);
  setText("vikramSamvat", data.vikramSamvat);
  setText("samvatsara", data.samvatsara);
  setText("ayana", data.ayana);
  setText("gola", data.gola);
  setText("ritu", data.ritu);
  setText("masa", data.masaNote || data.masa);
  setText("paksha", data.paksha);

  const tithiList = Array.isArray(data.tithi) ? data.tithi : [];

  if (tithiList.length > 0) {
    setText("tithi1", tithiList[0].name);
    setText("tithiTime1", tithiList[0].endTime);
  } else {
    setText("tithi1", "—");
    setText("tithiTime1", "—");
  }

  if (tithiList.length > 1) {
    setText("tithi2", tithiList[1].name);
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

  let sourceText = "Local Panchang Data";
  if (state.settings.panchangMode === "computed") sourceText = "Auto-Computed (astronomy-engine)";
  else if (state.settings.panchangMode === "api") sourceText = "Panchang API";
  else if (state.settings.panchangMode === "manual")
    sourceText = "Manual Panchang";
  setText("panchangSource", sourceText);

  state.panchang = {
    ...data,
    date: DOM.birthDate?.value || "",
    source: state.settings.panchangMode,
  };
  syncState();

  showMessage(
    DOM.panchangDetailsMessage,
    state.settings.panchangMode === "manual"
      ? "मैनुअल पंचांग सफलतापूर्वक प्रदर्शित किया गया है।"
      : "पंचांग विवरण स्वतः भर दिया गया है।",
    "success"
  );

  if (data.grahas || data.lagna) {
    displayGraha(data.grahas, data.lagna, data.nearestPanchang);
  }

  const exportBtn = document.getElementById("exportPdfBtn");
  if (exportBtn) exportBtn.style.display = "";

  animatePanchangDetails();
}

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
  clearGraha();
  state.panchang = {};
  syncState();
}

export function showPanchangMessage(text, type = "success") {
  showMessage(DOM.panchangDetailsMessage, text, type);
}
