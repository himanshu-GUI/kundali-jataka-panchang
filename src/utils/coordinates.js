export function parseCoordinate(str) {
  if (typeof str === "number") return str;
  if (!str) return null;
  str = String(str).trim();
  const decMatch = str.match(/^([\d.]+)°?\s*([NSEW])?$/i);
  if (decMatch) {
    let val = parseFloat(decMatch[1]);
    const dir = (decMatch[2] || "").toUpperCase();
    if (dir === "S" || dir === "W") val = -val;
    return val;
  }
  const dmsMatch = str.match(/(\d+)[°]\s*(\d+)[′']\s*(\d+)[″"]?\s*([NSEW])/i);
  if (dmsMatch) {
    let val = parseInt(dmsMatch[1]) + parseInt(dmsMatch[2]) / 60 + parseInt(dmsMatch[3]) / 3600;
    const dir = dmsMatch[4].toUpperCase();
    if (dir === "S" || dir === "W") val = -val;
    return val;
  }
  const numMatch = str.match(/^-?[\d.]+$/);
  if (numMatch) return parseFloat(str);
  return null;
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
