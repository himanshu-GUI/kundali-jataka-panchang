import { describe, it, expect } from "vitest";
import { computeTithi, tithiPaksha } from "../../src/vedic/tithi.js";

describe("computeTithi", () => {
  it("returns Pratipada (index 0) when elongation is 0-12°", () => {
    const result = computeTithi(30, 24);
    expect(result.index).toBe(0);
    expect(result.name).toBe("प्रतिपदा");
  });

  it("returns Purnima (index 14) at ~180° elongation", () => {
    const result = computeTithi(200, 20);
    expect(result.index).toBe(15);
  });

  it("wraps negative elongation to positive", () => {
    const result = computeTithi(10, 350);
    expect(result.index).toBe(1);
    expect(result.elongation).toBe(20);
  });

  it("returns valid fraction between 0 and 1", () => {
    const result = computeTithi(100, 50);
    expect(result.fraction).toBeGreaterThanOrEqual(0);
    expect(result.fraction).toBeLessThan(1);
  });

  it("covers all 30 tithis across 360° elongation", () => {
    for (let i = 0; i < 30; i++) {
      const moonSid = (i * 12 + 6) % 360;
      const result = computeTithi(moonSid, 0);
      expect(result.index).toBe(i);
    }
  });
});

describe("tithiPaksha", () => {
  it("returns शुक्ल for index 0-14", () => {
    expect(tithiPaksha(0)).toBe("शुक्ल");
    expect(tithiPaksha(14)).toBe("शुक्ल");
  });

  it("returns कृष्ण for index 15-29", () => {
    expect(tithiPaksha(15)).toBe("कृष्ण");
    expect(tithiPaksha(29)).toBe("कृष्ण");
  });
});
