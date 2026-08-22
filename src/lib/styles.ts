/**
 * The form the page takes. Few options, each a genuinely different mark system
 * — bands, blocks, washes, line work, stipple — so the choice changes the page
 * rather than tinting it. The directive is appended to the subject.
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
    hint: 'Let the subject decide the form.',
    directive: '',
  },
  {
    id: 'bands',
    label: 'Bands',
    hint: 'Stacked strata of long horizontal passes.',
    directive:
      'Build the body as BANDED STRATA. Ten to twenty bands stacked down the sheet, each one a patch of long horizontal passes drawn left to right, each with its own height, its own number of stacked rows and its own stopping point so the right edge stays ragged. Alternate open bands, where the passes keep paper between them, against three or four slabs gone over until they closed — a broad chalky bed in the band pigment with the passes drawn over it, never a filled rectangle. Comb one band with short hanging hair strokes. Drop counting ticks along the runs and a bracket-shaped hook where a pass turned back. One pigment carries most of the rows; the pen rows are leant on, heavier and darker than the crayon rows around them.',
  },
  {
    id: 'ledger',
    label: 'Ledger',
    hint: 'Ruled time column, hatched blocks, stippled patches.',
    directive:
      'Build the body as a RULED LEDGER on graph paper. A column of times, dates or readings down the left, and four or five columns of entries registered to it: blocks built from dense parallel hatching, squares of stipple with a dark core, and solid ink bars where something ran without a break. Number the columns along the foot. Repeat one part of the record a second time in a small panel low on the page, counted again and disagreeing slightly with the first count.',
  },
  {
    id: 'washes',
    label: 'Washes',
    hint: 'Gouache cells overprinted on an engineering grid.',
    directive:
      'Build the body as WASHES: cells of gouache laid over a printed engineering grid and overprinted in MULTIPLY so every crossing darkens. A checkerboard field, columns of stripes and two or three long bars, each cell mottled — pigment pooling darker at one edge, a bleached corner, dry-brush breaks where the sheet took nothing. Colour does the work here; keep line work to the ruling and the lettering.',
  },
  {
    id: 'diagram',
    label: 'Diagram',
    hint: 'Exploded parts in line, leaders and tallies.',
    directive:
      'Build the body as an EXPLODED DIAGRAM in line. The thing taken apart along one axis, each component outlined with a wavering doubled contour, spaced so nothing overlaps, with dashed leaders running out to lettered labels. Rub blurred graphite under the heavier parts so they sit on the page. Run a tally of counts down one side in five-bar gates.',
  },
  {
    id: 'plate',
    label: 'Plate',
    hint: 'A stippled specimen plate of volumes.',
    directive:
      'Build the body as a STIPPLED SPECIMEN PLATE. A row or grid of volumes, each built as a stack of rings along a spine with the ring silhouette taken from randomly assembled easing curves, drawn entirely in dots — no outlines. Hold the same foreshortening ratio across every specimen and light them all from one direction with a scalar around the ring. Number each specimen under its own boxed cell and record its dimensions beside it.',
  },
];
