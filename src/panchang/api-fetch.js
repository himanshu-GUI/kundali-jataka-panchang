/**
 * Panchang API Integration
 * Fetches panchang data from reliable external sources
 * Supports multiple API fallbacks
 */

import { CacheDB } from "./cache-db.js";

/**
 * Known panchang reference locations with coordinates
 */
const PANCHANG_LOCATIONS = [
  { name: "Haridwar", lat: 29.9457, lon: 78.1642, region: "North India" },
  { name: "Ujjain", lat: 23.1815, lon: 75.7733, region: "Central India" },
  { name: "Varanasi", lat: 25.3268, lon: 82.9853, region: "North India" },
  { name: "Jalandhar", lat: 31.7264, lon: 75.5761, region: "North India" },
  { name: "Delhi", lat: 28.6139, lon: 77.209, region: "North India" },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639, region: "East India" },
  { name: "Mumbai", lat: 19.076, lon: 72.8777, region: "West India" },
  { name: "Chennai", lat: 13.0827, lon: 80.2707, region: "South India" },
  { name: "Bangalore", lat: 12.9716, lon: 77.5946, region: "South India" },
  { name: "Jaipur", lat: 26.9124, lon: 75.7873, region: "North India" },
];

/**
 * Find nearest panchang reference location
 * @param {number} lat - Birth latitude
 * @param {number} lon - Birth longitude
 * @returns {object}
 */
export function findNearestPanchangLocation(lat, lon) {
  let nearest = PANCHANG_LOCATIONS[0];
  let minDistance = Infinity;

  for (const loc of PANCHANG_LOCATIONS) {
    const distance = haversineDistance(lat, lon, loc.lat, loc.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = loc;
    }
  }

  return { ...nearest, distance: minDistance };
}

/**
 * Haversine distance calculation (km)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Fetch panchang data from drikpanchang.com API
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} location - Location name
 * @returns {Promise<object>}
 */
async function fetchFromDrikPanchang(date, location) {
  try {
    // drikpanchang.com API endpoint (public, no auth required)
    const url = `https://api.drikpanchang.com/json/panchang/${date}?location=${encodeURIComponent(location)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      source: "drikpanchang",
      date,
      location,
      data: data,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("drikpanchang API failed:", error);
    return null;
  }
}

/**
 * Fetch panchang data from timeanddate.com
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>}
 */
async function fetchFromTimeAndDate(date, lat, lon) {
  try {
    // timeanddate.com has lunar phase API but limited panchang
    // Can be extended for more data
    const url = `https://www.timeanddate.com/scripts/api/moon-phases/`;

    const params = new URLSearchParams({
      date: date,
      lat: lat,
      lon: lon,
      limit: 1,
    });

    const response = await fetch(url + "?" + params.toString(), {
      timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      source: "timeanddate",
      date,
      location: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      data: data,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("timeanddate API failed:", error);
    return null;
  }
}

/**
 * Main function to fetch panchang data
 * Tries multiple API sources with fallback
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} lat - Birth latitude
 * @param {number} lon - Birth longitude
 * @returns {Promise<object|null>}
 */
export async function fetchPanchangFromAPI(date, lat, lon) {
  // Find nearest panchang location
  const nearestLocation = findNearestPanchangLocation(lat, lon);

  console.log(
    `[Panchang API] Finding panchang for ${date} at ${lat}, ${lon}`
  );
  console.log(
    `[Panchang API] Nearest panchang location: ${nearestLocation.name} (${nearestLocation.distance.toFixed(1)}km away)`
  );

  // Try primary API (drikpanchang)
  console.log(`[Panchang API] Attempting fetch from drikpanchang.com...`);
  let result = await fetchFromDrikPanchang(date, nearestLocation.name);

  if (result) {
    console.log(`[Panchang API] ✓ Successfully fetched from drikpanchang`);

    // Store in local cache
    try {
      await CacheDB.cache(date, nearestLocation.name, result);
      console.log(`[Panchang API] ✓ Cached data locally`);
    } catch (cacheError) {
      console.warn("[Panchang API] Cache storage failed:", cacheError);
    }

    return result;
  }

  // Try secondary API (timeanddate)
  console.log(`[Panchang API] Primary API failed, trying timeanddate.com...`);
  result = await fetchFromTimeAndDate(date, lat, lon);

  if (result) {
    console.log(`[Panchang API] ✓ Successfully fetched from timeanddate`);

    // Store in local cache
    try {
      await CacheDB.cache(date, nearestLocation.name, result);
      console.log(`[Panchang API] ✓ Cached data locally`);
    } catch (cacheError) {
      console.warn("[Panchang API] Cache storage failed:", cacheError);
    }

    return result;
  }

  console.error("[Panchang API] ✗ All API sources failed");
  return null;
}

/**
 * Get panchang data with smart caching
 * 1. Check local cache first
 * 2. If not found, fetch from API
 * 3. Store in local cache for future use
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} lat - Birth latitude
 * @param {number} lon - Birth longitude
 * @returns {Promise<object|null>}
 */
export async function getPanchangDataSmartCache(date, lat, lon) {
  const nearestLocation = findNearestPanchangLocation(lat, lon);

  console.log(`[Panchang Manager] Getting panchang for ${date} at ${nearestLocation.name}`);

  // Step 1: Check local cache
  console.log(`[Panchang Manager] Checking local cache...`);
  try {
    const cached = await CacheDB.get(date, nearestLocation.name);
    if (cached) {
      console.log(`[Panchang Manager] ✓ Found in local cache`);
      return cached;
    }
  } catch (error) {
    console.warn("[Panchang Manager] Cache lookup failed:", error);
  }

  // Step 2: Call API
  console.log(`[Panchang Manager] Not in cache, fetching from API...`);
  const apiData = await fetchPanchangFromAPI(date, lat, lon);

  return apiData;
}

/**
 * Prefetch panchang data for multiple dates
 * Useful for kundali calculations where multiple dates might be needed
 * @param {array} dates - Array of dates in YYYY-MM-DD format
 * @param {number} lat - Birth latitude
 * @param {number} lon - Birth longitude
 * @returns {Promise<object>}
 */
export async function prefetchPanchangData(dates, lat, lon) {
  const results = {};
  let successful = 0;
  let cached = 0;
  let failed = 0;

  for (const date of dates) {
    const data = await getPanchangDataSmartCache(date, lat, lon);
    if (data) {
      results[date] = data;
      if (data.source === "cached") {
        cached++;
      } else {
        successful++;
      }
    } else {
      failed++;
    }
  }

  return {
    results,
    stats: {
      total: dates.length,
      successful,
      cached,
      failed,
    },
  };
}

export const PanchangAPI = {
  fetch: fetchPanchangFromAPI,
  smartCache: getPanchangDataSmartCache,
  findNearest: findNearestPanchangLocation,
  prefetch: prefetchPanchangData,
  locations: PANCHANG_LOCATIONS,
};
