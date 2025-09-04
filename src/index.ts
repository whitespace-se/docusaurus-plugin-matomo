import type { LoadContext, Plugin } from '@docusaurus/types';
import type { MatomoPluginOptions } from './types';

export default function pluginMatomo(
  context: LoadContext,
  options: MatomoPluginOptions
): Plugin<void> {
  const {
    siteId,
    matomoUrl,
    tagManagerContainerId,
    trackingEnabled = true,
    respectDoNotTrack = true,
    disableCookies = false,
    anonymizeIp = false,
    phpScript = 'matomo.php',
    jsScript = 'matomo.js',
    additionalTrackers,
    debug = false,
  } = options;

  // Validate required options
  if (!siteId && !tagManagerContainerId) {
    console.warn('Matomo plugin: Either siteId or tagManagerContainerId is required');
  }
  if (!matomoUrl) {
    console.warn('Matomo plugin: matomoUrl is required');
  }

  const isProd = process.env.NODE_ENV === 'production';
  const shouldTrack = (isProd || debug) && trackingEnabled;

  return {
    name: 'docusaurus-plugin-matomo',

    getClientModules() {
      return shouldTrack ? [require.resolve('./client')] : [];
    },

    injectHtmlTags() {
      if (!shouldTrack) {
        return {};
      }

      const scriptContent = tagManagerContainerId
        ? generateTagManagerScript(tagManagerContainerId, matomoUrl)
        : generateTrackingScript({
            siteId,
            matomoUrl,
            respectDoNotTrack,
            disableCookies,
            anonymizeIp,
            phpScript,
            jsScript,
            additionalTrackers,
          });

      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: scriptContent,
          },
        ],
      };
    },
  };
}

function generateTagManagerScript(containerId: string, matomoUrl: string): string {
  return `
    var _mtm = window._mtm = window._mtm || [];
    _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
    (function() {
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.src='${matomoUrl}/js/container_${containerId}.js'; s.parentNode.insertBefore(g,s);
    })();
  `;
}

function generateTrackingScript({
  siteId,
  matomoUrl,
  respectDoNotTrack,
  disableCookies,
  anonymizeIp,
  phpScript,
  jsScript,
  additionalTrackers,
}: {
  siteId: string;
  matomoUrl: string;
  respectDoNotTrack: boolean;
  disableCookies: boolean;
  anonymizeIp: boolean;
  phpScript: string;
  jsScript: string;
  additionalTrackers?: Array<{ siteId: string; trackerUrl: string }>;
}): string {
  const commands = [];

  if (respectDoNotTrack) {
    commands.push("_paq.push(['setDoNotTrack', true]);");
  }

  if (disableCookies) {
    commands.push("_paq.push(['disableCookies']);");
  }

  if (anonymizeIp) {
    commands.push("_paq.push(['anonymizeIp']);");
  }

  // Add additional trackers
  if (additionalTrackers && additionalTrackers.length > 0) {
    additionalTrackers.forEach(({ siteId: additionalSiteId, trackerUrl }) => {
      commands.push(`_paq.push(['addTracker', '${trackerUrl}', '${additionalSiteId}']);`);
    });
  }

  return `
    var _paq = window._paq = window._paq || [];
    ${commands.join('\n    ')}
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    _paq.push(['setTrackerUrl', '${matomoUrl}/${phpScript}']);
    _paq.push(['setSiteId', '${siteId}']);
    (function() {
      var u="${matomoUrl}/";
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.src=u+'${jsScript}'; s.parentNode.insertBefore(g,s);
    })();
  `;
}

export type { MatomoPluginOptions } from './types';