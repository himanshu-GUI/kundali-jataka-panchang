import { describe, it, expect } from "vitest";
import { computeKarana } from "../../src/vedic/karana.js";

describe("computeKarana", () => {
  it("returns fixed karana (Kimstughna) at elongation 0", () => {
    const result = computeKarana(0, 0);
    expect(result.index).toBe(0);
    expect(result.name).toBe("किंस्तुघ्न");
  });

  it("returns a rotating karana for elongation 6-12°", () => {
    const result = computeKarana(10, 0);
    expect(result.index).toBe(1);
    expect(result.name).toBe("बव");
  });

  it("cycles through 7 rotating karanas", () => {
    const names = new Set();
    for (let i = 1; i <= 7; i++) {
      const result = computeKarana(i * 6 + 1, 0);
      names.add(result.name);
    }
    expect(names.size).toBe(7);
  });

  it("wraps negative elongation", () => {
    const result = computeKarana(5, 350);
    expect(result.index).toBeGreaterThanOrEqual(0);
  });

  it("returns fraction between 0 and 1", () => {
    const result = computeKarana(100, 50);
    expect(result.fraction).toBeGreaterThanOrEqual(0);
    expect(result.fraction).toBeLessThan(1);
  });
});
