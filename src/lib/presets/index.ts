import type { Motion } from '../../types';
import { LEDGER } from './ledger';
import { WASHES } from './washes';
import { MECHANISM } from './mechanism';
import { VESSELS } from './vessels';
import { FLOWFIELD } from './flowfield';
import { ATTRACTOR } from './attractor';

export interface Preset {
  id: string;
  title: string;
  description: string;
  motion: Motion;
  sketchCode: string;
}

/**
 * Reference pieces. They run without an API key, they are what the generator
 * is aimed at quality-wise, and the system prompt quotes their techniques.
 */
export const PRESETS: Preset[] = [
  {
    id: 'ledger',
    title: 'The Wall, Done',
    description:
      'A day logged on graph paper: hatched blocks, stippled patches and ink bars against a ruled time column.',
    motion: 'Still',
    sketchCode: LEDGER,
  },
  {
    id: 'washes',
    title: 'Washes Against the Wall',
    description:
      'Gouache cells overprinted in MULTIPLY on a printed engineering grid — checkerboard field, stripe columns, long bars.',
    motion: 'Still',
    sketchCode: WASHES,
  },
  {
    id: 'mechanism',
    title: 'Skips by the Radiator Pipe',
    description:
      'An exploded gear train in aniline purple with blurred graphite smudges, dashed leaders and a tally of counts.',
    motion: 'Still',
    sketchCode: MECHANISM,
  },
  {
    id: 'vessels',
    title: 'Nine Vessels, Stippled',
    description:
      'Solids of revolution built from random easing curves, every slice an ellipse of stroke dots lit from the upper left.',
    motion: 'Animated',
    sketchCode: VESSELS,
  },
  {
    id: 'flowfield',
    title: 'Slow Weather',
    description:
      '2,600 particles advected through a two-octave Perlin field, painted additively with an inferno ramp.',
    motion: 'Animated',
    sketchCode: FLOWFIELD,
  },
  {
    id: 'attractor',
    title: 'De Jong, Counted Twice',
    description:
      'Twelve million iterations of the De Jong map accumulated into a density buffer and log-tone-mapped through viridis.',
    motion: 'Animated',
    sketchCode: ATTRACTOR,
  },
];
