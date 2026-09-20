import * as Astronomy from "astronomy-engine";

export function makeObserver(latDeg, lonDeg, elevation = 0) {
  return new Astronomy.Observer(latDeg, lonDeg, elevation);
}

export function sunLongitude(date) {
  return Astronomy.EclipticGeoMoon ?
    Astronomy.SunPosition(date).elon :
    Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, date, true)).elon;
}

export function moonLongitude(date) {
  return Astronomy.EclipticGeoMoon
    ? Astronomy.EclipticGeoMoon(date).lon
    : Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, date, true)).elon;
}

export function searchSunrise(observer, date) {
  return Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, date, 1);
}

export function searchSunset(observer, date) {
  return Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, date, 1);
}

export function searchNextSunrise(observer, date) {
  const nextDay = new Date(date.getTime() + 86400000);
  return Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, nextDay, 1);
}

export { Astronomy };
