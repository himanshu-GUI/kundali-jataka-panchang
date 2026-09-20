import "./ui/helpers.js";
import { initializeApp } from "./init.js";
import { initI18n } from "./i18n/runtime.js";

function boot() {
  initI18n();
  initializeApp();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
