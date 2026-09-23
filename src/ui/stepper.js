import { t } from "../i18n/runtime.js";
import { showMessage, clearMessage } from "./helpers.js";

const STEPS = ["jataka", "birth-place", "panchang", "panchang-details", "kundali"];
const LAST = STEPS.length - 1;
let currentStep = 0;
let onCompute = null;
let onReset = null;

function getSections() {
  return STEPS.map((s) => document.querySelector(`[data-section="${s}"]`));
}

function getProgressSteps() {
  return document.querySelectorAll(".progress-step");
}

export function showStep(index) {
  const sections = getSections();

  sections.forEach((sec, i) => {
    if (!sec) return;
    sec.classList.toggle("stepper-hidden", i !== index);
    sec.classList.toggle("stepper-active", i === index);
  });

  getProgressSteps().forEach((step, i) => {
    step.classList.remove("active", "completed", "upcoming");
    if (i < index) step.classList.add("completed");
    else if (i === index) step.classList.add("active");
    else step.classList.add("upcoming");
    if (i === index) step.setAttribute("aria-current", "step");
    else step.removeAttribute("aria-current");
  });

  currentStep = index;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function stepMessageEl(section) {
  return section?.querySelector(".section-body > .message, .message");
}

function validateCurrentStep() {
  const section = getSections()[currentStep];
  if (!section) return true;

  const missing = [...section.querySelectorAll("[required]")]
    .filter((input) => !input.value || !input.value.trim())
    .map((input) => document.getElementById(input.dataset.requiredProxy) || input);
  missing.forEach((input) => input.setAttribute("aria-invalid", "true"));

  const msg = stepMessageEl(section);
  if (missing.length) {
    if (msg) showMessage(msg, t("msg_validation_error"), "error");
    missing[0].focus();
    return false;
  }
  if (msg?.classList.contains("error")) clearMessage(msg);
  return true;
}

export function nextStep() {
  if (!validateCurrentStep()) return;
  if (currentStep + 1 === LAST) {
    onCompute?.();
  } else if (currentStep < LAST) {
    showStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 0) showStep(currentStep - 1);
}

function goToStep(index) {
  if (index < currentStep) showStep(index);
  else if (index === currentStep + 1) nextStep();
}

export function showResultStep() {
  showStep(LAST);
}

function makeButton(className, key, handler) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = className;
  btn.dataset.stepperLabel = key;
  btn.addEventListener("click", handler);
  return btn;
}

const LABELS = {
  back: () => "← " + t("stepper_back"),
  next: () => t("stepper_next") + " →",
  compute: () => t("bottom_calculate"),
  reset: () => t("btn_new_kundali"),
};

export function refreshStepperLabels() {
  document.querySelectorAll("[data-stepper-label]").forEach((btn) => {
    btn.textContent = LABELS[btn.dataset.stepperLabel]();
  });
}

function addStepperButtons() {
  getSections().forEach((sec, i) => {
    const body = sec?.querySelector(".section-body");
    if (!body || body.querySelector(".stepper-nav")) return;

    const nav = document.createElement("div");
    nav.className = "stepper-nav";

    nav.appendChild(
      i > 0
        ? makeButton("btn btn-ghost stepper-back-btn", "back", prevStep)
        : document.createElement("span")
    );

    if (i < LAST - 1) {
      nav.appendChild(makeButton("btn btn-primary stepper-next-btn", "next", nextStep));
    } else if (i === LAST - 1) {
      nav.appendChild(makeButton("btn btn-primary stepper-next-btn", "compute", nextStep));
    } else {
      nav.appendChild(makeButton("btn btn-ghost stepper-reset-btn", "reset", () => onReset?.()));
    }

    body.appendChild(nav);
  });
  refreshStepperLabels();
}

export function initStepper({ compute, reset } = {}) {
  onCompute = compute;
  onReset = reset;
  addStepperButtons();

  getProgressSteps().forEach((step, i) => {
    step.tabIndex = 0;
    step.setAttribute("role", "button");
    step.addEventListener("click", () => goToStep(i));
    step.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goToStep(i);
      }
    });
  });

  showStep(0);
}

export function resetStepper() {
  showStep(0);
}
