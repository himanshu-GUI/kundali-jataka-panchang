import { describe, it, expect } from "vitest";
import { computeYoga } from "../../src/vedic/yoga.js";

describe("computeYoga", () => {
  it("returns Vishkambha (index 0) for small combined longitude", () => {
    const result = computeYoga(3, 5);
    expect(result.index).toBe(0);
    expect(result.name).toBe("विष्कम्भ");
  });

  it("wraps combined longitude exceeding 360°", () => {
    const result = computeYoga(200, 200);
    expect(result.index).toBeGreaterThanOrEqual(0);
    expect(result.index).toBeLessThan(27);
  });

  it("covers all 27 yogas", () => {
    const span = 360 / 27;
    const seen = new Set();
    for (let i = 0; i < 27; i++) {
      const result = computeYoga(i * span + 1, 0);
      seen.add(result.index);
    }
    expect(seen.size).toBe(27);
  });

  it("returns fraction between 0 and 1", () => {
    const result = computeYoga(100, 80);
    expect(result.fraction).toBeGreaterThanOrEqual(0);
    expect(result.fraction).toBeLessThan(1);
  });
});
