import { DOM } from "../dom.js";
import { state, syncState } from "../state.js";
import {
  displayPanchang,
  clearPanchangDetails,
  showPanchangMessage,
} from "./display.js";
import {
  hideManualPanchang,
  showManualPanchangButton,
} from "./manual.js";
import { computeFullKundali } from "./compute.js";
import { PANCHANG_LOCATIONS } from "./auto-select.js";
import { haversineDistance, parseCoordinate } from "../utils/coordinates.js";
import { t } from "../i18n/runtime.js";

function getCoordinates() {
  const panchangLat = DOM.panchangLatitude?.value;
  const panchangLon = DOM.panchangLongitude?.value;
  const birthLat = DOM.birthLatitude?.value;
  const birthLon = DOM.birthLongitude?.value;

  const hasPanchang = panchangLat && panchangLon;
  const hasBirth = birthLat && birthLon;

  if (!hasPanchang && !hasBirth) return null;

  return {
    birthLat: hasBirth ? birthLat : panchangLat,
    birthLon: hasBirth ? birthLon : panchangLon,
    panchangLat: hasPanchang ? panchangLat : null,
    panchangLon: hasPanchang ? panchangLon : null,
  };
}

export async function loadPanchangForDate(date, force = false) {
  if (!date) {
    clearPanchangDetails();
    return;
  }

  if (state.settings.panchangMode === "manual" && !force) return;

  const coords = getCoordinates();
  const birthTime = DOM.birthTime?.value || "06:00";

  if (coords) {
    try {
      showPanchangMessage(t("msg_computing"), "loading");

      await new Promise((r) => setTimeout(r, 10));

      const result = computeFullKundali(
        date, birthTime,
        coords.birthLat, coords.birthLon,
        coords.panchangLat, coords.panchangLon
      );

      if (result) {
        state.settings.panchangMode = "computed";
        hideManualPanchang();

        if (result._sunrise && DOM.sunrise) DOM.sunrise.value = result._sunrise;
        if (result._sunset && DOM.sunset) DOM.sunset.value = result._sunset;

        const selected = PANCHANG_LOCATIONS.find((l) => l.key === DOM.panchangPlace?.value);
        result.usedPanchang = selected
          ? {
              name: selected.name,
              distance: Math.round(haversineDistance(
                parseCoordinate(coords.birthLat), parseCoordinate(coords.birthLon),
                selected.lat, selected.lon
              )),
            }
          : result.nearestPanchang;

        if (!selected && result.nearestPanchang && DOM.panchangName) {
          DOM.panchangName.value = result.nearestPanchang.name
            + ` (${result.nearestPanchang.distance} km)`;
        }

        state.grahas = result.grahas;
        state.lagna = result.lagna;

        displayPanchang(result);
        return;
      }
    } catch (error) {
      console.warn("Kundali Computation Error:", error);
    }
  }

  state.settings.panchangMode = "manual";
  clearPanchangDetails();
  showPanchangMessage(t("msg_panchang_manual_hint"), "error");
  showManualPanchangButton();
  syncState();
}
