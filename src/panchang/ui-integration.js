/**
 * UI Integration Layer
 * Connects all panchang, graha, and lagna calculations with the UI
 */

import { PanchangManager } from './manager.js';
import { computeGrahaSphut, computeGrahaTraditional } from '../vedic/graha.js';
import { computeLagna, computeLagnaTraditional } from '../vedic/lagna.js';

/**
 * Complete Kundali Calculation and Display Integration
 * Orchestrates all calculations and updates UI
 */
export class KundaliIntegration {
  constructor() {
    this.currentKundali = null;
    this.isCalculating = false;
  }

  /**
   * Main entry point: Calculate complete kundali
   * @param {Object} birthData - {date, time, name, father, mother, lat, lon, location}
   * @returns {Promise<Object>}
   */
  async calculateKundali(birthData) {
    try {
      this.isCalculating = true;
      console.log('🔄 Starting complete kundali calculation...');

      const { date, time, lat, lon } = birthData;

      // Step 1: Get Panchang
      console.log('📊 Step 1: Computing Panchang...');
      const panchang = await PanchangManager.get(date, time, lat, lon);

      if (panchang.error) {
        throw new Error('Panchang calculation failed: ' + panchang.error);
      }

      // Step 2: Compute Lagna (Try traditional first, fall back to modern)
      console.log('🌙 Step 2: Computing Lagna...');
      let lagna = await this.computeLagnaWithFallback(date, time, lat, lon);

      // Step 3: Compute Grahas (Try traditional first, fall back to modern)
      console.log('🪐 Step 3: Computing Graha Positions...');
      let grahas = await this.computeGrahasWithFallback(date, time, lat, lon);

      // Step 4: Compute Navamsha (D-9)
      console.log('📈 Step 4: Computing Navamsha Chart (D-9)...');
      const navamsha = this.computeNavamsha(grahas, lagna);

      // Step 5: Compute Dasha System
      console.log('⏳ Step 5: Computing Dasha System...');
      const dasha = this.computeDashaSystem(panchang, lagna);

      // Compile complete kundali
      this.currentKundali = {
        profile: birthData,
        panchang,
        lagna,
        grahas,
        navamsha,
        dasha,
        generatedAt: new Date().toISOString()
      };

      console.log('✅ Kundali calculation complete!');
      this.isCalculating = false;

      return this.currentKundali;

    } catch (error) {
      console.error('❌ Kundali calculation failed:', error);
      this.isCalculating = false;
      throw error;
    }
  }

  /**
   * Compute Lagna with fallback
   */
  async computeLagnaWithFallback(date, time, lat, lon) {
    try {
      // Try traditional method
      const traditional = computeLagnaTraditional(date, time, lat, lon);
      if (traditional && !traditional.error) {
        console.log('✓ Using traditional lagna method');
        return traditional;
      }
    } catch (e) {
      console.warn('Traditional lagna failed, trying modern:', e.message);
    }

    // Fall back to modern method
    return computeLagna(date, time, lat, lon);
  }

  /**
   * Compute Grahas with fallback
   */
  async computeGrahasWithFallback(date, time, lat, lon) {
    try {
      // Try traditional method
      const traditional = computeGrahaTraditional(date, time, lat, lon);
      if (traditional && Object.keys(traditional).length > 0) {
        console.log('✓ Using traditional graha method');
        return traditional;
      }
    } catch (e) {
      console.warn('Traditional graha failed, trying modern:', e.message);
    }

    // Fall back to modern method
    const [y, m, d] = date.split('-').map(Number);
    const [h, min] = time.split(':').map(Number);
    const birthDate = new Date(y, m - 1, d, h, min, 0);
    return computeGrahaSphut(birthDate);
  }

  /**
   * Compute Navamsha (9th Divisional Chart)
   */
  computeNavamsha(grahas, lagna) {
    const RASHI_NAMES = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];

    const computeNavamshaPosition = (deg) => {
      const navDeg = (deg * 9) % 360;
      const rashiIdx = Math.floor(navDeg / 30);
      return {
        navamsha: navDeg,
        rashi: RASHI_NAMES[rashiIdx],
        position: navDeg % 30
      };
    };

    const navamshaData = {};

    // Lagna Navamsha
    navamshaData.lagna = computeNavamshaPosition(lagna.sidereal);

    // Graha Navamshas
    for (const [key, graha] of Object.entries(grahas)) {
      if (graha.sidereal !== undefined && !isNaN(graha.sidereal)) {
        navamshaData[key] = {
          ...computeNavamshaPosition(graha.sidereal),
          name: graha.name,
          nameEn: graha.nameEn
        };
      }
    }

    return navamshaData;
  }

  /**
   * Compute Dasha System (Vimshottari - 120 years)
   */
  computeDashaSystem(panchang, lagna) {
    const NAKSHATRA_LORDS = [
      { nakshatra: 'अश्विनी', lord: 'Ketu', years: 7 },
      { nakshatra: 'भरणी', lord: 'Venus', years: 20 },
      { nakshatra: 'कृत्तिका', lord: 'Sun', years: 6 },
      { nakshatra: 'रोहिणी', lord: 'Moon', years: 10 },
      { nakshatra: 'मृगशिरा', lord: 'Mars', years: 7 },
      { nakshatra: 'आर्द्रा', lord: 'Rahu', years: 18 },
      { nakshatra: 'पुनर्वसु', lord: 'Jupiter', years: 16 },
      { nakshatra: 'पुष्य', lord: 'Saturn', years: 19 },
      { nakshatra: 'आश्लेषा', lord: 'Mercury', years: 17 },
      { nakshatra: 'मघा', lord: 'Ketu', years: 7 },
      { nakshatra: 'पूर्वाफाल्गुनी', lord: 'Venus', years: 20 },
      { nakshatra: 'उत्तरफाल्गुनी', lord: 'Sun', years: 6 },
      { nakshatra: 'हस्त', lord: 'Moon', years: 10 },
      { nakshatra: 'चित्रा', lord: 'Mars', years: 7 },
      { nakshatra: 'स्वाती', lord: 'Rahu', years: 18 },
      { nakshatra: 'विशाखा', lord: 'Jupiter', years: 16 },
      { nakshatra: 'अनुराधा', lord: 'Saturn', years: 19 },
      { nakshatra: 'ज्येष्ठा', lord: 'Mercury', years: 17 },
      { nakshatra: 'मूल', lord: 'Ketu', years: 7 },
      { nakshatra: 'पूर्वाषाढ़', lord: 'Venus', years: 20 },
      { nakshatra: 'उत्तरषाढ़', lord: 'Sun', years: 6 },
      { nakshatra: 'श्रवण', lord: 'Moon', years: 10 },
      { nakshatra: 'धनिष्ठा', lord: 'Mars', years: 7 },
      { nakshatra: 'शतभिषक्', lord: 'Rahu', years: 18 },
      { nakshatra: 'पूर्वाभाद्रपद', lord: 'Jupiter', years: 16 },
      { nakshatra: 'उत्तराभाद्रपद', lord: 'Saturn', years: 19 },
      { nakshatra: 'रेवती', lord: 'Mercury', years: 17 }
    ];

    const DASHA_SEQUENCE = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

    // Get birth nakshatra index
    const birthNakIdx = panchang.nakshatra?.index || 0;
    const birthNakLord = NAKSHATRA_LORDS[birthNakIdx]?.lord || 'Saturn';
    const startDashaIdx = DASHA_SEQUENCE.indexOf(birthNakLord);

    const dashaTimeline = [];
    let currentAge = 0;

    for (let i = 0; i < 9; i++) {
      const lordName = DASHA_SEQUENCE[(startDashaIdx + i) % 9];
      const lordData = NAKSHATRA_LORDS.find(n => n.lord === lordName);
      const years = lordData?.years || 10;

      dashaTimeline.push({
        sequence: i + 1,
        lord: lordName,
        years,
        startAge: currentAge,
        endAge: currentAge + years,
        active: false // Will be set based on current age
      });

      currentAge += years;
    }

    return {
      sequence: dashaTimeline,
      birthNakshatra: NAKSHATRA_LORDS[birthNakIdx]?.nakshatra,
      birthLord: birthNakLord,
      totalYears: 120
    };
  }

  /**
   * Format graha data for UI display (fixes NaN issue)
   */
  formatGrahasForDisplay(grahas) {
    const formatted = {};

    for (const [key, graha] of Object.entries(grahas)) {
      // Validate that graha has required numeric fields
      if (graha && typeof graha === 'object') {
        formatted[key] = {
          key: key,
          nameEn: graha.nameEn || 'Unknown',
          name: graha.name || 'अज्ञात',
          rashi: graha.rashi || '—',
          rashiIndex: typeof graha.rashiIndex === 'number' ? graha.rashiIndex : -1,
          degrees: typeof graha.degrees === 'number' ? graha.degrees : 0,
          minutes: typeof graha.minutes === 'number' ? graha.minutes : 0,
          seconds: typeof graha.seconds === 'number' ? graha.seconds : 0,
          totalDeg: typeof graha.totalDeg === 'number' ? graha.totalDeg : 0,
          formatted: graha.formatted || '—',
          nakshatra: graha.nakshatra || '—',
          nakshatraPada: graha.nakshatraPada || 0,
          retrograde: graha.retrograde ? '℞' : 'Direct'
        };
      }
    }

    return formatted;
  }

  /**
   * Format lagna data for UI display
   */
  formatLagnaForDisplay(lagna) {
    return {
      rashi: lagna.rashi || '—',
      rashiIndex: typeof lagna.rashiIndex === 'number' ? lagna.rashiIndex : -1,
      degrees: typeof lagna.degrees === 'number' ? lagna.degrees : 0,
      minutes: typeof lagna.minutes === 'number' ? lagna.minutes : 0,
      seconds: typeof lagna.seconds === 'number' ? lagna.seconds : 0,
      totalDeg: typeof lagna.totalDeg === 'number' ? lagna.totalDeg : 0,
      formatted: lagna.formatted || '—',
      nakshatra: lagna.nakshatra || '—',
      nakshatraPada: lagna.nakshatraPada || 0
    };
  }

  /**
   * Get current kundali (formatted for UI)
   */
  getFormattedKundali() {
    if (!this.currentKundali) {
      return null;
    }

    return {
      profile: this.currentKundali.profile,
      panchang: this.currentKundali.panchang,
      lagna: this.formatLagnaForDisplay(this.currentKundali.lagna),
      grahas: this.formatGrahasForDisplay(this.currentKundali.grahas),
      navamsha: this.currentKundali.navamsha,
      dasha: this.currentKundali.dasha,
      generatedAt: this.currentKundali.generatedAt
    };
  }
}

// Export singleton instance
export const kundaliIntegration = new KundaliIntegration();
