/**
 * The technique the page is made in. Each option is a drawing or printing
 * tradition — common craft vocabulary, not any one artist's signature look —
 * chosen so the options differ in how the marks are made rather than in mood.
 * The directive is appended to the subject.
 */
export interface Style {
  id: string;
  label: string;
  hint: string;
  directive: string;
}

export const STYLES: Style[] = [
  {
    id: 'auto',
    label: 'Auto',
    hint: 'Let the subject decide the technique.',
    directive: '',
  },
  {
    id: 'hatched',
    label: 'Hatched',
    hint: 'Pen and ink: tone built from crossed line.',
    directive:
      'Make every tone from HATCHING, the way an engraver does. No fills anywhere. Dark is close-set line, light is open line, and mid-tone is two or three layers crossed at shallow angles. Curve the hatching to follow the form it sits on, let the strokes taper at both ends, and let the lines that bound a shape be nothing but the hatching stopping. Vary the angle set between one area and the next so neighbouring passages separate.',
  },
  {
    id: 'stippled',
    label: 'Stippled',
    hint: 'Tone built entirely from dots.',
    directive:
      'Make every tone from STIPPLE — dots only, no line and no fill. Density carries value: dense clustered dots in shadow thinning to bare paper in light, with the dot size varying slightly and the spacing sampled unevenly rather than on a grid. Edges are where dots crowd, never a drawn outline. Keep one light direction across the whole page.',
  },
  {
    id: 'blueprint',
    label: 'Blueprint',
    hint: 'Pale line on process blue, reversed out.',
    directive:
      'Draw the page as a BLUEPRINT: a deep process-blue ground, everything drawn in pale line reversed out of it, with the paper white reserved only for the lightest marks. Line work is technical — measured, dimensioned, with witness lines and arrowheads — but hand-drawn, so it wavers. Blotch the blue unevenly the way a wet-process print does, fade it toward one edge, and let a crease or a roller mark run through it.',
  },
  {
    id: 'riso',
    label: 'Riso',
    hint: 'Two ink drums, out of register.',
    directive:
      'Print the page as a two-colour DUOTONE from separated plates: one drum a strong flat ink, the other a second colour, each laid down as its own layer of coarse dots or open line and overprinted in MULTIPLY so the overlap makes a third colour. Offset the second plate two or three pixels from the first so the registration is visibly out. Ink lies unevenly — heavier at one edge of a pass, dropping out in patches — and shows roller streaks along the run direction.',
  },
  {
    id: 'woodcut',
    label: 'Woodcut',
    hint: 'Carved relief: solid black, gouged white.',
    directive:
      'Cut the page as a RELIEF PRINT. Only two values: solid black ink and the white the gouge took out. Model form with parallel gouge cuts that swell and taper as the tool bit deeper, and break large blacks with clusters of short chattering cuts. Every edge is a cut edge — angular, slightly splintered, with the odd slip where the blade ran on. Print it unevenly so the black is thin where the block did not take.',
  },
];
