/* ============================================
   LivyLamp — Auth Module
   Login, signup, token management, auth UI.
   ============================================ */

/* ---- Token Helpers ---- */
function getToken() {
  return localStorage.getItem('livylamp_token');
}

function setToken(token) {
  localStorage.setItem('livylamp_token', token);
}

function clearToken() {
  localStorage.removeItem('livylamp_token');
}

function isLoggedIn() {
  return !!getToken();
}

function isAdmin() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return !!payload.is_admin;
  } catch {
    return false;
  }
}

/* ---- Auth UI ---- */
function updateAuthUI() {
  const accountBtn = document.querySelector('[aria-label="Account"]');
  const adminLink = document.getElementById('admin-nav-link');

  if (isLoggedIn()) {
    if (accountBtn) {
      accountBtn.innerHTML = '<span class="material-symbols-outlined filled-icon">account_circle</span>';
      accountBtn.title = 'Logged in — click to log out';
      accountBtn.onclick = handleLogout;
    }
    if (adminLink) adminLink.classList.toggle('nav-link--hidden', !isAdmin());
  } else {
    if (accountBtn) {
      accountBtn.innerHTML = '<span class="material-symbols-outlined">person</span>';
      accountBtn.title = 'Account';
      accountBtn.onclick = openAuthModal;
    }
    if (adminLink) adminLink.classList.add('nav-link--hidden');
  }
}

function handleLogout() {
  clearToken();
  updateAuthUI();
  showToast('You have been logged out.');
}

/* ---- Validation ---- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---- Login ---- */
async function handleLogin(e) {
  e.preventDefault();
  clearAuthErrors();

  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value;

  let valid = true;
  if (!email || !isValidEmail(email)) { showError('err-login-email', 'Valid email required'); valid = false; }
  if (!pass || pass.length < 6) { showError('err-login-pass', 'Min 6 characters'); valid = false; }
  if (!valid) return;

  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Logging in...';
  btn.disabled = true;

  try {
    const data = await apiLogin(email, pass);
    setToken(data.token);
    updateAuthUI();
    closeAuthModal();
    showToast('Welcome back!');
  } catch (err) {
    showError('err-login-pass', err.message || 'Login failed');
  } finally {
    btn.textContent = 'Login';
    btn.disabled = false;
  }
}

/* ---- Signup ---- */
async function handleSignup(e) {
  e.preventDefault();
  clearAuthErrors();

  const email = document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-pass').value;
  const pass2 = document.getElementById('signup-pass2').value;

  let valid = true;
  if (!email || !isValidEmail(email)) { showError('err-signup-email', 'Valid email required'); valid = false; }
  if (!pass || pass.length < 6) { showError('err-signup-pass', 'Min 6 characters'); valid = false; }
  if (pass !== pass2) { showError('err-signup-pass2', 'Passwords must match'); valid = false; }
  if (!valid) return;

  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Creating account...';
  btn.disabled = true;

  try {
    await apiRegister(email, pass);
    showToast('Account created! Please log in.');
    switchAuthTab('login');
    document.getElementById('login-email').value = email;
  } catch (err) {
    showError('err-signup-email', err.message || 'Registration failed');
  } finally {
    btn.textContent = 'Create Account';
    btn.disabled = false;
  }
}
