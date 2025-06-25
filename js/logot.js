import { logout } from './login.js';

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout_btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});