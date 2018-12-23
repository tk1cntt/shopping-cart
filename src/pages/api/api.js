import axios from 'axios';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = 'https://api.tinvang.com.vn';

export const login = async (username, password, callback) => {
  await axios
    .post('api/authenticate', { username, password, rememberMe: true })
    .then(response => {
      callback(response.data);
    })
    .catch(error => {
      callback(error.response.data);
      // if (!error && !error.response) callback(error.response.data);
    });
};

export const getSession = async (token, callback) => {
  axios.defaults.headers.Authorization = `Bearer ${token}`;
  await axios
    .get('/api/account')
    .then(response => {
      callback(response.data);
    })
    .catch(error => {
      callback(error.response.data);
      // if (!error && !error.response) callback(error.response.data);
    });
};
