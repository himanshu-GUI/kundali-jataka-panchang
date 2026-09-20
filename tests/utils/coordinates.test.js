import { describe, it, expect } from "vitest";
import { parseCoordinate, haversineDistance } from "../../src/utils/coordinates.js";

describe("parseCoordinate", () => {
  it("parses decimal string", () => {
    expect(parseCoordinate("29.3167")).toBeCloseTo(29.3167, 3);
  });

  it("parses decimal with degree symbol", () => {
    expect(parseCoordinate("29.3167°")).toBeCloseTo(29.3167, 3);
  });

  it("parses decimal with N direction", () => {
    expect(parseCoordinate("29.3167° N")).toBeCloseTo(29.3167, 3);
  });

  it("parses DMS format: 29°19′00″ N", () => {
    expect(parseCoordinate("29°19′00″ N")).toBeCloseTo(29.3167, 2);
  });

  it("parses DMS format: 80°06′00″ E", () => {
    expect(parseCoordinate("80°06′00″ E")).toBeCloseTo(80.1, 2);
  });

  it("negates S direction", () => {
    expect(parseCoordinate("29°19′00″ S")).toBeCloseTo(-29.3167, 2);
  });

  it("negates W direction", () => {
    expect(parseCoordinate("80°06′00″ W")).toBeCloseTo(-80.1, 2);
  });

  it("passes through numbers directly", () => {
    expect(parseCoordinate(29.3167)).toBeCloseTo(29.3167, 3);
  });

  it("parses plain numeric string", () => {
    expect(parseCoordinate("-80.1")).toBeCloseTo(-80.1, 3);
  });

  it("returns null for empty/null/undefined", () => {
    expect(parseCoordinate("")).toBeNull();
    expect(parseCoordinate(null)).toBeNull();
    expect(parseCoordinate(undefined)).toBeNull();
  });
});

describe("haversineDistance", () => {
  it("returns 0 for same point", () => {
    expect(haversineDistance(29, 80, 29, 80)).toBeCloseTo(0, 3);
  });

  it("computes ~200 km from Champawat to Haridwar", () => {
    const d = haversineDistance(29.3167, 80.1, 29.9457, 78.1642);
    expect(d).toBeGreaterThan(150);
    expect(d).toBeLessThan(250);
  });

  it("computes ~1100 km from Delhi to Chennai", () => {
    const d = haversineDistance(28.6139, 77.209, 13.0827, 80.2707);
    expect(d).toBeGreaterThan(1500);
    expect(d).toBeLessThan(1900);
  });

  it("is symmetric", () => {
    const d1 = haversineDistance(29, 80, 28, 77);
    const d2 = haversineDistance(28, 77, 29, 80);
    expect(d1).toBeCloseTo(d2, 5);
  });
});
