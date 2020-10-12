export const LanguageStore = {
  get: () => {
    return window.localStorage.getItem('lang');
  },
  assign: (lang) => {
    window.localStorage.setItem('lang', lang);
  }
};
