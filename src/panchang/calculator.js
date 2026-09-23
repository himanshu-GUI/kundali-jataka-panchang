/**
 * Local Panchang Calculation Engine
 * Uses fetched raw data + astronomical formulas to compute panchang
 * Implements all traditional calculations
 */

import { Astronomy } from "../astronomy/engine.js";
import { lahiriAyanamsa, toSidereal } from "../astronomy/ayanamsa.js";
import { RASHI_NAMES, NAKSHATRA_NAMES } from "../vedic/constants.js";
import { normalizeDegrees } from "../utils/angle.js";

/**
 * Calculate Tithi (Lunar Day)
 * Formula: tithi = ceil((moon_sid - sun_sid) / 12)
 * Range: 1-30 (Shukla 1-15, Krishna 16-30)
 * @param {number} sunSid - Sun's sidereal longitude
 * @param {number} moonSid - Moon's sidereal longitude
 * @returns {object} {tithi, name, paksha, day}
 */
export function computeTithi(sunSid, moonSid) {
  const moonSunDiff = normalizeDegrees(moonSid - sunSid);
  const tithi = Math.ceil(moonSunDiff / 12);
  const tithiActual = tithi === 0 ? 30 : tithi;

  const TITHI_NAMES_HI = [
    "प्रतिपदा",
    "द्वितीया",
    "तृतीया",
    "चतुर्थी",
    "पंचमी",
    "षष्ठी",
    "सप्तमी",
    "अष्टमी",
    "नवमी",
    "दशमी",
    "एकादशी",
    "द्वादशी",
    "त्रयोदशी",
    "चतुर्दशी",
    "पूर्णिमा",
  ];

  const paksha = tithiActual <= 15 ? "शुक्ल" : "कृष्ण";
  const day = tithiActual <= 15 ? tithiActual : tithiActual - 15;

  return {
    tithi: tithiActual,
    name: TITHI_NAMES_HI[day - 1],
    paksha,
    day,
    elongation: moonSunDiff,
  };
}

/**
 * Calculate Nakshatra (Lunar Mansion)
 * Formula: nakshatra = floor(moon_sid / 13.333)
 * Range: 0-26 (27 nakshatras)
 * @param {number} moonSid - Moon's sidereal longitude
 * @returns {object} {nakshatra, index, pada}
 */
export function computeNakshatra(moonSid) {
  const moonSidNorm = normalizeDegrees(moonSid);
  const nakshatraSpan = 360 / 27; // 13.333°
  const index = Math.floor(moonSidNorm / nakshatraSpan) % 27;
  const posInNak = moonSidNorm % nakshatraSpan;
  const pada = Math.floor((posInNak / nakshatraSpan) * 4) + 1;

  return {
    nakshatra: NAKSHATRA_NAMES[index],
    index,
    pada,
    longitude: moonSid,
    positionInNakshatra: posInNak,
  };
}

/**
 * Calculate Yoga (Combination)
 * Formula: yoga = floor((sun_sid + moon_sid) / 13.333)
 * Range: 0-26 (27 yogas)
 * @param {number} sunSid - Sun's sidereal longitude
 * @param {number} moonSid - Moon's sidereal longitude
 * @returns {object} {yoga, index, name}
 */
export function computeYoga(sunSid, moonSid) {
  const YOGA_NAMES_HI = [
    "विष्कुम्भ",
    "प्रीति",
    "आयुष्मान्",
    "सौभाग्य",
    "शोभन",
    "अतिगण्ड",
    "सुकर्म",
    "धृति",
    "शूल",
    "गण्ड",
    "वृद्धि",
    "ध्रुव",
    "व्यघात",
    "हर्षण",
    "वज्र",
    "सिद्धि",
    "व्यतीपात",
    "वरीयान्",
    "परिघ",
    "शिव",
    "सिद्ध",
    "साध्य",
    "शुभ",
    "शुक्ल",
    "ब्रह्म",
    "इन्द्र",
    "वैधृति",
  ];

  const sum = normalizeDegrees(sunSid + moonSid);
  const yogaSpan = 360 / 27; // 13.333°
  const index = Math.floor(sum / yogaSpan) % 27;

  return {
    yoga: YOGA_NAMES_HI[index],
    index,
    sum,
  };
}

/**
 * Calculate Karana (Half Tithi)
 * Formula: karana = floor(elongation / 6)
 * Range: 0-59, mapped to 7 rotating + 4 fixed
 * @param {number} sunSid - Sun's sidereal longitude
 * @param {number} moonSid - Moon's sidereal longitude
 * @returns {object} {karana, index, name}
 */
export function computeKarana(sunSid, moonSid) {
  const KARANA_NAMES_HI = [
    "किम्स्तुघ्न",
    "बव",
    "बालव",
    "कौलव",
    "तैतिल",
    "गर",
    "वणिज",
    "विष्टि",
    "शकुनि",
    "छत्र",
    "नाग",
    "किंस्तुघ्न",
  ];

  const moonSunDiff = normalizeDegrees(moonSid - sunSid);
  const karana = Math.floor(moonSunDiff / 6);

  // Karana cycles: 7 rotating in first 60°, then 4 fixed repeat
  const index = karana % 12;

  return {
    karana: KARANA_NAMES_HI[index],
    index,
    elongation: moonSunDiff,
  };
}

/**
 * Calculate Vara (Day of Week)
 * Based on weekday at sunrise
 * @param {Date} sunriseTime - Sunrise time as Date object
 * @returns {object} {vara, index, weekday}
 */
export function computeVara(sunriseTime) {
  const VARA_NAMES_HI = [
    "रविवार",
    "सोमवार",
    "मंगलवार",
    "बुधवार",
    "गुरुवार",
    "शुक्रवार",
    "शनिवार",
  ];

  // Handle undefined/null input
  if (!sunriseTime || typeof sunriseTime.getDay !== 'function') {
    // Fallback to current date's weekday
    sunriseTime = new Date();
  }

  const weekday = sunriseTime.getDay(); // 0 = Sunday
  return {
    vara: VARA_NAMES_HI[weekday],
    index: weekday,
    weekday,
  };
}

/**
 * Calculate Masa (Month in lunar calendar)
 * Based on sun's position and lunar month rules
 * @param {number} sunSid - Sun's sidereal longitude
 * @returns {object} {masa, name, index}
 */
export function computeMasa(sunSid) {
  const MASA_NAMES_HI = [
    "चैत्र",
    "वैशाख",
    "ज्येष्ठ",
    "आषाढ़",
    "श्रावण",
    "भाद्रपद",
    "आश्विन",
    "कार्तिक",
    "मार्गशीर्ष",
    "पौष",
    "माघ",
    "फाल्गुन",
  ];

  const sunSidNorm = normalizeDegrees(sunSid);
  const masaSpan = 360 / 12; // 30°
  const index = Math.floor(sunSidNorm / masaSpan) % 12;

  return {
    masa: MASA_NAMES_HI[index],
    index,
    degreesInMasa: sunSidNorm % masaSpan,
  };
}

/**
 * Calculate Ritu (Season)
 * 6 seasons in Hindu calendar
 * @param {number} sunSid - Sun's sidereal longitude
 * @returns {object} {ritu, name, index}
 */
export function computeRitu(sunSid) {
  const RITU_NAMES_HI = [
    "वसन्त",
    "ग्रीष्म",
    "वर्षा",
    "शरद्",
    "हेमन्त",
    "शिशिर",
  ];

  const sunSidNorm = normalizeDegrees(sunSid);
  const rituSpan = 360 / 6; // 60°
  const index = Math.floor(sunSidNorm / rituSpan) % 6;

  return {
    ritu: RITU_NAMES_HI[index],
    index,
    degreesInRitu: sunSidNorm % rituSpan,
  };
}

/**
 * Calculate Ayana (Half Year: Uttarayan/Dakshiyan)
 * Determined by sun's position relative to ecliptic
 * @param {number} sunSid - Sun's sidereal longitude
 * @returns {object} {ayana, name}
 */
export function computeAyana(sunSid) {
  const sunSidNorm = normalizeDegrees(sunSid);

  if (sunSidNorm >= 0 && sunSidNorm < 180) {
    return { ayana: "उत्तरायन", name: "Uttarayan (Northern)" };
  } else {
    return { ayana: "दक्षिणायन", name: "Dakshiyan (Southern)" };
  }
}

/**
 * Calculate Samvatsara (Year in 60-year Hindu cycle)
 * Repeats every 60 years
 * @param {number} year - Gregorian year
 * @returns {object} {samvatsara, index}
 */
export function computeSamvatsara(year) {
  const SAMVATSARA_NAMES_HI = [
    "प्रभव",
    "विभव",
    "शुक्ल",
    "प्रमोद",
    "प्रजापति",
    "अंगिरस",
    "श्रीमुख",
    "भव",
    "युवा",
    "धाता",
    "ईश्वर",
    "बहुधान्य",
    "पृथु",
    "विष्णु",
    "जय",
    "विजय",
    "ध्रुव",
    "ईश",
    "अनन्द",
    "राक्षस",
    "नल",
    "पिंगल",
    "काल",
    "सिद्धार्थ",
    "रौद्र",
    "दुर्मुख",
    "हेमलम्ब",
    "विलम्ब",
    "विकारी",
    "शार्वरी",
    "प्लव",
    "शुभकृत्",
    "शोभन",
    "क्रोध",
    "विश्वावसु",
    "पराभव",
    "प्लवंग",
    "कीलक",
    "सौम्य",
    "सादारण",
    "विरोधी",
    "विक्रिती",
    "खर",
    "नन्दन",
    "विजय",
    "जय",
    "मन्मथ",
    "दुर्मद",
    "हेमन्त",
    "पदम",
    "परिधावी",
    "प्रमादी",
    "अनिल",
    "राक्षस",
    "चञ्चल",
    "नर",
    "विजय",
    "सिद्धार्थ",
    "रौद्र",
  ];

  // Samvatsara repeats every 60 years, starting from a reference year
  const referenceYear = 1870; // Prabhav started in this year
  const cyclePosition = (year - referenceYear) % 60;
  const index = cyclePosition < 0 ? cyclePosition + 60 : cyclePosition;

  return {
    samvatsara: SAMVATSARA_NAMES_HI[index],
    index,
    cycleYear: index + 1,
  };
}

/**
 * Calculate Shaka Samvat (Shaka Era Year)
 * Shaka Era started in 78 CE
 * @param {number} year - Gregorian year
 * @returns {number}
 */
export function computeShakaSamvat(year) {
  return year - 78;
}

/**
 * Calculate Vikram Samvat (Vikram Era Year)
 * Vikram Era started in 57 BCE
 * @param {number} year - Gregorian year
 * @returns {number}
 */
export function computeVikramSamvat(year) {
  return year + 57;
}

/**
 * Compute complete panchang from raw astronomical data
 * @param {Date} date - Birth date/time
 * @param {number} lat - Birth latitude
 * @param {number} lon - Birth longitude
 * @returns {object}
 */
export function computeCompletePanchang(date, lat, lon) {
  try {
    // Validate inputs
    if (!date || !(date instanceof Date)) {
      throw new Error('Invalid date parameter');
    }
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      throw new Error('Invalid latitude/longitude');
    }

    // Get Sun and Moon positions
    const sunEcl = Astronomy.Ecliptic(Astronomy.GeoVector("Sun", date, true));
    const moonEcl = Astronomy.Ecliptic(Astronomy.GeoVector("Moon", date, true));

    if (!sunEcl || !moonEcl) {
      throw new Error('Failed to compute celestial positions');
    }

    const sunTropical = sunEcl.elon;
    const moonTropical = moonEcl.elon;

    // Convert to sidereal
    const aya = lahiriAyanamsa(date);
    const sunSid = toSidereal(sunTropical, aya);
    const moonSid = toSidereal(moonTropical, aya);

    // Compute all panchang elements
    const tithi = computeTithi(sunSid, moonSid);
    const nakshatra = computeNakshatra(moonSid);
    const yoga = computeYoga(sunSid, moonSid);
    const karana = computeKarana(sunSid, moonSid);

    // Compute sunrise for location
    const observer = new Astronomy.Observer(lat, lon, 0);
    const riseSet = Astronomy.SearchRiseSet("Sun", observer, +1, date, 1);
    const sunrise = riseSet ? riseSet.rise : date;

    const riseSetSunset = Astronomy.SearchRiseSet("Sun", observer, -1, date, 1);
    const sunset = riseSetSunset ? riseSetSunset.set : date;

    const vara = computeVara(sunrise);
    const masa = computeMasa(sunSid);
    const ritu = computeRitu(sunSid);
    const ayana = computeAyana(sunSid);

    const samvatsara = computeSamvatsara(date.getFullYear());
    const shakaSamvat = computeShakaSamvat(date.getFullYear());
    const vikramSamvat = computeVikramSamvat(date.getFullYear());

    const dateStr = date instanceof Date ? date.toISOString() : new Date().toISOString();
    const sunriseStr = sunrise instanceof Date ? sunrise.toISOString() : dateStr;
    const sunsetStr = sunset instanceof Date ? sunset.toISOString() : dateStr;

    return {
      date: dateStr,
      latitude: lat,
      longitude: lon,

      // Primary panchang elements
      tithi,
      nakshatra,
      yoga,
      karana,
      vara,

      // Secondary elements
      masa,
      ritu,
      ayana,

      // Era calendars
      samvatsara,
      shakaSamvat,
      vikramSamvat,

      // Times
      sunrise: sunriseStr,
      sunset: sunsetStr,

      // Positions
      sun: {
        tropical: sunTropical,
        sidereal: sunSid,
        ayanamsa: aya,
      },
      moon: {
        tropical: moonTropical,
        sidereal: moonSid,
        ayanamsa: aya,
      },

      computedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in computeCompletePanchang:', error);
    throw error;
  }
}

export const PanchangCalculator = {
  tithi: computeTithi,
  nakshatra: computeNakshatra,
  yoga: computeYoga,
  karana: computeKarana,
  vara: computeVara,
  masa: computeMasa,
  ritu: computeRitu,
  ayana: computeAyana,
  samvatsara: computeSamvatsara,
  shakaSamvat: computeShakaSamvat,
  vikramSamvat: computeVikramSamvat,
  complete: computeCompletePanchang,
};
