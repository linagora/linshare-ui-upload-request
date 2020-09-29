export const StorageService = {
  getPassword: id => {
    return window.localStorage.getItem(id);
  },
  savePassword: (id, password) => {
    window.localStorage.setItem(id, password);
  },
  removePassword: (id) => {
    if (window.localStorage.getItem(id)) {
      window.localStorage.removeItem(id);
    }
  }
};
