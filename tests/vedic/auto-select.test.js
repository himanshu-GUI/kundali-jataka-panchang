import { describe, it, expect } from "vitest";
import { findNearestPanchang, PANCHANG_LOCATIONS } from "../../src/panchang/auto-select.js";

describe("PANCHANG_LOCATIONS", () => {
  it("has 16 panchang locations", () => {
    expect(PANCHANG_LOCATIONS).toHaveLength(16);
  });

  it("each location has key, name, lat, lon", () => {
    for (const loc of PANCHANG_LOCATIONS) {
      expect(loc.key).toBeTruthy();
      expect(loc.name).toBeTruthy();
      expect(typeof loc.lat).toBe("number");
      expect(typeof loc.lon).toBe("number");
    }
  });
});

describe("findNearestPanchang", () => {
  it("selects Haridwar for Champawat (29.32°N, 80.1°E)", () => {
    const result = findNearestPanchang(29.3167, 80.1);
    expect(result.key).toBe("haridwar");
    expect(result.distance).toBeGreaterThan(100);
    expect(result.distance).toBeLessThan(300);
  });

  it("selects Delhi for Delhi coordinates", () => {
    const result = findNearestPanchang(28.6139, 77.209);
    expect(result.key).toBe("delhi");
    expect(result.distance).toBeLessThan(1);
  });

  it("selects Kathmandu for Kathmandu", () => {
    const result = findNearestPanchang(27.7172, 85.324);
    expect(result.key).toBe("kathmandu");
    expect(result.distance).toBeLessThan(1);
  });

  it("selects Chennai for a south Indian city like Madurai", () => {
    const result = findNearestPanchang(9.9252, 78.1198);
    expect(["chennai", "bangalore"]).toContain(result.key);
  });

  it("returns distance as a rounded number", () => {
    const result = findNearestPanchang(29.3167, 80.1);
    expect(Number.isInteger(result.distance)).toBe(true);
  });

  it("selects Jalandhar for Amritsar (Punjab)", () => {
    const result = findNearestPanchang(31.634, 74.8723);
    expect(result.key).toBe("jalandhar");
  });
});
