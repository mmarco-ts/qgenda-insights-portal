import { Bell, HelpCircle, Settings } from 'lucide-react';

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
        <button className="header-action" aria-label="Help">
          <HelpCircle size={20} />
        </button>
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
