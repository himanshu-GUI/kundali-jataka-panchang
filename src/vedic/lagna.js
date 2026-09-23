import { lahiriAyanamsa, toSidereal } from "../astronomy/ayanamsa.js";
import { RASHI_NAMES, NAKSHATRA_NAMES } from "./constants.js";
import { dateToJulianDay, julianCenturies } from "../utils/date.js";
import { normalizeDegrees, degreesToRadians, radiansToDegrees } from "../utils/angle.js";
import { computeTraditionalKundali, formatRashiDMS } from "./traditional.js";
import { getPanchangData, getTraditionalConstants } from "./panchang-data.js";

// Inline nakshatra function to avoid import conflict
function getNakshatraForDeg(degDecimal) {
  const degNorm = normalizeDegrees(degDecimal);
  const span = 360 / 27;  // 13.333° per nakshatra
  const index = Math.floor(degNorm / span) % 27;
  const pada = Math.floor(((degNorm % span) / span) * 4) + 1;
  return { index, nakshatra: NAKSHATRA_NAMES[index], pada };
}

function lstToHours(date, lonDeg) {
  const jd = dateToJulianDay(date);
  const T = julianCenturies(date);
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T - (T * T * T) / 38710000;
  gmst = normalizeDegrees(gmst);
  return normalizeDegrees(gmst + lonDeg);
}

function obliquity(date) {
  const T = julianCenturies(date);
  return 23.439291 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
}

export function computeLagna(date, birthTime, lat, lon) {
  const [h, m] = birthTime.split(":").map(Number);
  const birthDate = new Date(date);
  birthDate.setHours(h, m, 0, 0);

  const lstDeg = lstToHours(birthDate, lon);
  const eps = degreesToRadians(obliquity(birthDate));
  const latRad = degreesToRadians(lat);
  const ramcRad = degreesToRadians(lstDeg);

  const y = Math.cos(ramcRad);
  const x = -(Math.sin(ramcRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps));
  const ascDeg = normalizeDegrees(radiansToDegrees(Math.atan2(y, x)));

  const aya = lahiriAyanamsa(birthDate);
  const lagnaS = toSidereal(ascDeg, aya);

  const rashiIndex = Math.floor(lagnaS / 30);
  const degInRashi = lagnaS - rashiIndex * 30;
  const d = Math.floor(degInRashi);
  const mFull = (degInRashi - d) * 60;
  const mi = Math.floor(mFull);
  const s = Math.round((mFull - mi) * 60);

  const nSpan = 360 / 27;
  const nakIndex = Math.floor(lagnaS / nSpan) % 27;
  const pada = Math.floor(((lagnaS % nSpan) / nSpan) * 4) + 1;

  return {
    tropical: ascDeg,
    sidereal: lagnaS,
    rashiIndex,
    rashi: RASHI_NAMES[rashiIndex],
    degrees: d,
    minutes: mi,
    seconds: s,
    nakshatra: NAKSHATRA_NAMES[nakIndex],
    nakshatraPada: pada,
    formatted: `${RASHI_NAMES[rashiIndex]} ${d}° ${mi}' ${s}"`,
  };
}

/**
 * Compute Lagna using Traditional Surya Siddhanta method (when panchang data available)
 */
export function computeLagnaTraditional(date, birthTime, lat, lon) {
  const panchangData = getPanchangData(date);
  if (!panchangData) {
    return null;  // Fall back to modern method if no panchang data
  }

  const birthData = { date, time: birthTime, lat, lon };
  const constants = getTraditionalConstants();

  try {
    const result = computeTraditionalKundali(birthData, panchangData, constants);
    const lagna = result.lagna;

    return {
      tropical: null,  // Not computed in traditional method
      sidereal: lagna.totalDeg,
      rashiIndex: lagna.rashiIndex,
      rashi: lagna.rashi,
      degrees: lagna.degrees,
      minutes: lagna.minutes,
      seconds: lagna.seconds,
      nakshatra: lagna.nakshatra,
      nakshatraPada: lagna.nakshatraPada,
      formatted: lagna.formatted,
    };
  } catch (e) {
    console.error("Traditional lagna computation failed:", e);
    return null;  // Fall back to modern method
  }
}
