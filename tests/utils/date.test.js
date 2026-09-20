import { describe, it, expect } from "vitest";
import { dateToJulianDay, julianCenturies, J2000 } from "../../src/utils/date.js";

describe("dateToJulianDay", () => {
  it("returns 2451545.0 for J2000 epoch (2000-01-01T12:00Z)", () => {
    const date = new Date("2000-01-01T12:00:00Z");
    expect(dateToJulianDay(date)).toBeCloseTo(2451545.0, 1);
  });

  it("increases by 1 for each day", () => {
    const d1 = new Date("2024-01-01T12:00:00Z");
    const d2 = new Date("2024-01-02T12:00:00Z");
    expect(dateToJulianDay(d2) - dateToJulianDay(d1)).toBeCloseTo(1.0, 5);
  });
});

describe("julianCenturies", () => {
  it("returns 0 for J2000 epoch", () => {
    const date = new Date("2000-01-01T12:00:00Z");
    expect(julianCenturies(date)).toBeCloseTo(0, 3);
  });

  it("returns ~0.245 for 2024-07-25", () => {
    const date = new Date("2024-07-25T12:00:00Z");
    const T = julianCenturies(date);
    expect(T).toBeGreaterThan(0.24);
    expect(T).toBeLessThan(0.25);
  });

  it("returns negative for dates before J2000", () => {
    const date = new Date("1990-01-01T12:00:00Z");
    expect(julianCenturies(date)).toBeLessThan(0);
  });
});

describe("J2000", () => {
  it("equals 2451545.0", () => {
    expect(J2000).toBe(2451545.0);
  });
});
