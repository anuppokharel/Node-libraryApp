import axios from 'axios'; // Promise based HTTP client for browser and Node.js
import { showAlert } from './alert';

// Register

export const register = async (data) => {
  // for (var pair of data.entries()) {
  //   console.log(pair[0] + ', ' + pair[1]);
  // }

  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/user/signup',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Registration successful!');

      window.setTimeout(() => {
        location.assign('/login');
      }, 750);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
