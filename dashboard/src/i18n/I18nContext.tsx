import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, TranslationDictionary, SUPPORTED_LANGUAGES, LanguageOption } from '../types/i18n';
import { enTranslations } from './locales/en';
import { hiTranslations } from './locales/hi';
import { satTranslations } from './locales/sat';
import { taTranslations } from './locales/ta';
import { formatDate, formatDateTime, formatNumber, formatPercent } from './formatters';
import { useAuth } from '../services/auth/AuthContext';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  languages: LanguageOption[];
  formatDate: (date: string | number | Date) => string;
  formatDateTime: (date: string | number | Date) => string;
  formatNumber: (val: number) => string;
  formatPercent: (val: number) => string;
}

const DICTIONARIES: Record<SupportedLanguage, TranslationDictionary> = {
  en: enTranslations,
  hi: hiTranslations,
  sat: satTranslations,
  ta: taTranslations
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { user, updateProfile } = useAuth();

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('safear_language') : null;
    if (saved === 'hi' || saved === 'sat' || saved === 'ta' || saved === 'en') return saved;
    return 'en';
  });

  // Synchronize when user logs in with a saved language preference
  useEffect(() => {
    if (user?.language && (user.language === 'en' || user.language === 'hi' || user.language === 'sat' || user.language === 'ta')) {
      if (user.language !== language) {
        setLanguageState(user.language as SupportedLanguage);
      }
    }
  }, [user]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('safear_language', lang);
    }
    if (user) {
      updateProfile({ language: lang }).catch(() => {});
    }
  };

  const t = DICTIONARIES[language] || enTranslations;

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        formatDate: (d) => formatDate(d, language),
        formatDateTime: (d) => formatDateTime(d, language),
        formatNumber: (n) => formatNumber(n, language),
        formatPercent: (p) => formatPercent(p, language)
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
