/* ============================================
   LivyLamp — UI Utilities Module
   Toast, navigation, modal, scroll reveal.
   ============================================ */

/* ---- Page Navigation ---- */
const PAGES = ['home', 'booking', 'collections', 'admin'];

function showPage(page) {
  PAGES.forEach(p => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.classList.toggle('page--hidden', p !== page);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'collections') loadProducts();
  if (page === 'admin') loadAdminDashboard();
}

/* ---- Toast ---- */
function showToast(message, isError = false) {
  let toast = document.getElementById('livylamp-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'livylamp-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.toggle('toast--error', isError);
  toast.classList.add('toast--visible');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('toast--visible'), 3000);
}

/* ---- Mobile Menu ---- */
let mobileOpen = false;

function toggleMobileMenu() {
  mobileOpen = !mobileOpen;
  const nav = document.getElementById('mobile-nav');
  const icon = document.getElementById('mobile-menu-icon');
  if (nav) nav.classList.toggle('mobile-nav--open', mobileOpen);
  if (icon) icon.textContent = mobileOpen ? 'close' : 'menu';
}

function closeMobileMenu() {
  mobileOpen = false;
  const nav = document.getElementById('mobile-nav');
  const icon = document.getElementById('mobile-menu-icon');
  if (nav) nav.classList.remove('mobile-nav--open');
  if (icon) icon.textContent = 'menu';
}

/* ---- Auth Modal ---- */
function openAuthModal() {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) overlay.classList.remove('modal-overlay--hidden');
  switchAuthTab('login');
}

function closeAuthModal() {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) overlay.classList.add('modal-overlay--hidden');
  clearAuthErrors();
}

function switchAuthTab(tab) {
  document.getElementById('tab-login')?.classList.toggle('modal-tab--active', tab === 'login');
  document.getElementById('tab-signup')?.classList.toggle('modal-tab--active', tab === 'signup');
  document.getElementById('login-form')?.classList.toggle('form--hidden', tab !== 'login');
  document.getElementById('signup-form')?.classList.toggle('form--hidden', tab !== 'signup');
  clearAuthErrors();
}

function clearAuthErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

/* ---- Cart Modal ---- */
function openCartModal() {
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.classList.remove('modal-overlay--hidden');
  renderCart();
}

function closeCartModal() {
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.classList.add('modal-overlay--hidden');
}

/* ---- Scroll Reveal ---- */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ---- Escape key closes modals ---- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAuthModal();
    closeCartModal();
  }
});
