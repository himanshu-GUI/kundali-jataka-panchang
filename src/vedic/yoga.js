import { YOGA_NAMES } from "./constants.js";

const YOGA_SPAN = 360 / 27;

export function computeYoga(sunSid, moonSid) {
  let combined = sunSid + moonSid;
  if (combined >= 360) combined -= 360;
  const index = Math.floor(combined / YOGA_SPAN);
  const fraction = (combined % YOGA_SPAN) / YOGA_SPAN;
  return {
    index: index % 27,
    name: YOGA_NAMES[index % 27],
    fraction,
  };
}
