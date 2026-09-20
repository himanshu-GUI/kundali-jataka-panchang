import { describe, it, expect } from "vitest";
import { computeVara } from "../../src/vedic/vara.js";

describe("computeVara", () => {
  it("returns Ravivaar for Sunday", () => {
    const sunday = new Date("2024-07-21T12:00:00Z");
    expect(sunday.getDay()).toBe(0);
    const result = computeVara(sunday);
    expect(result.index).toBe(0);
    expect(result.name).toBe("रविवार");
  });

  it("returns Guruvaar for Thursday (2024-07-25)", () => {
    const thursday = new Date("2024-07-25T12:00:00Z");
    expect(thursday.getDay()).toBe(4);
    const result = computeVara(thursday);
    expect(result.index).toBe(4);
    expect(result.name).toBe("गुरुवार");
  });

  it("returns Shanivaar for Saturday", () => {
    const saturday = new Date("2024-07-20T12:00:00Z");
    expect(saturday.getDay()).toBe(6);
    const result = computeVara(saturday);
    expect(result.index).toBe(6);
    expect(result.name).toBe("शनिवार");
  });
});
