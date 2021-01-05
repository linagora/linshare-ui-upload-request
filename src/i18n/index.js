import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { LanguageService } from '@/services/language.service';
import { LANGUAGE } from '@/constants';
import { en, fr, ru, vn } from '@/i18n/locales';

Vue.use(VueI18n);

const messages = { en, fr, vn, ru };

let cachedLanguage = LanguageService.get();

if (!cachedLanguage) {
  cachedLanguage = 'en';
  LanguageService.assign('en');
}

export const i18n = new VueI18n({
  locale: cachedLanguage,
  fallbackLocale: LANGUAGE.DEFAULT,
  messages
});
