import { describe, it, expect } from "vitest";
import { CITIES } from "../../src/birthplace/cities.js";

const IDX_HI = 0, IDX_EN = 1, IDX_LAT = 2, IDX_LON = 3, IDX_STATE = 4, IDX_CC = 5, IDX_TZ = 6;

describe("Cities database", () => {
  it("has at least 100 cities", () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(100);
  });

  it("each city has 7 fields [nameHi, nameEn, lat, lon, state, country, timezone]", () => {
    for (const city of CITIES) {
      expect(city).toHaveLength(7);
      expect(typeof city[IDX_HI]).toBe("string");
      expect(typeof city[IDX_EN]).toBe("string");
      expect(typeof city[IDX_LAT]).toBe("number");
      expect(typeof city[IDX_LON]).toBe("number");
      expect(typeof city[IDX_STATE]).toBe("string");
      expect(typeof city[IDX_CC]).toBe("string");
      expect(typeof city[IDX_TZ]).toBe("string");
    }
  });

  it("latitudes are in valid range [-90, 90]", () => {
    for (const city of CITIES) {
      expect(city[IDX_LAT]).toBeGreaterThanOrEqual(-90);
      expect(city[IDX_LAT]).toBeLessThanOrEqual(90);
    }
  });

  it("longitudes are in valid range [-180, 180]", () => {
    for (const city of CITIES) {
      expect(city[IDX_LON]).toBeGreaterThanOrEqual(-180);
      expect(city[IDX_LON]).toBeLessThanOrEqual(180);
    }
  });

  it("includes original 7 birth place cities", () => {
    const enNames = CITIES.map(c => c[IDX_EN].toLowerCase());
    const required = ["lohaghat", "champawat", "haridwar", "meerut", "lucknow", "new delhi", "dhangadhi"];
    for (const name of required) {
      expect(enNames).toContain(name);
    }
  });

  it("includes major Indian metros", () => {
    const enNames = CITIES.map(c => c[IDX_EN].toLowerCase());
    const metros = ["mumbai", "kolkata", "chennai", "bengaluru", "hyderabad", "ahmedabad", "pune"];
    for (const name of metros) {
      expect(enNames).toContain(name);
    }
  });

  it("includes international cities", () => {
    const enNames = CITIES.map(c => c[IDX_EN].toLowerCase());
    const intl = ["london", "new york", "dubai", "singapore", "tokyo"];
    for (const name of intl) {
      expect(enNames).toContain(name);
    }
  });

  it("includes Nepal cities", () => {
    const npCities = CITIES.filter(c => c[IDX_CC] === "NP");
    expect(npCities.length).toBeGreaterThanOrEqual(5);
    const enNames = npCities.map(c => c[IDX_EN].toLowerCase());
    expect(enNames).toContain("kathmandu");
  });

  it("all timezones are IANA format", () => {
    for (const city of CITIES) {
      expect(city[IDX_TZ]).toMatch(/^[A-Z][a-z]+\/[A-Za-z_]+/);
    }
  });

  it("no duplicate English names within same country", () => {
    const seen = new Set();
    for (const city of CITIES) {
      const key = `${city[IDX_EN]}|${city[IDX_CC]}`;
      expect(seen.has(key), `Duplicate: ${key}`).toBe(false);
      seen.add(key);
    }
  });

  it("search by Hindi text finds results", () => {
    const q = "दिल्ली".toLowerCase();
    const found = CITIES.filter(c => c[IDX_HI].toLowerCase().includes(q));
    expect(found.length).toBeGreaterThan(0);
    expect(found[0][IDX_EN]).toBe("New Delhi");
  });

  it("search by English text finds results", () => {
    const q = "mumbai";
    const found = CITIES.filter(c => c[IDX_EN].toLowerCase().includes(q));
    expect(found.length).toBeGreaterThan(0);
    expect(found[0][IDX_HI]).toBe("मुम्बई");
  });
});
