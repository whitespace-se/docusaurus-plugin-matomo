import { describe, it, expect, vi } from 'vitest';
import pluginMatomo from './index';
import type { LoadContext } from '@docusaurus/types';
import type { MatomoPluginOptions } from './types';

// Mock require.resolve to return a mock path
vi.mock('module', () => ({
  default: {
    createRequire: () => ({
      resolve: vi.fn(() => '/mock/path/to/client.js')
    })
  }
}));

const mockContext: LoadContext = {
  siteDir: '/mock/site',
  generatedFilesDir: '/mock/generated',
  siteConfig: {
    title: 'Test Site',
    url: 'https://test.com',
    baseUrl: '/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'test',
    projectName: 'test',
    plugins: [],
    themes: [],
    presets: [],
    customFields: {},
    themeConfig: {},
    titleDelimiter: '|',
    noIndex: false,
  },
  outDir: '/mock/out',
  baseUrl: '/',
};

describe('pluginMatomo', () => {
  it('should return a plugin with correct name', () => {
    const options: MatomoPluginOptions = {
      siteId: '1',
      matomoUrl: 'https://analytics.example.com',
    };
    
    const plugin = pluginMatomo(mockContext, options);
    expect(plugin.name).toBe('docusaurus-plugin-matomo');
  });

  it('should not load client modules in development without debug', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const options: MatomoPluginOptions = {
      siteId: '1',
      matomoUrl: 'https://analytics.example.com',
    };
    
    const plugin = pluginMatomo(mockContext, options);
    const clientModules = plugin.getClientModules?.();
    expect(clientModules).toEqual([]);
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should have getClientModules method that would load client in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const options: MatomoPluginOptions = {
      siteId: '1',
      matomoUrl: 'https://analytics.example.com',
    };
    
    const plugin = pluginMatomo(mockContext, options);
    expect(plugin.getClientModules).toBeDefined();
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should inject tracking script in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const options: MatomoPluginOptions = {
      siteId: '1',
      matomoUrl: 'https://analytics.example.com',
    };
    
    const plugin = pluginMatomo(mockContext, options);
    const htmlTags = plugin.injectHtmlTags?.();
    
    expect(htmlTags?.headTags).toHaveLength(1);
    expect(htmlTags?.headTags?.[0].tagName).toBe('script');
    expect(htmlTags?.headTags?.[0].innerHTML).toContain('_paq');
    expect(htmlTags?.headTags?.[0].innerHTML).toContain('setSiteId');
    expect(htmlTags?.headTags?.[0].innerHTML).toContain("'1'");
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should inject Tag Manager script when containerId is provided', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const options: MatomoPluginOptions = {
      siteId: '1',
      matomoUrl: 'https://analytics.example.com',
      tagManagerContainerId: 'ABC123',
    };
    
    const plugin = pluginMatomo(mockContext, options);
    const htmlTags = plugin.injectHtmlTags?.();
    
    expect(htmlTags?.headTags).toHaveLength(1);
    expect(htmlTags?.headTags?.[0].tagName).toBe('script');
    expect(htmlTags?.headTags?.[0].innerHTML).toContain('_mtm');
    expect(htmlTags?.headTags?.[0].innerHTML).toContain('container_ABC123.js');
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should include respectDoNotTrack option in tracking script', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const options: MatomoPluginOptions = {
      siteId: '1',
      matomoUrl: 'https://analytics.example.com',
      respectDoNotTrack: true,
    };
    
    const plugin = pluginMatomo(mockContext, options);
    const htmlTags = plugin.injectHtmlTags?.();
    
    expect(htmlTags?.headTags?.[0].innerHTML).toContain('setDoNotTrack');
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should include disableCookies option in tracking script', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const options: MatomoPluginOptions = {
      siteId: '1',
      matomoUrl: 'https://analytics.example.com',
      disableCookies: true,
    };
    
    const plugin = pluginMatomo(mockContext, options);
    const htmlTags = plugin.injectHtmlTags?.();
    
    expect(htmlTags?.headTags?.[0].innerHTML).toContain('disableCookies');
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should handle missing siteId gracefully', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const options = {
      matomoUrl: 'https://analytics.example.com',
    } as MatomoPluginOptions;
    
    expect(() => {
      const plugin = pluginMatomo(mockContext, options);
      plugin.injectHtmlTags?.();
    }).not.toThrow();
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should warn when required options are missing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const options = {} as MatomoPluginOptions;
    
    pluginMatomo(mockContext, options);
    
    expect(consoleSpy).toHaveBeenCalledWith('Matomo plugin: Either siteId or tagManagerContainerId is required');
    expect(consoleSpy).toHaveBeenCalledWith('Matomo plugin: matomoUrl is required');
    
    consoleSpy.mockRestore();
  });
});