export type Provider = 'openai' | 'anthropic' | 'gemini';

/** How the piece is drawn — the mark-making, not the subject. */
export const STYLES = [
  'Pencil',
  'Pen & Ink',
  'Ballpoint',
  'Charcoal',
  'Watercolour',
  'Marker',
  'Chalk',
  'Field Notebook',
] as const;
export type Style = (typeof STYLES)[number];

/** What it is drawn with. */
export const INKS = ['Graphite', 'Black Ink', 'Blue Biro', 'Red & Blue', 'Sepia', 'Faded Colour'] as const;
export type Ink = (typeof INKS)[number];

/** What it is drawn on. */
export const PAPERS = ['Graph Paper', 'Ruled Notebook', 'Kraft', 'Newsprint', 'Plain'] as const;
export type Paper = (typeof PAPERS)[number];

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
  style: Style;
  ink: Ink;
  paper: Paper;
  motion: Motion;
}
