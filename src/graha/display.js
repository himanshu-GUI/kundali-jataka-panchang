import { setText } from "../ui/helpers.js";
import { GRAHA_ORDER } from "../vedic/graha.js";
import { t } from "../i18n/runtime.js";
import { localizeName } from "../i18n/names.js";

function cell(text, tag = "td") {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}

export function displayGraha(grahas, lagna, panchangUsed) {
  const section = document.getElementById("grahaSphutSection");
  if (!section) return;

  if (lagna) {
    setText("lagnaRashi", localizeName(lagna.rashi));
    setText("lagnaPosition", `${lagna.degrees}° ${lagna.minutes}' ${lagna.seconds}"`);
    setText("lagnaNakshatra", `${localizeName(lagna.nakshatra)} (${t("lbl_pada")} ${lagna.nakshatraPada})`);
  }

  if (panchangUsed) {
    setText("nearestPanchangName", panchangUsed.name);
    setText("nearestPanchangDistance", `${panchangUsed.distance} km`);
  }

  const tbody = document.getElementById("grahaTableBody");
  if (!grahas || !tbody) return;
  tbody.replaceChildren();

  for (const key of GRAHA_ORDER) {
    const g = grahas[key];
    if (!g) continue;
    const tr = document.createElement("tr");
    tr.append(
      cell(localizeName(g.name), "th"),
      cell(localizeName(g.rashi)),
      cell(`${g.degrees}° ${g.minutes}' ${g.seconds}"`),
      cell(localizeName(g.nakshatra)),
      cell(g.nakshatraPada),
      cell(g.retrograde ? t("lbl_vakri_yes") : t("lbl_margi")),
    );
    if (g.retrograde) tr.classList.add("is-retrograde");
    tbody.appendChild(tr);
  }
}

export function clearGraha() {
  const tbody = document.getElementById("grahaTableBody");
  if (tbody) tbody.replaceChildren();

  setText("lagnaRashi", "—");
  setText("lagnaPosition", "—");
  setText("lagnaNakshatra", "—");
  setText("nearestPanchangName", "—");
  setText("nearestPanchangDistance", "—");
}
