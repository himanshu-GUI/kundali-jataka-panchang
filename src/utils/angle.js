export function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

export function degreesToRadians(deg) {
  return deg * Math.PI / 180;
}

export function radiansToDegrees(rad) {
  return rad * 180 / Math.PI;
}
