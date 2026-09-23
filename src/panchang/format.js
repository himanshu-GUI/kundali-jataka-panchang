import { t } from "../i18n/runtime.js";

export function ghatiPalToDecimal(ghati, pal) {
  const g = Number(ghati) || 0;
  const p = Number(pal) || 0;
  return g + p / 60;
}

export function formatGhatiDecimal(ghati, pal) {
  return ghatiPalToDecimal(ghati, pal)
    .toFixed(4)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
}

export function formatGhatiPal(ghati, pal) {
  const g =
    ghati === "" || ghati === null || ghati === undefined ? 0 : ghati;
  const p = pal === "" || pal === null || pal === undefined ? 0 : pal;
  return `${g} ${t("unit_ghati")} ${p} ${t("unit_pal")}`;
}
