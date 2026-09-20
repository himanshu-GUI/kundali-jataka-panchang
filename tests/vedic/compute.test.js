import { describe, it, expect } from "vitest";
import { computePanchang, computeFullKundali } from "../../src/panchang/compute.js";
import { parseCoordinate } from "../../src/utils/coordinates.js";

describe("parseCoordinate", () => {
  it("parses decimal degrees", () => {
    expect(parseCoordinate("29.3167")).toBeCloseTo(29.3167, 3);
  });

  it("parses DMS format with direction", () => {
    expect(parseCoordinate("29°19′00″ N")).toBeCloseTo(29.3167, 2);
  });

  it("negates for S/W direction", () => {
    expect(parseCoordinate("80°06′00″ W")).toBeLessThan(0);
  });

  it("parses number directly", () => {
    expect(parseCoordinate(29.3167)).toBeCloseTo(29.3167, 3);
  });

  it("returns null for empty/invalid input", () => {
    expect(parseCoordinate("")).toBeNull();
    expect(parseCoordinate(null)).toBeNull();
  });
});

describe("computePanchang", () => {
  it("computes panchang for Champawat on 2024-07-25", () => {
    const result = computePanchang("2024-07-25", "29.3167", "80.1");
    expect(result).not.toBeNull();
    expect(result._computed).toBe(true);
  });

  it("returns tithi as an array", () => {
    const result = computePanchang("2024-07-25", "29.3167", "80.1");
    expect(Array.isArray(result.tithi)).toBe(true);
    expect(result.tithi.length).toBeGreaterThanOrEqual(1);
    expect(result.tithi[0].name).toBeTruthy();
  });

  it("returns vara with name and ghati/pal", () => {
    const result = computePanchang("2024-07-25", "29.3167", "80.1");
    expect(result.vara.name).toBe("गुरुवार");
    expect(typeof result.vara.ghati).toBe("number");
    expect(typeof result.vara.pal).toBe("number");
  });

  it("returns nakshatra data", () => {
    const result = computePanchang("2024-07-25", "29.3167", "80.1");
    expect(result.currentNakshatra.name).toBeTruthy();
    expect(result.previousNakshatra.name).toBeTruthy();
    expect(result.nextNakshatra.name).toBeTruthy();
  });

  it("returns yoga and karana", () => {
    const result = computePanchang("2024-07-25", "29.3167", "80.1");
    expect(result.yoga.name).toBeTruthy();
    expect(result.karana.name).toBeTruthy();
  });

  it("returns samvat data", () => {
    const result = computePanchang("2024-07-25", "29.3167", "80.1");
    expect(result.shakaSamvat).toBe("1946");
    expect(result.vikramSamvat).toBe("2081");
    expect(result.samvatsara).toBeTruthy();
  });

  it("returns ayana and ritu", () => {
    const result = computePanchang("2024-07-25", "29.3167", "80.1");
    expect(["उत्तरायण", "दक्षिणायन"]).toContain(result.ayana);
    expect(result.ritu).toBeTruthy();
  });

  it("returns sunrise and sunset times", () => {
    const result = computePanchang("2024-07-25", "29.3167", "80.1");
    expect(result._sunrise).toMatch(/^\d{2}:\d{2}$/);
    expect(result._sunset).toMatch(/^\d{2}:\d{2}$/);
  });

  it("returns null for invalid coordinates", () => {
    expect(computePanchang("2024-07-25", "", "")).toBeNull();
  });
});

describe("computeFullKundali", () => {
  it("computes full kundali for Champawat", () => {
    const result = computeFullKundali(
      "2024-07-25", "18:10",
      "29°19′00″ N", "80°06′00″ E",
      null, null
    );
    expect(result).not.toBeNull();
    expect(result.grahas).toBeTruthy();
    expect(result.lagna).toBeTruthy();
    expect(result.nearestPanchang).toBeTruthy();
  });

  it("returns all 9 grahas", () => {
    const result = computeFullKundali(
      "2024-07-25", "18:10",
      "29.3167", "80.1",
      null, null
    );
    const keys = Object.keys(result.grahas);
    expect(keys).toContain("surya");
    expect(keys).toContain("chandra");
    expect(keys).toContain("mangal");
    expect(keys).toContain("budh");
    expect(keys).toContain("guru");
    expect(keys).toContain("shukra");
    expect(keys).toContain("shani");
    expect(keys).toContain("rahu");
    expect(keys).toContain("ketu");
    expect(keys).toHaveLength(9);
  });

  it("returns lagna with rashi and position", () => {
    const result = computeFullKundali(
      "2024-07-25", "18:10",
      "29.3167", "80.1",
      null, null
    );
    expect(result.lagna.rashi).toBeTruthy();
    expect(typeof result.lagna.degrees).toBe("number");
    expect(typeof result.lagna.minutes).toBe("number");
    expect(result.lagna.nakshatra).toBeTruthy();
  });

  it("selects nearest panchang location", () => {
    const result = computeFullKundali(
      "2024-07-25", "18:10",
      "29.3167", "80.1",
      null, null
    );
    expect(result.nearestPanchang.name).toBeTruthy();
    expect(typeof result.nearestPanchang.distance).toBe("number");
  });

  it("returns null for invalid birth coordinates", () => {
    const result = computeFullKundali(
      "2024-07-25", "18:10",
      "", "",
      null, null
    );
    expect(result).toBeNull();
  });
});
