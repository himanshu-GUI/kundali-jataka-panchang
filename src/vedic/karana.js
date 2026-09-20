import { KARANA_NAMES, KARANA_FIXED } from "./constants.js";

export function computeKarana(moonSid, sunSid) {
  let elongation = moonSid - sunSid;
  if (elongation < 0) elongation += 360;
  const karanaNum = Math.floor(elongation / 6);
  let name;
  if (karanaNum === 0) {
    name = KARANA_FIXED[3];
  } else if (karanaNum >= 57) {
    name = KARANA_FIXED[karanaNum - 57];
  } else {
    name = KARANA_NAMES[(karanaNum - 1) % 7];
  }
  const fraction = (elongation % 6) / 6;
  return { index: karanaNum, name, fraction };
}
