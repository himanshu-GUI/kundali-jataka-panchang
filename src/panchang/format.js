export function ghatiPalToDecimal(ghati, pal) {
  const g = Number(ghati) || 0;
  const p = Number(pal) || 0;
  return g + p / 60;
}

export function formatGhatiDecimal(ghati, pal) {
  return ghatiPalToDecimal(ghati, pal)
    .toFixed(8)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
}

export function formatGhatiPal(ghati, pal) {
  const g =
    ghati === "" || ghati === null || ghati === undefined ? 0 : ghati;
  const p = pal === "" || pal === null || pal === undefined ? 0 : pal;
  return `${g} घटी ${p} पल`;
}
