/* eslint-env jest */

import * as locales from '@/i18n/locales';
import dateTimeFormats from '@/i18n/dateTimeFormats';
import { LANGUAGE } from '@/constants';

const SOURCE = 'en';
// Languages without grammatical plural may use a single form.
const NO_PLURAL = ['vi'];

function flatten(object, prefix = '') {
  return Object.keys(object).reduce((result, key) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (object[key] !== null && typeof object[key] === 'object') {
      return { ...result, ...flatten(object[key], path) };
    }

    return { ...result, [path]: object[key] };
  }, {});
}

function placeholders(message) {
  return (message.match(/\{\s*[\w.]+\s*\}/g) || []).map(item => item.replace(/\s/g, '')).sort();
}

function pluralForms(message) {
  return message.split('|').length;
}

const source = flatten(locales[SOURCE]);
const targets = Object.keys(locales).filter(language => language !== SOURCE);

describe('i18n locales', () => {
  it('registers a bundle and a date format for every selectable language', () => {
    LANGUAGE.SUPPORTED_LANGUAGE.forEach(({ language }) => {
      expect(locales[language]).toBeDefined();
      expect(dateTimeFormats[language]).toBeDefined();
    });
  });

  describe.each(targets)('%s', language => {
    const target = flatten(locales[language]);

    it('has the same keys as the source', () => {
      expect(Object.keys(target).sort()).toEqual(Object.keys(source).sort());
    });

    it('has no empty value', () => {
      Object.keys(target).forEach(key => {
        expect({ key, empty: !String(target[key]).trim() }).toEqual({ key, empty: false });
      });
    });

    it('keeps the source placeholders and plural forms', () => {
      Object.keys(source).filter(key => key in target).forEach(key => {
        expect({ key, placeholders: placeholders(target[key]) })
          .toEqual({ key, placeholders: placeholders(source[key]) });
        const forms = pluralForms(target[key]);
        const singleFormAllowed = NO_PLURAL.includes(language) && forms === 1;

        expect({ key, forms: singleFormAllowed ? pluralForms(source[key]) : forms })
          .toEqual({ key, forms: pluralForms(source[key]) });
      });
    });
  });
});
