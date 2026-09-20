import { describe, it, expect } from "vitest";
import {
  computeMasa,
  computeRitu,
  computeAyana,
  computeShakaSamvat,
  computeVikramSamvat,
  computeSamvatsara,
} from "../../src/vedic/masa.js";

describe("computeMasa", () => {
  it("returns correct masa for given sun sidereal longitude", () => {
    const result = computeMasa(90);
    expect(result.index).toBe(4);
    expect(result.name).toBe("श्रावण");
  });

  it("returns Chaitra for sun near 0° (Mesha)", () => {
    const result = computeMasa(5);
    expect(result.index).toBe(1);
    expect(result.name).toBe("वैशाख");
  });
});

describe("computeRitu", () => {
  it("returns Vasant for Chaitra (index 0)", () => {
    const result = computeRitu(0);
    expect(result.name).toBe("वसन्त");
  });

  it("returns Varsha for Shravana (index 4)", () => {
    const result = computeRitu(4);
    expect(result.name).toBe("वर्षा");
  });

  it("cycles through 6 seasons over 12 months", () => {
    const seasons = new Set();
    for (let i = 0; i < 12; i++) {
      seasons.add(computeRitu(i).name);
    }
    expect(seasons.size).toBe(6);
  });
});

describe("computeAyana", () => {
  it("returns Uttarayana for sun 0-180°", () => {
    expect(computeAyana(90)).toBe("उत्तरायण");
    expect(computeAyana(0)).toBe("उत्तरायण");
  });

  it("returns Dakshinayana for sun 180-360°", () => {
    expect(computeAyana(270)).toBe("दक्षिणायन");
    expect(computeAyana(180)).toBe("दक्षिणायन");
  });
});

describe("computeShakaSamvat", () => {
  it("returns Gregorian year - 78 for most months", () => {
    expect(computeShakaSamvat(2024, 4)).toBe("1946");
  });

  it("returns year - 79 before Chaitra", () => {
    expect(computeShakaSamvat(2024, 0)).toBe("1945");
  });
});

describe("computeVikramSamvat", () => {
  it("returns Gregorian year + 57 for most months", () => {
    expect(computeVikramSamvat(2024, 4)).toBe("2081");
  });

  it("returns year + 56 before Chaitra", () => {
    expect(computeVikramSamvat(2024, 0)).toBe("2080");
  });
});

describe("computeSamvatsara", () => {
  it("returns a non-empty name for any year", () => {
    const result = computeSamvatsara(2024);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("cycles every 60 years", () => {
    const s1 = computeSamvatsara(2024);
    const s2 = computeSamvatsara(2024 + 60);
    expect(s1).toBe(s2);
  });
});
