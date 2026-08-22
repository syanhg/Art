import { PROVIDERS, type Provider } from '../types';

export function ApiKeyPanel({
  provider,
  onProvider,
  apiKey,
  onApiKey,
  model,
  onModel,
}: {
  provider: Provider;
  onProvider: (p: Provider) => void;
  apiKey: string;
  onApiKey: (v: string) => void;
  model: string;
  onModel: (v: string) => void;
}) {
  const current = PROVIDERS.find((p) => p.id === provider)!;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {PROVIDERS.map((p) => (
          <label key={p.id} className="flex items-center gap-1 text-[12px] cursor-default">
            <input
              type="radio"
              name="provider"
              checked={p.id === provider}
              onChange={() => onProvider(p.id)}
              className="cursor-default"
            />
            {p.label}
          </label>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="password"
          spellCheck={false}
          autoComplete="off"
          value={apiKey}
          onChange={(e) => onApiKey(e.target.value)}
          placeholder={`${current.label} API key`}
          className="win-sunken flex-1 h-[22px] px-2 text-[12px]"
        />
        <input
          type="text"
          spellCheck={false}
          autoComplete="off"
          value={model}
          onChange={(e) => onModel(e.target.value)}
          placeholder="model"
          className="win-sunken w-full sm:w-[180px] h-[22px] px-2 text-[12px]"
        />
      </div>
      <p className="text-[11px] text-black/60">
        Stored only in this browser. Sent directly to the provider's API, never to any server of ours.
      </p>
    </div>
  );
}
