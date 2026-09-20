import { CITIES } from "./cities.js";
import { DOM } from "../dom.js";
import { state, syncState } from "../state.js";
import { showMessage } from "../ui/helpers.js";
import { t } from "../i18n/runtime.js";

const IDX_HI = 0, IDX_EN = 1, IDX_LAT = 2, IDX_LON = 3, IDX_STATE = 4, IDX_CC = 5, IDX_TZ = 6;

let searchInput = null;
let dropdown = null;
let selectedIndex = -1;
let results = [];

function normalize(str) {
  return str.toLowerCase().replace(/[\s\-\.]+/g, "");
}

function searchCities(query) {
  if (!query || query.length < 2) return [];
  const q = normalize(query);
  const matches = [];
  for (const city of CITIES) {
    const hiNorm = normalize(city[IDX_HI]);
    const enNorm = normalize(city[IDX_EN]);
    if (hiNorm.includes(q) || enNorm.includes(q)) {
      matches.push(city);
      if (matches.length >= 10) break;
    }
  }
  return matches;
}

function formatCity(city) {
  return `${city[IDX_HI]} (${city[IDX_EN]}), ${city[IDX_STATE]}, ${city[IDX_CC]}`;
}

function renderDropdown(items) {
  if (!dropdown) return;
  dropdown.innerHTML = "";
  selectedIndex = -1;
  results = items;

  if (items.length === 0) {
    dropdown.hidden = true;
    return;
  }

  items.forEach((city, i) => {
    const div = document.createElement("div");
    div.className = "city-search-option";
    div.textContent = formatCity(city);
    div.dataset.index = i;
    div.addEventListener("mousedown", (e) => {
      e.preventDefault();
      selectCity(city);
    });
    dropdown.appendChild(div);
  });

  dropdown.hidden = false;
}

function highlightOption(idx) {
  const options = dropdown.querySelectorAll(".city-search-option");
  options.forEach((o, i) => o.classList.toggle("active", i === idx));
  selectedIndex = idx;
}

function selectCity(city) {
  searchInput.value = formatCity(city);
  dropdown.hidden = true;
  results = [];

  const lat = city[IDX_LAT];
  const lon = city[IDX_LON];

  if (DOM.birthLatitude) DOM.birthLatitude.value = lat.toFixed(4);
  if (DOM.birthLongitude) DOM.birthLongitude.value = lon.toFixed(4);

  state.birthPlace = {
    city: city[IDX_EN],
    cityName: city[IDX_HI],
    state: city[IDX_STATE],
    country: city[IDX_CC],
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    timezone: city[IDX_TZ],
    specialPlace: DOM.birthSpecialPlace?.value.trim() || "",
  };
  syncState();

  showMessage(DOM.birthPlaceMessage, t("msg_birthplace_ready"), "success");
}

export function initCitySearch() {
  const container = document.getElementById("citySearchContainer");
  if (!container) return;

  searchInput = document.getElementById("citySearchInput");
  dropdown = document.getElementById("citySearchDropdown");
  if (!searchInput || !dropdown) return;

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim();
    const items = searchCities(q);
    renderDropdown(items);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      highlightOption(Math.min(selectedIndex + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      highlightOption(Math.max(selectedIndex - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      selectCity(results[selectedIndex]);
    } else if (e.key === "Escape") {
      dropdown.hidden = true;
    }
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => { dropdown.hidden = true; }, 150);
  });

  searchInput.addEventListener("focus", () => {
    if (results.length > 0) dropdown.hidden = false;
  });
}
