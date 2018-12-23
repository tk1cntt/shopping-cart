import axios from 'axios';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = 'https://api.tinvang.com.vn';

export const login = async (username, password, rememberMe, callback) => {
  await axios
    .post('api/authenticate', { username, password, rememberMe })
    .then(response => {
      // console.log(response);
      callback(response.data);
    })
    .catch(error => {
      if (!error && !error.response) callback(error.response.data);
    });
};
