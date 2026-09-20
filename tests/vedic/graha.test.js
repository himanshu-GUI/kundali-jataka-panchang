import { describe, it, expect } from "vitest";
import { computeGrahaSphut, computeGrahaAtLocation, GRAHA_ORDER } from "../../src/vedic/graha.js";

describe("GRAHA_ORDER", () => {
  it("has 9 grahas in correct order", () => {
    expect(GRAHA_ORDER).toEqual([
      "surya", "chandra", "mangal", "budh", "guru", "shukra", "shani", "rahu", "ketu",
    ]);
  });
});

describe("computeGrahaSphut", () => {
  const date = new Date("2024-07-25T12:40:00Z");
  let grahas;

  it("returns all 9 grahas", () => {
    grahas = computeGrahaSphut(date);
    expect(Object.keys(grahas)).toHaveLength(9);
    for (const key of GRAHA_ORDER) {
      expect(grahas[key]).toBeTruthy();
    }
  });

  it("each graha has name, rashi, position, nakshatra", () => {
    grahas = computeGrahaSphut(date);
    for (const key of GRAHA_ORDER) {
      const g = grahas[key];
      expect(g.name).toBeTruthy();
      expect(g.nameEn).toBeTruthy();
      expect(g.rashi).toBeTruthy();
      expect(typeof g.degrees).toBe("number");
      expect(typeof g.minutes).toBe("number");
      expect(typeof g.seconds).toBe("number");
      expect(g.nakshatra).toBeTruthy();
      expect(g.nakshatraPada).toBeGreaterThanOrEqual(1);
      expect(g.nakshatraPada).toBeLessThanOrEqual(4);
    }
  });

  it("sidereal longitude is between 0-360", () => {
    grahas = computeGrahaSphut(date);
    for (const key of GRAHA_ORDER) {
      expect(grahas[key].sidereal).toBeGreaterThanOrEqual(0);
      expect(grahas[key].sidereal).toBeLessThan(360);
    }
  });

  it("Rahu and Ketu are always retrograde", () => {
    grahas = computeGrahaSphut(date);
    expect(grahas.rahu.retrograde).toBe(true);
    expect(grahas.ketu.retrograde).toBe(true);
  });

  it("Ketu is exactly 180° from Rahu", () => {
    grahas = computeGrahaSphut(date);
    let diff = Math.abs(grahas.ketu.sidereal - grahas.rahu.sidereal);
    if (diff > 180) diff = 360 - diff;
    expect(diff).toBeCloseTo(180, 0);
  });

  it("Sun and Moon are never retrograde", () => {
    grahas = computeGrahaSphut(date);
    expect(grahas.surya.retrograde).toBe(false);
    expect(grahas.chandra.retrograde).toBe(false);
  });

  it("rashiIndex is within 0-11", () => {
    grahas = computeGrahaSphut(date);
    for (const key of GRAHA_ORDER) {
      expect(grahas[key].rashiIndex).toBeGreaterThanOrEqual(0);
      expect(grahas[key].rashiIndex).toBeLessThanOrEqual(11);
    }
  });
});

describe("computeGrahaAtLocation", () => {
  it("computes grahas for a specific birth date/time", () => {
    const grahas = computeGrahaAtLocation(
      new Date("2024-07-25"), "18:10", 29.3167, 80.1
    );
    expect(Object.keys(grahas)).toHaveLength(9);
    expect(grahas.surya).toBeTruthy();
  });
});
