export type Provider = 'openai' | 'anthropic' | 'gemini';

/** Every plate is a portrait page. The materials are fixed, not chosen. */
export const PAGE_WIDTH = 1000;
export const PAGE_HEIGHT = 1400;

export const PROVIDERS: { id: Provider; label: string; defaultModel: string }[] = [
  { id: 'openai', label: 'GPT', defaultModel: 'gpt-5' },
  { id: 'anthropic', label: 'Claude', defaultModel: 'claude-sonnet-5' },
  { id: 'gemini', label: 'Gemini', defaultModel: 'gemini-2.5-pro' },
];

export interface GenerationResult {
  title: string;
  description: string;
  sketchCode: string;
}
