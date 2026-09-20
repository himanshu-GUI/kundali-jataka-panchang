import { describe, it, expect, beforeEach } from "vitest";
import hi from "../../src/i18n/hi.json";
import en from "../../src/i18n/en.json";
import sa from "../../src/i18n/sa.json";

describe("Translation JSON files", () => {
  const hiKeys = Object.keys(hi);
  const enKeys = Object.keys(en);
  const saKeys = Object.keys(sa);

  it("Hindi has at least 80 translation keys", () => {
    expect(hiKeys.length).toBeGreaterThanOrEqual(80);
  });

  it("English has all keys that Hindi has", () => {
    for (const key of hiKeys) {
      expect(en[key], `Missing English key: ${key}`).toBeTruthy();
    }
  });

  it("Sanskrit has all keys that Hindi has", () => {
    for (const key of hiKeys) {
      expect(sa[key], `Missing Sanskrit key: ${key}`).toBeTruthy();
    }
  });

  it("No extra keys in English not in Hindi", () => {
    for (const key of enKeys) {
      expect(hi[key], `Extra English key: ${key}`).toBeTruthy();
    }
  });

  it("No extra keys in Sanskrit not in Hindi", () => {
    for (const key of saKeys) {
      expect(hi[key], `Extra Sanskrit key: ${key}`).toBeTruthy();
    }
  });

  it("All Hindi values are non-empty strings", () => {
    for (const [key, val] of Object.entries(hi)) {
      expect(typeof val).toBe("string");
      expect(val.length, `Empty value for key: ${key}`).toBeGreaterThan(0);
    }
  });

  it("All English values are non-empty strings", () => {
    for (const [key, val] of Object.entries(en)) {
      expect(typeof val).toBe("string");
      expect(val.length, `Empty value for key: ${key}`).toBeGreaterThan(0);
    }
  });

  it("English and Hindi differ for non-symbol keys", () => {
    const diffCount = hiKeys.filter(k => hi[k] !== en[k]).length;
    expect(diffCount).toBeGreaterThan(50);
  });
});
