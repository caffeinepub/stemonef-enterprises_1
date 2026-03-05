const STORAGE_KEY = "stemonef_behavior";

export function recordInteraction(promptId: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, number> = raw ? JSON.parse(raw) : {};
    data[promptId] = (data[promptId] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable — fail silently
  }
}

export function getTopInteractions(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: Record<string, number> = JSON.parse(raw);
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);
  } catch {
    return [];
  }
}
