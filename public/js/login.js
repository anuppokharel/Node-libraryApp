import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      // Promise based HTTP client for the browser and node.js
      // res = result
      method: 'POST',
      url: 'http://127.0.0.1:3000/user/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');

      window.setTimeout(() => {
        location.assign('/');
      }, 750); // 1 and half second
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/user/logout',
    });

    if (res.data.status === 'success') location.reload(true); // setting true will force a reload from server but from the browser cache
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
