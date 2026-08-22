import { LEDGER } from './ledger';
import { WASHES } from './washes';
import { MECHANISM } from './mechanism';
import { VESSELS } from './vessels';

export interface Preset {
  id: string;
  title: string;
  description: string;
  sketchCode: string;
}

/**
 * Reference pieces: four hand-drawn plates. They run without an API key, they
 * are what the generator is aimed at, and the system prompt quotes their
 * techniques as house style.
 */
export const PRESETS: Preset[] = [
  {
    id: 'ledger',
    title: 'The Wall, Done',
    description:
      'A day logged on graph paper: hatched blocks, stippled patches and ink bars against a ruled time column.',
    sketchCode: LEDGER,
  },
  {
    id: 'washes',
    title: 'Washes Against the Wall',
    description:
      'Gouache cells overprinted in MULTIPLY on a printed engineering grid — checkerboard field, stripe columns, long bars.',
    sketchCode: WASHES,
  },
  {
    id: 'mechanism',
    title: 'Skips by the Radiator Pipe',
    description:
      'An exploded gear train in aniline purple with blurred graphite smudges, dashed leaders and a tally of counts.',
    sketchCode: MECHANISM,
  },
  {
    id: 'vessels',
    title: 'Nine Vessels, Stippled',
    description:
      'Solids of revolution built from random easing curves, every slice an ellipse of stroke dots lit from the upper left.',
    sketchCode: VESSELS,
  },
];
