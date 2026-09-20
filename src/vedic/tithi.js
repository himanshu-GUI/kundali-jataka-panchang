import { TITHI_NAMES } from "./constants.js";

export function computeTithi(moonSid, sunSid) {
  let elongation = moonSid - sunSid;
  if (elongation < 0) elongation += 360;
  const tithiIndex = Math.floor(elongation / 12);
  const fraction = (elongation % 12) / 12;
  return {
    index: tithiIndex,
    name: TITHI_NAMES[tithiIndex],
    fraction,
    elongation,
  };
}

export function tithiPaksha(tithiIndex) {
  return tithiIndex < 15 ? "शुक्ल" : "कृष्ण";
}
