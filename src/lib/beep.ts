// A short click sound for every button in the app. One delegated listener beats
// wiring onClick handlers by hand — buttons added later are covered for free.

const SRC = './beep.mp3';
// Rapid clicks overlap rather than cutting each other off, so a small pool of
// elements is rotated through instead of restarting a single one.
const POOL_SIZE = 4;

let pool: HTMLAudioElement[] = [];
let next = 0;

function makeAudio() {
  const audio = new Audio(SRC);
  audio.preload = 'auto';
  return audio;
}

export function playBeep() {
  if (pool.length === 0) pool = Array.from({ length: POOL_SIZE }, makeAudio);

  const audio = pool[next];
  next = (next + 1) % pool.length;

  audio.currentTime = 0;
  // Autoplay policies reject this until the page has been interacted with, and
  // the browser may also be mid-load; a silent click beats a console full of
  // unhandled rejections.
  void audio.play().catch(() => {});
}

export function installButtonBeep() {
  document.addEventListener(
    'click',
    (e) => {
      if (!e.isTrusted) return;
      const button = (e.target as Element | null)?.closest?.('button');
      if (!button || button.disabled) return;
      playBeep();
    },
    // Capture, so a handler calling stopPropagation still gets its beep.
    true,
  );
}
