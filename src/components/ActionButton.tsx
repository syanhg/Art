import { Icon } from './Icon';

export function ActionButton({
  children,
  onClick,
  disabled,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  icon?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="win-raised h-[26px] px-3 flex items-center gap-1.5 text-[12px] disabled:text-black/40"
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}
