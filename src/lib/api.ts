import { TS_HOST } from './thoughtspot';

export interface TSMetadataItem {
  metadata_id: string;
  metadata_name: string;
  metadata_type: 'LIVEBOARD' | 'ANSWER' | 'MODEL' | string;
  metadata_header?: {
    description?: string;
    modified?: number;
    created?: number;
    author?: string;
    authorDisplayName?: string;
    tags?: Array<{ name: string }>;
  };
  metadata_url?: string;
}

export interface TSLiveboardTab {
  id: string;
  name: string;
}

async function tsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${TS_HOST}${path}`, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-By': 'ThoughtSpot',
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`TS API ${path} ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Fetch liveboards visible to the current user. Sorted by most recently modified.
 * Pass `createdByMe: true` to scope to only ones the user authored.
 */
export async function searchLiveboards(opts: {
  recordSize?: number;
  createdByMe?: boolean;
  currentUserName?: string;
} = {}): Promise<TSMetadataItem[]> {
  const body: Record<string, unknown> = {
    metadata: [{ type: 'LIVEBOARD' }],
    record_size: opts.recordSize ?? 50,
    record_offset: 0,
    sort_options: { field_name: 'MODIFIED', order: 'DESC' },
  };
  if (opts.createdByMe && opts.currentUserName) {
    body.created_by_user_identifiers = [opts.currentUserName];
  }
  const data = await tsFetch<TSMetadataItem[]>('/api/rest/2.0/metadata/search', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return data;
}

export async function getLiveboardTabs(liveboardId: string): Promise<TSLiveboardTab[]> {
  try {
    const data = await tsFetch<{
      contents?: Array<{ tabs?: TSLiveboardTab[] }>;
      metadata?: Array<{ metadata_detail?: { tabs?: TSLiveboardTab[] } }>;
    }>(`/api/rest/2.0/metadata/tml/export`, {
      method: 'POST',
      body: JSON.stringify({
        metadata: [{ identifier: liveboardId, type: 'LIVEBOARD' }],
        export_associated: false,
        export_fqn: false,
        edoc_format: 'JSON',
      }),
    });
    const tabs = data?.contents?.[0]?.tabs ?? data?.metadata?.[0]?.metadata_detail?.tabs ?? [];
    return tabs;
  } catch {
    return [];
  }
}
