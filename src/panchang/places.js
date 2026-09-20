import { DOM } from "../dom.js";
import { state, syncState } from "../state.js";
import { clearMessage } from "../ui/helpers.js";

export function updatePanchangPlace() {
  if (!DOM.panchangPlace) return;
  state.panchangPlace = { place: DOM.panchangPlace.value };
  syncState();
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
