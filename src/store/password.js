let passwords = {};

export const PasswordStore = {
  get: id => {
    const cachedPassword = window.sessionStorage.getItem(id);

    if (cachedPassword) {
      passwords[id] = cachedPassword;
      window.sessionStorage.removeItem(id);
    }

    return passwords[id];
  },
  assign: (id, password) => {
    passwords[id] = password;
  },
  del: id => {
    delete passwords[id];
  }
};
