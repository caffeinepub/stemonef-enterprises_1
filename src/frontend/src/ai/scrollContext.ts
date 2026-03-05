const SECTION_IDS = [
  "hero",
  "pillars",
  "mission",
  "feed",
  "pathway",
  "humanon",
  "cta",
];

export function detectActiveSection(): string {
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
      return id;
    }
  }
  return "hero";
}
