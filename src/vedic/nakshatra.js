import { NAKSHATRA_NAMES } from "./constants.js";

const NAKSHATRA_SPAN = 360 / 27;

export function computeNakshatra(moonSid) {
  const index = Math.floor(moonSid / NAKSHATRA_SPAN);
  const fraction = (moonSid % NAKSHATRA_SPAN) / NAKSHATRA_SPAN;
  const pada = Math.floor(fraction * 4) + 1;
  return {
    index: index % 27,
    name: NAKSHATRA_NAMES[index % 27],
    fraction,
    pada,
  };
}

export function getPreviousNakshatra(index) {
  const prev = (index - 1 + 27) % 27;
  return { index: prev, name: NAKSHATRA_NAMES[prev] };
}

export function getNextNakshatra(index) {
  const next = (index + 1) % 27;
  return { index: next, name: NAKSHATRA_NAMES[next] };
}
