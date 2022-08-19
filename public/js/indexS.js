import { login, logout } from './login.js';

// DOM Elements

const loginForm = document.querySelector('.login-form');
const logoutBtn = document.querySelector('.logout');

// Delegation

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
