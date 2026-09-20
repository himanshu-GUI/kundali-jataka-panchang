import { describe, it, expect } from "vitest";
import {
  computeNakshatra,
  getPreviousNakshatra,
  getNextNakshatra,
} from "../../src/vedic/nakshatra.js";

describe("computeNakshatra", () => {
  it("returns Ashwini (index 0) for 0°", () => {
    const result = computeNakshatra(0);
    expect(result.index).toBe(0);
    expect(result.name).toBe("अश्विनी");
    expect(result.pada).toBe(1);
  });

  it("returns correct nakshatra for 100°", () => {
    const span = 360 / 27;
    const expectedIndex = Math.floor(100 / span);
    const result = computeNakshatra(100);
    expect(result.index).toBe(expectedIndex);
  });

  it("returns pada 1-4 within each nakshatra", () => {
    const span = 360 / 27;
    for (let p = 0; p < 4; p++) {
      const deg = p * (span / 4) + 0.5;
      const result = computeNakshatra(deg);
      expect(result.pada).toBe(p + 1);
    }
  });

  it("covers all 27 nakshatras", () => {
    const span = 360 / 27;
    const seen = new Set();
    for (let i = 0; i < 27; i++) {
      const result = computeNakshatra(i * span + 1);
      seen.add(result.index);
    }
    expect(seen.size).toBe(27);
  });

  it("returns fraction between 0 and 1", () => {
    const result = computeNakshatra(150);
    expect(result.fraction).toBeGreaterThanOrEqual(0);
    expect(result.fraction).toBeLessThan(1);
  });
});

describe("getPreviousNakshatra", () => {
  it("wraps from 0 to 26", () => {
    const result = getPreviousNakshatra(0);
    expect(result.index).toBe(26);
  });

  it("returns index - 1 normally", () => {
    const result = getPreviousNakshatra(5);
    expect(result.index).toBe(4);
  });
});

describe("getNextNakshatra", () => {
  it("wraps from 26 to 0", () => {
    const result = getNextNakshatra(26);
    expect(result.index).toBe(0);
  });

  it("returns index + 1 normally", () => {
    const result = getNextNakshatra(5);
    expect(result.index).toBe(6);
  });
});
