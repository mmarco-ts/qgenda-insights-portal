import { useEffect, useRef, useState } from 'react';
import { SpotterEmbed } from '@thoughtspot/visual-embed-sdk';
import { Sparkles, MessageSquare, Lightbulb, Copy, Check } from 'lucide-react';
import Header from '../components/Header';
import {
  QGENDA_MODEL_ID,
  HIDE_TS_BRANDING_RULES,
  QG_CSS_VARIABLES,
} from '../lib/thoughtspot';
import '../lib/thoughtspot';

const STARTER_PROMPTS = [
  'Which units have the most open shifts this week?',
  'Show overtime hours by department over the last 90 days',
  'Top 10 providers by hours scheduled this month',
  'Compare staffing levels for nights vs days',
  'Which credentials are expiring in the next 60 days?',
  'Show schedule coverage trends across locations',
];

const TIPS = [
  { title: 'Be specific about time', body: 'Add "last 7 days", "this month", or a date range to narrow the answer.' },
  { title: 'Slice by what matters', body: 'Try "by unit", "by department", or "by provider" to break down the metric.' },
  { title: 'Compare two things', body: 'Use "vs" or "compared to" — e.g. "overtime this month vs last month".' },
  { title: 'Drill into outliers', body: 'Click any data point in a chart to filter the next question to that segment.' },
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
                  <Lightbulb size={13} />
                  Tips for better answers
                </div>
                <ul className="spotter-tips">
                  {TIPS.map(t => (
                    <li key={t.title}>
                      <strong>{t.title}.</strong> {t.body}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="spotter-side-section spotter-side-context">
                <div className="spotter-side-eyebrow">
                  <Sparkles size={13} />
                  Data context
                </div>
                <p>
                  Insights AI is connected to your workforce model — schedules, shifts, providers,
                  credentialing, and time &amp; attendance. Ask anything across those entities in plain English.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
