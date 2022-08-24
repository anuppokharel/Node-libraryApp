import { login, logout } from './login.js';
import { register } from './register';
import { updateSettings } from './updateSetting';

// DOM Elements

const registerForm = document.querySelector('.register-form');
const loginForm = document.querySelector('.login-form');
const logoutBtn = document.querySelector('.logout');

const updateForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const changePasswordBtn = document.getElementById('btn--change-password');

// Delegation

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('image', document.getElementById('image').files[0]);
    form.append('bio', document.getElementById('bio').value);
    form.append('password', document.getElementById('password').value);
    form.append(
      'confirmPassword',
      document.getElementById('confirmPassword').value
    );

    await register(form);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (updateForm) {
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData(); // multipart/form-data
    form.append('name', document.getElementById('name').value);
    form.append('bio', document.getElementById('bio').value);
    form.append('image', document.getElementById('image').files[0]);

    updateSettings(form, 'data');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    changePasswordBtn.textContent = 'Updating..';
    changePasswordBtn.style.cursor = 'not-allowed';
    changePasswordBtn.style.opacity = '0.2';

    const currentPassword = document.getElementById('current_password').value;
    const password = document.getElementById('new_password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    await updateSettings(
      { currentPassword, password, confirmPassword },
      'password'
    ); // Awaiting so we wait to clear the password afterwards

    changePasswordBtn.textContent = 'Update Password';
    changePasswordBtn.style.cursor = 'pointer';
    changePasswordBtn.style.opacity = '1';

    document.getElementById('current_password').value = '';
    document.getElementById('new_password').value = '';
    document.getElementById('confirm_password').value = '';
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
