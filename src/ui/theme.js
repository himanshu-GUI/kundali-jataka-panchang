import { DOM } from "../dom.js";
import { state, syncState } from "../state.js";

function updateThemeButton() {
  if (!DOM.themeBtn) return;
  DOM.themeBtn.textContent = state.settings.theme === "dark" ? "☀️" : "🌙";
  DOM.themeBtn.setAttribute(
    "aria-label",
    state.settings.theme === "dark" ? "Light mode" : "Dark mode"
  );
}

export function toggleTheme() {
  const dark = document.body.classList.toggle("dark");
  state.settings.theme = dark ? "dark" : "light";
  localStorage.setItem("kundali-theme", state.settings.theme);
  updateThemeButton();
  syncState();
}

export function loadTheme() {
  const saved = localStorage.getItem("kundali-theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    state.settings.theme = "dark";
  } else {
    document.body.classList.remove("dark");
    state.settings.theme = "light";
  }
  updateThemeButton();
  syncState();
}
