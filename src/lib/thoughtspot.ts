import { init, AuthType } from '@thoughtspot/visual-embed-sdk';

let isInitialized = false;

export const TS_HOST = 'https://qgenda.thoughtspot.cloud';
export const QGENDA_LIVEBOARD_ID = '081d70c1-7549-451c-8135-0d77dcf32c62';
export const QGENDA_LIVEBOARD_TAB_ID = '0319fb37-0cdb-4e86-a767-9a82d4f5784b';
export const QGENDA_MODEL_ID = '7d0a8b72-2620-4040-9b86-644a8cccba9e';

/**
 * Hide-Powered-by + footer rules reused across embeds.
 * Targets the various TS footer/logo modules.
 */
// Spotter icon hosted on GitHub + served via jsDelivr.
// Make sure cdn.jsdelivr.net is on the TS CSP img-src allowlist.
export const QG_SPOTTER_ICON_URL =
  "https://cdn.jsdelivr.net/gh/mmarco-ts/qgenda-insights-portal/public/qg-spotter-icon.svg";

export const HIDE_TS_BRANDING_RULES: Record<string, Record<string, string>> = {
  ".footer-module__footerLogo": { display: "none !important" },
  ".footer-module__footer": { display: "none !important" },
  "[class*='footer-module']": { display: "none !important" },
  "img[alt*='Powered by']": { display: "none !important" },
  "img[alt*='ThoughtSpot']": { display: "none !important" },
  ".bk-logo, .thoughtspot-logo, [class*='thoughtspotLogo']": { display: "none !important" },
  ".collapsible-item-response-module__customIconWrapper": { display: "none !important" },
  ".button-module__buttonWrapper.chat-connector-resources-module__addConnectorResourceButton": { display: "none !important" },
};

export const QG_CSS_VARIABLES = {
  "--ts-var-root-background": "#ffffff",
  "--ts-var-viz-background": "#ffffff",
  "--ts-var-application-color": "#002E61",
  "--ts-var-root-color": "#1A1A1A",
  "--ts-var-root-font-family": "'Red Hat Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "--ts-var-root-text-transform": "none",
  "--ts-var-button--primary-color": "#ffffff",
  "--ts-var-button--primary-background": "#1F7BB6",
  "--ts-var-button--primary--hover-background": "#1A6A9E",
  "--ts-var-button--secondary-color": "#1F7BB6",
  "--ts-var-button--secondary-background": "#E6F1F9",
  "--ts-var-button--secondary--hover-background": "#D0E5F3",
  "--ts-var-button-border-radius": "10px",
  "--ts-var-chip-border-radius": "999px",
  "--ts-var-nav-background": "#ffffff",
  "--ts-var-nav-color": "#002E61",
  "--ts-var-search-bar-text-font-color": "#1A1A1A",
  "--ts-var-search-bar-background-color": "#F5F6F8",
  "--ts-var-viz-title-font-family": "'Red Hat Display', sans-serif",
  "--ts-var-viz-title-color": "#002E61",
  "--ts-var-viz-title-text-transform": "none",
  "--ts-var-viz-description-color": "#4E4D4D",
  "--ts-var-axis-title-color": "#4E4D4D",
  "--ts-var-axis-data-label-color": "#4E4D4D",
  "--ts-var-spotter-prompt-background": "#F5F6F8",
  "--ts-var-spotter-prompt-color": "#002E61",
};

export const QG_WHITELABEL_STRINGS: Record<string, string> = {
  // Product names
  "ThoughtSpot": "QGenda Insights",
  "ThoughtSpot Embedded": "QGenda Insights",
  "Spotter": "Insights AI",
  "Ask Spotter": "Ask Insights AI",
  "Spotter session": "Insights AI session",
  "Ask a question": "Ask about your workforce data",
  "What do you want to know?": "What would you like to analyze about your workforce?",
  "Powered by ThoughtSpot": "",

  // Object types — Liveboard → Insights Board, Worksheet/Model → Workforce Model
  "Liveboard": "Insights Board",
  "Liveboards": "Insights Boards",
  "liveboard": "insights board",
  "liveboards": "insights boards",
  "Worksheet": "Workforce Model",
  "Worksheets": "Workforce Models",
  "worksheet": "workforce model",
  "worksheets": "workforce models",
  "Answer": "Insight",
  "Answers": "Insights",
  "answer": "insight",
  "answers": "insights",
  "Pinboard": "Insights Board",
  "Pinboards": "Insights Boards",

  // Search/chat copy
  "Preview data": "Preview data",
  "Search data": "Search workforce data",
  "Type a question to start": "Type a question about your workforce…",
  "Suggestions": "Sample questions",
  "Sample questions": "Sample questions",
};
export function initThoughtSpot() {
  if (!isInitialized) {
    init({
      thoughtSpotHost: TS_HOST,
      authType: AuthType.None,
      customizations: {
        content: {
          strings: QG_WHITELABEL_STRINGS,
        },
        iconSpriteUrl: QG_SPOTTER_ICON_URL,
        style: {
          customCSS: {
            variables: QG_CSS_VARIABLES,
            rules_UNSTABLE: HIDE_TS_BRANDING_RULES,
          },
        },
      },
    });
    isInitialized = true;
    console.log('ThoughtSpot SDK initialized for QGenda Insights');
  }
}

initThoughtSpot();
