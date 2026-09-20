import { julianCenturies } from "../utils/date.js";

export function lahiriAyanamsa(date) {
  const T = julianCenturies(date);
  return 23.85 + T * 1.395;
}

export function toSidereal(tropicalLon, ayanamsa) {
  let sid = tropicalLon - ayanamsa;
  if (sid < 0) sid += 360;
  if (sid >= 360) sid -= 360;
  return sid;
}
