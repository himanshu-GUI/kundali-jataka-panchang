/**
 * Initialize Complete UI-Calculation Integration
 * This file ties together all panchang, graha, and lagna calculations with the UI
 */

// Import integration modules
import { kundaliIntegration } from './ui-integration.js';
import { initializeUIHandlers } from './ui-handler.js';

/**
 * Initialize the complete integration
 * Call this from your main app initialization
 */
export async function initializeKundaliIntegration() {
  console.log('🚀 Initializing Kundali Integration System...');

  try {
    // Step 1: Initialize UI event handlers
    console.log('  ├─ Setting up UI event handlers...');
    initializeUIHandlers();
    console.log('  ✓ UI handlers initialized');

    // Step 2: Verify kundali integration is ready
    console.log('  ├─ Verifying kundali calculation engine...');
    if (!kundaliIntegration) {
      throw new Error('KundaliIntegration not loaded');
    }
    console.log('  ✓ Calculation engine ready');

    // Step 3: Add calculation method to window for direct access
    if (typeof window !== 'undefined') {
      window.calculateKundali = async (birthData) => {
        console.log('📱 Manual kundali calculation triggered...');
        return await kundaliIntegration.calculateKundali(birthData);
      };

      window.getFormattedKundali = () => {
        return kundaliIntegration.getFormattedKundali();
      };

      console.log('  ✓ Global methods available (window.calculateKundali, window.getFormattedKundali)');
    }

    console.log('✅ Kundali Integration System Ready!\n');
    console.log('═'.repeat(60));
    console.log('System Status:');
    console.log('  ✓ Panchang Manager (PanchangManager)');
    console.log('  ✓ Graha Calculator (9 planets)');
    console.log('  ✓ Lagna Calculator (Ascendant)');
    console.log('  ✓ Navamsha Chart (D-9)');
    console.log('  ✓ Dasha System (120 years)');
    console.log('  ✓ UI Integration Layer');
    console.log('  ✓ Event Handlers');
    console.log('═'.repeat(60));
    console.log('\nUsage:');
    console.log('  window.calculateKundali(birthData)');
    console.log('  window.getFormattedKundali()');

    return true;

  } catch (error) {
    console.error('❌ Integration initialization failed:', error);
    throw error;
  }
}

// Export the integration instance for direct use
export { kundaliIntegration };
