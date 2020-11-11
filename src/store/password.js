let passwords = {};

export const PasswordStore = {
  get: id => {
    return passwords[id];
  },
  assign: (id, password) => {
    passwords[id] = password;
  },
  del: id => {
    delete passwords[id];
  }
};
