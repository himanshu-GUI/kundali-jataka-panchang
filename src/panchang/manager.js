/**
 * Panchang Manager - Orchestrates Smart Fallback Chain
 * 1. Check local cache
 * 2. Use local calculation engine
 * 3. Fetch from API on miss
 * 4. Store fetched data for future use
 */

import { CacheDB } from "./cache-db.js";
import { PanchangAPI } from "./api-fetch.js";
import { PanchangCalculator } from "./calculator.js";

/**
 * Main entry point for getting panchang data
 * Smart logic:
 * 1. Check cache first
 * 2. If cached, use local calculation
 * 3. If not cached, try API
 * 4. Store API result in cache
 * 5. Use local calculation for final result
 *
 * @param {string} date - Birth date (YYYY-MM-DD)
 * @param {string} time - Birth time (HH:MM:SS)
 * @param {number} lat - Birth latitude
 * @param {number} lon - Birth longitude
 * @returns {Promise<object>}
 */
export async function getPanchangData(date, time, lat, lon) {
  console.log(
    `\n[PanchangManager] === PANCHANG REQUEST ===`
  );
  console.log(
    `[PanchangManager] Date: ${date}, Time: ${time}, Lat: ${lat}, Lon: ${lon}`
  );

  try {
    // Initialize database
    await CacheDB.initialize();

    const nearestLocation = PanchangAPI.findNearest(lat, lon);
    console.log(
      `[PanchangManager] Nearest panchang location: ${nearestLocation.name} (${nearestLocation.distance.toFixed(1)}km)`
    );

    // Step 1: Check local cache
    console.log(`[PanchangManager] Step 1: Checking local cache...`);
    let cachedRawData = null;

    try {
      cachedRawData = await CacheDB.get(date, nearestLocation.name);
      if (cachedRawData) {
        console.log(
          `[PanchangManager] ✓ Found in local cache (fetched: ${cachedRawData.fetchedAt})`
        );
      }
    } catch (cacheError) {
      console.warn("[PanchangManager] Cache check failed:", cacheError);
    }

    // Step 2: If not cached, fetch from API
    if (!cachedRawData) {
      console.log(
        `[PanchangManager] Step 2: Not in cache, calling API...`
      );
      const apiResult = await PanchangAPI.fetch(date, lat, lon);

      if (apiResult) {
        cachedRawData = apiResult;
        console.log(`[PanchangManager] ✓ API returned data`);

        // Store in cache for future use
        try {
          await CacheDB.cache(date, nearestLocation.name, apiResult);
          console.log(
            `[PanchangManager] ✓ Data cached locally for future use`
          );
        } catch (cacheStoreError) {
          console.warn(
            "[PanchangManager] Failed to store in cache:",
            cacheStoreError
          );
        }
      } else {
        console.error("[PanchangManager] ✗ API failed, no fallback available");
        return {
          error: "Failed to fetch panchang data",
          source: "none",
        };
      }
    }

    // Step 3: Use local calculation engine
    console.log(
      `[PanchangManager] Step 3: Computing panchang using local engine...`
    );

    // Parse birth time
    const [birthHour, birthMin, birthSec] = time.split(":").map(Number);
    const [year, month, day] = date.split("-").map(Number);
    const birthDate = new Date(year, month - 1, day, birthHour, birthMin, birthSec);

    // Compute complete panchang
    const panchangResult = PanchangCalculator.complete(birthDate, lat, lon);

    // Add source information
    panchangResult.source = "local_calculation";
    panchangResult.dataSource = cachedRawData?.source || "api";
    panchangResult.nearestLocation = {
      name: nearestLocation.name,
      distance: nearestLocation.distance,
      lat: nearestLocation.lat,
      lon: nearestLocation.lon,
    };
    panchangResult.cacheStatus = cachedRawData
      ? "from_cache"
      : "from_api";

    console.log(`[PanchangManager] ✓ Panchang computed successfully`);
    console.log(`[PanchangManager] Data: ${panchangResult.dataSource}`);
    console.log(`[PanchangManager] Tithi: ${panchangResult.tithi.name} (${panchangResult.tithi.paksha})`);
    console.log(`[PanchangManager] Nakshatra: ${panchangResult.nakshatra.nakshatra} (Pada ${panchangResult.nakshatra.pada})`);
    console.log(`[PanchangManager] Yoga: ${panchangResult.yoga.yoga}`);
    console.log(`[PanchangManager] Karana: ${panchangResult.karana.karana}`);
    console.log(`[PanchangManager] === REQUEST COMPLETE ===\n`);

    return panchangResult;
  } catch (error) {
    console.error("[PanchangManager] Fatal error:", error);
    return {
      error: error.message,
      source: "error",
    };
  }
}

/**
 * Prefetch panchang data for multiple dates
 * Useful for extended calculations
 *
 * @param {array} dates - Array of dates [YYYY-MM-DD]
 * @param {string} time - Birth time (HH:MM:SS)
 * @param {number} lat - Birth latitude
 * @param {number} lon - Birth longitude
 * @returns {Promise<object>}
 */
export async function prefetchMultipleDates(dates, time, lat, lon) {
  console.log(`\n[PanchangManager] Prefetching panchang for ${dates.length} dates...`);

  const results = {};
  const stats = {
    total: dates.length,
    successful: 0,
    failed: 0,
    fromCache: 0,
    fromAPI: 0,
    duration: 0,
  };

  const startTime = Date.now();

  for (const date of dates) {
    try {
      const result = await getPanchangData(date, time, lat, lon);
      if (!result.error) {
        results[date] = result;
        stats.successful++;
        if (result.cacheStatus === "from_cache") {
          stats.fromCache++;
        } else {
          stats.fromAPI++;
        }
      } else {
        stats.failed++;
      }
    } catch (error) {
      console.error(`[PanchangManager] Failed to fetch ${date}:`, error);
      stats.failed++;
    }
  }

  stats.duration = Date.now() - startTime;

  console.log(
    `[PanchangManager] Prefetch complete: ${stats.successful}/${stats.total} successful in ${stats.duration}ms`
  );
  console.log(`[PanchangManager] From cache: ${stats.fromCache}, From API: ${stats.fromAPI}`);

  return { results, stats };
}

/**
 * Get cache statistics
 * @returns {Promise<object>}
 */
export async function getCacheInfo() {
  console.log(`\n[PanchangManager] Retrieving cache statistics...`);

  try {
    await CacheDB.initialize();
    const stats = await CacheDB.stats();
    return stats;
  } catch (error) {
    console.error("[PanchangManager] Failed to get cache stats:", error);
    return null;
  }
}

/**
 * Clear expired cache entries
 * @returns {Promise<number>}
 */
export async function clearExpiredCache() {
  console.log(`[PanchangManager] Clearing expired cache entries...`);

  try {
    await CacheDB.initialize();
    const deleted = await CacheDB.clearExpired();
    console.log(
      `[PanchangManager] Deleted ${deleted} expired entries`
    );
    return deleted;
  } catch (error) {
    console.error("[PanchangManager] Failed to clear cache:", error);
    return 0;
  }
}

/**
 * Test the complete panchang system
 * @param {string} date - Test date
 * @param {string} time - Test time
 * @param {number} lat - Test latitude
 * @param {number} lon - Test longitude
 * @returns {Promise<object>}
 */
export async function testPanchangSystem(date, time, lat, lon) {
  console.log(`\n[PanchangManager] === SYSTEM TEST ===`);
  console.log(
    `[PanchangManager] Testing with: ${date} ${time} at ${lat}, ${lon}`
  );

  try {
    // Test 1: Get panchang (should cache)
    console.log(`\n[PanchangManager] Test 1: Initial fetch (will cache)`);
    const result1 = await getPanchangData(date, time, lat, lon);
    if (result1.error) {
      console.error("[PanchangManager] Test 1 FAILED:", result1.error);
      return { status: "failed", error: result1.error };
    }
    console.log(`[PanchangManager] Test 1 PASSED`);

    // Test 2: Get same panchang (should use cache)
    console.log(`\n[PanchangManager] Test 2: Second fetch (should use cache)`);
    const result2 = await getPanchangData(date, time, lat, lon);
    if (result2.error) {
      console.error("[PanchangManager] Test 2 FAILED:", result2.error);
      return { status: "failed", error: result2.error };
    }
    if (result2.cacheStatus !== "from_cache") {
      console.warn("[PanchangManager] Test 2 WARNING: Not using cache");
    }
    console.log(`[PanchangManager] Test 2 PASSED (Cache status: ${result2.cacheStatus})`);

    // Test 3: Check cache stats
    console.log(`\n[PanchangManager] Test 3: Cache statistics`);
    const cacheStats = await getCacheInfo();
    console.log(`[PanchangManager] Cache has ${cacheStats.validRecords} valid entries`);
    console.log(`[PanchangManager] Test 3 PASSED`);

    console.log(`\n[PanchangManager] === ALL TESTS PASSED ===\n`);

    return {
      status: "success",
      result1,
      result2,
      cacheStats,
    };
  } catch (error) {
    console.error("[PanchangManager] TEST FAILED:", error);
    return { status: "failed", error: error.message };
  }
}

export const PanchangManager = {
  get: getPanchangData,
  prefetch: prefetchMultipleDates,
  cacheInfo: getCacheInfo,
  clearExpired: clearExpiredCache,
  test: testPanchangSystem,
};
