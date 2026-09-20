import { DOM } from "../dom.js";
import { t } from "../i18n/runtime.js";

const STEPS = ["jataka", "birth-place", "panchang", "panchang-details"];
let currentStep = 0;

function getSections() {
  return STEPS.map((s) => document.querySelector(`[data-section="${s}"]`));
}

function getProgressSteps() {
  return document.querySelectorAll(".progress-step");
}

function showStep(index) {
  const sections = getSections();
  const progressSteps = getProgressSteps();

  sections.forEach((sec, i) => {
    if (!sec) return;
    sec.classList.toggle("stepper-hidden", i !== index);
    sec.classList.toggle("stepper-active", i === index);
  });

  progressSteps.forEach((step, i) => {
    step.classList.remove("active", "completed");
    if (i < index) step.classList.add("completed");
    if (i === index) step.classList.add("active");
  });

  const bottomBar = document.querySelector(".bottom-action-bar");
  if (bottomBar) bottomBar.classList.toggle("stepper-hidden", index < STEPS.length - 1);

  currentStep = index;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function validateCurrentStep() {
  const section = getSections()[currentStep];
  if (!section) return true;

  const required = section.querySelectorAll("[required]");
  let valid = true;

  for (const input of required) {
    if (!input.value || !input.value.trim()) {
      input.setAttribute("aria-invalid", "true");
      input.focus();
      valid = false;
      break;
    }
  }

  return valid;
}

function nextStep() {
  if (!validateCurrentStep()) return;
  if (currentStep < STEPS.length - 1) {
    showStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
}

function goToStep(index) {
  if (index < currentStep) {
    showStep(index);
  } else if (index === currentStep + 1) {
    nextStep();
  }
}

function addStepperButtons() {
  const sections = getSections();

  sections.forEach((sec, i) => {
    if (!sec) return;

    const body = sec.querySelector(".section-body");
    if (!body) return;

    const existing = body.querySelector(".stepper-nav");
    if (existing) return;

    const nav = document.createElement("div");
    nav.className = "stepper-nav";

    if (i > 0) {
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "btn btn-secondary stepper-back-btn";
      backBtn.innerHTML = "← " + t("stepper_back") || "पीछे जाएं";
      backBtn.addEventListener("click", prevStep);
      nav.appendChild(backBtn);
    } else {
      nav.appendChild(document.createElement("span"));
    }

    if (i < sections.length - 1) {
      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "btn btn-primary stepper-next-btn";
      nextBtn.innerHTML = (t("stepper_next") || "आगे बढ़ें") + " →";
      nextBtn.addEventListener("click", nextStep);
      nav.appendChild(nextBtn);
    }

    body.appendChild(nav);
  });
}

export function initStepper() {
  addStepperButtons();

  const progressSteps = getProgressSteps();
  progressSteps.forEach((step, i) => {
    step.style.cursor = "pointer";
    step.addEventListener("click", () => goToStep(i));
  });

  showStep(0);
}

export function resetStepper() {
  showStep(0);
}
