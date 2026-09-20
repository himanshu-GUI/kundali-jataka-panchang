import { describe, it, expect } from "vitest";
import {
  makeObserver,
  sunLongitude,
  moonLongitude,
  searchSunrise,
  searchSunset,
  Astronomy,
} from "../../src/astronomy/engine.js";

describe("makeObserver", () => {
  it("creates an Astronomy.Observer with lat/lon", () => {
    const obs = makeObserver(28.6139, 77.209);
    expect(obs.latitude).toBeCloseTo(28.6139, 3);
    expect(obs.longitude).toBeCloseTo(77.209, 3);
  });
});

describe("sunLongitude", () => {
  it("returns tropical longitude between 0-360", () => {
    const date = new Date("2024-07-25T12:00:00Z");
    const lon = sunLongitude(date);
    expect(lon).toBeGreaterThanOrEqual(0);
    expect(lon).toBeLessThan(360);
  });

  it("Sun is near 120° (Cancer/Leo) in late July", () => {
    const date = new Date("2024-07-25T12:00:00Z");
    const lon = sunLongitude(date);
    expect(lon).toBeGreaterThan(110);
    expect(lon).toBeLessThan(135);
  });
});

describe("moonLongitude", () => {
  it("returns tropical longitude between 0-360", () => {
    const date = new Date("2024-07-25T12:00:00Z");
    const lon = moonLongitude(date);
    expect(lon).toBeGreaterThanOrEqual(0);
    expect(lon).toBeLessThan(360);
  });

  it("changes significantly over 24 hours (~13°/day)", () => {
    const d1 = new Date("2024-07-25T00:00:00Z");
    const d2 = new Date("2024-07-26T00:00:00Z");
    let diff = moonLongitude(d2) - moonLongitude(d1);
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;
    expect(Math.abs(diff)).toBeGreaterThan(10);
    expect(Math.abs(diff)).toBeLessThan(16);
  });
});

describe("searchSunrise / searchSunset", () => {
  it("finds sunrise for Delhi on a known date", () => {
    const obs = makeObserver(28.6139, 77.209);
    const date = new Date("2024-07-25T00:00:00Z");
    const rise = searchSunrise(obs, date);
    expect(rise).not.toBeNull();
    const riseHourUTC = rise.date.getUTCHours() + rise.date.getUTCMinutes() / 60;
    // Delhi sunrise ~0:00-1:00 UTC (5:30-6:30 IST)
    expect(riseHourUTC).toBeGreaterThan(-0.5);
    expect(riseHourUTC).toBeLessThan(2);
  });

  it("finds sunset for Delhi on a known date", () => {
    const obs = makeObserver(28.6139, 77.209);
    const date = new Date("2024-07-25T00:00:00Z");
    const set = searchSunset(obs, date);
    expect(set).not.toBeNull();
    const setHourUTC = set.date.getUTCHours() + set.date.getUTCMinutes() / 60;
    // Delhi sunset ~13:00-14:00 UTC (18:30-19:30 IST)
    expect(setHourUTC).toBeGreaterThan(12);
    expect(setHourUTC).toBeLessThan(15);
  });

  it("sunrise is before sunset", () => {
    const obs = makeObserver(28.6139, 77.209);
    const date = new Date("2024-07-25T00:00:00Z");
    const rise = searchSunrise(obs, date);
    const set = searchSunset(obs, date);
    expect(rise.date.getTime()).toBeLessThan(set.date.getTime());
  });
});
