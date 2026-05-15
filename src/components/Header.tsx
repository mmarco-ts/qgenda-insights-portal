import { Bell, Settings } from 'lucide-react';
import TenantSwitcher from './TenantSwitcher';
import HelpButton from './HelpButton';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <div>
          <h1 className="header-title">{title}</h1>
          {subtitle && (
            <div className="header-breadcrumb">
              <span>{subtitle}</span>
            </div>
          )}
        </div>
      </div>
      <div className="header-right">
        <TenantSwitcher />
        <HelpButton />
        <button className="header-action" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <button className="header-action" aria-label="Settings">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
