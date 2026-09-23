import { sunLongitude, moonLongitude } from "../astronomy/engine.js";
import { lahiriAyanamsa, toSidereal } from "../astronomy/ayanamsa.js";
import { computeTithi, tithiPaksha } from "../vedic/tithi.js";
import { computeNakshatra, getPreviousNakshatra, getNextNakshatra } from "../vedic/nakshatra.js";
import { computeYoga } from "../vedic/yoga.js";
import { computeKarana } from "../vedic/karana.js";
import { computeVara } from "../vedic/vara.js";
import {
  computeMasa, computeRitu, computeAyana,
  computeShakaSamvat, computeVikramSamvat, computeSamvatsara,
} from "../vedic/masa.js";
import { computeSunriseSunset, formatTimeHHMM } from "../vedic/sunrise.js";
import { computeGrahaSphut, GRAHA_ORDER, computeGrahaTraditional } from "../vedic/graha.js";
import { computeLagna, computeLagnaTraditional } from "../vedic/lagna.js";
import { findNearestPanchang } from "./auto-select.js";
import { parseCoordinate } from "../utils/coordinates.js";

function timeToGhatiPal(hours) {
  const totalGhati = (hours / 24) * 60;
  const ghati = Math.floor(totalGhati);
  const pal = Math.round((totalGhati - ghati) * 60);
  return { ghati, pal };
}

function remainingGhatiPal(fraction, dayLengthHours) {
  const remainingHours = fraction * dayLengthHours;
  return timeToGhatiPal(remainingHours);
}

function formatEndTime(date) {
  if (!date) return "—";
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const dd = date.getDate().toString().padStart(2, "0");
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const yy = date.getFullYear();
  return `${h12.toString().padStart(2, "0")}:${m} ${ampm}, ${dd}-${mm}-${yy}`;
}

function findAngEnd(computeFn, currentIndex, startDate, stepHours, maxHours, sunSid, isSunDependent) {
  const step = stepHours * 3600000;
  const maxSteps = Math.ceil(maxHours / stepHours);
  let t = new Date(startDate.getTime());
  for (let i = 0; i < maxSteps; i++) {
    t = new Date(t.getTime() + step);
    const aya = lahiriAyanamsa(t);
    const moonSid = toSidereal(moonLongitude(t), aya);
    let result;
    if (isSunDependent) {
      const sS = toSidereal(sunLongitude(t), aya);
      result = computeFn(moonSid, sS);
    } else {
      result = computeFn(moonSid);
    }
    if (result.index !== currentIndex) return t;
  }
  return null;
}

export { parseCoordinate } from "../utils/coordinates.js";

export function computeFullKundali(dateStr, birthTime, birthLatStr, birthLonStr, panchangLatStr, panchangLonStr) {
  const birthLat = parseCoordinate(birthLatStr);
  const birthLon = parseCoordinate(birthLonStr);
  if (birthLat === null || birthLon === null) return null;

  const pLat = parseCoordinate(panchangLatStr);
  const pLon = parseCoordinate(panchangLonStr);
  const panchangLat = pLat !== null ? pLat : birthLat;
  const panchangLon = pLon !== null ? pLon : birthLon;

  const nearest = findNearestPanchang(birthLat, birthLon);

  const [y, mo, da] = dateStr.split("-").map(Number);
  const [h, mi] = (birthTime || "06:00").split(":").map(Number);
  const birthDate = new Date(y, mo - 1, da, h, mi, 0);

  // Try traditional method first (when panchang data available), fall back to modern
  let grahas = computeGrahaTraditional(dateStr, birthTime || "06:00", birthLat, birthLon);
  if (!grahas) {
    grahas = computeGrahaSphut(birthDate);
  }

  let lagna = computeLagnaTraditional(dateStr, birthTime || "06:00", birthLat, birthLon);
  if (!lagna) {
    lagna = computeLagna(dateStr, birthTime || "06:00", birthLat, birthLon);
  }

  const panchang = computePanchang(dateStr, String(panchangLat), String(panchangLon));
  if (!panchang) return null;

  return {
    ...panchang,
    grahas,
    lagna,
    nearestPanchang: nearest,
    birthCoords: { lat: birthLat, lon: birthLon },
    panchangCoords: { lat: panchangLat, lon: panchangLon },
  };
}

export function computePanchang(dateStr, latStr, lonStr) {
  const lat = parseCoordinate(latStr);
  const lon = parseCoordinate(lonStr);
  if (lat === null || lon === null) return null;

  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d, 6, 0, 0);

  const { sunrise, sunset } = computeSunriseSunset(lat, lon, new Date(y, m - 1, d, 0, 0, 0));
  const sunriseDate = sunrise || new Date(y, m - 1, d, 6, 0, 0);
  const sunsetDate = sunset || new Date(y, m - 1, d, 18, 0, 0);
  const dayLengthMs = sunsetDate.getTime() - sunriseDate.getTime();
  const dayLengthHours = dayLengthMs / 3600000;

  const aya = lahiriAyanamsa(sunriseDate);
  const sunTrop = sunLongitude(sunriseDate);
  const moonTrop = moonLongitude(sunriseDate);
  const sunSid = toSidereal(sunTrop, aya);
  const moonSid = toSidereal(moonTrop, aya);

  const tithi = computeTithi(moonSid, sunSid);
  const tithiEnd = findAngEnd(
    (mS, sS) => computeTithi(mS, sS),
    tithi.index, sunriseDate, 0.5, 48, sunSid, true
  );

  const nextTithiIndex = (tithi.index + 1) % 30;
  const nextTithiEnd = tithiEnd
    ? findAngEnd((mS, sS) => computeTithi(mS, sS), nextTithiIndex, tithiEnd, 0.5, 48, sunSid, true)
    : null;

  const nakshatra = computeNakshatra(moonSid);
  const prev = getPreviousNakshatra(nakshatra.index);
  const next = getNextNakshatra(nakshatra.index);

  const nakshatraEnd = findAngEnd(
    (mS) => computeNakshatra(mS),
    nakshatra.index, sunriseDate, 0.5, 48, null, false
  );
  const nakshatraRemainHrs = nakshatraEnd
    ? (nakshatraEnd.getTime() - sunriseDate.getTime()) / 3600000
    : dayLengthHours;
  const currentNakGP = timeToGhatiPal(nakshatraRemainHrs);

  const prevNakEnd = sunriseDate;
  const prevNakGP = timeToGhatiPal(dayLengthHours * (1 - nakshatra.fraction));

  const nextNakStart = nakshatraEnd || sunsetDate;
  const nextNakEnd = findAngEnd(
    (mS) => computeNakshatra(mS),
    next.index, nextNakStart, 0.5, 48, null, false
  );
  const nextNakHrs = nextNakEnd
    ? (nextNakEnd.getTime() - nextNakStart.getTime()) / 3600000
    : 13;
  const nextNakGP = timeToGhatiPal(nextNakHrs);

  const yoga = computeYoga(sunSid, moonSid);
  const yogaEnd = findAngEnd(
    (mS, sS) => computeYoga(sS, mS),
    yoga.index, sunriseDate, 0.5, 48, sunSid, true
  );
  const yogaHrs = yogaEnd
    ? (yogaEnd.getTime() - sunriseDate.getTime()) / 3600000
    : dayLengthHours;
  const yogaGP = timeToGhatiPal(yogaHrs);

  const karana = computeKarana(moonSid, sunSid);
  const karanaEnd = findAngEnd(
    (mS, sS) => computeKarana(mS, sS),
    karana.index, sunriseDate, 0.25, 24, sunSid, true
  );
  const karanaHrs = karanaEnd
    ? (karanaEnd.getTime() - sunriseDate.getTime()) / 3600000
    : dayLengthHours / 2;
  const karanaGP = timeToGhatiPal(karanaHrs);

  const vara = computeVara(new Date(y, m - 1, d));
  const varaGP = timeToGhatiPal(dayLengthHours);

  const paksha = tithiPaksha(tithi.index);
  const masa = computeMasa(sunSid);
  const ritu = computeRitu(masa.index);
  const ayana = computeAyana(sunSid);
  const shakaSamvat = computeShakaSamvat(y, masa.index);
  const vikramSamvat = computeVikramSamvat(y, masa.index);
  const samvatsara = computeSamvatsara(y);

  const tithiList = [{ name: tithi.name, endTime: formatEndTime(tithiEnd) }];
  if (nextTithiEnd) {
    const nextTithiName = computeTithi(
      toSidereal(moonLongitude(tithiEnd || sunriseDate), lahiriAyanamsa(tithiEnd || sunriseDate)),
      toSidereal(sunLongitude(tithiEnd || sunriseDate), lahiriAyanamsa(tithiEnd || sunriseDate))
    ).name;
    if (nextTithiEnd.getTime() < sunsetDate.getTime() + 43200000) {
      tithiList.push({ name: nextTithiName, endTime: formatEndTime(nextTithiEnd) });
    }
  }

  return {
    shakaSamvat,
    vikramSamvat,
    samvatsara,
    ayana,
    gola: "",
    ritu: ritu.name,
    masa: masa.name,
    masaNote: masa.name,
    paksha,
    tithi: tithiList,
    vara: { name: vara.name, ...varaGP },
    previousNakshatra: { name: prev.name, ...prevNakGP },
    currentNakshatra: { name: nakshatra.name, ...currentNakGP },
    nextNakshatra: { name: next.name, ...nextNakGP },
    yoga: { name: yoga.name, ...yogaGP },
    karana: { name: karana.name, ...karanaGP },
    _computed: true,
    _sunrise: formatTimeHHMM(sunriseDate),
    _sunset: formatTimeHHMM(sunsetDate),
    _lat: lat,
    _lon: lon,
  };
}
