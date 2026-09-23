/**
 * UI Event Handler
 * Connects form inputs to kundali calculations and displays results
 */

import { kundaliIntegration } from './ui-integration.js';
import { DOM } from '../dom.js';
import { state } from '../state.js';
import { showMessage } from '../ui/helpers.js';
import { t } from '../i18n/runtime.js';

/**
 * Handle kundali calculation from form submission
 */
export async function handleKundaliCalculation() {
  try {
    // Show loading state
    if (DOM.calculateBtn) {
      DOM.calculateBtn.disabled = true;
      DOM.calculateBtn.textContent = '⏳ गणना हो रही है...';
    }

    // Collect birth data from form
    const birthData = {
      name: DOM.birthName?.value || 'Unnamed',
      father: DOM.fatherName?.value || '—',
      mother: DOM.motherName?.value || '—',
      date: state.birthDate || '2024-07-25',
      time: state.birthTime || '18:10:00',
      lat: state.birthCoords?.lat || 29.24,
      lon: state.birthCoords?.lon || 80.10,
      location: state.selectedCity?.name || 'Unknown'
    };

    console.log('📋 Birth Data:', birthData);

    // Run calculations
    const kundali = await kundaliIntegration.calculateKundali(birthData);

    console.log('✅ Kundali Calculated:', kundali);

    // Store in state
    state.currentKundali = kundali;

    // Display results
    displayKundaliResults(kundali);

    // Show success message
    if (DOM.resultMessage) {
      showMessage(
        DOM.resultMessage,
        `✅ कुंडली सफलतापूर्वक तैयार की गई - ${birthData.name}`,
        'success'
      );
    }

  } catch (error) {
    console.error('❌ Calculation error:', error);

    if (DOM.resultMessage) {
      showMessage(
        DOM.resultMessage,
        `❌ त्रुटि: ${error.message}`,
        'error'
      );
    }

  } finally {
    // Reset button
    if (DOM.calculateBtn) {
      DOM.calculateBtn.disabled = false;
      DOM.calculateBtn.textContent = '✓ कुंडली बनाएं';
    }
  }
}

/**
 * Display kundali results in the UI
 */
function displayKundaliResults(kundali) {
  const formatted = kundaliIntegration.getFormattedKundali();

  // Display Panchang
  displayPanchang(formatted.panchang);

  // Display Lagna
  displayLagna(formatted.lagna);

  // Display Grahas
  displayGrahas(formatted.grahas);

  // Display Navamsha Summary
  displayNavamshaSummary(formatted.navamsha);

  // Display Dasha
  displayDasha(formatted.dasha);

  // Update UI panels
  updateUIWithResults(formatted);
}

/**
 * Display panchang details
 */
function displayPanchang(panchang) {
  if (!panchang) return;

  console.log('📊 Displaying Panchang...');

  // Update Panchang fields in UI
  const panchangElements = {
    tithi: document.getElementById('display-tithi'),
    nakshatra: document.getElementById('display-nakshatra'),
    yoga: document.getElementById('display-yoga'),
    karana: document.getElementById('display-karana'),
    vara: document.getElementById('display-vara'),
    masa: document.getElementById('display-masa'),
    ritu: document.getElementById('display-ritu'),
    ayana: document.getElementById('display-ayana'),
    shakaSamvat: document.getElementById('display-shaka-samvat'),
    vikramSamvat: document.getElementById('display-vikram-samvat')
  };

  if (panchangElements.tithi && panchang.tithi?.[0]) {
    panchangElements.tithi.textContent = panchang.tithi[0].name;
  }

  if (panchangElements.nakshatra && panchang.currentNakshatra) {
    panchangElements.nakshatra.textContent = panchang.currentNakshatra.name;
  }

  if (panchangElements.yoga && panchang.yoga) {
    panchangElements.yoga.textContent = panchang.yoga.name || '—';
  }

  if (panchangElements.karana && panchang.karana) {
    panchangElements.karana.textContent = panchang.karana.name || '—';
  }

  if (panchangElements.vara && panchang.vara) {
    panchangElements.vara.textContent = panchang.vara.name || '—';
  }

  if (panchangElements.masa && panchang.masa) {
    panchangElements.masa.textContent = panchang.masa || '—';
  }

  if (panchangElements.ritu && panchang.ritu) {
    panchangElements.ritu.textContent = panchang.ritu || '—';
  }

  if (panchangElements.ayana && panchang.ayana) {
    panchangElements.ayana.textContent = panchang.ayana || '—';
  }

  if (panchangElements.shakaSamvat && panchang.shakaSamvat) {
    panchangElements.shakaSamvat.textContent = panchang.shakaSamvat;
  }

  if (panchangElements.vikramSamvat && panchang.vikramSamvat) {
    panchangElements.vikramSamvat.textContent = panchang.vikramSamvat;
  }
}

/**
 * Display lagna details
 */
function displayLagna(lagna) {
  if (!lagna) return;

  console.log('🌙 Displaying Lagna...');

  const lagnaElement = document.getElementById('display-lagna');
  if (lagnaElement) {
    lagnaElement.textContent = lagna.formatted || `${lagna.rashi} ${lagna.degrees}° ${lagna.minutes}' ${lagna.seconds}"`;
  }

  const lagnaRashiElement = document.getElementById('display-lagna-rashi');
  if (lagnaRashiElement) {
    lagnaRashiElement.textContent = lagna.rashi || '—';
  }

  const lagnaNakElement = document.getElementById('display-lagna-nakshatra');
  if (lagnaNakElement) {
    lagnaNakElement.textContent = lagna.nakshatra || '—';
  }
}

/**
 * Display graha positions
 */
function displayGrahas(grahas) {
  if (!grahas || Object.keys(grahas).length === 0) return;

  console.log('🪐 Displaying Grahas...');

  const grahaContainer = document.getElementById('grahas-container');
  if (!grahaContainer) return;

  grahaContainer.innerHTML = '';

  const GRAHA_ORDER = ['surya', 'chandra', 'mangal', 'budh', 'guru', 'shukra', 'shani', 'rahu', 'ketu'];

  for (const key of GRAHA_ORDER) {
    const graha = grahas[key];
    if (!graha) continue;

    const grahaCard = document.createElement('div');
    grahaCard.className = 'graha-card';
    grahaCard.innerHTML = `
      <div class="graha-name">${graha.name}</div>
      <div class="graha-rashi">${graha.rashi}</div>
      <div class="graha-position">${graha.degrees}° ${graha.minutes}' ${graha.seconds}"</div>
      <div class="graha-nakshatra">${graha.nakshatra}</div>
      <div class="graha-status">${graha.retrograde}</div>
    `;

    grahaContainer.appendChild(grahaCard);
  }
}

/**
 * Display Navamsha summary
 */
function displayNavamshaSummary(navamsha) {
  if (!navamsha) return;

  console.log('📈 Displaying Navamsha...');

  const navamshaLagnaElement = document.getElementById('display-navamsha-lagna');
  if (navamshaLagnaElement && navamsha.lagna) {
    navamshaLagnaElement.textContent = `${navamsha.lagna.rashi} ${navamsha.lagna.position.toFixed(2)}°`;
  }
}

/**
 * Display Dasha information
 */
function displayDasha(dasha) {
  if (!dasha) return;

  console.log('⏳ Displaying Dasha...');

  const dashaElement = document.getElementById('display-current-dasha');
  if (dashaElement && dasha.sequence && dasha.sequence.length > 0) {
    const currentDasha = dasha.sequence[0]; // Assuming first one is current
    dashaElement.textContent = `${currentDasha.lord} (${currentDasha.years} वर्ष)`;
  }

  // Display dasha timeline
  const dashaListElement = document.getElementById('dasha-timeline');
  if (dashaListElement && dasha.sequence) {
    dashaListElement.innerHTML = '';

    dasha.sequence.slice(0, 5).forEach(d => {
      const item = document.createElement('div');
      item.className = 'dasha-item';
      item.innerHTML = `
        <div class="dasha-lord">${d.lord}</div>
        <div class="dasha-years">${d.startAge}-${d.endAge} years</div>
        <div class="dasha-duration">${d.years} years</div>
      `;
      dashaListElement.appendChild(item);
    });
  }
}

/**
 * Update overall UI with results
 */
function updateUIWithResults(formatted) {
  console.log('🎨 Updating UI...');

  // Update profile section
  const profileSection = document.getElementById('profile-section');
  if (profileSection) {
    profileSection.style.display = 'block';
  }

  // Update result section
  const resultSection = document.getElementById('result-section');
  if (resultSection) {
    resultSection.style.display = 'block';
  }

  // Scroll to results
  setTimeout(() => {
    resultSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 500);
}

/**
 * Initialize UI event listeners
 */
export function initializeUIHandlers() {
  console.log('🔌 Initializing UI handlers...');

  // Find and bind calculate button
  const calculateBtn = document.getElementById('calculate-btn') || document.querySelector('[data-action="calculate"]');

  if (calculateBtn) {
    calculateBtn.addEventListener('click', handleKundaliCalculation);
    console.log('✓ Calculate button bound');
  }

  // Bind form submission
  const form = document.querySelector('form[data-type="birth-details"]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleKundaliCalculation();
    });
    console.log('✓ Form submission bound');
  }
}

// Auto-initialize when module loads (if DOM is ready)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUIHandlers);
} else {
  initializeUIHandlers();
}
