import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


// Import translation files
import translationEN from '../locales/en/translation.json';
import translationJA from '../locales/ja/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  ja: {
    translation: translationJA
  }
};

i18n
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback language if translation missing
    
    // Language detection options
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator'],
      // Cache user language selection
      caches: ['localStorage'],
      // localStorage key name
      lookupLocalStorage: 'i18nextLng'
    },
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    // Debug mode - set to false in production
    debug: true,
    
    // React specific options
    react: {
      useSuspense: true // Disable suspense for simpler setup
    }
  });

export default i18n;