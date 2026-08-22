import type { ReactNode } from 'react';
import { Icon } from './Icon';

export function GroupBox({
  label,
  icon,
  className = '',
  bodyClassName = '',
  children,
}: {
  label: string;
  icon?: string;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={`win-groupbox px-3 pt-3 pb-2 ${className}`}>
      <div className="win-groupbox-label">
        {icon && <Icon name={icon} size={14} />}
        {label}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
