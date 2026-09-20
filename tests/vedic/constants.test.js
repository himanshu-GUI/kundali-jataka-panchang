import { describe, it, expect } from "vitest";
import {
  TITHI_NAMES,
  NAKSHATRA_NAMES,
  YOGA_NAMES,
  KARANA_NAMES,
  KARANA_FIXED,
  VARA_NAMES,
  MASA_NAMES,
  RITU_NAMES,
  RASHI_NAMES,
  SAMVATSARA_NAMES,
  AYANA_NAMES,
} from "../../src/vedic/constants.js";

describe("Vedic Constants", () => {
  it("TITHI_NAMES has exactly 30 entries", () => {
    expect(TITHI_NAMES).toHaveLength(30);
  });

  it("TITHI_NAMES starts with Pratipada and ends with Amavasya", () => {
    expect(TITHI_NAMES[0]).toBe("प्रतिपदा");
    expect(TITHI_NAMES[14]).toBe("पूर्णिमा");
    expect(TITHI_NAMES[29]).toBe("अमावस्या");
  });

  it("NAKSHATRA_NAMES has exactly 27 entries", () => {
    expect(NAKSHATRA_NAMES).toHaveLength(27);
  });

  it("NAKSHATRA_NAMES starts with Ashwini and ends with Revati", () => {
    expect(NAKSHATRA_NAMES[0]).toBe("अश्विनी");
    expect(NAKSHATRA_NAMES[26]).toBe("रेवती");
  });

  it("YOGA_NAMES has exactly 27 entries", () => {
    expect(YOGA_NAMES).toHaveLength(27);
  });

  it("KARANA_NAMES has 7 rotating karanas", () => {
    expect(KARANA_NAMES).toHaveLength(7);
    expect(KARANA_NAMES[0]).toBe("बव");
  });

  it("KARANA_FIXED has 4 fixed karanas", () => {
    expect(KARANA_FIXED).toHaveLength(4);
    expect(KARANA_FIXED[3]).toBe("किंस्तुघ्न");
  });

  it("VARA_NAMES has 7 days starting with Ravivaar", () => {
    expect(VARA_NAMES).toHaveLength(7);
    expect(VARA_NAMES[0]).toBe("रविवार");
    expect(VARA_NAMES[6]).toBe("शनिवार");
  });

  it("MASA_NAMES has 12 months starting with Chaitra", () => {
    expect(MASA_NAMES).toHaveLength(12);
    expect(MASA_NAMES[0]).toBe("चैत्र");
  });

  it("RITU_NAMES has 6 seasons", () => {
    expect(RITU_NAMES).toHaveLength(6);
    expect(RITU_NAMES[0]).toBe("वसन्त");
  });

  it("RASHI_NAMES has 12 signs starting with Mesha", () => {
    expect(RASHI_NAMES).toHaveLength(12);
    expect(RASHI_NAMES[0]).toBe("मेष");
    expect(RASHI_NAMES[11]).toBe("मीन");
  });

  it("SAMVATSARA_NAMES has 60 year names", () => {
    expect(SAMVATSARA_NAMES).toHaveLength(60);
    expect(SAMVATSARA_NAMES[0]).toBe("प्रभव");
  });

  it("AYANA_NAMES has uttarayana and dakshinayana", () => {
    expect(AYANA_NAMES.uttarayana).toBe("उत्तरायण");
    expect(AYANA_NAMES.dakshinayana).toBe("दक्षिणायन");
  });
});
