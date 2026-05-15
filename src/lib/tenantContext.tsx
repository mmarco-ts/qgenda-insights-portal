import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RuntimeFilterOp } from '@thoughtspot/visual-embed-sdk';

export interface Tenant {
  id: string;
  name: string;
  shortName: string;
  /** Organization column value(s) to filter on. Empty = no filter (all tenants). */
  orgValues: string[];
  /** Accent colour for the chip when this tenant is active. */
  accent: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  /** Optional Task Type filter to scope the data to what this persona cares about. */
  taskTypeValues?: string[];
  /** Lookback window in days applied to Shift Date (e.g. 7 = "last 7 days"). */
  dateRangeDays?: number;
  /** Human-friendly label for the date scope, shown in the UI. */
  dateRangeLabel?: string;
  /** Starter questions tuned to this persona — rendered in the Spotter side panel. */
  prompts: string[];
}

export const TENANTS: Tenant[] = [
  { id: 'all',       name: 'All Organizations',           shortName: 'All',         orgValues: [],                                       accent: '#1F7BB6' },
  { id: 'mayo',      name: 'Mayo Clinic',                 shortName: 'Mayo',        orgValues: ['Mayo Clinic'],                          accent: '#1F7BB6' },
  { id: 'northwell', name: 'Northwell Health',            shortName: 'Northwell',   orgValues: ['Northwell Health'],                     accent: '#7C3AED' },
  { id: 'choa',      name: "Children's Healthcare of ATL", shortName: 'CHOA',       orgValues: ["Children's Healthcare of Atlanta"],     accent: '#20C9A4' },
];

export const PERSONAS: Persona[] = [
  {
    id: 'exec',
    name: 'VP, Clinical Ops',
    description: 'Year-to-date strategic view',
    dateRangeDays: 365,
    dateRangeLabel: 'Last 365 days',
    prompts: [
      'Total shifts by organization year over year',
      'Top 10 organizations by scheduled hours',
      'Published rate % trend across all organizations',
      'Compare total shifts: this quarter vs last quarter',
      'Which organizations have the lowest published rate?',
    ],
  },
  {
    id: 'scheduler',
    name: 'Scheduling Admin',
    description: 'This week — coverage and fill ops',
    dateRangeDays: 7,
    dateRangeLabel: 'Last 7 days',
    prompts: [
      'Open shifts trend over the last 7 days',
      'Published rate % by task type this week',
      'Total shifts vs open shifts by day this week',
      'Which task types have the most open shifts this week?',
      'Open shifts by organization in the last 7 days',
    ],
  },
  {
    id: 'ops',
    name: 'Operations Lead',
    description: 'Today — task-level execution',
    dateRangeDays: 1,
    dateRangeLabel: 'Last 24 hours',
    prompts: [
      'Scheduled hours by task type today',
      'Compare task type volume: today vs yesterday',
      'Hourly shift volume in the last 24 hours',
      'Top task types by total shifts today',
      'Open shifts right now by organization',
    ],
  },
];

interface TenantCtx {
  tenant: Tenant;
  persona: Persona;
  setTenantId: (id: string) => void;
  setPersonaId: (id: string) => void;
  /** Field name on the workforce model used to filter by tenant. */
  orgField: string;
  /** Field name on the workforce model used to filter by persona task type. */
  taskTypeField: string;
  /** Field name on the workforce model used for date filtering. */
  dateField: string;
}

const TenantContext = createContext<TenantCtx | null>(null);

const LS_TENANT = 'qg.tenant';
const LS_PERSONA = 'qg.persona';

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantIdState] = useState<string>(() => localStorage.getItem(LS_TENANT) || 'all');
  const [personaId, setPersonaIdState] = useState<string>(() => localStorage.getItem(LS_PERSONA) || 'exec');

  useEffect(() => { localStorage.setItem(LS_TENANT, tenantId); }, [tenantId]);
  useEffect(() => { localStorage.setItem(LS_PERSONA, personaId); }, [personaId]);

  const tenant = TENANTS.find(t => t.id === tenantId) ?? TENANTS[0];
  const persona = PERSONAS.find(p => p.id === personaId) ?? PERSONAS[0];

  return (
    <TenantContext.Provider
      value={{
        tenant,
        persona,
        setTenantId: setTenantIdState,
        setPersonaId: setPersonaIdState,
        orgField: 'Organization',
        taskTypeField: 'Task Type',
        dateField: 'Shift Date',
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used inside TenantProvider');
  return ctx;
}

/**
 * Build runtimeFilters for the current tenant+persona combo.
 * Returned array can be passed directly to LiveboardEmbed/SpotterEmbed.
 */
export function buildRuntimeFilters(ctx: TenantCtx) {
  const filters: Array<{ columnName: string; operator: RuntimeFilterOp; values: (string | number)[] }> = [];

  if (ctx.tenant.orgValues.length > 0) {
    filters.push({
      columnName: ctx.orgField,
      operator: RuntimeFilterOp.IN,
      values: ctx.tenant.orgValues,
    });
  }

  if (ctx.persona.taskTypeValues && ctx.persona.taskTypeValues.length > 0) {
    filters.push({
      columnName: ctx.taskTypeField,
      operator: RuntimeFilterOp.IN,
      values: ctx.persona.taskTypeValues,
    });
  }

  // Date range filter — applied as Shift Date >= today minus N days.
  // TS runtime filters expect epoch seconds for date columns.
  if (ctx.persona.dateRangeDays && ctx.persona.dateRangeDays > 0) {
    const startSec = Math.floor(Date.now() / 1000) - ctx.persona.dateRangeDays * 86400;
    filters.push({
      columnName: ctx.dateField,
      operator: RuntimeFilterOp.GE,
      values: [startSec],
    });
  }

  return filters;
}
