import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { en, fr, ru, vi, es, de, it } from 'vuetify/lib/locale';
import { LanguageService } from '@/services/language.service';
import { LANGUAGE } from '@/constants';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  lang: {
    locales: { en, fr, ru, vi, es, de, it },
    current: LanguageService.get() || LANGUAGE.DEFAULT
  }
});
