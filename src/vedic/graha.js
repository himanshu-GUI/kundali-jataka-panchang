import { Astronomy } from "../astronomy/engine.js";
import { lahiriAyanamsa, toSidereal } from "../astronomy/ayanamsa.js";
import { RASHI_NAMES, NAKSHATRA_NAMES } from "./constants.js";
import { julianCenturies } from "../utils/date.js";
import { normalizeDegrees } from "../utils/angle.js";

const GRAHA_BODIES = [
  { key: "surya", name: "सूर्य", nameEn: "Sun", body: Astronomy.Body.Sun },
  { key: "chandra", name: "चन्द्र", nameEn: "Moon", body: Astronomy.Body.Moon },
  { key: "mangal", name: "मंगल", nameEn: "Mars", body: Astronomy.Body.Mars },
  { key: "budh", name: "बुध", nameEn: "Mercury", body: Astronomy.Body.Mercury },
  { key: "guru", name: "गुरु", nameEn: "Jupiter", body: Astronomy.Body.Jupiter },
  { key: "shukra", name: "शुक्र", nameEn: "Venus", body: Astronomy.Body.Venus },
  { key: "shani", name: "शनि", nameEn: "Saturn", body: Astronomy.Body.Saturn },
];

function getTropicalLongitude(body, date) {
  const ecl = Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true));
  return ecl.elon;
}

function meanLunarNodeLongitude(date) {
  const T = julianCenturies(date);
  const omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000;
  return normalizeDegrees(omega);
}

function degreesToDMS(deg) {
  const d = Math.floor(deg);
  const mFull = (deg - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return { degrees: d, minutes: m, seconds: s };
}

function formatRashiPosition(siderealDeg) {
  const rashiIndex = Math.floor(siderealDeg / 30);
  const degInRashi = siderealDeg - rashiIndex * 30;
  const dms = degreesToDMS(degInRashi);
  return {
    rashiIndex,
    rashi: RASHI_NAMES[rashiIndex],
    degrees: dms.degrees,
    minutes: dms.minutes,
    seconds: dms.seconds,
    totalDeg: siderealDeg,
    formatted: `${rashiIndex + 1} राशि ${dms.degrees}° ${dms.minutes}' ${dms.seconds}"`,
  };
}

function getNakshatraForDeg(siderealDeg) {
  const span = 360 / 27;
  const index = Math.floor(siderealDeg / span) % 27;
  const pada = Math.floor(((siderealDeg % span) / span) * 4) + 1;
  return { index, name: NAKSHATRA_NAMES[index], pada };
}

function isRetrograde(body, date) {
  const dt = 0.5;
  const before = new Date(date.getTime() - dt * 86400000);
  const after = new Date(date.getTime() + dt * 86400000);
  const lonBefore = getTropicalLongitude(body, before);
  const lonAfter = getTropicalLongitude(body, after);
  let diff = lonAfter - lonBefore;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

export function computeGrahaSphut(date) {
  const aya = lahiriAyanamsa(date);
  const grahas = {};

  for (const g of GRAHA_BODIES) {
    const tropical = getTropicalLongitude(g.body, date);
    const sidereal = toSidereal(tropical, aya);
    const position = formatRashiPosition(sidereal);
    const nakshatra = getNakshatraForDeg(sidereal);
    const retro = g.key !== "surya" && g.key !== "chandra" ? isRetrograde(g.body, date) : false;

    grahas[g.key] = {
      key: g.key,
      name: g.name,
      nameEn: g.nameEn,
      tropical,
      sidereal,
      ayanamsa: aya,
      ...position,
      nakshatra: nakshatra.name,
      nakshatraPada: nakshatra.pada,
      nakshatraIndex: nakshatra.index,
      retrograde: retro,
    };
  }

  const rahuTropical = meanLunarNodeLongitude(date);
  const rahuSidereal = toSidereal(rahuTropical, aya);
  const rahuPos = formatRashiPosition(rahuSidereal);
  const rahuNak = getNakshatraForDeg(rahuSidereal);
  grahas.rahu = {
    key: "rahu",
    name: "राहु",
    nameEn: "Rahu",
    tropical: rahuTropical,
    sidereal: rahuSidereal,
    ayanamsa: aya,
    ...rahuPos,
    nakshatra: rahuNak.name,
    nakshatraPada: rahuNak.pada,
    nakshatraIndex: rahuNak.index,
    retrograde: true,
  };

  let ketuSidereal = rahuSidereal + 180;
  if (ketuSidereal >= 360) ketuSidereal -= 360;
  const ketuPos = formatRashiPosition(ketuSidereal);
  const ketuNak = getNakshatraForDeg(ketuSidereal);
  grahas.ketu = {
    key: "ketu",
    name: "केतु",
    nameEn: "Ketu",
    tropical: (rahuTropical + 180) % 360,
    sidereal: ketuSidereal,
    ayanamsa: aya,
    ...ketuPos,
    nakshatra: ketuNak.name,
    nakshatraPada: ketuNak.pada,
    nakshatraIndex: ketuNak.index,
    retrograde: true,
  };

  return grahas;
}

export function computeGrahaAtLocation(date, birthTime, lat, lon) {
  const [h, m] = birthTime.split(":").map(Number);
  const birthDate = new Date(date);
  birthDate.setHours(h, m, 0, 0);
  return computeGrahaSphut(birthDate);
}

export const GRAHA_ORDER = [
  "surya", "chandra", "mangal", "budh", "guru", "shukra", "shani", "rahu", "ketu",
];
