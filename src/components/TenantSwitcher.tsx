import { useEffect, useRef, useState } from 'react';
import { Building2, ChevronDown, UserCircle2, Check } from 'lucide-react';
import { TENANTS, PERSONAS, useTenant } from '../lib/tenantContext';

export default function TenantSwitcher() {
  const { tenant, persona, setTenantId, setPersonaId } = useTenant();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div className="tenant-switcher" ref={wrapRef}>
      <button
        className="tenant-switcher-trigger"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="tenant-switcher-chip" style={{ background: tenant.accent }}>
          {tenant.shortName.slice(0, 2).toUpperCase()}
        </span>
        <span className="tenant-switcher-labels">
          <span className="tenant-switcher-tenant">{tenant.shortName}</span>
          <span className="tenant-switcher-persona">{persona.name}</span>
        </span>
        <ChevronDown size={14} className={`tenant-switcher-caret ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="tenant-switcher-pop">
          <div className="tenant-switcher-section">
            <div className="tenant-switcher-section-head">
              <Building2 size={13} />
              <span>Organization</span>
            </div>
            <div className="tenant-switcher-list">
              {TENANTS.map(t => (
                <button
                  key={t.id}
                  className={`tenant-switcher-item ${t.id === tenant.id ? 'active' : ''}`}
                  onClick={() => { setTenantId(t.id); }}
                >
                  <span className="tenant-switcher-dot" style={{ background: t.accent }}></span>
                  <span className="tenant-switcher-item-name">{t.name}</span>
                  {t.id === tenant.id && <Check size={14} className="tenant-switcher-check" />}
                </button>
              ))}
            </div>
          </div>

          <div className="tenant-switcher-section">
            <div className="tenant-switcher-section-head">
              <UserCircle2 size={13} />
              <span>View as</span>
            </div>
            <div className="tenant-switcher-list">
              {PERSONAS.map(p => (
                <button
                  key={p.id}
                  className={`tenant-switcher-item ${p.id === persona.id ? 'active' : ''}`}
                  onClick={() => { setPersonaId(p.id); }}
                >
                  <div className="tenant-switcher-persona-block">
                    <span className="tenant-switcher-item-name">{p.name}</span>
                    <span className="tenant-switcher-item-desc">{p.description}</span>
                  </div>
                  {p.id === persona.id && <Check size={14} className="tenant-switcher-check" />}
                </button>
              ))}
            </div>
          </div>

          <div className="tenant-switcher-foot">
            Changes apply as a runtime filter to dashboards and Insights AI.
          </div>
        </div>
      )}
    </div>
  );
}
