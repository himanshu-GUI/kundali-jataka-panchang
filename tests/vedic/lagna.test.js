import { describe, it, expect } from "vitest";
import { computeLagna } from "../../src/vedic/lagna.js";

describe("computeLagna", () => {
  it("computes lagna for Champawat on 2024-07-25 at 18:10", () => {
    const result = computeLagna("2024-07-25", "18:10", 29.3167, 80.1);
    expect(result).toBeTruthy();
    expect(result.rashi).toBeTruthy();
    expect(result.formatted).toBeTruthy();
  });

  it("returns tropical and sidereal longitudes between 0-360", () => {
    const result = computeLagna("2024-07-25", "18:10", 29.3167, 80.1);
    expect(result.tropical).toBeGreaterThanOrEqual(0);
    expect(result.tropical).toBeLessThan(360);
    expect(result.sidereal).toBeGreaterThanOrEqual(0);
    expect(result.sidereal).toBeLessThan(360);
  });

  it("returns valid rashiIndex 0-11", () => {
    const result = computeLagna("2024-07-25", "18:10", 29.3167, 80.1);
    expect(result.rashiIndex).toBeGreaterThanOrEqual(0);
    expect(result.rashiIndex).toBeLessThanOrEqual(11);
  });

  it("returns degrees 0-29, minutes 0-59, seconds 0-59", () => {
    const result = computeLagna("2024-07-25", "18:10", 29.3167, 80.1);
    expect(result.degrees).toBeGreaterThanOrEqual(0);
    expect(result.degrees).toBeLessThanOrEqual(29);
    expect(result.minutes).toBeGreaterThanOrEqual(0);
    expect(result.minutes).toBeLessThanOrEqual(59);
    expect(result.seconds).toBeGreaterThanOrEqual(0);
    expect(result.seconds).toBeLessThanOrEqual(60);
  });

  it("returns nakshatra and pada", () => {
    const result = computeLagna("2024-07-25", "18:10", 29.3167, 80.1);
    expect(result.nakshatra).toBeTruthy();
    expect(result.nakshatraPada).toBeGreaterThanOrEqual(1);
    expect(result.nakshatraPada).toBeLessThanOrEqual(4);
  });

  it("changes with different birth times", () => {
    const morning = computeLagna("2024-07-25", "06:00", 29.3167, 80.1);
    const evening = computeLagna("2024-07-25", "18:00", 29.3167, 80.1);
    expect(morning.sidereal).not.toBeCloseTo(evening.sidereal, 0);
  });

  it("changes with different latitudes", () => {
    const north = computeLagna("2024-07-25", "12:00", 50, 80);
    const equator = computeLagna("2024-07-25", "12:00", 0, 80);
    expect(north.sidereal).not.toBeCloseTo(equator.sidereal, 0);
  });

  it("formatted string includes rashi, degrees, minutes, seconds", () => {
    const result = computeLagna("2024-07-25", "18:10", 29.3167, 80.1);
    expect(result.formatted).toMatch(/\d+°/);
    expect(result.formatted).toMatch(/\d+'/);
    expect(result.formatted).toMatch(/\d+"/);
  });
});
