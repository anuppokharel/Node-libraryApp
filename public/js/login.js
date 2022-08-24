import axios from 'axios'; // Promise based HTTP client for browser and node.js
import { showAlert } from './alert';

// Login

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/user/login',
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

// Logout

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/user/logout',
    });

    if (res.data.status === 'success') location.reload(true); // setting true will force a reload from server but from the browser cache
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
