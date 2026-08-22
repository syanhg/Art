export function TitleBar({ title }: { title: string }) {
  return (
    <div
      className="flex items-center justify-between h-[28px] pl-1 pr-1 shrink-0 select-none"
      style={{
        background: 'linear-gradient(90deg, var(--title-from), var(--title-to))',
        borderBottom: '1px solid #14306f',
      }}
    >
      <div className="flex items-center gap-1.5">
        <img src="./icons/app.png" alt="" className="icon w-[18px] h-[18px]" />
        <span className="text-white text-[13px] font-bold tracking-tight">{title}</span>
      </div>
      <div className="flex gap-[2px]">
        <button type="button" aria-label="Minimize" className="win-raised w-[20px] h-[18px] text-[11px] leading-none font-bold">
          _
        </button>
        <button type="button" aria-label="Restore" className="win-raised w-[20px] h-[18px] text-[11px] leading-none font-bold">
          &#9633;
        </button>
        <button type="button" aria-label="Close" className="win-raised w-[20px] h-[18px] text-[11px] leading-none font-bold">
          &#10005;
        </button>
      </div>
    </div>
  );
}
