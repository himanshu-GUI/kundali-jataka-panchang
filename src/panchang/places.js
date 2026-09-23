import { DOM } from "../dom.js";
import { state, syncState } from "../state.js";
import { showMessage, clearMessage } from "../ui/helpers.js";
import { PANCHANG_LOCATIONS } from "./auto-select.js";
import { t } from "../i18n/runtime.js";
import { getPanchangDataByLocation } from "../vedic/panchang-data.js";

export function populatePanchangPlaces() {
  if (!DOM.panchangPlace) return;

  for (const loc of PANCHANG_LOCATIONS) {
    const option = document.createElement("option");
    option.value = loc.key;
    option.textContent = loc.name;
    DOM.panchangPlace.appendChild(option);
  }
}

export function updatePanchangPlace() {
  if (!DOM.panchangPlace) return;

  const key = DOM.panchangPlace.value;
  const loc = PANCHANG_LOCATIONS.find((l) => l.key === key);

  if (!loc) {
    clearPanchangPlace();
    return;
  }

  if (DOM.panchangName) DOM.panchangName.value = loc.name;
  if (DOM.panchangLatitude) DOM.panchangLatitude.value = loc.lat.toFixed(4) + "° N";
  if (DOM.panchangLongitude) DOM.panchangLongitude.value = loc.lon.toFixed(4) + "° E";

  // Try to load panchang data for the selected location
  const panchangData = getPanchangDataByLocation(key);

  state.panchangPlace = {
    place: key,
    name: loc.name,
    latitude: loc.lat.toFixed(4),
    longitude: loc.lon.toFixed(4),
    data: panchangData,  // Store panchang data if available
  };
  syncState();

  showMessage(DOM.panchangMessage, t("msg_panchang_auto"), "success");
}

export function clearPanchangPlace() {
  const fields = [
    DOM.panchangName,
    DOM.panchangLatitude,
    DOM.panchangLongitude,
    DOM.sunrise,
    DOM.sunset,
  ];
  fields.forEach((field) => {
    if (field) field.value = "";
  });
  state.panchangPlace = {};
  syncState();
  clearMessage(DOM.panchangMessage);
}
