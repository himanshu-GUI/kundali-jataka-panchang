import { DOM } from "../dom.js";
import { $$ } from "../ui/helpers.js";

export function validateJataka() {
  const requiredFields = [
    DOM.name,
    DOM.fatherName,
    DOM.motherName,
    DOM.birthDate,
    DOM.birthTime,
  ];

  let valid = true;

  requiredFields.forEach((input) => {
    if (!input) return;
    const empty = !input.value.trim();
    input.setAttribute("aria-invalid", String(empty));
    if (empty) valid = false;
  });

  return valid;
}

export function clearValidation() {
  $$("[aria-invalid]").forEach((element) => {
    element.removeAttribute("aria-invalid");
  });
}
