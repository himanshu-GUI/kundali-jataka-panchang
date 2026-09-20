export function animatePanchangDetails() {
  const section = document.getElementById("panchangDetailsSection");
  if (!section) return;
  section.classList.remove("data-updated");
  void section.offsetWidth;
  section.classList.add("data-updated");
}
