export const PasswordStore = {
  get: id => {
    return window.localStorage.getItem(id);
  },
  assign: (id, password) => {
    window.localStorage.setItem(id, password);
  },
  del: id => {
    if (window.localStorage.getItem(id)) {
      window.localStorage.removeItem(id);
    }
  }
};
