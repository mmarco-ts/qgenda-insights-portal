import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, RefreshCw, Clock, User } from 'lucide-react';
import Header from '../components/Header';
import { searchLiveboards, TSMetadataItem } from '../lib/api';
import { useCurrentUser } from '../lib/useCurrentUser';

function formatRelative(ts?: number) {
  if (!ts) return '—';
  const ms = ts < 1e12 ? ts * 1000 : ts;
  const diff = Date.now() - ms;
  const day = 86_400_000;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < day) return `${Math.floor(diff / 3_600_000)} hr ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} d ago`;
  return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MyReports() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [items, setItems] = useState<TSMetadataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'mine'>('all');
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchLiveboards({
        recordSize: 60,
        createdByMe: filter === 'mine',
        currentUserName: user?.userName,
      });
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter === 'mine' && !user?.userName) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, user?.userName]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i =>
      i.metadata_name.toLowerCase().includes(q) ||
      (i.metadata_header?.description ?? '').toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <>
      <Header
        title="My Reports"
        subtitle="Live, API-driven library of Insights Boards available to you"
      />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">My Reports</h2>
            <p className="page-subtitle">
              Every Insights Board you can access — pulled live from QGenda Insights. Click any card to open it in the workforce dashboard.
            </p>
          </div>

          <div className="reports-toolbar">
            <div className="reports-search">
              <Search size={16} />
              <input
                placeholder="Search reports…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className="reports-filter">
              <button
                className={`reports-chip ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All reports
              </button>
              <button
                className={`reports-chip ${filter === 'mine' ? 'active' : ''}`}
                onClick={() => setFilter('mine')}
                disabled={!user?.userName}
              >
                Created by me
              </button>
            </div>
            <button className="reports-refresh" onClick={load} disabled={loading} aria-label="Refresh">
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {error && (
            <div className="reports-error">
              <strong>Could not load reports.</strong>
              <div>{error}</div>
              <div className="reports-error-hint">
                If you see a CORS or 401, make sure <code>http://localhost:8080</code> is on the CORS whitelist and you're signed in to qgenda.thoughtspot.cloud.
              </div>
            </div>
          )}

          {loading && !error && (
            <div className="reports-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="report-card skeleton" />
              ))}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="reports-empty">
              <LayoutDashboard size={36} />
              <h3>No reports found</h3>
              <p>Try clearing your search or switching to "All reports".</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="reports-grid">
              {filtered.map(item => (
                <button
                  key={item.metadata_id}
                  className="report-card"
                  onClick={() => navigate(`/dashboard/${item.metadata_id}`)}
                >
                  <div className="report-card-icon">
                    <LayoutDashboard size={20} />
                  </div>
                  <div className="report-card-body">
                    <div className="report-card-title">{item.metadata_name}</div>
                    {item.metadata_header?.description && (
                      <div className="report-card-desc">
                        {item.metadata_header.description}
                      </div>
                    )}
                    <div className="report-card-meta">
                      <span><Clock size={12} /> {formatRelative(item.metadata_header?.modified)}</span>
                      {item.metadata_header?.authorDisplayName && (
                        <span><User size={12} /> {item.metadata_header.authorDisplayName}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
