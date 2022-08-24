import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/user/update'
        : 'http://127.0.0.1:3000/api/user/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);

      window.setTimeout(() => {
        location.assign('/profile');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
