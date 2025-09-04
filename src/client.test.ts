import { describe, it, expect, vi, beforeEach } from 'vitest';
import clientModule from './client';

describe('client module', () => {
  beforeEach(() => {
    // Reset window._paq before each test
    delete (window as any)._paq;
  });

  it('should not track on initial page load', () => {
    const mockPaq = vi.fn();
    (window as any)._paq = { push: mockPaq };

    const location = { pathname: '/test', search: '', hash: '' };
    const previousLocation = null;

    clientModule.onRouteDidUpdate?.({ location, previousLocation } as any);

    expect(mockPaq).not.toHaveBeenCalled();
  });

  it('should track when pathname changes', () => {
    const mockPaq = vi.fn();
    (window as any)._paq = { push: mockPaq };

    const location = { pathname: '/new-page', search: '', hash: '' };
    const previousLocation = { pathname: '/old-page', search: '', hash: '' };

    clientModule.onRouteDidUpdate?.({ location, previousLocation } as any);

    expect(mockPaq).toHaveBeenCalledWith(['setCustomUrl', '/new-page']);
    expect(mockPaq).toHaveBeenCalledWith(['setDocumentTitle', document.title]);
    expect(mockPaq).toHaveBeenCalledWith(['trackPageView']);
  });

  it('should track when search params change', () => {
    const mockPaq = vi.fn();
    (window as any)._paq = { push: mockPaq };

    const location = { pathname: '/page', search: '?new=param', hash: '' };
    const previousLocation = { pathname: '/page', search: '?old=param', hash: '' };

    clientModule.onRouteDidUpdate?.({ location, previousLocation } as any);

    expect(mockPaq).toHaveBeenCalledWith(['setCustomUrl', '/page?new=param']);
    expect(mockPaq).toHaveBeenCalledWith(['trackPageView']);
  });

  it('should handle missing _paq gracefully', () => {
    // No _paq on window
    const location = { pathname: '/new-page', search: '', hash: '' };
    const previousLocation = { pathname: '/old-page', search: '', hash: '' };

    // Should not throw
    expect(() => {
      clientModule.onRouteDidUpdate?.({ location, previousLocation } as any);
    }).not.toThrow();
  });

  it('should handle _paq without push method', () => {
    // _paq exists but is not an array with push
    (window as any)._paq = {};
    
    const location = { pathname: '/new-page', search: '', hash: '' };
    const previousLocation = { pathname: '/old-page', search: '', hash: '' };

    expect(() => {
      clientModule.onRouteDidUpdate?.({ location, previousLocation } as any);
    }).not.toThrow();
  });

  it('should handle undefined URL parts gracefully', () => {
    const mockPaq = vi.fn();
    (window as any)._paq = { push: mockPaq };

    const location = { pathname: undefined, search: undefined, hash: undefined } as any;
    const previousLocation = { pathname: '/old-page', search: '', hash: '' };

    clientModule.onRouteDidUpdate?.({ location, previousLocation } as any);

    expect(mockPaq).toHaveBeenCalledWith(['setCustomUrl', '']);
  });
});