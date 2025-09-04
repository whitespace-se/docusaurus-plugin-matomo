import { ClientModule } from '@docusaurus/types';

// Client-side module for handling SPA navigation tracking
const clientModule: ClientModule = {
  onRouteDidUpdate({ location, previousLocation }) {
    // Don't track the initial page load, it's already tracked by the embedded script
    if (previousLocation && (
      location.pathname !== previousLocation.pathname ||
      location.search !== previousLocation.search ||
      location.hash !== previousLocation.hash
    )) {
      if (window._paq && typeof window._paq.push === 'function') {
        // Track page view for SPA navigation
        const customUrl = (location.pathname || '') + (location.search || '') + (location.hash || '');
        window._paq.push(['setCustomUrl', customUrl]);
        window._paq.push(['setDocumentTitle', document.title]);
        window._paq.push(['trackPageView']);
      }
    }
  },
};

export default clientModule;