# कुण्डली निर्माण — Kundali Jataka Panchang

**A client-side Vedic astrology (Jyotish) application that computes real planetary positions, Panchang, and birth charts entirely in the browser — no server required.**

> शास्त्रीय गणना • पञ्चाङ्गम् • कुण्डली • दशा • फलादेश

---

## Features

### Astronomical Calculations (Client-Side)
- **Real planetary positions** using [astronomy-engine](https://github.com/cosinekitty/astronomy) (MIT, pure JS)
- **Lahiri Ayanamsa** — polynomial calculation validated against Indian Astronomical Ephemeris
- **Sidereal conversion** — tropical-to-sidereal for all 9 Vedic grahas
- **Graha Sphut** — sidereal longitude, Rashi, degree/minute/second, Nakshatra & Pada for:
  - Sun (सूर्य), Moon (चन्द्र), Mars (मंगल), Mercury (बुध), Jupiter (गुरु), Venus (शुक्र), Saturn (शनि)
  - Rahu & Ketu (mean lunar nodes)
  - Retrograde detection for all planets
- **Lagna (Ascendant)** — computed from RAMC, obliquity, and birth latitude

### Panchang (पञ्चाङ्ग)
All five elements computed from first principles, not looked up from tables:

| Element | Method |
|---------|--------|
| **Tithi** (तिथि) | `ceil((Moon° − Sun°) / 12)` → 1–30, with end time |
| **Nakshatra** (नक्षत्र) | `floor(Moon° / 13.333)` → 27 Nakshatras with Pada |
| **Yoga** (योग) | `floor((Sun° + Moon°) / 13.333)` → 27 Yogas |
| **Karana** (करण) | `floor(elongation / 6)` → 7 rotating + 4 fixed |
| **Vara** (वार) | Weekday at sunrise + Ghati/Pal from elapsed fraction |

Plus: Masa, Paksha, Ritu, Ayana, Samvatsara, Shaka Samvat, Vikram Samvat, Sunrise/Sunset.

### Trilingual Interface (i18n)
- **Hindi** (हिन्दी) — default
- **English**
- **Sanskrit** (संस्कृतम्)
- Runtime language switching with `localStorage` persistence
- All UI elements translated: labels, placeholders, select options, table headers, messages

### Birth Place Database
- **150+ cities** with search-as-you-type
- All Indian state/UT capitals and major metros
- Pilgrim cities: Ayodhya, Kashi, Dwarka, Badrinath, Somnath, Bodh Gaya, etc.
- International: Nepal (10 cities), Bangladesh, Sri Lanka, Pakistan
- Global: London, New York, Dubai, Tokyo, Singapore, Sydney, and more
- Each city entry: `[nameHi, nameEn, latitude, longitude, state, country, timezone]`

### UI/UX
- Dark/light theme toggle
- Responsive design (mobile-first)
- Step-by-step wizard: Jataka → Panchang → Birth Place → Panchang Detail → Kundali
- PDF export support
- Manual Panchang entry option
- Auto-fill coordinates on city selection

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Build** | Vite 6 + ES Modules |
| **Language** | Vanilla JavaScript (ES2020, no framework) |
| **Astronomy** | astronomy-engine v2.1 (MIT, ~200KB, client-side) |
| **Tests** | Vitest 3 — 170 tests across 19 files |
| **i18n** | Custom ~1KB runtime with JSON translation files |
| **Styling** | Pure CSS with CSS custom properties |

**Build output:** ~138KB JS (50KB gzipped) across 46 modules

---

## Project Structure

```
kundali/
├── index.html                    # Single-page app entry
├── style.css                     # All styles (dark/light themes)
├── package.json                  # Vite + Vitest + astronomy-engine
├── vite.config.js
│
├── src/
│   ├── main.js                   # App entry point
│   ├── state.js                  # Centralized state management
│   ├── dom.js                    # DOM element references
│   ├── events.js                 # Event binding
│   ├── init.js                   # Kundali calculation orchestrator
│   │
│   ├── astronomy/
│   │   ├── engine.js             # astronomy-engine wrapper (Sun, Moon, planets)
│   │   └── ayanamsa.js           # Lahiri Ayanamsa + sidereal conversion
│   │
│   ├── vedic/
│   │   ├── constants.js          # Rashi, Nakshatra, Tithi, Yoga names (Hindi)
│   │   ├── tithi.js              # Tithi calculation with end time
│   │   ├── nakshatra.js          # Nakshatra + Pada (prev/current/next)
│   │   ├── yoga.js               # Yoga calculation
│   │   ├── karana.js             # Karana (rotating + fixed)
│   │   ├── vara.js               # Vara (weekday) + Ghati/Pal
│   │   ├── masa.js               # Masa, Ritu, Ayana, Samvatsara, Samvat
│   │   ├── sunrise.js            # Sunrise/Sunset via astronomy-engine
│   │   ├── graha.js              # 9 Graha sidereal positions
│   │   └── lagna.js              # Ascendant (Lagna) calculation
│   │
│   ├── panchang/
│   │   ├── compute.js            # Full Panchang + Graha computation pipeline
│   │   ├── display.js            # Render Panchang to DOM
│   │   ├── format.js             # Display formatting
│   │   ├── loader.js             # Date-based Panchang loader
│   │   ├── places.js             # Panchang place data
│   │   ├── manual.js             # Manual Panchang entry UI
│   │   └── auto-select.js        # Nearest Panchang place finder
│   │
│   ├── birthplace/
│   │   ├── cities.js             # 150+ cities database
│   │   ├── search.js             # Search-as-you-type component
│   │   ├── data.js               # Legacy place data
│   │   └── cascade.js            # Legacy cascading dropdowns
│   │
│   ├── i18n/
│   │   ├── runtime.js            # Translation engine (~1KB)
│   │   ├── hi.json               # Hindi (110+ keys)
│   │   ├── en.json               # English
│   │   └── sa.json               # Sanskrit
│   │
│   ├── jataka/
│   │   ├── data.js               # Native (Jataka) data management
│   │   └── validate.js           # Form validation
│   │
│   ├── ui/
│   │   ├── helpers.js            # DOM utilities, message display
│   │   ├── theme.js              # Dark/light theme toggle
│   │   └── animate.js            # UI animations
│   │
│   ├── graha/
│   │   └── display.js            # Graha table rendering
│   │
│   ├── export/
│   │   └── pdf.js                # PDF export
│   │
│   └── utils/
│       ├── angle.js              # Angle normalization, DMS conversion
│       ├── date.js               # Julian Day, Julian Centuries
│       └── coordinates.js        # Coordinate parsing (DMS ↔ decimal)
│
└── tests/
    ├── astronomy/                # Ayanamsa, engine accuracy tests
    ├── vedic/                    # Tithi, Nakshatra, Yoga, Karana, Vara, Masa, Graha, Lagna
    ├── birthplace/               # Cities database integrity
    ├── i18n/                     # Translation runtime
    └── utils/                    # Angle, date, coordinate utilities
```

---

## Vedic Calculation Pipeline

```
Birth Date + Time + Location
        │
        ▼
┌─────────────────────────────┐
│  astronomy-engine            │
│  Tropical longitudes for     │
│  Sun, Moon, Mars, Mercury,   │
│  Jupiter, Venus, Saturn      │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Lahiri Ayanamsa             │
│  23.85° + T × 1.395°        │
│  (T = Julian centuries)      │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Sidereal Conversion         │
│  sidereal = tropical − aya   │
└──────────┬──────────────────┘
           │
     ┌─────┴──────┐
     ▼            ▼
┌─────────┐ ┌──────────┐
│ Panchang │ │  Grahas  │
│ Tithi    │ │  Sphut   │
│ Naksha.  │ │  Lagna   │
│ Yoga     │ │  Rahu    │
│ Karana   │ │  Ketu    │
│ Vara     │ │          │
└─────────┘ └──────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (or use the portable version)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/himanshu-GUI/kundali-jataka-panchang.git
cd kundali-jataka-panchang

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

Output goes to `dist/` — deploy as a static site to any CDN.

### Run Tests

```bash
npm test
```

170 tests across 19 test files covering:
- Astronomical accuracy (Sun/Moon positions vs JPL Horizons)
- Ayanamsa precision (validated against Indian Astronomical Ephemeris)
- All Panchang elements (Tithi, Nakshatra, Yoga, Karana, Vara, Masa)
- Graha Sphut and Lagna calculations
- Cities database integrity (no duplicates, valid coordinates, IANA timezones)
- i18n runtime (language switching, fallback chains)
- Utility functions (angle math, Julian Day, coordinate parsing)

---

## Accuracy Validation

| Calculation | Reference | Tolerance |
|-------------|-----------|-----------|
| Sun longitude | JPL Horizons | ±0.01° |
| Moon longitude | JPL Horizons | ±0.05° |
| Lahiri Ayanamsa (2000) | Indian Astronomical Ephemeris | ≈23.86° |
| Lahiri Ayanamsa (2024) | Indian Astronomical Ephemeris | ≈24.17° |
| Sunrise/Sunset | astronomy-engine SearchRiseSet | ±2 min |

---

## Roadmap

- [x] Phase 1 — Vite + ES Module architecture (46 modules)
- [x] Phase 2 — Trilingual i18n (Hindi/English/Sanskrit)
- [x] Phase 3 — Utility layer (angle, date, coordinates)
- [x] Phase 4 — astronomy-engine integration
- [x] Phase 5 — Lahiri Ayanamsa + sidereal conversion
- [x] Phase 6 — Full Panchang computation engine
- [x] Phase 7 — 150+ city search-as-you-type database
- [ ] Phase 8 — Dynamic timezone + worldwide sunrise/sunset
- [ ] Phase 9 — Graha Sphut + Lagna UI integration
- [ ] Phase 10 — Rashi Chart (North Indian diamond SVG)
- [ ] Phase 11 — Navamsha Chart (D9)
- [ ] Phase 12 — Vimshottari Dasha system
- [ ] Phase 13 — Performance optimization (code-splitting, Web Worker)
- [ ] Phase 14 — PWA + offline support
- [ ] Phase 15 — Print/export + global CDN deployment

---

## License

This project uses [astronomy-engine](https://github.com/cosinekitty/astronomy) (MIT License) for planetary calculations.

---

## Acknowledgements

- **astronomy-engine** by Don Cross — MIT-licensed pure JS astronomical calculations
- **Lahiri Ayanamsa** — based on the Indian Astronomical Ephemeris standard
- Vedic calculation methods based on traditional Siddhantic astronomy (सिद्धान्त ज्योतिष)
