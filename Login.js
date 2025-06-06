document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    const users = new Map([
      ['user@gmail.com', 'user1'],
      ['admin@gmail.com', 'admin1']
    ]);

    const showError = (message) => {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    };

    const clearError = () => {
      errorMessage.textContent = '';
      errorMessage.style.display = 'none';
    };

    const redirectUser = (username) => {
      const isAdmin = username === 'admin@gmail.com';
      const path = isAdmin ? 'Admin/admin.html' : 'Frontend/Inicio.html';
      window.location.href = path;
    };

    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      clearError();

      if (!username || !password) {
        showError('Por favor, complete todos los campos.');
        return;
      }

      const storedPassword = users.get(username);

      if (storedPassword && storedPassword === password) {
        redirectUser(username);
      } else {
        showError('Usuario o contraseña incorrectos');
      }
    });
  });

  