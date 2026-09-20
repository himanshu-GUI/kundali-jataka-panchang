import { describe, it, expect } from "vitest";
import { lahiriAyanamsa, toSidereal } from "../../src/astronomy/ayanamsa.js";

describe("lahiriAyanamsa", () => {
  it("returns ~23.85° for J2000 epoch (2000-01-01T12:00Z)", () => {
    const date = new Date("2000-01-01T12:00:00Z");
    const aya = lahiriAyanamsa(date);
    expect(aya).toBeCloseTo(23.85, 1);
  });

  it("returns ~24.19° for 2024-07-25", () => {
    const date = new Date("2024-07-25T12:00:00Z");
    const aya = lahiriAyanamsa(date);
    expect(aya).toBeGreaterThan(24.0);
    expect(aya).toBeLessThan(24.5);
  });

  it("increases over time", () => {
    const d1 = new Date("1950-01-01T12:00:00Z");
    const d2 = new Date("2024-01-01T12:00:00Z");
    expect(lahiriAyanamsa(d2)).toBeGreaterThan(lahiriAyanamsa(d1));
  });
});

describe("toSidereal", () => {
  it("subtracts ayanamsa from tropical longitude", () => {
    expect(toSidereal(50, 24)).toBeCloseTo(26, 5);
  });

  it("wraps negative results to 0-360 range", () => {
    const sid = toSidereal(10, 24);
    expect(sid).toBeGreaterThanOrEqual(0);
    expect(sid).toBeLessThan(360);
    expect(sid).toBeCloseTo(346, 5);
  });

  it("wraps results >= 360", () => {
    const sid = toSidereal(359, -2);
    expect(sid).toBeGreaterThanOrEqual(0);
    expect(sid).toBeLessThan(360);
  });
});
