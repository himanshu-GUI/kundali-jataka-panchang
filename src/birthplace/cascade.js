import { DOM } from "../dom.js";
import { state, syncState } from "../state.js";
import { showMessage, clearMessage } from "../ui/helpers.js";
import { BIRTH_PLACE_DATA } from "./data.js";

export function clearSelect(element, placeholder) {
  if (!element) return;
  element.innerHTML = "";
  const option = document.createElement("option");
  option.value = "";
  option.textContent = placeholder;
  element.appendChild(option);
}

function clearBirthCoordinates() {
  if (DOM.birthLatitude) DOM.birthLatitude.value = "";
  if (DOM.birthLongitude) DOM.birthLongitude.value = "";
  clearMessage(DOM.birthPlaceMessage);
  state.birthPlace = { ...state.birthPlace, latitude: "", longitude: "" };
  syncState();
}

export function loadBirthStates(countryCode) {
  clearSelect(DOM.birthState, "— राज्य चुनें —");
  clearSelect(DOM.birthDistrict, "— जिला चुनें —");
  clearSelect(DOM.birthCity, "— शहर चुनें —");
  clearBirthCoordinates();

  const country = BIRTH_PLACE_DATA[countryCode];
  if (!country?.states) {
    state.birthPlace = {};
    syncState();
    return;
  }

  Object.entries(country.states).forEach(([code, data]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = data.name;
    DOM.birthState?.appendChild(option);
  });

  state.birthPlace = { country: countryCode, countryName: country.name };
  syncState();
}

export function loadBirthDistricts(countryCode, stateCode) {
  clearSelect(DOM.birthDistrict, "— जिला चुनें —");
  clearSelect(DOM.birthCity, "— शहर चुनें —");
  clearBirthCoordinates();

  const selectedState = BIRTH_PLACE_DATA[countryCode]?.states?.[stateCode];
  if (!selectedState?.districts) return;

  Object.entries(selectedState.districts).forEach(([code, data]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = data.name;
    DOM.birthDistrict?.appendChild(option);
  });

  state.birthPlace = {
    ...state.birthPlace,
    state: stateCode,
    stateName: selectedState.name,
  };
  syncState();
}

export function loadBirthCities(countryCode, stateCode, districtCode) {
  clearSelect(DOM.birthCity, "— शहर चुनें —");
  clearBirthCoordinates();

  const district =
    BIRTH_PLACE_DATA?.[countryCode]?.states?.[stateCode]?.districts?.[
      districtCode
    ];
  if (!district?.cities) return;

  Object.entries(district.cities).forEach(([code, data]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = data.name;
    DOM.birthCity?.appendChild(option);
  });

  state.birthPlace = {
    ...state.birthPlace,
    district: districtCode,
    districtName: district.name,
  };
  syncState();
}

export function loadBirthCoordinates(
  countryCode,
  stateCode,
  districtCode,
  cityCode
) {
  const city =
    BIRTH_PLACE_DATA?.[countryCode]?.states?.[stateCode]?.districts?.[
      districtCode
    ]?.cities?.[cityCode];

  if (!city) {
    clearBirthCoordinates();
    return;
  }

  if (DOM.birthLatitude) DOM.birthLatitude.value = city.latitude || "";
  if (DOM.birthLongitude) DOM.birthLongitude.value = city.longitude || "";

  state.birthPlace = {
    ...state.birthPlace,
    city: cityCode,
    cityName: city.name,
    latitude: city.latitude || "",
    longitude: city.longitude || "",
    specialPlace: DOM.birthSpecialPlace?.value.trim() || "",
  };
  syncState();

  showMessage(
    DOM.birthPlaceMessage,
    "जन्म स्थान के निर्देशांक स्वतः भर दिए गए हैं।",
    "success"
  );
}
