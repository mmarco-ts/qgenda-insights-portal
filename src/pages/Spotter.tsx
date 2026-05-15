import { useEffect, useRef, useState } from 'react';
import { SpotterEmbed } from '@thoughtspot/visual-embed-sdk';
import { MessageSquare, Lightbulb, Send, Check } from 'lucide-react';
import Header from '../components/Header';
import {
  QGENDA_MODEL_ID,
  HIDE_TS_BRANDING_RULES,
  QG_CSS_VARIABLES,
} from '../lib/thoughtspot';
import { useTenant, buildRuntimeFilters } from '../lib/tenantContext';
import '../lib/thoughtspot';

const STARTER_PROMPTS = [
  'Total shifts by organization this month',
  'Open shifts trend over the last 90 days',
  'Published rate % by task type',
  'Top 10 organizations by scheduled hours',
  'Compare total shifts: this month vs last month',
];

const TIPS = [
  'Add a time range — "last 7 days", "this month".',
  'Slice with "by organization" or "by task type".',
  'Compare with "vs" — "this month vs last month".',
];

export default function Spotter() {
  const embedRef = useRef<HTMLDivElement>(null);
  const embedInstanceRef = useRef<SpotterEmbed | null>(null);
  const [sentIdx, setSentIdx] = useState<number | null>(null);
  const [seedQuery, setSeedQuery] = useState<string | undefined>(undefined);
  const [mountKey, setMountKey] = useState(0);
  const tenantCtx = useTenant();

  // Remount when tenant/persona/seedQuery change
  useEffect(() => {
    embedInstanceRef.current = null;
    setMountKey(k => k + 1);
  }, [tenantCtx.tenant.id, tenantCtx.persona.id, seedQuery]);

  useEffect(() => {
    if (!embedRef.current || embedInstanceRef.current) return;

    const runtimeFilters = buildRuntimeFilters(tenantCtx);

    const embed = new SpotterEmbed(embedRef.current, {
      frameParams: { width: '100%', height: '100%' },
      worksheetId: QGENDA_MODEL_ID,
      updatedSpotterChatPrompt: true,
      runtimeFilters,
      ...(seedQuery ? { searchOptions: { searchQuery: seedQuery } } : {}),
      customizations: {
        style: {
          customCSS: {
            variables: QG_CSS_VARIABLES,
            rules_UNSTABLE: HIDE_TS_BRANDING_RULES,
          },
        },
      },
    });

    embedInstanceRef.current = embed;
    embed.render();

    return () => {
      embedInstanceRef.current = null;
    };
  }, [mountKey, tenantCtx, seedQuery]);

  const handlePromptClick = (prompt: string, idx: number) => {
    setSeedQuery(prompt);
    setSentIdx(idx);
    setTimeout(() => setSentIdx(null), 1600);
  };

  return (
    <>
      <Header
        title="Insights AI"
        subtitle="Ask questions in plain English about scheduling, capacity, providers, and staffing performance"
      />
      <main className="main-content">
        <div className="page-container">
          <div className="spotter-layout">
            <div className="spotter-embed-wrap" key={mountKey}>
              <div className="embed-container" ref={embedRef}>
                <div className="embed-loading">
                  <div className="embed-loading-spinner"></div>
                  <span>Loading Insights AI…</span>
                </div>
              </div>
            </div>

            <aside className="spotter-side">
              <div className="spotter-side-status">
                <span className="status-dot"></span>
                <span>Active</span>
              </div>

              <div className="spotter-side-section">
                <div className="spotter-side-eyebrow">
                  <MessageSquare size={13} />
                  Ask Insights AI
                </div>
                <div className="spotter-side-help">
                  Click a question to ask Insights AI directly, or type your own in the chat below.
                </div>
                <div className="spotter-prompt-list">
                  {STARTER_PROMPTS.map((p, i) => (
                    <button
                      key={p}
                      className="spotter-prompt-card"
                      onClick={() => handlePromptClick(p, i)}
                      title="Ask Insights AI this question"
                    >
                      <span className="spotter-prompt-text">{p}</span>
                      <span className="spotter-prompt-icon" aria-hidden="true">
                        {sentIdx === i ? <Check size={14} /> : <Send size={13} />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="spotter-side-section">
                <div className="spotter-side-eyebrow">
                  <Lightbulb size={12} />
                  Tips
                </div>
                <ul className="spotter-tips">
                  {TIPS.map(t => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
