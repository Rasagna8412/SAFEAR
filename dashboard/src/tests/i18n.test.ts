import { describe, it, expect } from 'vitest';
import { enTranslations } from '../i18n/locales/en';
import { hiTranslations } from '../i18n/locales/hi';
import { satTranslations } from '../i18n/locales/sat';
import { taTranslations } from '../i18n/locales/ta';
import { formatDate, formatNumber, formatPercent } from '../i18n/formatters';
import { SUPPORTED_LANGUAGES } from '../types/i18n';

describe('Phase 8 Multilingual Localization & i18n Tests', () => {
  describe('1. Supported Languages & Dictionary Completeness', () => {
    it('1. Supported languages list contains English, Hindi, Santali, and Tamil', () => {
      const codes = SUPPORTED_LANGUAGES.map(l => l.code);
      expect(codes).toContain('en');
      expect(codes).toContain('hi');
      expect(codes).toContain('sat');
      expect(codes).toContain('ta');
    });

    it('2. Hindi translation dictionary must have all required keys matching English', () => {
      const enKeys = Object.keys(enTranslations);
      const hiKeys = Object.keys(hiTranslations);

      for (const key of enKeys) {
        expect(hiKeys).toContain(key);
        expect((hiTranslations as any)[key]).toBeTruthy();
      }
    });

    it('3. Santali (Jharkhand) translation dictionary must have all required keys matching English', () => {
      const enKeys = Object.keys(enTranslations);
      const satKeys = Object.keys(satTranslations);

      for (const key of enKeys) {
        expect(satKeys).toContain(key);
        expect((satTranslations as any)[key]).toBeTruthy();
      }
    });

    it('4. Tamil translation dictionary must have all required keys matching English', () => {
      const enKeys = Object.keys(enTranslations);
      const taKeys = Object.keys(taTranslations);

      for (const key of enKeys) {
        expect(taKeys).toContain(key);
        expect((taTranslations as any)[key]).toBeTruthy();
      }
    });
  });

  describe('2. Locale Formatters', () => {
    it('5. Date formatting produces valid localized date strings', () => {
      const testDate = new Date('2026-08-25T12:00:00Z');
      const enDate = formatDate(testDate, 'en');
      const hiDate = formatDate(testDate, 'hi');
      const satDate = formatDate(testDate, 'sat');
      const taDate = formatDate(testDate, 'ta');

      expect(enDate).toBeTruthy();
      expect(hiDate).toBeTruthy();
      expect(satDate).toBeTruthy();
      expect(taDate).toBeTruthy();
    });

    it('6. Number and Percentage formatting produces valid strings', () => {
      expect(formatNumber(1250, 'en')).toBe('1,250');
      expect(formatPercent(95, 'en')).toBe('95%');
      expect(formatPercent(100, 'hi')).toContain('100');
    });
  });
});
