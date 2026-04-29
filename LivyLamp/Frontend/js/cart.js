/* ============================================
   LivyLamp — Cart Module
   Cart state, rendering, and checkout.
   ============================================ */

let cart = [];

/* ---- Cart Actions ---- */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id == productId);
  if (!product) return;
  const existing = cart.find(i => i.id == productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartBadge();
  openCartModal();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id != productId);
  updateCartBadge();
  renderCart();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id == productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  updateCartBadge();
  renderCart();
}

function clearCart() {
  cart = [];
  updateCartBadge();
  renderCart();
}

/* ---- Cart Badge ---- */
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  badge.classList.toggle('cart-badge--hidden', totalItems === 0);
  badge.textContent = totalItems;
}

/* ---- Cart Render ---- */
function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  const footerEl = document.getElementById('cart-footer');
  if (!itemsEl || !emptyEl || !footerEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    emptyEl.classList.remove('cart-empty--hidden');
    footerEl.classList.add('cart-footer--hidden');
    return;
  }

  emptyEl.classList.add('cart-empty--hidden');
  footerEl.classList.remove('cart-footer--hidden');

  itemsEl.innerHTML = cart.map(i => `
    <div class="cart-item">
      <img src="${i.image || 'https://via.placeholder.com/80x80?text=Lamp'}" alt="${i.name}" />
      <div class="cart-item-info">
        <h5>${i.name}</h5>
        <span class="cart-item-price">$${i.price.toFixed(2)}</span>
      </div>
      <div class="cart-item-qty">
        <button onclick="changeQty(${i.id}, -1)" aria-label="Decrease quantity">−</button>
        <span>${i.qty}</span>
        <button onclick="changeQty(${i.id}, 1)" aria-label="Increase quantity">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i.id})" aria-label="Remove ${i.name}">
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalEl = document.getElementById('cart-total-price');
  if (totalEl) {
    totalEl.textContent = '$' + total.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

/* ---- Checkout ---- */
async function handleCheckout() {
  if (!isLoggedIn()) {
    closeCartModal();
    openAuthModal();
    showToast('Please log in to place an order.', true);
    return;
  }

  if (cart.length === 0) return;

  const items = cart.map(i => ({
    product_id: i.id,
    quantity: i.qty,
    price: i.price,
  }));

  const btn = document.getElementById('checkout-btn');
  if (btn) { btn.textContent = 'Placing order...'; btn.disabled = true; }

  try {
    const data = await apiPlaceOrder(items);
    clearCart();
    closeCartModal();
    showToast(`Order #${data.order_id} placed successfully! 🎉`);
  } catch (err) {
    showToast(err.message || 'Checkout failed.', true);
  } finally {
    if (btn) { btn.textContent = 'Checkout'; btn.disabled = false; }
  }
}
