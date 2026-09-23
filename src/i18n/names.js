import {
  TITHI_NAMES, NAKSHATRA_NAMES, YOGA_NAMES, KARANA_NAMES, KARANA_FIXED,
  VARA_NAMES, MASA_NAMES, RITU_NAMES, RASHI_NAMES, SAMVATSARA_NAMES,
} from "../vedic/constants.js";
import { getLang } from "./runtime.js";

const EN = [
  [TITHI_NAMES, [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
  ]],
  [NAKSHATRA_NAMES, [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
    "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati",
  ]],
  [YOGA_NAMES, [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
    "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
    "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
    "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
    "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
    "Indra", "Vaidhriti",
  ]],
  [KARANA_NAMES, ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"]],
  [KARANA_FIXED, ["Shakuni", "Chatushpada", "Naga", "Kimstughna"]],
  [VARA_NAMES, ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]],
  [MASA_NAMES, [
    "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
    "Ashwin", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna",
  ]],
  [RITU_NAMES, [
    "Vasanta (Spring)", "Grishma (Summer)", "Varsha (Monsoon)",
    "Sharad (Autumn)", "Hemanta (Pre-winter)", "Shishira (Winter)",
  ]],
  [RASHI_NAMES, [
    "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
    "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)",
  ]],
  [SAMVATSARA_NAMES, [
    "Prabhava", "Vibhava", "Shukla", "Pramoduta", "Prajotpatti",
    "Angirasa", "Shrimukha", "Bhava", "Yuva", "Dhata",
    "Ishvara", "Bahudhanya", "Pramathi", "Vikrama", "Vrisha",
    "Chitrabhanu", "Subhanu", "Tarana", "Parthiva", "Vyaya",
    "Sarvajit", "Sarvadhari", "Virodhi", "Vikriti", "Khara",
    "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
    "Hemalambi", "Vilambi", "Vikari", "Sharvari", "Plava",
    "Shubhakrit", "Shobhakrit", "Krodhi", "Vishvavasu", "Parabhava",
    "Plavanga", "Kilaka", "Saumya", "Sadharana", "Virodhikrit",
    "Paridhavi", "Pramadicha", "Ananda", "Rakshasa", "Nala",
    "Pingala", "Kalayukti", "Siddharthi", "Raudra", "Durmati",
    "Dundubhi", "Rudhirodgari", "Raktakshi", "Krodhana", "Akshaya",
  ]],
  [
    ["सूर्य", "चन्द्र", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "राहु", "केतु"],
    ["Surya (Sun)", "Chandra (Moon)", "Mangal (Mars)", "Budh (Mercury)", "Guru (Jupiter)",
      "Shukra (Venus)", "Shani (Saturn)", "Rahu", "Ketu"],
  ],
  [["शुक्ल", "कृष्ण", "उत्तरायण", "दक्षिणायन"], ["Shukla", "Krishna", "Uttarayana", "Dakshinayana"]],
];

const HI_TO_EN = new Map();
for (const [hi, en] of EN) hi.forEach((name, i) => HI_TO_EN.has(name) || HI_TO_EN.set(name, en[i]));

export function localizeName(value) {
  if (getLang() !== "en" || typeof value !== "string") return value;
  return HI_TO_EN.get(value.trim()) ?? value;
}
