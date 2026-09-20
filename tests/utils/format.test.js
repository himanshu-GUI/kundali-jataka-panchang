import { describe, it, expect } from "vitest";
import {
  ghatiPalToDecimal,
  formatGhatiDecimal,
  formatGhatiPal,
} from "../../src/panchang/format.js";

describe("ghatiPalToDecimal", () => {
  it("converts ghati and pal to decimal", () => {
    expect(ghatiPalToDecimal(10, 30)).toBeCloseTo(10.5, 5);
  });

  it("handles zero pal", () => {
    expect(ghatiPalToDecimal(5, 0)).toBe(5);
  });

  it("handles null/undefined as 0", () => {
    expect(ghatiPalToDecimal(null, null)).toBe(0);
    expect(ghatiPalToDecimal(undefined, undefined)).toBe(0);
  });

  it("handles string inputs", () => {
    expect(ghatiPalToDecimal("10", "30")).toBeCloseTo(10.5, 5);
  });
});

describe("formatGhatiDecimal", () => {
  it("formats as decimal string without trailing zeros", () => {
    const result = formatGhatiDecimal(10, 30);
    expect(result).toBe("10.5");
  });

  it("formats whole numbers without decimal point", () => {
    const result = formatGhatiDecimal(10, 0);
    expect(result).toBe("10");
  });
});

describe("formatGhatiPal", () => {
  it("formats as 'X घटी Y पल'", () => {
    expect(formatGhatiPal(10, 30)).toBe("10 घटी 30 पल");
  });

  it("handles null values as 0", () => {
    expect(formatGhatiPal(null, null)).toBe("0 घटी 0 पल");
  });

  it("handles empty string values as 0", () => {
    expect(formatGhatiPal("", "")).toBe("0 घटी 0 पल");
  });
});
