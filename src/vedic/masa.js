import { MASA_NAMES, RITU_NAMES, SAMVATSARA_NAMES } from "./constants.js";

export function computeMasa(sunSid) {
  const rashiIndex = Math.floor(sunSid / 30);
  const masaIndex = rashiIndex;
  return { index: masaIndex, name: MASA_NAMES[masaIndex] };
}

export function computeRitu(masaIndex) {
  const rituIndex = Math.floor(masaIndex / 2);
  return { index: rituIndex, name: RITU_NAMES[rituIndex] };
}

export function computeAyana(sunSid) {
  return (sunSid >= 270 || sunSid < 90) ? "उत्तरायण" : "दक्षिणायन";
}

export function computeShakaSamvat(year, masaIndex) {
  const shakaYear = year - 78;
  return masaIndex < 1 ? String(shakaYear - 1) : String(shakaYear);
}

export function computeVikramSamvat(year, masaIndex) {
  const vikramYear = year + 57;
  return masaIndex < 1 ? String(vikramYear - 1) : String(vikramYear);
}

export function computeSamvatsara(year) {
  const shakaYear = year - 78;
  const index = ((shakaYear + 25) % 60 + 60) % 60;
  return SAMVATSARA_NAMES[index] || "";
}
