import { useEffect, useRef, useState } from 'react';
import { HelpCircle, Hash, Copy, Check, ExternalLink } from 'lucide-react';

const SLACK_CHANNEL = 'ext-qgenda-thoughtspot';
const TEAM = ['Manuel', 'Jack Mulcahy'];
const SLACK_DEEP_LINK = `slack://channel?team=&id=${SLACK_CHANNEL}`;

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleCopy = () => {
    navigator.clipboard?.writeText(`#${SLACK_CHANNEL}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="help-button-wrap" ref={wrapRef}>
      <button
        className="header-action"
        aria-label="Help"
        onClick={() => setOpen(o => !o)}
      >
        <HelpCircle size={20} />
      </button>

      {open && (
        <div className="help-pop" role="dialog">
          <div className="help-pop-title">Need a hand?</div>
          <div className="help-pop-body">
            Message{' '}
            {TEAM.map((name, i) => (
              <span key={name}>
                <span className="help-pop-mention">@{name}</span>
                {i < TEAM.length - 2 && ', '}
                {i === TEAM.length - 2 && ' and '}
              </span>
            ))}{' '}
            in the Slack channel below.
          </div>

          <button className="help-pop-channel" onClick={handleCopy}>
            <Hash size={14} />
            <span className="help-pop-channel-name">{SLACK_CHANNEL}</span>
            <span className="help-pop-copy" aria-label="Copy channel name">
              {copied ? <Check size={14} /> : <Copy size={13} />}
            </span>
          </button>

          <a
            className="help-pop-link"
            href={SLACK_DEEP_LINK}
            onClick={() => setOpen(false)}
          >
            Open in Slack <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
