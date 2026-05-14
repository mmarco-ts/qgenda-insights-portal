import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk';
import Header from '../components/Header';
import {
  QGENDA_LIVEBOARD_ID,
  QGENDA_LIVEBOARD_TAB_ID,
  HIDE_TS_BRANDING_RULES,
  QG_CSS_VARIABLES,
} from '../lib/thoughtspot';
import '../lib/thoughtspot';

export default function Dashboard() {
  const { liveboardId: paramId } = useParams<{ liveboardId?: string }>();
  const liveboardId = paramId || QGENDA_LIVEBOARD_ID;
  const isDefault = liveboardId === QGENDA_LIVEBOARD_ID;

  const embedRef = useRef<HTMLDivElement>(null);
  const embedInstanceRef = useRef<LiveboardEmbed | null>(null);
  const [mountKey, setMountKey] = useState(0);

  // remount when navigating from /dashboard/:id1 to /dashboard/:id2
  useEffect(() => {
    embedInstanceRef.current = null;
    setMountKey(k => k + 1);
  }, [liveboardId]);

  useEffect(() => {
    if (!embedRef.current || embedInstanceRef.current) return;

    const embed = new LiveboardEmbed(embedRef.current, {
      frameParams: { width: '100%', height: '100%' },
      liveboardId,
      ...(isDefault ? { activeTabId: QGENDA_LIVEBOARD_TAB_ID } : {}),
      hideLiveboardHeader: false,
      showLiveboardTitle: false,
      showLiveboardDescription: false,
      isLiveboardStylingAndGroupingEnabled: true,
      customizations: {
        style: {
          customCSS: {
            variables: {
              ...QG_CSS_VARIABLES,
              "--ts-var-root-background": "transparent",
            },
            rules_UNSTABLE: {
              ...HIDE_TS_BRANDING_RULES,
              // Keep AI Highlights, hide title/description/info chips only
              ".pinboard-title-module__pinboardTitle": { display: "none !important" },
              ".pinboard-header-module__title": { display: "none !important" },
              ".pinboard-header-module__description": { display: "none !important" },
              ".pinboard-header-module__pinboardInfo": { display: "none !important" },
              "[data-testid='pinboard-title']": { display: "none !important" },
              "[data-testid='pinboard-description']": { display: "none !important" },
              "body, .bk-root, .sage-embed-module, *": {
                fontFamily: "'Red Hat Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important",
              },
              "body": { backgroundColor: "transparent !important" },
              ".pinboard-background, .ReactGridLayout, .pinboard-content-module__pinboardContent, .pinboard-module__pinboard, .pinboard-page, .embed-module__embedContainer": {
                backgroundColor: "transparent !important",
              },
              ".answer-module__answer, .viz-card-module__vizCard": {
                border: "none !important",
                boxShadow: "0 8px 20px -4px rgba(0, 46, 97, 0.12), 0 2px 6px -2px rgba(0, 46, 97, 0.06) !important",
                borderRadius: "14px !important",
                overflow: "hidden !important",
              },
              ".react-grid-item": { border: "none !important" },
              ".chip-base-module__chip.chip-base-module__filter:hover, [data-testid='filter-panel-chip']:hover": {
                backgroundColor: "#1F7BB6 !important",
                borderColor: "#1F7BB6 !important",
                color: "#ffffff !important",
              },
              ".chip-base-module__chip.chip-base-module__filter:hover *, [data-testid='filter-panel-chip']:hover *": {
                color: "#ffffff !important",
              },
            },
          },
        },
      },
    });

    embedInstanceRef.current = embed;
    embed.render();

    return () => {
      embedInstanceRef.current = null;
    };
  }, [mountKey, liveboardId, isDefault]);

  return (
    <>
      <Header
        title="Workforce Dashboard"
        subtitle="Scheduling, staffing, and capacity analytics"
      />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">Workforce Operations Overview</h2>
            <p className="page-subtitle">
              Monitor scheduling coverage, provider utilization, and staffing trends across units and locations
            </p>
          </div>
          <div className="embed-container" key={mountKey} ref={embedRef} />
        </div>
      </main>
    </>
  );
}
