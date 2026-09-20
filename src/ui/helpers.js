export const $ = (selector) => document.querySelector(selector);

export const $$ = (selector) => Array.from(document.querySelectorAll(selector));

export function setText(id, value) {
  const element =
    typeof id === "string" ? document.getElementById(id) : id;
  if (!element) return;
  element.textContent =
    value !== undefined && value !== null && String(value).trim() !== ""
      ? value
      : "—";
}

export function showMessage(element, text, type = "success") {
  if (!element) return;
  element.textContent = text || "";
  element.className = `message show ${type}`;
}

export function clearMessage(element) {
  if (!element) return;
  element.textContent = "";
  element.className = "message";
}
