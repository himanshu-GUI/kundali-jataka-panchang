const J2000 = 2451545.0;

export function dateToJulianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

export function julianCenturies(date) {
  return (dateToJulianDay(date) - J2000) / 36525.0;
}

export { J2000 };
