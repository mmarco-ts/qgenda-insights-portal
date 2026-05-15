import { ExternalLink } from 'lucide-react';
import TenantSwitcher from './TenantSwitcher';
import HelpButton from './HelpButton';
import { TS_HOST } from '../lib/thoughtspot';

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
        <a
          className="header-action header-action-link"
          href={TS_HOST}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open ThoughtSpot in a new tab"
          title="Open ThoughtSpot"
        >
          <span className="header-action-label">ThoughtSpot</span>
          <ExternalLink size={14} />
        </a>
        <HelpButton />
      </div>
    </header>
  );
}
