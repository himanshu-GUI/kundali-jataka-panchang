import { setText } from "../ui/helpers.js";
import { GRAHA_ORDER } from "../vedic/graha.js";

export function displayGraha(grahas, lagna, nearestPanchang) {
  const section = document.getElementById("grahaSphutSection");
  if (!section) return;

  if (!grahas && !lagna) {
    section.style.display = "none";
    return;
  }

  section.style.display = "";

  if (lagna) {
    setText("lagnaRashi", lagna.rashi);
    setText("lagnaPosition", `${lagna.degrees}° ${lagna.minutes}' ${lagna.seconds}"`);
    setText("lagnaNakshatra", `${lagna.nakshatra} (पाद ${lagna.nakshatraPada})`);
  }

  if (nearestPanchang) {
    setText("nearestPanchangName", nearestPanchang.name);
    setText("nearestPanchangDistance", `${nearestPanchang.distance} km`);
  }

  if (grahas) {
    const tbody = document.getElementById("grahaTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    for (const key of GRAHA_ORDER) {
      const g = grahas[key];
      if (!g) continue;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${g.name}</strong></td>
        <td>${g.rashi}</td>
        <td>${g.degrees}° ${g.minutes}' ${g.seconds}"</td>
        <td>${g.nakshatra}</td>
        <td>${g.nakshatraPada}</td>
        <td>${g.retrograde ? "वक्री ⟲" : "—"}</td>
      `;
      tbody.appendChild(tr);
    }
  }
}

export function clearGraha() {
  const section = document.getElementById("grahaSphutSection");
  if (section) section.style.display = "none";

  const tbody = document.getElementById("grahaTableBody");
  if (tbody) tbody.innerHTML = "";

  setText("lagnaRashi", "—");
  setText("lagnaPosition", "—");
  setText("lagnaNakshatra", "—");
  setText("nearestPanchangName", "—");
  setText("nearestPanchangDistance", "—");
}
