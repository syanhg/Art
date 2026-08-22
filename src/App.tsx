import { useEffect, useRef, useState } from 'react';
import { PROVIDERS, type GenerationResult, type Provider } from './types';
import { TitleBar } from './components/TitleBar';
import { MenuBar } from './components/MenuBar';
import { StatusBar } from './components/StatusBar';
import { GroupBox } from './components/GroupBox';
import { ApiKeyPanel } from './components/ApiKeyPanel';
import { CodeEditor } from './components/CodeEditor';
import { SketchCanvas } from './components/SketchCanvas';
import { ActionButton } from './components/ActionButton';
import { Icon } from './components/Icon';
import { buildSystemPrompt, buildUserPrompt } from './lib/prompt';
import { generateSketch } from './lib/providers';
import { canvasToPng, type SketchStatus } from './lib/runner';
import { PRESETS, type Preset } from './sketches';

const APP_NAME = 'p5 Art Generator';

function useStored(key: string, initial: string) {
  const [value, setValue] = useState(() => localStorage.getItem(key) ?? initial);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);
  return [value, setValue] as const;
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'sketch'
  );
}

function download(filename: string, content: Blob) {
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [provider, setProviderRaw] = useStored('p5:provider', 'anthropic');
  const providerTyped = provider as Provider;
  const [apiKey, setApiKey] = useStored(`p5:key:${provider}`, '');
  const [model, setModel] = useStored(
    `p5:model:${provider}`,
    PROVIDERS.find((p) => p.id === provider)?.defaultModel ?? '',
  );

  const [prompt, setPrompt] = useState('');

  const [status, setStatus] = useState<SketchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [runToken, setRunToken] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [presetId, setPresetId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function setProvider(p: Provider) {
    setProviderRaw(p);
    const storedKey = localStorage.getItem(`p5:key:${p}`);
    setApiKey(storedKey ?? '');
    const storedModel = localStorage.getItem(`p5:model:${p}`);
    setModel(storedModel ?? PROVIDERS.find((x) => x.id === p)?.defaultModel ?? '');
  }

  function show(generated: GenerationResult) {
    setResult(generated);
    setErrorMessage(null);
    setRunToken((n) => n + 1);
    setStatus('done');
  }

  async function handleGenerate(remix: boolean) {
    if (!apiKey.trim()) {
      setStatus('error');
      setErrorMessage('Enter an API key for the selected provider before generating.');
      return;
    }
    if (!prompt.trim()) {
      setStatus('error');
      setErrorMessage('Describe what the page should record in the prompt field.');
      return;
    }

    setErrorMessage(null);
    setStatus('thinking');
    setResult(null);
    setPresetId(null);

    try {
      const systemPrompt = buildSystemPrompt();
      let userPrompt = buildUserPrompt(prompt);
      if (remix) {
        userPrompt +=
          '\n\nThis is a remix request: produce a different variation (different seed, parameters or composition) of the same theme, not the same sketch.';
      }

      const generated = await generateSketch({
        provider: providerTyped,
        apiKey,
        model,
        systemPrompt,
        userPrompt,
      });

      setStatus('rendering');
      show(generated);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : String(err));
    }
  }

  function handleSketchError(message: string) {
    setStatus('error');
    setErrorMessage(message);
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.sketchCode);
  }

  async function handleDownloadPng() {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    try {
      download(`${slugify(result.title)}.png`, await canvasToPng(canvas));
    } catch (err) {
      handleSketchError(err instanceof Error ? err.message : String(err));
    }
  }

  function handleSaveCode() {
    if (!result) return;
    download(`${slugify(result.title)}.js`, new Blob([result.sketchCode], { type: 'text/javascript' }));
  }

  function handleShowPreset(preset: Preset) {
    setPresetId(preset.id);
    show(preset);
  }

  function handleNew() {
    setPrompt('');
    setPresetId(null);
    setResult(null);
    setStatus('idle');
    setErrorMessage(null);
  }

  function handleClearOutput() {
    setPresetId(null);
    setResult(null);
    setStatus('idle');
    setErrorMessage(null);
  }

  const busy = status === 'thinking' || status === 'rendering';

  const statusText =
    status === 'thinking'
      ? `Querying ${PROVIDERS.find((p) => p.id === provider)?.label}…`
      : status === 'rendering'
        ? 'Compiling sketch…'
        : status === 'error'
          ? (errorMessage ?? 'Error')
          : result
            ? `${result.title} — drawn in p5.js`
            : 'Ready';

  return (
    <div className="h-screen w-screen flex flex-col win-panel overflow-hidden">
      <TitleBar title={APP_NAME} />
      <MenuBar
        menus={[
          {
            label: 'File',
            items: [
              { label: 'New Prompt', onClick: handleNew },
              { label: 'Save Sketch As…', onClick: handleSaveCode, disabled: !result },
              { label: 'Export PNG…', onClick: handleDownloadPng, disabled: !result },
              { separator: true, label: '' },
              { label: 'Exit', onClick: () => window.close() },
            ],
          },
          {
            label: 'Edit',
            items: [
              { label: 'Copy Sketch Code', onClick: handleCopy, disabled: !result },
              { label: 'Clear Output', onClick: handleClearOutput, disabled: !result },
            ],
          },
          {
            label: 'Help',
            items: [{ label: `About ${APP_NAME}`, onClick: () => setAboutOpen(true) }],
          },
        ]}
      />

      <div className="flex-1 min-h-0 flex flex-col gap-2 p-2 overflow-hidden">
        <GroupBox label="Model Provider" icon="provider" className="shrink-0">
          <ApiKeyPanel
            provider={providerTyped}
            onProvider={setProvider}
            apiKey={apiKey}
            onApiKey={setApiKey}
            model={model}
            onModel={setModel}
          />
        </GroupBox>

        <GroupBox label="Prompt" icon="new" className="shrink-0" bodyClassName="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !busy) handleGenerate(false);
            }}
            placeholder="every window in the house, counted twice"
            className="win-sunken flex-1 h-[24px] px-2 text-[13px]"
          />
          <ActionButton icon="generate" onClick={() => handleGenerate(false)} disabled={busy}>
            {busy ? 'Working…' : 'Generate'}
          </ActionButton>
        </GroupBox>

        <GroupBox
          label="Reference Pages"
          icon="visualization"
          className="shrink-0"
          bodyClassName="flex flex-wrap items-center gap-2"
        >
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              title={preset.description}
              onClick={() => handleShowPreset(preset)}
              className={`${presetId === preset.id ? 'win-sunken' : 'win-raised'} h-[22px] px-2 text-[11px]`}
            >
              {preset.title}
            </button>
          ))}
        </GroupBox>

        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-2">
          <GroupBox
            label={presetId ? 'Reference Page' : 'Generated Page'}
            icon="visualization"
            className="flex-1 min-h-0 flex flex-col basis-1/2"
            bodyClassName="flex-1 min-h-0 flex flex-col gap-2"
          >
            {result && (
              <div className="shrink-0">
                <div className="text-[12px] font-bold">{result.title}</div>
                <div className="text-[11px] text-black/70">{result.description}</div>
              </div>
            )}
            <SketchCanvas
              code={result?.sketchCode ?? null}
              runToken={runToken}
              status={status}
              errorMessage={status === 'error' ? errorMessage : null}
              onError={handleSketchError}
              onCanvas={(canvas) => {
                canvasRef.current = canvas;
              }}
            />
            <div className="shrink-0 flex flex-wrap gap-2">
              <ActionButton icon="generate" onClick={() => setRunToken((n) => n + 1)} disabled={!result}>
                Run Again
              </ActionButton>
              <ActionButton icon="download" onClick={handleDownloadPng} disabled={!result}>
                Export PNG
              </ActionButton>
            </div>
          </GroupBox>

          <GroupBox
            label={presetId ? 'Reference p5.js Code' : 'Generated p5.js Code'}
            icon="code"
            className="flex-1 min-h-0 flex flex-col basis-1/2"
            bodyClassName="flex-1 min-h-0 flex flex-col gap-2"
          >
            <CodeEditor code={result?.sketchCode ?? ''} />
            <div className="shrink-0 flex flex-wrap gap-2">
              <ActionButton icon="copy" onClick={handleCopy} disabled={!result}>
                Copy
              </ActionButton>
              <ActionButton icon="download" onClick={handleSaveCode} disabled={!result}>
                Save .js
              </ActionButton>
              <ActionButton icon="remix" onClick={() => handleGenerate(true)} disabled={!result || busy}>
                Remix
              </ActionButton>
            </div>
          </GroupBox>
        </div>
      </div>

      <StatusBar
        left={statusText}
        right={
          <a
            href="https://github.com/syanhg/Art"
            target="_blank"
            rel="noopener noreferrer"
            className="win-raised h-[16px] px-2 flex items-center whitespace-nowrap text-[11px] no-underline text-black"
          >
            source on github
          </a>
        }
      />

      {aboutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setAboutOpen(false)}
        >
          <div className="win-panel w-[340px]" onClick={(e) => e.stopPropagation()}>
            <div
              className="h-[22px] flex items-center justify-between px-2"
              style={{ background: 'linear-gradient(90deg, var(--title-from), var(--title-to))' }}
            >
              <span className="text-white text-[12px] font-bold">About</span>
              <button
                type="button"
                className="win-raised w-[16px] h-[16px] text-[10px] leading-none"
                onClick={() => setAboutOpen(false)}
              >
                &#10005;
              </button>
            </div>
            <div className="p-4 flex gap-3 items-start">
              <Icon name="about" size={32} />
              <div className="text-[12px] leading-snug">
                <p className="font-bold mb-1">{APP_NAME}</p>
                <p>
                  Describe what a page should record. GPT / Claude / Gemini writes a p5.js sketch that draws the
                  whole sheet — ruling, hand-lettered title, drawing, annotation column and all — live in your
                  browser. The materials are fixed: graphite and ink on cream paper, one accent.
                </p>
              </div>
            </div>
            <div className="flex justify-end p-2 pt-0">
              <ActionButton onClick={() => setAboutOpen(false)}>OK</ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
