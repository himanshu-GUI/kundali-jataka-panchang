import { VARA_NAMES } from "./constants.js";

export function computeVara(date) {
  const day = date.getDay();
  return { index: day, name: VARA_NAMES[day] };
}
