/**
 * Traditional Surya Siddhanta Vedic Calculations
 * Implements the classical panchang-based method decoded from CSV reference data
 */
import { RASHI_NAMES, NAKSHATRA_NAMES } from "./constants.js";
import { normalizeDegrees } from "../utils/angle.js";

// ============================================================
// UNIT CONVERSIONS
// ============================================================

export function hoursToGhatikas(hours) {
  return hours * 60 / 24;  // 1 day = 24 hours = 60 ghatikas
}

export function ghatikasToHours(gha) {
  return gha * 24 / 60;
}

export function dmsToDecimal(deg, min, sec = 0) {
  return deg + min / 60 + sec / 3600;
}

function decimalToDMS(decimal) {
  const d = Math.floor(decimal);
  const mFull = (decimal - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return { deg: d, min: m, sec: s };
}

// ============================================================
// TIME CORRECTIONS
// ============================================================

/**
 * Deshaantar (longitude-based time correction)
 * @param {number} birthLon - Birth longitude in degrees
 * @param {number} referenceLon - Reference longitude in degrees
 * @returns {number} Correction in hours (positive means birth is east, subtract from local time)
 */
export function computeDeshaantar(birthLon, referenceLon) {
  const degDiff = birthLon - referenceLon;
  const correctionMinutes = degDiff * 4;  // 1° = 4 minutes of time
  return correctionMinutes / 60;  // convert to hours
}

/**
 * Equation of Time (Velantar) - simplified approximation
 * For precise values, use astronomy tables or provide via panchang data
 * @param {Date} date - Birth date
 * @returns {number} Correction in hours (typically ±15 minutes)
 */
export function computeVelantar(date) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const B = (360 / 365.25) * (dayOfYear - 81) * Math.PI / 180;
  const eotMinutes = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  return eotMinutes / 60;  // convert to hours
}

/**
 * Shuddh Samay (Corrected Birth Time)
 * Formula: shuddh_samay = birth_time - deshaantar + velantar
 * @param {number} birthTimeHours - Birth time in 24h format (hours)
 * @param {number} deshaantarHours - Deshaantar correction (hours)
 * @param {number} velantarHours - Velantar/Equation of Time (hours)
 * @returns {number} Shuddh Samay in hours
 */
export function computeShudhSamay(birthTimeHours, deshaantarHours, velantarHours) {
  return birthTimeHours - deshaantarHours + velantarHours;
}

/**
 * Ishta Kaal (Time from Sunrise)
 * Formula: ishta_kaal = shuddh_samay - sunrise
 * @param {number} shudhSamayHours - Corrected birth time (hours)
 * @param {number} sunriseHours - Sunrise time (hours)
 * @returns {number} Elapsed time in ghatikas
 */
export function computeIshtaKaal(shudhSamayHours, sunriseHours) {
  const diffHours = shudhSamayHours - sunriseHours;
  return hoursToGhatikas(diffHours);
}

/**
 * Shodhak (Time Offset from Birth to Panchang Reference)
 * Formula: shodhak = time from shuddh_samay to panchang_sunrise (in ghatikas, negative)
 * @param {Date} shudhSamayDate - Corrected birth time as Date
 * @param {Date} panchangSunriseDate - Panchang sunrise as Date
 * @returns {number} Time difference in ghatikas (negative when panchang is after shuddh)
 */
export function computeShodhak(shudhSamayDate, panchangSunriseDate) {
  const diffMs = panchangSunriseDate.getTime() - shudhSamayDate.getTime();
  const diffHours = diffMs / 3600000;
  return -hoursToGhatikas(diffHours);  // negative because we go backward in time
}

// ============================================================
// PLANETARY CORRECTIONS
// ============================================================

/**
 * Doshaantar (Position Correction for Time Shift)
 * Formula: doshaantar = shodhak × asu_decimal / 60
 * @param {number} shodhakGha - Time offset in ghatikas
 * @param {number} asuDecimal - Daily motion of planet (degrees/day or relevant unit)
 * @returns {number} Position correction in degrees
 */
export function computeDoshaantar(shodhakGha, asuDecimal) {
  return shodhakGha * asuDecimal / 60;
}

/**
 * Sphashta (True Sidereal Position)
 * Formula for prograde: sphashta = panchang_position + doshaantar
 * Formula for retrograde: sphashta = panchang_position - doshaantar
 * @param {number} panchangPos - Panchang position in degrees
 * @param {number} doshaantar - Position correction in degrees
 * @param {boolean} isRetrograde - Whether planet is retrograde (Rahu/Ketu)
 * @returns {number} True position in degrees (0-360)
 */
export function computeSphashta(panchangPos, doshaantar, isRetrograde = false) {
  let sphashta;
  if (isRetrograde) {
    sphashta = panchangPos - doshaantar;  // reversed sign for retrograde
  } else {
    sphashta = panchangPos + doshaantar;
  }
  return normalizeDegrees(sphashta);
}

// ============================================================
// CHARA (ASCENSIONAL DIFFERENCE)
// ============================================================

/**
 * Interpolate Chara at given latitude
 * Chara varies with latitude; interpolate between two reference values
 * @param {number} latitude - Birth latitude in degrees
 * @param {number} chara29 - Chara value at 29° latitude
 * @param {number} chara30 - Chara value at 30° latitude
 * @returns {number} Interpolated chara value
 */
export function interpolateChara(latitude, chara29, chara30) {
  const latDeg = Math.floor(latitude);
  const latMin = (latitude - latDeg) * 60;
  if (latDeg === 29) {
    return chara29 + (chara30 - chara29) * (latMin / 60);
  }
  // For other latitudes, use linear extrapolation
  const charaDiff = chara30 - chara29;
  return chara29 + charaDiff * (latitude - 29);
}

/**
 * Dinmaan and Ratrimaan (Day and Night Duration)
 * Dinmaan = 30 + 2×chara_pala/60
 * Ratrimaan = 30 - 2×chara_pala/60
 * @param {number} charaPala - Chara value in pala units
 * @returns {object} {dinmaan, ratrimaan} in ghatikas
 */
export function computeDinRatrimaan(charaPala) {
  const dinmaan = 30 + 2 * charaPala / 60;
  const ratrimaan = 30 - 2 * charaPala / 60;
  return { dinmaan, ratrimaan };
}

// ============================================================
// LAGNA (ASCENDANT)
// ============================================================

/**
 * Compute Lagna using Traditional Method
 * Formula: lagna = (kalkhand × 60 + ishta_ansh) × 2/9
 * Where:
 *   kalkhand = number of completed nakshatras from 0° Aries
 *   ishta_ansh = position within current nakshatra (in asus, where 1 asu = 2/9°)
 *   2/9 converts asus to degrees
 * @param {number} kalkhand - Nakshatra count (0-26)
 * @param {number} bhyatGha - Elapsed time in current nakshatra (ghatikas)
 * @param {number} bhabhogGha - Total duration of current nakshatra (ghatikas)
 * @returns {number} Lagna in degrees (0-360)
 */
export function computeTraditionalLagna(kalkhand, bhyatGha, bhabhogGha) {
  if (bhabhogGha === 0) return kalkhand * (360 / 27);  // fallback

  const bhyatPala = Math.floor(bhyatGha * 60);
  const bhyatVipa = bhyatPala * 60;
  const bhabhogPala = bhabhogGha * 60;
  const ishtaAnsh = bhyatVipa / bhabhogPala;  // asus
  const totalAsus = kalkhand * 60 + ishtaAnsh;
  return totalAsus * 2 / 9;  // convert asus to degrees
}

// ============================================================
// FORMATTING
// ============================================================

/**
 * Format degree position as Rashi, Degree, Minute, Second
 * @param {number} degDecimal - Decimal degree value
 * @returns {object} {rashi, rashiIndex, deg, min, sec, formatted}
 */
export function formatRashiDMS(degDecimal) {
  const degNorm = normalizeDegrees(degDecimal);
  const rashiIndex = Math.floor(degNorm / 30);
  const degInRashi = degNorm - rashiIndex * 30;
  const dms = decimalToDMS(degInRashi);

  return {
    rashi: RASHI_NAMES[rashiIndex],
    rashiIndex,
    degrees: dms.deg,
    minutes: dms.min,
    seconds: dms.sec,
    totalDeg: degNorm,
    formatted: `${rashiIndex + 1} ${RASHI_NAMES[rashiIndex]} ${dms.deg}°${dms.min}'${dms.sec}"`
  };
}

/**
 * Get Nakshatra for given degree
 * @param {number} degDecimal - Sidereal degree value
 * @returns {object} {nakshatraIndex, nakshatra, pada}
 */
export function getNakshatraForDeg(degDecimal) {
  const degNorm = normalizeDegrees(degDecimal);
  const span = 360 / 27;  // 13.333° per nakshatra
  const index = Math.floor(degNorm / span) % 27;
  const pada = Math.floor(((degNorm % span) / span) * 4) + 1;
  return { index, nakshatra: NAKSHATRA_NAMES[index], pada };
}

// ============================================================
// COMPLETE KUNDALI COMPUTATION (Traditional Method)
// ============================================================

/**
 * Compute all planetary positions using Traditional Surya Siddhanta method
 * @param {object} birthData - {date, time, lat, lon} - Birth details
 * @param {object} panchangData - {positions, asus, sunrise, dates} - Panchang reference data
 * @param {object} constants - {ujjainLon, ayanamsha, charaTable} - Fixed constants
 * @returns {object} Complete kundali with all positions
 */
export function computeTraditionalKundali(birthData, panchangData, constants) {
  const { date, time, lat, lon } = birthData;
  const { standardMeridian, ayanamsha } = constants;

  // Parse birth time
  const [birthHour, birthMin] = time.split(':').map(Number);
  const birthTimeHours = birthHour + birthMin / 60;

  // Create Date objects for calculations
  const [y, m, d] = date.split('-').map(Number);
  const birthDate = new Date(y, m - 1, d, birthHour, birthMin, 0);

  // Time corrections
  // Clock time is IST; local mean time = IST − (82.5° − lon) × 4 min
  const deshaantar = computeDeshaantar(standardMeridian, lon);
  const velantar = panchangData.velantar || computeVelantar(birthDate);
  const shudhSamay = computeShudhSamay(birthTimeHours, deshaantar, velantar);

  const shudhDate = new Date(new Date(y, m - 1, d).getTime() + shudhSamay * 3600000);

  // Panchang reference date (typically 2-3 days after birth)
  const panchangDate = panchangData.sunriseDate;
  const shodhak = computeShodhak(shudhDate, panchangDate);

  // Ishta kaal
  const sunriseHours = panchangData.sunriseDate.getHours() + panchangData.sunriseDate.getMinutes() / 60;
  const ishtaKaal = computeIshtaKaal(shudhSamay, sunriseHours);

  // Panchang columns: Su Mo Ma Me Ju Ve Sa Ra. Budh is omitted because its panchang
  // value is unreliable; callers fill missing grahas from the modern ephemeris.
  const grahas = {};
  const planets = [
    { key: 'surya', name: 'सूर्य', nameEn: 'Sun', panchangIdx: 0 },
    { key: 'chandra', name: 'चन्द्र', nameEn: 'Moon', panchangIdx: 1 },
    { key: 'mangal', name: 'मंगल', nameEn: 'Mars', panchangIdx: 2 },
    { key: 'guru', name: 'गुरु', nameEn: 'Jupiter', panchangIdx: 4 },
    { key: 'shukra', name: 'शुक्र', nameEn: 'Venus', panchangIdx: 5 },
    { key: 'shani', name: 'शनि', nameEn: 'Saturn', panchangIdx: 6 },
    { key: 'rahu', name: 'राहु', nameEn: 'Rahu', panchangIdx: 7, retrograde: true },
  ];

  const toGraha = (planet, sphashta, retrograde) => {
    const position = formatRashiDMS(sphashta);
    const nakshatraData = getNakshatraForDeg(sphashta);
    return {
      key: planet.key,
      name: planet.name,
      nameEn: planet.nameEn,
      sidereal: sphashta,
      ayanamsha: ayanamsha,
      rashi: position.rashi,
      rashiIndex: position.rashiIndex,
      degrees: position.degrees,
      minutes: position.minutes,
      seconds: position.seconds,
      totalDeg: position.totalDeg,
      formatted: position.formatted,
      nakshatra: nakshatraData.nakshatra,
      nakshatraPada: nakshatraData.pada,
      nakshatraIndex: nakshatraData.index,
      retrograde,
    };
  };

  for (const planet of planets) {
    const panchangPos = panchangData.positions[planet.panchangIdx];
    if (panchangPos === undefined || panchangPos === null) continue;

    const retrograde = planet.retrograde ?? Boolean(panchangData.retrograde?.[planet.panchangIdx]);
    const asu = panchangData.asus[planet.panchangIdx] || 0;
    const doshaantar = computeDoshaantar(shodhak, asu);
    const sphashta = computeSphashta(panchangPos, doshaantar, retrograde);
    grahas[planet.key] = toGraha(planet, sphashta, retrograde);
  }

  if (grahas.rahu) {
    const ketu = { key: 'ketu', name: 'केतु', nameEn: 'Ketu' };
    grahas.ketu = toGraha(ketu, normalizeDegrees(grahas.rahu.sidereal + 180), true);
  }

  // Lagna computation
  const lagnaRaw = computeTraditionalLagna(
    panchangData.lagna.kalkhand,
    panchangData.lagna.bhyat,
    panchangData.lagna.bhabhog
  );

  const lagnaPosition = formatRashiDMS(lagnaRaw);
  const lagnaNakshatra = getNakshatraForDeg(lagnaRaw);

  const lagna = {
    sidereal: lagnaRaw,
    rashi: lagnaPosition.rashi,
    rashiIndex: lagnaPosition.rashiIndex,
    degrees: lagnaPosition.degrees,
    minutes: lagnaPosition.minutes,
    seconds: lagnaPosition.seconds,
    totalDeg: lagnaPosition.totalDeg,
    formatted: lagnaPosition.formatted,
    nakshatra: lagnaNakshatra.nakshatra,
    nakshatraPada: lagnaNakshatra.pada,
    nakshatraIndex: lagnaNakshatra.index,
  };

  return {
    grahas,
    lagna,
    computed: {
      shudhSamay,
      ishtaKaal,
      shodhak,
      deshaantar,
      velantar,
      ayanamsha,
    }
  };
}
