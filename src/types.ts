export type Provider = 'openai' | 'anthropic' | 'gemini';

export const CATEGORIES = [
  'Flow',
  'Fractal',
  'Geometry',
  'Organic',
  'Particles',
  'Physics',
  'Chaos',
  'Plotter',
  'Glitch',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const PALETTES = [
  'Inferno',
  'Viridis',
  'Plasma',
  'Turbo',
  'Cividis',
  'Risograph',
  'Graphite',
] as const;
export type Palette = (typeof PALETTES)[number];

export const STYLES = [
  'Gallery',
  'Dreamlike',
  'Scientific',
  'Minimal',
  'Neon',
  'Notebook',
  'Blueprint',
] as const;
export type Style = (typeof STYLES)[number];

export const BACKGROUNDS = ['White', 'Black', 'Paper', 'Transparent'] as const;
export type Background = (typeof BACKGROUNDS)[number];

export const MOTIONS = ['Still', 'Animated', 'Looping'] as const;
export type Motion = (typeof MOTIONS)[number];

export const OUTPUT_DIMENSION = 1000;

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

export interface DesignOptions {
  prompt: string;
  category: Category;
  palette: Palette;
  style: Style;
  background: Background;
  motion: Motion;
}

export const BACKGROUND_COLORS: Record<Background, string> = {
  White: '#ffffff',
  Black: '#000000',
  Paper: '#efeade',
  Transparent: 'transparent',
};
