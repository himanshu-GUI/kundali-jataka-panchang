import { DOM } from "../dom.js";

export function getJatakaData() {
  return {
    name: DOM.name?.value.trim() || "",
    fatherName: DOM.fatherName?.value.trim() || "",
    motherName: DOM.motherName?.value.trim() || "",
    gotra: DOM.gotra?.value.trim() || "",
    caste: DOM.caste?.value.trim() || "",
    birthDate: DOM.birthDate?.value || "",
    birthTime: DOM.birthTime?.value || "",
  };
}
