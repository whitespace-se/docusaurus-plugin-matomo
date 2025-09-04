export interface MatomoConfig {
  /** Matomo site ID */
  siteId: string;
  
  /** Matomo instance URL (without trailing slash) */
  matomoUrl: string;
  
  /** Matomo Tag Manager container ID (optional) */
  tagManagerContainerId?: string;
  
  /** Enable/disable tracking (default: true, disabled in development) */
  trackingEnabled?: boolean;
  
  /** Respect Do Not Track header (default: true) */
  respectDoNotTrack?: boolean;
  
  /** Disable cookies (default: false) */
  disableCookies?: boolean;
  
  /** Anonymize IP addresses (default: false) */
  anonymizeIp?: boolean;
  
  /** Custom PHP script path (default: 'matomo.php') */
  phpScript?: string;
  
  /** Custom JS script path (default: 'matomo.js') */
  jsScript?: string;
  
  /** Additional Matomo configuration options */
  additionalTrackers?: Array<{
    siteId: string;
    trackerUrl: string;
  }>;

  /** Enable debug mode for development testing (default: false) */
  debug?: boolean;
}

export interface MatomoPluginOptions extends MatomoConfig {
  // Plugin can extend with additional options if needed
}

declare global {
  interface Window {
    _paq?: any[][];
  }
}