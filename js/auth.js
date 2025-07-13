document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.querySelector('#signup-form') || document.querySelector('form[action="signup-form"]');
  const loginForm = document.querySelector('#login-form') || document.querySelector('form[action="login-form"]');
  const welcomeMessage = document.querySelector('#welcome-message');
  const logoutBtn = document.querySelector('#logout-btn');

  checkUserSession();

  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = document.querySelector('#username').value.trim();
      const email = document.querySelector('#email').value.trim();
      const password = document.querySelector('#password').value;
      const confirmPassword = document.querySelector('#confirm-password').value;

      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      let users = JSON.parse(localStorage.getItem('users')) || [];

      const emailExists = users.some(user => user.email === email);
      if (emailExists) {
        alert('Email is already registered!');
        return;
      }

      const newUser = { username, email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      alert('Account created successfully!');
      window.location.href = 'dashboard.html'; 
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.querySelector('#email').value.trim();
      const password = document.querySelector('#password').value;

      const users = JSON.parse(localStorage.getItem('users')) || [];

      const user = users.find(user => user.email === email && user.password === password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        window.location.href = 'dashboard.html'; 
      } else {
        alert('Invalid email or password');
      }
    });
  }

 
  function checkUserSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (welcomeMessage) {
      if (currentUser) {
        welcomeMessage.textContent = `Welcome, ${currentUser.username}!`;
      } else {
        window.location.href = 'login.html';
      }
    }
  }


  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      alert('You have been logged out successfully!');
      window.location.href = 'login.html';
    });
  }
});