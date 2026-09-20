import { DOM } from "../dom.js";
import { state, syncState } from "../state.js";
import { showMessage, clearMessage } from "../ui/helpers.js";

export const PANCHANG_PLACE_DATA = {
  jalandhar: {
    name: "दिवाकर पंचांग",
    latitude: "31.3260° N",
    longitude: "75.5762° E",
    sunrise: "06:10",
    sunset: "18:32",
  },
  haridwar: {
    name: "हरिद्वार पंचांग",
    latitude: "29.9457° N",
    longitude: "78.1642° E",
    sunrise: "06:05",
    sunset: "18:35",
  },
  delhi: {
    name: "दिल्ली पंचांग",
    latitude: "28.6139° N",
    longitude: "77.2090° E",
    sunrise: "06:08",
    sunset: "18:28",
  },
};

export function updatePanchangPlace() {
  if (!DOM.panchangPlace) return;

  const key = DOM.panchangPlace.value;
  const data = PANCHANG_PLACE_DATA[key];

  if (!data) {
    clearPanchangPlace();
    return;
  }

  if (DOM.panchangName) DOM.panchangName.value = data.name;
  if (DOM.panchangLatitude) DOM.panchangLatitude.value = data.latitude;
  if (DOM.panchangLongitude) DOM.panchangLongitude.value = data.longitude;
  if (DOM.sunrise) DOM.sunrise.value = data.sunrise;
  if (DOM.sunset) DOM.sunset.value = data.sunset;

  state.panchangPlace = { place: key, ...data };
  syncState();

  showMessage(
    DOM.panchangMessage,
    "पंचांग की जानकारी स्वतः भर गई है।",
    "success"
  );
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
