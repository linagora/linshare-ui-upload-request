import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { LanguageService } from '@/services/language.service';
import { ConfigService } from '@/services/config.service';
import { LANGUAGE } from '@/constants';
import { en, fr, ru, vi } from '@/i18n/locales';
import dateTimeFormats from './dateTimeFormats';

const documentTitles = ConfigService.get().title;

function overrideDocumentTitleTranslation (source, language) {
  return {
    ...source,
    LINSHARE_UPLOAD_REQUEST: documentTitles[language] || source.LINSHARE_UPLOAD_REQUEST
  };
}

Vue.use(VueI18n);

const messages = {
  en: overrideDocumentTitleTranslation(en, 'en'),
  fr: overrideDocumentTitleTranslation(fr, 'fr'),
  vi: overrideDocumentTitleTranslation(vi, 'vi'),
  ru: overrideDocumentTitleTranslation(ru, 'ru')
};

let cachedLanguage = LanguageService.get();

if (!cachedLanguage) {
  cachedLanguage = 'en';
  LanguageService.assign('en');
}

export const i18n = new VueI18n({
  locale: cachedLanguage,
  fallbackLocale: LANGUAGE.DEFAULT,
  dateTimeFormats,
  messages
});
