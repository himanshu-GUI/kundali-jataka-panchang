import "./ui/helpers.js";
import { initializeApp } from "./init.js";
import { initI18n } from "./i18n/runtime.js";
import { initializeKundaliIntegration } from "./panchang/init-integration.js";

async function boot() {
  initI18n();
  initializeApp();

  try {
    await initializeKundaliIntegration();
  } catch (error) {
    console.error('Failed to initialize kundali integration:', error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
