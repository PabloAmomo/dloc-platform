import { InitOptions } from "i18next";
import lngEN from 'languages/en.json';
import lngES from 'languages/es.json';
import { configApp } from "./configApp";

const LNG_LIST = ['es', 'en'];
const LNG_RESOURCES = {
  en: { translation: { ...lngEN } },
  es: { translation: { ...lngES } },
};

const configI18n : InitOptions<unknown> = {
  resources: LNG_RESOURCES,
  fallbackLng: LNG_LIST,
  interpolation: { escapeValue: false },
  nonExplicitSupportedLngs: true,
  supportedLngs: LNG_LIST,
  lowerCaseLng: true,
  load: 'languageOnly',

  detection: {
    order: ['querystring', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
    caches: ['localStorage', 'cookie'],
    excludeCacheFor: ['cimode'],
    cookieMinutes: 10,
    cookieDomain: configApp.cookieName,
    htmlTag: document.documentElement,
    cookieOptions: { path: '/', sameSite: 'strict' },
    convertDetectedLanguage: (lng:string) => lng.split('-')[0].split('_')[0],
  },
};

export default configI18n;