import { state } from "../state.js";
import { DOM } from "../dom.js";
import { GRAHA_ORDER } from "../vedic/graha.js";
import { formatGhatiPal, formatGhatiDecimal } from "../panchang/format.js";

function escHtml(str) {
  return String(str || "—").replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function grahaRow(g) {
  return `<tr>
    <td><strong>${g.name}</strong> (${g.nameEn})</td>
    <td>${g.rashi}</td>
    <td>${g.degrees}° ${g.minutes}' ${g.seconds}"</td>
    <td>${g.formatted}</td>
    <td>${g.nakshatra} (पाद ${g.nakshatraPada})</td>
    <td>${g.retrograde ? "वक्री ⟲" : "मार्गी"}</td>
  </tr>`;
}

function angRow(label, data) {
  if (!data) return "";
  return `<tr>
    <td>${label}</td>
    <td>${data.name}</td>
    <td>${formatGhatiPal(data.ghati, data.pal)}</td>
    <td>${formatGhatiDecimal(data.ghati, data.pal)}</td>
  </tr>`;
}

export function exportKundaliPDF() {
  const s = state;
  const p = s.panchang || {};
  const j = s.jataka || {};
  const bp = s.birthPlace || {};
  const pp = s.panchangPlace || {};
  const grahas = s.grahas;
  const lagna = s.lagna;

  const tithiRows = (Array.isArray(p.tithi) ? p.tithi : [])
    .map(t => `<tr><td>${t.name}</td><td>${t.endTime}</td></tr>`)
    .join("");

  const grahaRows = grahas
    ? GRAHA_ORDER.map(k => grahas[k] ? grahaRow(grahas[k]) : "").join("")
    : "<tr><td colspan='6'>गणना उपलब्ध नहीं</td></tr>";

  const birthDate = DOM.birthDate?.value || "";
  const birthTime = DOM.birthTime?.value || "";
  const sunrise = DOM.sunrise?.value || "";
  const sunset = DOM.sunset?.value || "";

  const html = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>कुंडली रिपोर्ट — ${escHtml(j.name)}</title>
<style>
  @page { size: A4; margin: 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Noto Sans Devanagari', 'Mangal', sans-serif; font-size: 11px; color: #1a2744; line-height: 1.5; }
  .header { text-align: center; border-bottom: 3px double #c0a36c; padding-bottom: 10px; margin-bottom: 12px; }
  .header h1 { font-size: 20px; color: #1a2744; margin-bottom: 2px; }
  .header h2 { font-size: 14px; color: #c0a36c; font-weight: normal; }
  .header .subtitle { font-size: 10px; color: #666; margin-top: 4px; }
  .section { margin-bottom: 14px; page-break-inside: avoid; }
  .section h3 { font-size: 13px; color: #1a2744; border-bottom: 1px solid #c0a36c; padding-bottom: 3px; margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 8px; }
  th { background: #1a2744; color: #fff; padding: 5px 8px; text-align: left; font-weight: 600; font-size: 10px; }
  td { padding: 4px 8px; border-bottom: 1px solid #e0e0e0; }
  tr:nth-child(even) { background: #f8f6f2; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; margin-bottom: 8px; }
  .info-item { display: flex; gap: 6px; }
  .info-label { font-weight: 600; color: #465066; min-width: 110px; }
  .info-value { color: #1a2744; }
  .four-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px; margin-bottom: 8px; }
  .four-grid .box { border: 1px solid #ddd; border-radius: 4px; padding: 6px 8px; text-align: center; }
  .four-grid .box .label { font-size: 9px; color: #888; }
  .four-grid .box .value { font-size: 12px; font-weight: 600; color: #1a2744; }
  .lagna-box { background: #fdf8ee; border: 2px solid #c0a36c; border-radius: 6px; padding: 10px; text-align: center; margin-bottom: 10px; }
  .lagna-box .rashi { font-size: 18px; font-weight: 700; color: #1a2744; }
  .lagna-box .detail { font-size: 11px; color: #465066; }
  .footer { text-align: center; border-top: 1px solid #ccc; padding-top: 8px; font-size: 9px; color: #999; margin-top: 16px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>

<div class="header">
  <h1>ॐ जन्म कुंडली रिपोर्ट</h1>
  <h2>${escHtml(j.name || "जातक")}</h2>
  <div class="subtitle">शास्त्रीय गणना प्रणाली — astronomy-engine आधारित सम्पूर्ण ज्योतिष गणना</div>
</div>

<div class="section">
  <h3>१. जातक विवरण</h3>
  <div class="info-grid">
    <div class="info-item"><span class="info-label">जातक का नाम:</span><span class="info-value">${escHtml(j.name)}</span></div>
    <div class="info-item"><span class="info-label">पिताजी का नाम:</span><span class="info-value">${escHtml(j.fatherName)}</span></div>
    <div class="info-item"><span class="info-label">माताजी का नाम:</span><span class="info-value">${escHtml(j.motherName)}</span></div>
    <div class="info-item"><span class="info-label">गोत्र:</span><span class="info-value">${escHtml(j.gotra)}</span></div>
    <div class="info-item"><span class="info-label">जन्म तिथि:</span><span class="info-value">${escHtml(birthDate)}</span></div>
    <div class="info-item"><span class="info-label">जन्म समय:</span><span class="info-value">${escHtml(birthTime)}</span></div>
  </div>
</div>

<div class="section">
  <h3>२. जन्म स्थान एवं पंचांग स्थान</h3>
  <div class="info-grid">
    <div class="info-item"><span class="info-label">जन्म स्थान:</span><span class="info-value">${escHtml(bp.cityName || "")}${bp.districtName ? ", " + escHtml(bp.districtName) : ""}${bp.stateName ? ", " + escHtml(bp.stateName) : ""}</span></div>
    <div class="info-item"><span class="info-label">देश:</span><span class="info-value">${escHtml(bp.countryName)}</span></div>
    <div class="info-item"><span class="info-label">जन्म अक्षांश:</span><span class="info-value">${escHtml(bp.latitude)}</span></div>
    <div class="info-item"><span class="info-label">जन्म देशांतर:</span><span class="info-value">${escHtml(bp.longitude)}</span></div>
    <div class="info-item"><span class="info-label">पंचांग स्थान:</span><span class="info-value">${escHtml(p.nearestPanchang?.name || pp.name || "")}</span></div>
    <div class="info-item"><span class="info-label">पंचांग दूरी:</span><span class="info-value">${p.nearestPanchang ? p.nearestPanchang.distance + " km" : "—"}</span></div>
    <div class="info-item"><span class="info-label">सूर्योदय:</span><span class="info-value">${escHtml(sunrise)}</span></div>
    <div class="info-item"><span class="info-label">सूर्यास्त:</span><span class="info-value">${escHtml(sunset)}</span></div>
  </div>
</div>

<div class="section">
  <h3>३. संवत एवं काल विवरण</h3>
  <div class="four-grid">
    <div class="box"><div class="label">शक संवत</div><div class="value">${escHtml(p.shakaSamvat)}</div></div>
    <div class="box"><div class="label">वि. संवत</div><div class="value">${escHtml(p.vikramSamvat)}</div></div>
    <div class="box"><div class="label">संवत्सर</div><div class="value">${escHtml(p.samvatsara)}</div></div>
    <div class="box"><div class="label">अयन</div><div class="value">${escHtml(p.ayana)}</div></div>
    <div class="box"><div class="label">ऋतु</div><div class="value">${escHtml(p.ritu)}</div></div>
    <div class="box"><div class="label">मास</div><div class="value">${escHtml(p.masa)}</div></div>
    <div class="box"><div class="label">पक्ष</div><div class="value">${escHtml(p.paksha)}</div></div>
    <div class="box"><div class="label">वार</div><div class="value">${escHtml(p.vara?.name)}</div></div>
  </div>
</div>

<div class="section">
  <h3>४. तिथि</h3>
  <table>
    <thead><tr><th>तिथि</th><th>समाप्ति समय</th></tr></thead>
    <tbody>${tithiRows || "<tr><td colspan='2'>—</td></tr>"}</tbody>
  </table>
</div>

<div class="section">
  <h3>५. पंचांग के अंग</h3>
  <table>
    <thead><tr><th>अंग</th><th>नाम</th><th>घटी पल</th><th>घटी (दशमलव)</th></tr></thead>
    <tbody>
      ${angRow("वार", p.vara)}
      ${angRow("गत नक्षत्र", p.previousNakshatra)}
      ${angRow("वर्तमान नक्षत्र", p.currentNakshatra)}
      ${angRow("अगामी नक्षत्र", p.nextNakshatra)}
      ${angRow("योग", p.yoga)}
      ${angRow("करण", p.karana)}
    </tbody>
  </table>
</div>

<div class="section">
  <h3>६. लग्न (Ascendant)</h3>
  ${lagna ? `
  <div class="lagna-box">
    <div class="rashi">${lagna.rashi} लग्न</div>
    <div class="detail">${lagna.degrees}° ${lagna.minutes}' ${lagna.seconds}" | नक्षत्र: ${lagna.nakshatra} (पाद ${lagna.nakshatraPada})</div>
    <div class="detail" style="font-size:10px;color:#888;margin-top:4px;">Tropical: ${lagna.tropical.toFixed(4)}° | Sidereal: ${lagna.sidereal.toFixed(4)}°</div>
  </div>` : "<p>लग्न गणना उपलब्ध नहीं</p>"}
</div>

<div class="section">
  <h3>७. नवग्रह स्पष्ट (Planet Positions)</h3>
  <table>
    <thead>
      <tr><th>ग्रह</th><th>राशि</th><th>अंश° कला' विकला"</th><th>स्पष्ट (राशि अंश)</th><th>नक्षत्र (पाद)</th><th>गति</th></tr>
    </thead>
    <tbody>${grahaRows}</tbody>
  </table>
</div>

${grahas ? `<div class="section">
  <h3>८. ग्रह विस्तृत गणना (Detailed Computation)</h3>
  <table>
    <thead><tr><th>ग्रह</th><th>सायन (Tropical)°</th><th>अयनांश°</th><th>निरयन (Sidereal)°</th><th>राशि अंक</th></tr></thead>
    <tbody>
      ${GRAHA_ORDER.map(k => {
        const g = grahas[k];
        if (!g) return "";
        return `<tr>
          <td><strong>${g.name}</strong></td>
          <td>${g.tropical.toFixed(4)}°</td>
          <td>${g.ayanamsa.toFixed(4)}°</td>
          <td>${g.sidereal.toFixed(4)}°</td>
          <td>${g.rashiIndex + 1} (${g.rashi})</td>
        </tr>`;
      }).join("")}
    </tbody>
  </table>
</div>` : ""}

<div class="section">
  <h3>गणना स्रोत</h3>
  <div class="info-grid">
    <div class="info-item"><span class="info-label">गणना इंजन:</span><span class="info-value">astronomy-engine (MIT, client-side)</span></div>
    <div class="info-item"><span class="info-label">अयनांश:</span><span class="info-value">लाहिरी (Chitrapaksha)</span></div>
    <div class="info-item"><span class="info-label">पद्धति:</span><span class="info-value">निरयन (Sidereal)</span></div>
    <div class="info-item"><span class="info-label">रिपोर्ट दिनांक:</span><span class="info-value">${new Date().toLocaleDateString("hi-IN")}</span></div>
  </div>
</div>

<div class="footer">
  ॐ — कुंडली निर्माण — शास्त्रीय ज्योतिष गणना प्रणाली — सर्वाधिकार सुरक्षित
</div>

</body>
</html>`;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
}
