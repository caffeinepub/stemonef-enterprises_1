export interface Prompt {
  id: string;
  label: string;
  answer: string;
}

export function semanticSearch(query: string, prompts: Prompt[]): Prompt[] {
  if (!query.trim()) return prompts;

  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  const scored = prompts
    .map((p) => {
      const text = `${p.label} ${p.answer}`.toLowerCase();
      const score = tokens.reduce(
        (acc, token) => (text.includes(token) ? acc + 1 : acc),
        0,
      );
      return { ...p, score };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored;
}
