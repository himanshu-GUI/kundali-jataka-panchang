/**
 * LocalStorage Cache Database for Panchang Data
 * Stores all fetched panchang raw data systematically
 * Uses IndexedDB for reliable, structured storage
 */

const DB_NAME = "kundali_panchang_db";
const STORE_NAME = "panchang_data";
const DB_VERSION = 1;

let dbInstance = null;

/**
 * Initialize IndexedDB database
 */
export function initializePanchangDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("dateLocation", ["date", "location"], { unique: true });
        store.createIndex("date", "date", { unique: false });
        store.createIndex("location", "location", { unique: false });
      }
    };
  });
}

/**
 * Store raw panchang data with metadata
 * @param {string} date - Birth date (YYYY-MM-DD)
 * @param {string} location - Nearest panchang location name
 * @param {object} rawData - Raw panchang data from API
 * @returns {Promise<void>}
 */
export async function cachePanchangData(date, location, rawData) {
  const db = await initializePanchangDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const record = {
      id: `${date}_${location}`,
      date,
      location,
      rawData,
      fetchedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    };

    const request = store.put(record);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(record);
  });
}

/**
 * Retrieve cached panchang data
 * @param {string} date - Birth date (YYYY-MM-DD)
 * @param {string} location - Nearest panchang location name
 * @returns {Promise<object|null>}
 */
export async function getCachedPanchangData(date, location) {
  const db = await initializePanchangDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("dateLocation");

    const request = index.get([date, location]);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result;

      // Check if expired
      if (result && new Date(result.expiresAt) > new Date()) {
        resolve(result.rawData);
      } else {
        resolve(null);
      }
    };
  });
}

/**
 * Get all cached data for a specific date
 * @param {string} date - Birth date (YYYY-MM-DD)
 * @returns {Promise<array>}
 */
export async function getCachedDataForDate(date) {
  const db = await initializePanchangDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("date");

    const request = index.getAll(date);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const results = request.result.filter(
        (r) => new Date(r.expiresAt) > new Date()
      );
      resolve(results.map((r) => ({ location: r.location, rawData: r.rawData })));
    };
  });
}

/**
 * Get all cached locations
 * @returns {Promise<array>}
 */
export async function getCachedLocations() {
  const db = await initializePanchangDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const results = request.result.filter(
        (r) => new Date(r.expiresAt) > new Date()
      );
      const locations = [...new Set(results.map((r) => r.location))];
      resolve(locations);
    };
  });
}

/**
 * Clear expired panchang data
 * @returns {Promise<number>}
 */
export async function clearExpiredPanchangData() {
  const db = await initializePanchangDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const results = request.result;
      let deleted = 0;

      for (const record of results) {
        if (new Date(record.expiresAt) <= new Date()) {
          const deleteRequest = store.delete(record.id);
          deleteRequest.onsuccess = () => deleted++;
        }
      }

      resolve(deleted);
    };
  });
}

/**
 * Get cache statistics
 * @returns {Promise<object>}
 */
export async function getCacheStats() {
  const db = await initializePanchangDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const results = request.result;
      const valid = results.filter((r) => new Date(r.expiresAt) > new Date());

      resolve({
        totalRecords: results.length,
        validRecords: valid.length,
        expiredRecords: results.length - valid.length,
        uniqueDates: [...new Set(results.map((r) => r.date))].length,
        uniqueLocations: [...new Set(results.map((r) => r.location))].length,
        oldestRecord: results.length > 0 ? results[0].fetchedAt : null,
        newestRecord:
          results.length > 0
            ? results[results.length - 1].fetchedAt
            : null,
      });
    };
  });
}

export const CacheDB = {
  initialize: initializePanchangDB,
  cache: cachePanchangData,
  get: getCachedPanchangData,
  getByDate: getCachedDataForDate,
  getLocations: getCachedLocations,
  clearExpired: clearExpiredPanchangData,
  stats: getCacheStats,
};
