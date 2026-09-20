import { describe, it, expect } from "vitest";
import { normalizeDegrees, degreesToRadians, radiansToDegrees } from "../../src/utils/angle.js";

describe("normalizeDegrees", () => {
  it("keeps 0-360 values unchanged", () => {
    expect(normalizeDegrees(90)).toBe(90);
    expect(normalizeDegrees(0)).toBe(0);
    expect(normalizeDegrees(359.99)).toBeCloseTo(359.99);
  });

  it("wraps negative values to 0-360", () => {
    expect(normalizeDegrees(-30)).toBeCloseTo(330);
    expect(normalizeDegrees(-360)).toBeCloseTo(0);
    expect(normalizeDegrees(-90)).toBeCloseTo(270);
  });

  it("wraps values >= 360", () => {
    expect(normalizeDegrees(360)).toBeCloseTo(0);
    expect(normalizeDegrees(450)).toBeCloseTo(90);
    expect(normalizeDegrees(720)).toBeCloseTo(0);
  });
});

describe("degreesToRadians", () => {
  it("converts 0° to 0 radians", () => {
    expect(degreesToRadians(0)).toBe(0);
  });

  it("converts 180° to π radians", () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
  });

  it("converts 90° to π/2 radians", () => {
    expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
  });
});

describe("radiansToDegrees", () => {
  it("converts 0 radians to 0°", () => {
    expect(radiansToDegrees(0)).toBe(0);
  });

  it("converts π to 180°", () => {
    expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
  });

  it("round-trips with degreesToRadians", () => {
    expect(radiansToDegrees(degreesToRadians(123.456))).toBeCloseTo(123.456);
  });
});
