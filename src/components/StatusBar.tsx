import type { ReactNode } from 'react';

export function StatusBar({ left, right }: { left: string; right?: ReactNode }) {
  return (
    <div
      className="flex items-center justify-between h-[22px] px-2 shrink-0 text-[11px]"
      style={{ background: 'var(--face)', borderTop: '1px solid var(--bevel-lt)', borderTopColor: '#fff' }}
    >
      <div className="win-sunken px-2 h-[16px] flex items-center flex-1 mr-2 truncate">{left}</div>
      {right}
    </div>
  );
}
