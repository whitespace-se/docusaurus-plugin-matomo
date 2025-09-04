import { describe, it, expect } from 'vitest';
import type { MatomoConfig } from './types';

describe('types', () => {
  it('should define MatomoConfig interface with required fields', () => {
    const config: MatomoConfig = {
      siteId: '1',
      matomoUrl: 'https://analytics.example.com',
    };
    
    expect(config.siteId).toBe('1');
    expect(config.matomoUrl).toBe('https://analytics.example.com');
  });
});