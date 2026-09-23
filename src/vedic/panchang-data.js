/**
 * Traditional Panchang Reference Data
 * Extracted from the Daksh Bhatt demo birth kundali CSV
 * Date: 25-Jul-2024, 6:10 PM IST, 29°20'N, 80°06'E
 * Panchang reference date: 28-Jul-2024 5:25:52 AM
 */

/**
 * Panchang data for Jul 28, 2024 (demo birth reference)
 * All values derived from the demo CSV file
 */
export const PANCHANG_JUL28_2024 = {
  // Panchang reference date and sunrise
  date: "2024-07-28",
  sunriseTime: "5:25:52 AM",  // R44[11]
  sunriseDate: new Date(2024, 6, 28, 5, 25, 52),

  // Planet positions at panchang reference (degrees, sidereal)
  positions: [
    101.2225,    // 0: Surya (Sun) — 3 rashi 11°13'21"
    40.7075,     // 1: Chandra (Moon) — 1 rashi 10°42'27"
    127.2128,    // 2: Mangal (Mars) — 4 rashi 7°12'46"
    9.674,       // 3: Budh (Mercury) — 0 rashi 9°40'25" [UNRELIABLE]
    49.4742,     // 4: Guru (Jupiter) — 1 rashi 19°28'27"
    115.8517,    // 5: Shukra (Venus) — 3 rashi 25°51'6"
    324.5856,    // 6: Shani (Saturn, retrograde) — 10 rashi 24°35'8"
    345.6117,    // 7: Rahu — 11 rashi 15°36'42" (Ketu = Rahu + 180°)
  ],

  retrograde: [false, false, false, false, false, false, true, true],

  // Daily motion (asu values from R22, Decimal row)
  asus: [
    0.955833333,  // 0: Surya — 57'21"
    0.681388889,  // 1: Chandra — 40'53"
    0.591388889,  // 2: Mangal — 35'29"
    13.8875,      // 3: Budh — 833'15" [SUSPICIOUS - not used]
    0.183888889,  // 4: Guru — 11'2"
    1.228333333,  // 5: Shukra — 73'42"
    0.045,        // 6: Shani — 2'42"
    0.053055556,  // 7: Rahu — 3'11"
  ],

  // Equation of Time (Velantar)
  // From R59[11]: -06:18 = -6 minutes 18 seconds
  velantar: -6.3 / 60,  // in hours (-6m18s ≈ -0.105 hours)

  // Lagna parameters
  // From R44[6], R46[6], R48[6] — bhyat, bhabhog computed values
  lagna: {
    kalkhand: 25,        // R69[6] — completed nakshatras
    bhyat: 4.793055556,  // R44[6] — elapsed time in current nakshatra (ghatikas)
    bhabhog: 55.5,       // R46[6] — nakshatra transit duration (ghatikas)
    // Final computed: 334.4824691° (11 rashi 4°28'57")
  },

  // Chara Khanda (for latitude 29°20'N)
  chara: {
    value_deg29: 6 + 39/60 + 6/3600,     // R06[7]: 6°39'6" = 6.6683°
    value_deg30: 6 + 55/60 + 41/3600,    // R07[7]: 6°55'41" = 6.9281°
    interpolated: 6 + 44/60 + 38/3600,   // R22[7]: 6°44'38" = 6.7439°
    charaPala: 113,                       // R20[11] — chara in pala units
  },

  // Dinmaan and Ratrimaan (day and night length)
  dinmaan: 33.76,       // R25[11] — 33.76 ghatikas
  ratrimaan: 26.24,     // R27[11] — 26.24 ghatikas
  mishramaan: 46.88,    // R23[11] — mean of day and night

  // Equatorial rising times and corrections (Chara Khanda table)
  // Base equatorial rising times (prana per sign pair, at equator)
  equatorialRising: [278, 299, 323, 323, 299, 278],  // R31-R36[6]

  // Chara corrections per sign (prana)
  charaCorrections: [-67, -53, -22, 22, 53, 67],     // R31-R36[7]

  // Corrected rising times (12 signs)
  // Computed: 211, 246, 301, 345, 352, 345, 345, 352, 345, 301, 246, 211
  correctedRisingTimes: [211, 246, 301, 345, 352, 345, 345, 352, 345, 301, 246, 211],

  // Ayanamsha
  ayanamsha: 24.2008,   // R41[7]: 24°12'3"

  // Shuddh Samay (corrected birth time from birth to panchang reference)
  shudhSamay: 17 + 54/60 + 6/3600,  // R60[11]: 5:54:06 PM = 17.9017 hours

  // Shodhak (time interval from shuddh samay to panchang sunrise in ghatikas)
  // From shuddh 17:54:06 on Jul 25 to panchang sunrise 5:25:52 on Jul 28
  // = 2 days + 11:31:46 = 148.8236 ghatikas (stored negative)
  shodhak: -148.8236111,  // R38[14]

  // Sphashta (true sidereal positions) - FINAL COMPUTED VALUES
  // These are the reference values for verification
  sphashta: {
    surya: 98.8516572,     // R41[14] — Sun
    chandra: 39.01738742,  // R41[18] — Moon
    mangal: 125.7459006,   // R60[14] — Mars
    guru: 49.01804986,     // R60[18] — Jupiter
    shukra: 112.8049166,   // R76[14] — Venus
    shani: 324.6971733,    // R76[18] — Shani (retrograde, reversed doshaantar)
    rahu: 345.7432653,     // R57[1] — Rahu
    ketu: 165.7432653,     // R96[14] — Ketu (Rahu + 180°)
  },

  // Summary positions (from summary section R49-R58)
  summary: {
    lagnaRaw: 262.48,           // R49[1]: 8 rashi 22°29'1" — sayana lagna (standard SS method)
    sunSphashta: 98.8517,       // R50[1]: 3 rashi 8°51'6"
    lagnaSphashta: 334.4825,    // R51[1]: 11 rashi 04°28'57" — nirayana lagna (traditional)
    moonSphashta: 39.0174,      // R52[1]: 1 rashi 9°1'3"
    mangalSphashta: 125.746,    // R53[1]: 4 rashi 5°44'45"
    guruSphashta: 49.018,       // R54[1]: 1 rashi 19°1'5"
    shukreSphashta: 112.805,    // R55[1]: 3 rashi 22°48'18"
    rahuSphashta: 324.697,      // R56[1]: 10 rashi 24°41'50"
    ketuRaw: 345.743,           // R57[1]: 11 rashi 15°44'36"
    ketuFinal: 165.743,         // R58[1]: 5 rashi 15°44'36"
  },
};

/**
 * CONSTANTS FOR TRADITIONAL CALCULATIONS
 */
export const TRADITIONAL_CONSTANTS = {
  // Ujjain longitude (prime meridian for Surya Siddhanta)
  ujjainLongitude: 75.57,  // 75°34'E = 75.5667° [CSV uses 75.57]

  // IST standard meridian; CSV shuddh samay 17:54:06 = 18:10 − (82.5 − 80.1)×4m − 6m18s
  standardMeridian: 82.5,

  // Lahiri Ayanamsha for Jul 25, 2024
  ayanamsha: 24.2008,  // 24°12'3"

  // Chara table (interpolation points)
  charaTable: {
    lat29: 6.6683,  // 6°39'6"
    lat30: 6.9281,  // 6°55'41"
  },

  // Nakshatra span in degrees
  nakshatraSpan: 360 / 27,  // 13.333° per nakshatra

  // Rashi span in degrees
  rashiSpan: 30,  // 30° per rashi
};

/**
 * Helper function to get panchang data for a given date
 * Uses nearest available panchang (traditional astrology method)
 * Currently supports Jul 25-28, 2024 using Jul 28 panchang reference
 */
export function getPanchangData(dateStr) {
  // Support Jul 25-28, 2024 using Jul 28 panchang as reference
  if (dateStr >= "2024-07-25" && dateStr <= "2024-07-28") {
    return PANCHANG_JUL28_2024;
  }
  // TODO: Add database lookup for other dates
  // For now, return null to fall back to modern astronomical computation
  return null;
}

/**
 * Get panchang data by location name
 * Maps panchang location selections to actual panchang data
 */
export function getPanchangDataByLocation(locationValue, dateStr = "2024-07-28") {
  // All locations currently return the same Jul 28, 2024 panchang reference
  // In production, this would query a proper panchang database
  const validLocations = [
    'jalandhar', 'haridwar', 'delhi', 'varanasi', 'ujjain',
    'puri', 'kolkata', 'mumbai', 'chennai', 'jaipur',
    'lucknow', 'patna', 'ahmedabad', 'hyderabad', 'bangalore', 'kathmandu'
  ];

  if (!locationValue || !validLocations.includes(locationValue)) {
    return null;
  }

  // Return panchang data for dates in range
  return getPanchangData(dateStr);
}

/**
 * Get constants for traditional calculations
 */
export function getTraditionalConstants() {
  return TRADITIONAL_CONSTANTS;
}
