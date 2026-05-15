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
          className="header-action header-action-ts"
          href={TS_HOST}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open ThoughtSpot in a new tab"
          title="Open ThoughtSpot"
        >
          <TSLogo />
        </a>
        <HelpButton />
      </div>
    </header>
  );
}

function TSLogo() {
  // Simplified ThoughtSpot brand mark (stacked bars).
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3"  y="13" width="4" height="8" rx="1" fill="#1F2A44" />
      <rect x="10" y="9"  width="4" height="12" rx="1" fill="#1F2A44" />
      <rect x="17" y="4"  width="4" height="17" rx="1" fill="#2DD3A9" />
    </svg>
  );
}
