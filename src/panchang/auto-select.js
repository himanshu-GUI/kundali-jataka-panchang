import { haversineDistance } from "../utils/coordinates.js";

const PANCHANG_LOCATIONS = [
  { key: "jalandhar", name: "दिवाकर पंचांग (जालंधर)", lat: 31.3260, lon: 75.5762 },
  { key: "haridwar", name: "हरिद्वार पंचांग", lat: 29.9457, lon: 78.1642 },
  { key: "delhi", name: "दिल्ली पंचांग", lat: 28.6139, lon: 77.2090 },
  { key: "varanasi", name: "काशी पंचांग (वाराणसी)", lat: 25.3176, lon: 83.0068 },
  { key: "ujjain", name: "उज्जैन पंचांग", lat: 23.1765, lon: 75.7885 },
  { key: "puri", name: "पुरी पंचांग", lat: 19.8135, lon: 85.8312 },
  { key: "kolkata", name: "कोलकाता पंचांग", lat: 22.5726, lon: 88.3639 },
  { key: "mumbai", name: "मुम्बई पंचांग", lat: 19.0760, lon: 72.8777 },
  { key: "chennai", name: "चेन्नई पंचांग", lat: 13.0827, lon: 80.2707 },
  { key: "jaipur", name: "जयपुर पंचांग", lat: 26.9124, lon: 75.7873 },
  { key: "lucknow", name: "लखनऊ पंचांग", lat: 26.8467, lon: 80.9462 },
  { key: "patna", name: "पटना पंचांग", lat: 25.6093, lon: 85.1376 },
  { key: "ahmedabad", name: "अहमदाबाद पंचांग", lat: 23.0225, lon: 72.5714 },
  { key: "hyderabad", name: "हैदराबाद पंचांग", lat: 17.3850, lon: 78.4867 },
  { key: "bangalore", name: "बेंगलुरु पंचांग", lat: 12.9716, lon: 77.5946 },
  { key: "kathmandu", name: "काठमांडू पंचांग", lat: 27.7172, lon: 85.3240 },
];

export function findNearestPanchang(birthLat, birthLon) {
  let nearest = PANCHANG_LOCATIONS[0];
  let minDist = Infinity;

  for (const loc of PANCHANG_LOCATIONS) {
    const dist = haversineDistance(birthLat, birthLon, loc.lat, loc.lon);
    if (dist < minDist) {
      minDist = dist;
      nearest = loc;
    }
  }

  return { ...nearest, distance: Math.round(minDist) };
}

export { PANCHANG_LOCATIONS };
