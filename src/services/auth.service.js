import Vue from 'vue';

let passwordAuthorized = false;

export const AuthService = {
  checkPassword: async (id, password) => {
    try {
      if (passwordAuthorized) {
        return true;
      }

      await Vue.axios.get(`requests/${id}`, {
        headers: {
          'linshare-uploadrequest-password': password
        }
      });
      passwordAuthorized = true;
      
      return true;
    } catch (error) {
      if (error && error.response && error.response.status === 401 && error.response.data && error.response.data.errCode === 32401) {
        passwordAuthorized = false;
        
        return false;
      }
      
      return true;
    }
  }
};
