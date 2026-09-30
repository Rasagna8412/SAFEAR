import { SupportedLanguage } from '../types/i18n';

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  sat: 'sat-IN',
  ta: 'ta-IN'
};

export function formatDate(dateInput: string | number | Date, lang: SupportedLanguage = 'en'): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  const locale = LOCALE_MAP[lang] || 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function formatDateTime(dateInput: string | number | Date, lang: SupportedLanguage = 'en'): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  const locale = LOCALE_MAP[lang] || 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatNumber(val: number, lang: SupportedLanguage = 'en'): string {
  const locale = LOCALE_MAP[lang] || 'en-US';
  return new Intl.NumberFormat(locale).format(val);
}

export function formatPercent(val: number, lang: SupportedLanguage = 'en'): string {
  const locale = LOCALE_MAP[lang] || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0
  }).format(val / 100);
}
