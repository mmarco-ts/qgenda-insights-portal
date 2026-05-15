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
    description: 'Cross-organization, strategic view',
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
    description: 'Coverage, open shifts, and fill operations',
    prompts: [
      'Open shifts trend over the last 90 days',
      'Published rate % by task type this month',
      'Total shifts vs open shifts by week',
      'Which task types have the most open shifts?',
      'Open shifts by organization in the last 30 days',
    ],
  },
  {
    id: 'ops',
    name: 'Operations Lead',
    description: 'Task-level execution and throughput',
    prompts: [
      'Scheduled hours by task type this month',
      'Compare task type volume: this month vs last month',
      'Daily shift volume over the last 30 days',
      'Top task types by total shifts',
      'Published rate by task type and organization',
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
  return filters;
}
