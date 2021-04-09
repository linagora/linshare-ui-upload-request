<template>
  <v-menu
    bottom
    :close-on-click="true"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        id="language-selector-button"
        offset-y
        v-bind="attrs"
        v-on="on"
      >
        <span :class="'space-between-span flag-icon flag-icon-' + key" />
        <span class="space-between-span">{{ key.toUpperCase() }}</span>
        <v-icon>keyboard_arrow_down</v-icon>
      </v-btn>
    </template>

    <v-list class="language-selector-list">
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        class="language-selector-item"
        @click="changeLocale(item.language)"
      >
        <v-list-item-title>
          <span :class="'space-between-span flag-icon flag-icon-' + item.key" />
          <span class="space-between-span">{{ item.key.toUpperCase() }}</span>
          <span class="space-between-span">{{ item.name }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { LANGUAGE } from '@/constants';
import { i18n } from '@/i18n';
import { LanguageService } from '@/services';

export default {
  name: 'LanguageSelector',
  data() {
    return {
      key: 'us',
      items: LANGUAGE.SUPPORTED_LANGUAGE
    };
  },
  created() {
    if (i18n && i18n.locale) {
      const selectedLanguage = LANGUAGE.SUPPORTED_LANGUAGE.find(item => item.language === i18n.locale);

      this.key = selectedLanguage ? selectedLanguage.key.toLowerCase() : 'us';
    }
  },
  methods: {
    changeLocale(language) {
      const selectedLanguage = LANGUAGE.SUPPORTED_LANGUAGE.find(item => item.language === language);

      i18n.locale = language;

      LanguageService.assign(language);

      document.title = this.$t('LINSHARE_UPLOAD_REQUEST');

      this.key = selectedLanguage ? selectedLanguage.key.toLowerCase() : 'us';
    }
  }
};
</script>

<style src="flag-icon-css/css/flag-icon.css"></style>
<style lang="scss" scoped>
  #language-selector-button {
    padding: 0px 7px;
    background-color: rgba(0,0,0,0.5);
    box-shadow: 0 2px 5px rgba(0,0,0,.16), 0 2px 10px rgba(0,0,0,.12);
    transition: 250ms all ease-in-out;
    color: #fff;
    &:hover {
      box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15);
    }
    .v-icon {
      font-size: 14px;
      padding: 0px 3px;
    }
  }
  .language-selector-list {
    padding: 0px;
  }

  .language-selector-item {
    border-bottom: 1px solid #eee;
    &:hover {
      background-color: #ddd;
    }
    cursor: pointer;
  }
  .space-between-span {
    padding: 0px 5px;
  }
</style>