const pptxgen = require("pptxgenjs");
const path = require("path");

// ---------- Brand tokens ----------
const FOREST = "2D6A4F";
const FOREST_DARK = "163C2B";
const FOREST_LIGHT = "E8F3EE";
const SKY = "48CAE4";
const SKY_DARK = "1F7C91";
const INK = "1B2430";
const INK_SOFT = "4B5563";
const WHITE = "FFFFFF";
const AMBER = "C97A2B";
const BORDER = "DCE3E0";

const STATUS = {
  suitable: { fg: FOREST, bg: FOREST_LIGHT, label: "Suitable" },
  caution: { fg: "A8631C", bg: "FBEEDD", label: "Suitable with Caution" },
  assistance: { fg: "206A7D", bg: "E2F2F5", label: "Suitable with Assistance" },
  partial: { fg: "6A4A78", bg: "F0E8F2", label: "Partially Accessible" },
  notrec: { fg: "9A3B3B", bg: "FBE9E9", label: "Not Recommended" }
};

const HEAD_FONT = "Arial";
const BODY_FONT = "Calibri";
const LOGO = path.join(__dirname, "logo.png");

const pres = new pptxgen();
pres.defineLayout({ name: "RTBA_WIDE", width: 13.333, height: 7.5 });
pres.layout = "RTBA_WIDE";

// ---------- helpers ----------
function statusPill(slide, { x, y, w = 3.4, h = 0.5, statusKey, fontSize = 16 }) {
  const s = STATUS[statusKey];
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.25, fill: { color: s.bg }, line: { color: s.bg } });
  slide.addText(s.label.toUpperCase(), {
    x, y, w, h, align: "center", valign: "middle",
    fontFace: HEAD_FONT, bold: true, fontSize, color: s.fg, margin: 0
  });
  return s;
}

function iconCircle(slide, { x, y, d = 0.55, glyph, fg = WHITE, bg = FOREST, fontSize = 20 }) {
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg } });
  slide.addText(glyph, {
    x, y, w: d, h: d, align: "center", valign: "middle",
    fontFace: HEAD_FONT, bold: true, fontSize, color: fg, margin: 0
  });
}

function meter(slide, { x, y, w = 4.2, label, actual, max, threshold, unit = "", ok, actualLabel }) {
  const trackH = 0.16;
  const labelH = 0.28;
  slide.addText(label, { x, y, w, h: labelH, fontFace: BODY_FONT, fontSize: 12, bold: true, color: INK_SOFT, margin: 0 });
  const trackY = y + labelH + 0.05;
  slide.addShape("roundRect", { x, y: trackY, w, h: trackH, rectRadius: 0.08, fill: { color: BORDER }, line: { color: BORDER } });
  const fillW = Math.max(0.05, Math.min(1, actual / max)) * w;
  slide.addShape("roundRect", {
    x, y: trackY, w: fillW, h: trackH, rectRadius: 0.08,
    fill: { color: ok ? FOREST : "9A3B3B" }, line: { color: ok ? FOREST : "9A3B3B" }
  });
  const threshX = x + Math.max(0, Math.min(1, threshold / max)) * w;
  slide.addShape("line", { x: threshX, y: trackY - 0.04, w: 0, h: trackH + 0.08, line: { color: INK, width: 1.5, dashType: "dash" } });
  slide.addText(actualLabel || `${actual}${unit}  (limit ${threshold}${unit})`, {
    x, y: trackY + trackH + 0.03, w, h: 0.24, fontFace: BODY_FONT, fontSize: 10.5, color: INK_SOFT, margin: 0
  });
}

function footerTag(slide, dark) {
  slide.addText("Rolling Trailblazers Australia  ·  Group 38  ·  CSIT321 A4", {
    x: 0.5, y: 7.12, w: 8, h: 0.3, fontFace: BODY_FONT, fontSize: 9,
    color: dark ? "CFE6DA" : INK_SOFT, margin: 0
  });
  slide.addText("2", { x: 12.5, y: 7.12, w: 0.4, h: 0.3, fontFace: BODY_FONT, fontSize: 9, color: dark ? "CFE6DA" : INK_SOFT, align: "right", margin: 0 });
}

// =====================================================================
// SLIDE 1 - TITLE
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: FOREST_DARK };
  s.addShape("roundRect", { x: 0.7, y: 0.65, w: 1.5, h: 1.5, rectRadius: 0.18, fill: { color: WHITE }, line: { color: WHITE } });
  s.addImage({ path: LOGO, x: 0.82, y: 0.77, w: 1.26, h: 1.26 });

  s.addText("SEMESTER 1 · PROTOTYPE PRESENTATION (A4)", {
    x: 0.7, y: 2.55, w: 10, h: 0.4, fontFace: BODY_FONT, bold: true, fontSize: 14,
    color: SKY, charSpacing: 2, margin: 0
  });
  s.addText("Rolling Trailblazers Australia", {
    x: 0.68, y: 2.95, w: 11.5, h: 1.1, fontFace: HEAD_FONT, bold: true, fontSize: 44,
    color: WHITE, margin: 0
  });
  s.addText("Trail-to-User Matching Engine — Illawarra Proof of Concept", {
    x: 0.7, y: 3.85, w: 10.5, h: 0.55, fontFace: BODY_FONT, fontSize: 18,
    color: "D7EFE3", margin: 0
  });

  s.addText([
    { text: "LIMITS ARE OPTIONAL   ", options: { fontFace: HEAD_FONT, bold: true, fontSize: 18, color: SKY } },
    { text: "Different Wheels. Same Challenge.", options: { fontFace: BODY_FONT, italic: true, fontSize: 14, color: "CFE6DA" } }
  ], { x: 0.7, y: 4.95, w: 10, h: 0.5, margin: 0 });

  s.addText("Group 38  ·  CSIT321  ·  University of Wollongong", {
    x: 0.7, y: 6.85, w: 8, h: 0.35, fontFace: BODY_FONT, fontSize: 12, color: "9FC7B4", margin: 0
  });
}

// =====================================================================
// SLIDE 2 - RECAP: PROBLEM & VISION
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("WHERE WE LEFT OFF", { x: 0.6, y: 0.5, w: 8, h: 0.35, fontFace: BODY_FONT, bold: true, fontSize: 13, color: SKY_DARK, charSpacing: 1.5, margin: 0 });
  s.addText("Accessibility isn't yes or no.", { x: 0.6, y: 0.85, w: 9.5, h: 0.8, fontFace: HEAD_FONT, bold: true, fontSize: 32, color: FOREST_DARK, margin: 0 });

  const bullets = [
    "A trail marked \u201Cwheelchair accessible\u201D can still hide loose gravel, steep pinches, or steps.",
    "RTBA scores every trail segment-by-segment, profiles every user, and matches the two — including partial access.",
    "Design principle: be conservative, not optimistic. A false positive can strand a user and destroy trust in the platform."
  ];
  let by = 2.0;
  bullets.forEach((b) => {
    iconCircle(s, { x: 0.6, y: by, d: 0.4, glyph: "•", bg: FOREST, fontSize: 18 });
    s.addText(b, { x: 1.25, y: by - 0.08, w: 6.6, h: 1.0, fontFace: BODY_FONT, fontSize: 15, color: INK, valign: "top", margin: 0 });
    by += 1.28;
  });

  // Right column stat callouts
  const statCard = (x, y, num, label) => {
    s.addShape("roundRect", { x, y, w: 3.9, h: 1.35, rectRadius: 0.12, fill: { color: FOREST_LIGHT }, line: { color: FOREST_LIGHT } });
    s.addText(num, { x: x + 0.25, y: y + 0.12, w: 3.4, h: 0.75, fontFace: HEAD_FONT, bold: true, fontSize: 34, color: FOREST_DARK, margin: 0 });
    s.addText(label, { x: x + 0.25, y: y + 0.88, w: 3.5, h: 0.4, fontFace: BODY_FONT, fontSize: 12, color: INK_SOFT, margin: 0 });
  };
  statCard(8.55, 2.0, "7 Trails", "Scored in the Illawarra POC set");
  statCard(8.55, 3.55, "5 Outcomes", "Suitable → Not Recommended");
  statCard(8.55, 5.1, "1 Rule", "Stop at the first unsafe segment");

  footerTag(s, false);
}

// =====================================================================
// SLIDE 3 - SYSTEM ARCHITECTURE
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("WHAT WE BUILT", { x: 0.6, y: 0.5, w: 8, h: 0.35, fontFace: BODY_FONT, bold: true, fontSize: 13, color: SKY_DARK, charSpacing: 1.5, margin: 0 });
  s.addText("A working, tested full-stack prototype", { x: 0.6, y: 0.85, w: 10.5, h: 0.7, fontFace: HEAD_FONT, bold: true, fontSize: 30, color: FOREST_DARK, margin: 0 });

  const layerBox = (y, title, desc, color) => {
    s.addShape("roundRect", { x: 0.7, y, w: 7.2, h: 1.05, rectRadius: 0.12, fill: { color: FOREST_LIGHT }, line: { color: BORDER, width: 1 } });
    iconCircle(s, { x: 0.95, y: y + 0.28, d: 0.48, glyph: "•", bg: color, fontSize: 20 });
    s.addText(title, { x: 1.65, y: y + 0.08, w: 6.1, h: 0.4, fontFace: HEAD_FONT, bold: true, fontSize: 16, color: FOREST_DARK, margin: 0 });
    s.addText(desc, { x: 1.65, y: y + 0.48, w: 6.1, h: 0.5, fontFace: BODY_FONT, fontSize: 12.5, color: INK_SOFT, margin: 0 });
  };
  layerBox(1.75, "Frontend — React (Vite)", "Profile builder, trail discovery, and the Trail Details & Results screen.", FOREST);
  layerBox(3.0, "Backend API — Node.js / Express", "REST endpoints for trails, profile options, and the matching engine.", SKY_DARK);
  layerBox(4.25, "Data Layer — Trail + Segment model", "Structured segment records now; PostgreSQL schema specified for A5.", AMBER);

  [2.15, 2.85, 3.4, 4.1].forEach((yy) => {
    s.addShape("line", { x: 4.3, y: yy, w: 0, h: 0.12, line: { color: FOREST, width: 2, endArrowType: "triangle" } });
  });

  s.addShape("roundRect", { x: 8.3, y: 1.75, w: 4.3, h: 3.55, rectRadius: 0.12, fill: { color: WHITE }, line: { color: BORDER, width: 1, dashType: "dash" } });
  s.addText("FUTURE HOOKS (RESERVED)", { x: 8.55, y: 1.9, w: 3.9, h: 0.3, fontFace: BODY_FONT, bold: true, fontSize: 11, color: INK_SOFT, charSpacing: 1, margin: 0 });
  ["AI query interface", "Transport-plan API", "Community trail-condition reports"].forEach((t, i) => {
    s.addText(`•  ${t}`, { x: 8.55, y: 2.3 + i * 0.5, w: 3.9, h: 0.4, fontFace: BODY_FONT, fontSize: 13, color: INK, margin: 0 });
  });
  s.addText("Endpoints exist and return 501 Not Implemented — a stable contract for Semester 2, not a Semester 1 promise.", {
    x: 8.55, y: 3.95, w: 3.9, h: 1.2, fontFace: BODY_FONT, italic: true, fontSize: 11, color: INK_SOFT, margin: 0
  });

  s.addText("Automated tests: 7 / 7 passing, including the sponsor's exact worked example.", {
    x: 0.7, y: 5.75, w: 11.9, h: 0.5, fontFace: BODY_FONT, bold: true, fontSize: 14, color: FOREST_DARK, margin: 0
  });

  footerTag(s, false);
}

// =====================================================================
// SLIDE 4 - THE MATCHING ALGORITHM
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("THE ALGORITHM", { x: 0.6, y: 0.5, w: 8, h: 0.35, fontFace: BODY_FONT, bold: true, fontSize: 13, color: SKY_DARK, charSpacing: 1.5, margin: 0 });
  s.addText("Score every segment out of 100", { x: 0.6, y: 0.85, w: 10.5, h: 0.7, fontFace: HEAD_FONT, bold: true, fontSize: 30, color: FOREST_DARK, margin: 0 });

  s.addChart(pres.ChartType.bar, [
    {
      name: "Weight",
      labels: ["Surface", "Gradient", "Width", "Hazards", "Facilities", "Safety"],
      values: [30, 25, 15, 15, 10, 5]
    }
  ], {
    x: 0.6, y: 1.75, w: 6.6, h: 4.6,
    barDir: "bar",
    showTitle: true, title: "Weighted segment score (out of 100)", titleFontSize: 13, titleColor: FOREST_DARK,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: INK,
    chartColors: [FOREST],
    catAxisLabelColor: INK_SOFT, catAxisLabelFontSize: 11,
    valAxisLabelColor: INK_SOFT, valAxisLabelFontSize: 10,
    valGridLine: { color: BORDER, size: 1 },
    catGridLine: { style: "none" },
    showLegend: false,
    barGapWidthPct: 35
  });

  s.addShape("roundRect", { x: 7.55, y: 1.9, w: 5.15, h: 2.05, rectRadius: 0.12, fill: { color: FOREST_LIGHT }, line: { color: FOREST_LIGHT } });
  s.addText("“Be conservative rather than optimistic. A false positive can strand a user, damage confidence, and destroy trust in the platform.”", {
    x: 7.85, y: 2.08, w: 4.55, h: 1.3, fontFace: BODY_FONT, italic: true, fontSize: 14, color: FOREST_DARK, margin: 0
  });
  s.addText("— Sponsor's Algorithm Design Sheet", { x: 7.85, y: 3.45, w: 4.55, h: 0.35, fontFace: BODY_FONT, fontSize: 11, color: INK_SOFT, margin: 0 });

  s.addShape("roundRect", { x: 7.55, y: 4.15, w: 5.15, h: 2.15, rectRadius: 0.12, fill: { color: WHITE }, line: { color: BORDER, width: 1 } });
  s.addText("The algorithm walks a trail in order and stops at the very first segment that breaches ANY of the user's thresholds — surface, gradient, width, or score.", {
    x: 7.85, y: 4.35, w: 4.55, h: 1.0, fontFace: BODY_FONT, fontSize: 13.5, color: INK, margin: 0
  });
  s.addText("This holds even for advanced, high-confidence profiles — the safety floor never gets switched off.", {
    x: 7.85, y: 5.45, w: 4.55, h: 0.75, fontFace: BODY_FONT, bold: true, fontSize: 12.5, color: AMBER, margin: 0
  });

  footerTag(s, false);
}

// =====================================================================
// SLIDE 5 - WALKTHROUGH PART 1: PROFILE & DISCOVER
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("PROTOTYPE WALKTHROUGH", { x: 0.6, y: 0.5, w: 8, h: 0.35, fontFace: BODY_FONT, bold: true, fontSize: 13, color: SKY_DARK, charSpacing: 1.5, margin: 0 });
  s.addText("Build a profile. See your matches.", { x: 0.6, y: 0.85, w: 10.5, h: 0.7, fontFace: HEAD_FONT, bold: true, fontSize: 30, color: FOREST_DARK, margin: 0 });

  // Left panel: profile wizard mock
  s.addShape("roundRect", { x: 0.6, y: 1.75, w: 5.7, h: 5.1, rectRadius: 0.14, fill: { color: FOREST_DARK }, line: { color: FOREST_DARK } });
  s.addText("MY PROFILE — STEP 4 OF 6", { x: 0.95, y: 1.98, w: 5, h: 0.3, fontFace: BODY_FONT, bold: true, fontSize: 10.5, color: SKY, charSpacing: 1, margin: 0 });
  s.addText("What terrain are you comfortable on?", { x: 0.95, y: 2.32, w: 5, h: 0.7, fontFace: HEAD_FONT, bold: true, fontSize: 17, color: WHITE, margin: 0 });
  const opts = ["Sealed surfaces only", "Sealed + firm gravel", "Accepts uneven ground", "Advanced / experienced"];
  opts.forEach((o, i) => {
    const y = 3.15 + i * 0.68;
    const selected = i === 0;
    s.addShape("roundRect", { x: 0.95, y, w: 4.95, h: 0.55, rectRadius: 0.1, fill: { color: selected ? SKY : "1F5240" }, line: { color: selected ? SKY : "2C6650", width: 1 } });
    s.addText(o, { x: 1.2, y, w: 4.5, h: 0.55, valign: "middle", fontFace: BODY_FONT, bold: selected, fontSize: 13, color: selected ? FOREST_DARK : "D7EFE3", margin: 0 });
  });
  s.addShape("roundRect", { x: 0.95, y: 6.15, w: 2.2, h: 0.45, rectRadius: 0.22, fill: { color: SKY }, line: { color: SKY } });
  s.addText("Next", { x: 0.95, y: 6.15, w: 2.2, h: 0.45, align: "center", valign: "middle", fontFace: BODY_FONT, bold: true, fontSize: 13, color: FOREST_DARK, margin: 0 });

  // Right panel: discover results mock
  s.addText("DISCOVER — RANKED FOR YOUR PROFILE", { x: 6.6, y: 1.78, w: 6, h: 0.3, fontFace: BODY_FONT, bold: true, fontSize: 10.5, color: SKY_DARK, charSpacing: 1, margin: 0 });
  const trailRows = [
    { name: "Wollongong Harbour to North Beach (Blue Mile)", status: "suitable", access: "3.5 / 3.5 km" },
    { name: "Nan Tien Temple Gardens Walk", status: "suitable", access: "1.2 / 1.2 km" },
    { name: "Shellharbour Coastal Walk", status: "partial", access: "1.2 / 4.0 km" },
    { name: "Kiama Harbour and Blowhole Point Walk", status: "partial", access: "0.9 / 1.8 km" },
    { name: "Lake Illawarra Foreshore Path", status: "notrec", access: "7.0 / 7.0 km" }
  ];
  trailRows.forEach((t, i) => {
    const y = 2.15 + i * 0.98;
    s.addShape("roundRect", { x: 6.6, y, w: 6.1, h: 0.85, rectRadius: 0.1, fill: { color: WHITE }, line: { color: BORDER, width: 1 } });
    s.addText(t.name, { x: 6.8, y: y + 0.08, w: 3.7, h: 0.5, fontFace: BODY_FONT, bold: true, fontSize: 11.5, color: INK, valign: "top", margin: 0 });
    s.addText(`Accessible: ${t.access}`, { x: 6.8, y: y + 0.52, w: 3.7, h: 0.3, fontFace: BODY_FONT, fontSize: 10, color: INK_SOFT, margin: 0 });
    statusPill(s, { x: 10.55, y: y + 0.16, w: 2.0, h: 0.42, statusKey: t.status, fontSize: 9.5 });
  });

  footerTag(s, false);
}

// =====================================================================
// SLIDE 6 - THE "SECRET SAUCE": TRAIL DETAILS & RESULTS  (centerpiece)
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("PROTOTYPE WALKTHROUGH", { x: 0.6, y: 0.42, w: 8, h: 0.32, fontFace: BODY_FONT, bold: true, fontSize: 13, color: SKY_DARK, charSpacing: 1.5, margin: 0 });
  s.addText("Where the algorithm stops — and why", { x: 0.6, y: 0.75, w: 10.5, h: 0.65, fontFace: HEAD_FONT, bold: true, fontSize: 28, color: FOREST_DARK, margin: 0 });

  s.addText("Minnamurra Rainforest Loop Walk", { x: 0.6, y: 1.5, w: 6.5, h: 0.4, fontFace: HEAD_FONT, bold: true, fontSize: 18, color: INK, margin: 0 });
  statusPill(s, { x: 9.3, y: 1.45, w: 3.4, h: 0.48, statusKey: "partial", fontSize: 15 });

  // Segment strip: total 2600m -> 800 boardwalk (green) + 1100 dirt (red) + 700 not-yet-evaluated (grey)
  const stripX = 0.6, stripY = 2.15, stripW = 12.1, stripH = 0.62;
  const total = 2600, seg1 = 800, seg2 = 1100, seg3 = 700;
  const w1 = (seg1 / total) * stripW, w2 = (seg2 / total) * stripW, w3 = (seg3 / total) * stripW;
  s.addShape("roundRect", { x: stripX, y: stripY, w: w1, h: stripH, fill: { color: FOREST }, line: { color: WHITE, width: 1.5 } });
  s.addText("800m — boardwalk", { x: stripX, y: stripY, w: w1, h: stripH, align: "center", valign: "middle", fontFace: BODY_FONT, bold: true, fontSize: 11, color: WHITE, margin: 0 });
  s.addShape("roundRect", { x: stripX + w1, y: stripY, w: w2, h: stripH, fill: { color: "9A3B3B" }, line: { color: WHITE, width: 1.5 } });
  s.addText("1,100m — dirt / roots (STOPS HERE)", { x: stripX + w1, y: stripY, w: w2, h: stripH, align: "center", valign: "middle", fontFace: BODY_FONT, bold: true, fontSize: 11, color: WHITE, margin: 0 });
  s.addShape("roundRect", { x: stripX + w1 + w2, y: stripY, w: w3, h: stripH, fill: { color: "D9D9D9" }, line: { color: WHITE, width: 1.5 } });
  s.addText("700m — not evaluated", { x: stripX + w1 + w2, y: stripY, w: w3, h: stripH, align: "center", valign: "middle", fontFace: BODY_FONT, fontSize: 10, color: "5B5B5B", margin: 0 });

  s.addText("Safe access for the first 800m via boardwalk. The algorithm stops at the rainforest floor track — surface, gradient, width, and overall score all breach this profile's thresholds. Return trip: 1.6km.", {
    x: 0.6, y: 2.95, w: 12.1, h: 0.55, fontFace: BODY_FONT, fontSize: 13, color: INK, margin: 0
  });

  // Capability meters (using real API output for the sponsor's worked example)
  s.addText("YOUR CAPABILITY vs. THIS SEGMENT'S DEMAND", { x: 0.6, y: 3.65, w: 8, h: 0.3, fontFace: BODY_FONT, bold: true, fontSize: 11, color: INK_SOFT, charSpacing: 1, margin: 0 });
  meter(s, { x: 0.6, y: 4.0, w: 3.75, label: "Segment score", actual: 34, max: 100, threshold: 80, ok: false, actualLabel: "34 / 100  (need ≥ 80)" });
  meter(s, { x: 4.65, y: 4.0, w: 3.75, label: "Gradient (max)", actual: 9, max: 20, threshold: 5, unit: "%", ok: false, actualLabel: "9%  (limit 5%)" });
  meter(s, { x: 8.7, y: 4.0, w: 3.75, label: "Path width", actual: 900, max: 2000, threshold: 1000, unit: "mm", ok: false, actualLabel: "900mm  (need ≥ 1000mm)" });

  // Notes strip
  s.addShape("roundRect", { x: 0.6, y: 5.1, w: 12.1, h: 1.55, rectRadius: 0.12, fill: { color: "F0E8F2" }, line: { color: "F0E8F2" } });
  s.addText("Trip-level notes for this profile (mobility scooter · low confidence · solo · sealed-only · max 1.5km):", {
    x: 0.85, y: 5.25, w: 11.6, h: 0.3, fontFace: BODY_FONT, bold: true, fontSize: 12, color: "6A4A78", margin: 0
  });
  s.addText([
    { text: "•  Return trip of 1,600m exceeds the 1,500m distance limit for this profile.\n", options: { breakLine: true } },
    { text: "•  Solo + low confidence → a companion or support worker is recommended for this trail." }
  ], { x: 0.85, y: 5.6, w: 11.6, h: 0.95, fontFace: BODY_FONT, fontSize: 12.5, color: INK, valign: "top", margin: 0, paraSpaceAfter: 6 });

  footerTag(s, false);
}

// =====================================================================
// SLIDE 7 - TESTED & VALIDATED
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: FOREST_LIGHT };
  s.addText("QUALITY & VALIDATION", { x: 0.6, y: 0.55, w: 8, h: 0.35, fontFace: BODY_FONT, bold: true, fontSize: 13, color: SKY_DARK, charSpacing: 1.5, margin: 0 });
  s.addText("We didn't just design the algorithm. We tested it.", { x: 0.6, y: 0.95, w: 11, h: 0.7, fontFace: HEAD_FONT, bold: true, fontSize: 28, color: FOREST_DARK, margin: 0 });

  s.addShape("roundRect", { x: 0.6, y: 1.95, w: 3.4, h: 2.5, rectRadius: 0.14, fill: { color: WHITE }, line: { color: WHITE } });
  s.addText("7 / 7", { x: 0.6, y: 2.2, w: 3.4, h: 1.0, align: "center", fontFace: HEAD_FONT, bold: true, fontSize: 52, color: FOREST, margin: 0 });
  s.addText("automated tests passing", { x: 0.6, y: 3.25, w: 3.4, h: 0.5, align: "center", fontFace: BODY_FONT, fontSize: 13, color: INK_SOFT, margin: 0 });

  const checks = [
    "Reproduces the sponsor's exact worked example (800m accessible, 1.6km return, Partially Accessible).",
    "Confirms the conservative safety floor stops even advanced, high-confidence profiles on hazardous segments.",
    "Confirms best-first ranking across all 7 trails for any given profile.",
    "Confirms trip-day modifiers (wet weather, no support person) correctly downgrade a recommendation."
  ];
  let cy = 2.0;
  checks.forEach((c) => {
    iconCircle(s, { x: 4.35, y: cy, d: 0.42, glyph: "\u2713", bg: FOREST, fontSize: 18 });
    s.addText(c, { x: 4.95, y: cy - 0.06, w: 7.6, h: 0.7, fontFace: BODY_FONT, fontSize: 13.5, color: INK, valign: "top", margin: 0 });
    cy += 0.95;
  });

  footerTag(s, false);
}

// =====================================================================
// SLIDE 8 - PROGRESS SNAPSHOT + NEXT STEPS
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("PROGRESS & NEXT STEPS", { x: 0.6, y: 0.5, w: 8, h: 0.35, fontFace: BODY_FONT, bold: true, fontSize: 13, color: SKY_DARK, charSpacing: 1.5, margin: 0 });
  s.addText("Against our A2 requirements, and what's next", { x: 0.6, y: 0.85, w: 11.5, h: 0.6, fontFace: HEAD_FONT, bold: true, fontSize: 26, color: FOREST_DARK, margin: 0 });

  s.addText("BASE REQUIREMENT PROGRESS", { x: 0.6, y: 1.65, w: 6, h: 0.3, fontFace: BODY_FONT, bold: true, fontSize: 11, color: INK_SOFT, charSpacing: 1, margin: 0 });
  const rows = [
    ["Trail data model (segments)", "Done"],
    ["Weighted segment scoring", "Done"],
    ["User capability profile", "Done"],
    ["Matching + risk modifiers", "Done"],
    ["Map integration", "In progress"],
    ["Accessible UI (WCAG)", "In progress"]
  ];
  const rowColor = (v) => (v === "Done" ? FOREST : AMBER);
  let ry = 2.0;
  rows.forEach(([label, statusVal]) => {
    s.addText(label, { x: 0.6, y: ry, w: 4.3, h: 0.4, fontFace: BODY_FONT, fontSize: 13, color: INK, valign: "middle", margin: 0 });
    s.addShape("roundRect", { x: 5.0, y: ry + 0.02, w: 1.5, h: 0.36, rectRadius: 0.18, fill: { color: rowColor(statusVal) === FOREST ? FOREST_LIGHT : "FBEEDD" }, line: { color: rowColor(statusVal) === FOREST ? FOREST_LIGHT : "FBEEDD" } });
    s.addText(statusVal, { x: 5.0, y: ry + 0.02, w: 1.5, h: 0.36, align: "center", valign: "middle", fontFace: BODY_FONT, bold: true, fontSize: 11, color: rowColor(statusVal), margin: 0 });
    ry += 0.53;
  });

  s.addShape("roundRect", { x: 7.1, y: 1.95, w: 5.6, h: 4.85, rectRadius: 0.14, fill: { color: FOREST_DARK }, line: { color: FOREST_DARK } });
  s.addText("NEXT: TOWARD A5", { x: 7.4, y: 2.15, w: 5, h: 0.3, fontFace: BODY_FONT, bold: true, fontSize: 11, color: SKY, charSpacing: 1, margin: 0 });
  const next = [
    "Migrate the data layer to PostgreSQL per the A2 schema",
    "Live geographic map (Leaflet) with facilities overlay",
    "Community trail-condition reporting (the \u201Ctrail degradation\u201D problem)",
    "Sponsor-reviewed field data for all 7 trails",
    "Onboarding flow + community landing experience (per sponsor's A3 feedback)"
  ];
  let ny = 2.55;
  next.forEach((n) => {
    s.addText("→", { x: 7.4, y: ny, w: 0.35, h: 0.6, fontFace: BODY_FONT, bold: true, fontSize: 14, color: SKY, margin: 0 });
    s.addText(n, { x: 7.8, y: ny, w: 4.7, h: 0.75, fontFace: BODY_FONT, fontSize: 13, color: WHITE, valign: "top", margin: 0 });
    ny += 0.85;
  });

  footerTag(s, false);
}

// =====================================================================
// SLIDE 9 - THANK YOU / QUESTIONS
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: FOREST_DARK };
  s.addShape("roundRect", { x: 0.9, y: 0.7, w: 1.15, h: 1.15, rectRadius: 0.15, fill: { color: WHITE }, line: { color: WHITE } });
  s.addImage({ path: LOGO, x: 1.0, y: 0.8, w: 0.95, h: 0.95 });

  s.addText("Questions?", { x: 0.9, y: 2.7, w: 10, h: 1.1, fontFace: HEAD_FONT, bold: true, fontSize: 54, color: WHITE, margin: 0 });
  s.addText("Rolling Trailblazers Australia — Different Wheels. Same Challenge.", {
    x: 0.9, y: 3.85, w: 10, h: 0.5, fontFace: BODY_FONT, italic: true, fontSize: 16, color: "CFE6DA", margin: 0
  });
  s.addText("Group 38  ·  CSIT321  ·  University of Wollongong", {
    x: 0.9, y: 6.85, w: 8, h: 0.35, fontFace: BODY_FONT, fontSize: 12, color: "9FC7B4", margin: 0
  });
}

pres.writeFile({ fileName: path.join(__dirname, "RTBA_A4_Prototype_Presentation.pptx") }).then(() => {
  console.log("Deck written.");
});
