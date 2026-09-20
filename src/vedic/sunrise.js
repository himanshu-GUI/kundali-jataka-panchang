import { makeObserver, searchSunrise, searchSunset } from "../astronomy/engine.js";

export function computeSunriseSunset(lat, lon, date) {
  const observer = makeObserver(lat, lon);
  const rise = searchSunrise(observer, date);
  const set = searchSunset(observer, date);
  return {
    sunrise: rise ? rise.date : null,
    sunset: set ? set.date : null,
  };
}

export function formatTimeHHMM(date) {
  if (!date) return "—";
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}
