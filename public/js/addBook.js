import axios from 'axios'; // Promise based HTTP client for browser and node.js
import { showAlert } from 'alert.js';

export const addBook = async (data) => {
  console.log('hi');
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/book',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Book added successfully!');

      window.setTimeout(() => {
        location.assign('/add-book');
      }, 750);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
