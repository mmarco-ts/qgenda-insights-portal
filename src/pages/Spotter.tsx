import { useEffect, useRef, useState } from 'react';
import { SpotterEmbed } from '@thoughtspot/visual-embed-sdk';
import { MessageSquare, Lightbulb, Copy, Check } from 'lucide-react';
import Header from '../components/Header';
import {
  QGENDA_MODEL_ID,
  HIDE_TS_BRANDING_RULES,
  QG_CSS_VARIABLES,
} from '../lib/thoughtspot';
import '../lib/thoughtspot';

const STARTER_PROMPTS = [
  'Units with the most open shifts this week',
  'Overtime hours by department, last 90 days',
  'Top 10 providers by hours scheduled',
  'Staffing levels: nights vs days',
  'Credentials expiring in the next 60 days',
];

const TIPS = [
  'Add a time range — "last 7 days", "this month".',
  'Slice with "by unit", "by department", "by provider".',
  'Compare with "vs" — e.g. "this month vs last month".',
];

export default function Spotter() {
  const embedRef = useRef<HTMLDivElement>(null);
  const embedInstanceRef = useRef<SpotterEmbed | null>(null);
  const [seedQuery, setSeedQuery] = useState<string | null>(null);
  const [mountKey, setMountKey] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!embedRef.current || embedInstanceRef.current) return;

    const embed = new SpotterEmbed(embedRef.current, {
      frameParams: { width: '100%', height: '100%' },
      worksheetId: QGENDA_MODEL_ID,
      updatedSpotterChatPrompt: true,
      ...(seedQuery ? { searchOptions: { searchTokenString: seedQuery, executeSearch: true } } : {}),
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
  }, [mountKey, seedQuery]);

  const handlePromptClick = (prompt: string, idx: number) => {
    setSeedQuery(prompt);
    embedInstanceRef.current = null;
    setMountKey(k => k + 1);
    navigator.clipboard?.writeText(prompt).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1600);
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
                  Click a question to start the conversation, or type your own below.
                </div>
                <div className="spotter-prompt-list">
                  {STARTER_PROMPTS.map((p, i) => (
                    <button
                      key={p}
                      className="spotter-prompt-card"
                      onClick={() => handlePromptClick(p, i)}
                    >
                      <span className="spotter-prompt-text">{p}</span>
                      <span className="spotter-prompt-icon" aria-hidden="true">
                        {copiedIdx === i ? <Check size={14} /> : <Copy size={14} />}
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
