import { useEffect, useRef } from 'react';
import { runSketch, type SketchHandle, type SketchStatus } from '../lib/p5runner';

export type { SketchStatus };

export function SketchCanvas({
  code,
  runToken,
  status,
  errorMessage,
  onError,
  onCanvas,
}: {
  code: string | null;
  /** Bumped by the host to force a re-run of the same source. */
  runToken: number;
  status: SketchStatus;
  errorMessage: string | null;
  onError: (message: string) => void;
  onCanvas: (canvas: HTMLCanvasElement | null) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<SketchHandle | null>(null);
  const onErrorRef = useRef(onError);
  const onCanvasRef = useRef(onCanvas);

  useEffect(() => {
    onErrorRef.current = onError;
    onCanvasRef.current = onCanvas;
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !code) return;

    try {
      handleRef.current = runSketch({
        code,
        container: host,
        onError: (message) => onErrorRef.current(message),
        onCanvas: (canvas) => onCanvasRef.current(canvas),
      });
    } catch (err) {
      onErrorRef.current(err instanceof Error ? err.message : String(err));
    }

    return () => {
      handleRef.current?.destroy();
      handleRef.current = null;
      onCanvasRef.current(null);
    };
  }, [code, runToken]);

  return (
    <div className="win-sunken win-scroll h-full min-h-0 flex flex-col items-center justify-center p-2">
      <div
        ref={hostRef}
        className="sketch-stage flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden transition-opacity-fast"
        style={{ display: code ? undefined : 'none' }}
      />
      {!code && (
        <div className="w-full h-full flex items-center justify-center text-[12px] text-black/50">
          {status === 'thinking' && 'Querying model…'}
          {status === 'rendering' && 'Drawing the page…'}
          {status === 'error' && 'No page'}
          {status === 'idle' && 'No page yet — describe one above'}
          {status === 'done' && 'No page'}
        </div>
      )}
      {errorMessage && (
        <pre className="mt-2 w-full max-w-full shrink-0 border border-black bg-[#ffffe0] p-2 text-[11px] whitespace-pre-wrap text-black">
          {errorMessage}
        </pre>
      )}
    </div>
  );
}
