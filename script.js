(() => {
  'use strict';

  const PRODUCTS = [
    { id: 'lassi', name: 'Protein Lassi', category: 'lassi', description: 'A creamy, protein-rich sip for busy days.', price: 45, symbol: '🥛', bg: '#f5df9c', variants: ['Sweet', 'Masala', 'Mango'] },
    { id: 'dahi', name: 'Farm Fresh Dahi', category: 'dahi', description: 'Cool, comforting and made for every meal.', price: 65, symbol: '◉', bg: '#dce8ca' },
    { id: 'paneer', name: 'Soft Paneer', category: 'paneer', description: 'A tender favourite for curries and grills.', price: 110, symbol: '▦', bg: '#f2d8be' },
    { id: 'ghee', name: 'Desi Ghee', category: 'ghee', description: 'A golden spoonful of traditional comfort.', price: 280, symbol: '◒', bg: '#f4d276' },
    { id: 'milk', name: 'Flavoured Milk', category: 'milk', description: 'A chilled, cheerful treat with a hint of cocoa.', price: 40, symbol: '♧', bg: '#ead4db' },
    { id: 'mango-dahi', name: 'Mango Dahi', category: 'dahi', description: 'A gently fruity twist on a cool everyday favourite.', price: 85, symbol: '✿', bg: '#f5e8be' }
  ];
  const CATEGORY_LABELS = { lassi: 'Protein Lassi', dahi: 'Dahi', paneer: 'Paneer', ghee: 'Desi Ghee', milk: 'Flavoured Milk' };
  const KEYS = { cart: 'sunehriCart', coupon: 'sunehriCoupon', theme: 'sunehriTheme', orders: 'sunehriOrders', messages: 'sunehriMessages' };
  const read = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;
  const getCart = () => read(KEYS.cart, []);
  const cartCount = () => getCart().reduce((sum, item) => sum + item.qty, 0);
  const subtotal = (cart) => cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = (sum) => sum === 0 || sum >= 500 ? 0 : 40;
  const currentCoupon = () => read(KEYS.coupon, null);
  const discountFor = (sum) => currentCoupon()?.code === 'PUNJAB10' ? Math.round(sum * 0.1) : 0;
  const productFor = (id) => PRODUCTS.find((product) => product.id === id);
  const itemName = (item) => `${item.name}${item.variant ? ` · ${item.variant}` : ''}`;

  function header() {
    const active = location.pathname.split('/').pop() || 'index.html';
    const links = [['index.html', 'Home'], ['products.html', 'Products'], ['about.html', 'Our story'], ['faq.html', 'FAQs'], ['contact.html', 'Contact']];
    const svg = '<svg class="brand-mark" viewBox="0 0 42 48" aria-hidden="true"><path d="M21 43V7M21 16C14 16 11 12 10 7c7 0 11 3 11 9Zm0 8c7 0 11-4 12-9-7 0-12 3-12 9Zm0 3c-7 0-11-4-12-9 7 0 12 3 12 9Zm0 8c7 0 11-4 12-9-7 0-12 3-12 9Z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 44h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
    const host = document.getElementById('site-header');
    if (!host) return;
    host.innerHTML = `<header class="site-header"><div class="nav-shell"><a class="brand" href="index.html" aria-label="Sunehri Dairy home">${svg}<span class="brand-name">Sunehri Dairy<small>PURE PIND. PURE SUNEHRI.</small></span></a><button type="button" class="icon-button mobile-menu" id="mobile-menu" aria-label="Open navigation" aria-expanded="false">☰</button><nav class="main-nav" id="main-nav" aria-label="Main navigation">${links.map(([href, label]) => `<a href="${href}"${href === active ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav><div class="nav-tools"><button type="button" class="icon-button" id="theme-toggle" aria-label="Switch to dark mode" title="Switch theme">☾</button><a class="cart-link" href="cart.html" aria-label="Shopping basket, ${cartCount()} items"><span class="cart-icon" aria-hidden="true">♧</span> Basket <span class="cart-badge" id="cart-count">${cartCount()}</span></a></div></div></header>`;
    const toggle = document.getElementById('theme-toggle');
    const theme = read(KEYS.theme, 'light');
    applyTheme(theme);
    toggle.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
    const menu = document.getElementById('mobile-menu');
    menu.addEventListener('click', () => {
      const nav = document.getElementById('main-nav');
      const expanded = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!expanded));
      menu.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !expanded);
    });
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    write(KEYS.theme, theme);
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.textContent = theme === 'dark' ? '☀' : '☾';
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  function footer() {
    const host = document.getElementById('site-footer');
    if (!host) return;
    host.innerHTML = `<footer class="site-footer"><div class="footer-inner"><div class="footer-brand">Sunehri Dairy<p>Pure Pind. Pure Sunehri.</p></div><nav class="footer-links" aria-label="Footer navigation"><a href="products.html">Products</a><a href="about.html">Our story</a><a href="faq.html">FAQs</a><a href="contact.html">Contact</a><a href="cart.html">Your basket</a></nav><p class="footer-disclaimer">Sunehri Dairy is an imaginary company created for the Digital Marketing practical file of Radha Kumari, B.Com 1st Year (C), Roll No. 5871. Not a real business. No real orders or payments are taken.</p></div><div class="footer-bottom"><span>© Sunehri Dairy · Student project</span><span>IMAGINARY BY DESIGN</span></div></footer>`;
  }

  function updateBadge() {
    const badge = document.getElementById('cart-count');
    const link = document.querySelector('.cart-link');
    if (badge) badge.textContent = cartCount();
    if (link) link.setAttribute('aria-label', `Shopping basket, ${cartCount()} items`);
  }

  function productCard(product, index) {
    const variantSelect = product.variants ? `<label class="visually-hidden" for="variant-${product.id}">Choose Protein Lassi flavour</label><select class="variant-select" id="variant-${product.id}">${product.variants.map((variant) => `<option>${variant}</option>`).join('')}</select>` : '';
    return `<article class="product-card" style="--product-bg:${product.bg};animation-delay:${index * 45}ms"><div class="product-visual"><span class="product-number">0${index + 1} / 06</span><span class="product-symbol" aria-hidden="true">${product.symbol}</span></div><div class="product-info"><div class="product-meta"><span>${CATEGORY_LABELS[product.category] || product.category}</span><span>Imaginary fresh</span></div><h2>${product.name}</h2><p>${product.description}</p>${variantSelect}<div class="product-actions"><span class="product-price">${money(product.price)}<small>per pack</small></span><button class="add-button" type="button" data-add="${product.id}">Add to basket +</button></div></div></article>`;
  }

  function renderCatalog() {
    const host = document.getElementById('product-list');
    if (!host) return;
    const search = document.getElementById('product-search');
    const category = document.getElementById('category-filter');
    const sort = document.getElementById('price-sort');
    const draw = () => {
      const query = search.value.trim().toLowerCase();
      let products = PRODUCTS.filter((product) => (category.value === 'all' || product.category === category.value) && `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query));
      if (sort.value === 'low') products.sort((a, b) => a.price - b.price);
      if (sort.value === 'high') products.sort((a, b) => b.price - a.price);
      host.innerHTML = products.map(productCard).join('');
      document.getElementById('result-count').textContent = `${products.length} ${products.length === 1 ? 'product' : 'products'}`;
      document.getElementById('no-products').hidden = products.length > 0;
    };
    [search, category, sort].forEach((control) => control.addEventListener('input', draw));
    host.addEventListener('click', (event) => {
      const button = event.target.closest('[data-add]');
      if (!button) return;
      const product = productFor(button.dataset.add);
      const variant = product.variants ? document.getElementById(`variant-${product.id}`).value : '';
      addItem(product, variant);
      button.textContent = 'Added ✓';
      window.setTimeout(() => { if (button.isConnected) button.textContent = 'Add to basket +'; }, 1100);
      showToast(`${itemName({ ...product, variant })} added to your basket`);
    });
    draw();
  }

  function addItem(product, variant = '') {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id && item.variant === variant);
    if (existing) existing.qty += 1;
    else cart.push({ id: product.id, name: product.name, variant, price: product.price, qty: 1, symbol: product.symbol, bg: product.bg });
    write(KEYS.cart, cart);
    updateBadge();
  }

  function showToast(message) {
    document.querySelector('.toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 2200);
  }

  function renderFeatured() {
    const host = document.getElementById('featured-products');
    if (!host) return;
    host.innerHTML = PRODUCTS.slice(0, 3).map((product) => `<article class="mini-product"><div class="mini-art" style="background:${product.bg}" aria-hidden="true">${product.symbol}</div><div><h3>${product.name}</h3><p>${product.description}</p><strong>${money(product.price)}</strong></div></article>`).join('');
  }

  function cartRow(item) {
    return `<article class="cart-row" data-cart-id="${escapeHtml(item.id)}" data-variant="${escapeHtml(item.variant || '')}"><div class="cart-art" style="--product-bg:${escapeHtml(item.bg || '#f8e6b1')}" aria-hidden="true">${escapeHtml(item.symbol || '🥛')}</div><div><h2 class="cart-item-name">${escapeHtml(item.name)}</h2><p class="cart-item-variant">${escapeHtml(item.variant || 'Everyday favourite')}</p><p class="cart-item-price">${money(item.price)} each</p><div class="cart-item-controls"><div class="qty-control"><button type="button" data-qty="-1" aria-label="Decrease ${escapeHtml(item.name)} quantity">−</button><span>${item.qty}</span><button type="button" data-qty="1" aria-label="Increase ${escapeHtml(item.name)} quantity">+</button></div><button type="button" class="remove-button" data-remove>Remove</button></div></div><strong class="cart-row-total">${money(item.price * item.qty)}</strong></article>`;
  }

  function renderCart() {
    const host = document.getElementById('cart-items');
    if (!host) return;
    const cart = getCart();
    const sum = subtotal(cart);
    const fee = deliveryFee(sum);
    const discount = discountFor(sum);
    if (cart.length) host.innerHTML = cart.map(cartRow).join('');
    else host.innerHTML = '<div class="empty-cart"><h2>Your basket is taking a breather.</h2><p>Add a few everyday favourites and they will show up here.</p><a class="button button-dark" href="products.html">Browse products <span aria-hidden="true">&#8594;</span></a></div>';
    document.getElementById('cart-subtotal').textContent = money(sum);
    document.getElementById('cart-delivery').textContent = fee ? money(fee) : 'Free';
    document.getElementById('cart-total').textContent = money(sum + fee - discount);
    document.getElementById('discount-row').hidden = !discount;
    document.getElementById('cart-discount').textContent = `−${money(discount)}`;
    document.getElementById('delivery-note').textContent = sum >= 500 ? 'Lovely! Your delivery is on us.' : `Add ${money(Math.max(0, 500 - sum))} more for free delivery.`;
    const checkoutLink = document.getElementById('checkout-link');
    checkoutLink.setAttribute('aria-disabled', String(!cart.length));
    checkoutLink.classList.toggle('is-disabled', !cart.length);
    checkoutLink.onclick = (event) => {
      if (!getCart().length) {
        event.preventDefault();
        showToast('Add a product before continuing to checkout.');
      }
    };
    const coupon = currentCoupon();
    const couponMessage = document.getElementById('coupon-message');
    if (coupon?.code === 'PUNJAB10') { document.getElementById('coupon-code').value = coupon.code; couponMessage.textContent = 'PUNJAB10 applied: 10% off your subtotal.'; couponMessage.className = 'form-message success'; }
    host.onclick = (event) => {
      const row = event.target.closest('[data-cart-id]');
      if (!row) return;
      const updated = getCart();
      const item = updated.find((entry) => entry.id === row.dataset.cartId && (entry.variant || '') === row.dataset.variant);
      if (!item) return;
      if (event.target.closest('[data-remove]')) {
        write(KEYS.cart, updated.filter((entry) => entry !== item));
      } else {
        const change = Number(event.target.closest('[data-qty]')?.dataset.qty || 0);
        item.qty += change;
        if (item.qty <= 0) write(KEYS.cart, updated.filter((entry) => entry !== item));
        else write(KEYS.cart, updated);
      }
      renderCart(); updateBadge();
    };
    document.getElementById('apply-coupon').onclick = () => {
      const input = document.getElementById('coupon-code');
      const message = document.getElementById('coupon-message');
      if (input.value.trim().toUpperCase() === 'PUNJAB10') {
        write(KEYS.coupon, { code: 'PUNJAB10' });
        message.textContent = 'PUNJAB10 applied: 10% off your subtotal.';
        message.className = 'form-message success';
      } else {
        write(KEYS.coupon, null);
        message.textContent = 'That code did not work. Check it and try again.';
        message.className = 'form-message';
      }
      renderCart();
      if (input.value.trim().toUpperCase() !== 'PUNJAB10') message.textContent = 'That code did not work. Check it and try again.';
    };
  }

  function renderCheckoutSummary() {
    const host = document.getElementById('checkout-items');
    if (!host) return;
    const cart = getCart();
    const sum = subtotal(cart);
    const fee = deliveryFee(sum);
    const discount = discountFor(sum);
    host.innerHTML = cart.length ? cart.map((item) => `<div class="checkout-item"><span>${escapeHtml(itemName(item))} × ${item.qty}</span><span>${money(item.price * item.qty)}</span></div>`).join('') : '<p class="form-message">Your basket is empty. Add a product before checkout.</p>';
    document.getElementById('checkout-subtotal').textContent = money(sum);
    document.getElementById('checkout-delivery').textContent = fee ? money(fee) : 'Free';
    document.getElementById('checkout-total').textContent = money(sum + fee - discount);
    document.getElementById('checkout-discount-row').hidden = !discount;
    document.getElementById('checkout-discount').textContent = `−${money(discount)}`;
  }

  function setFieldError(form, name, message) {
    const error = form.querySelector(`[data-error="${name}"]`);
    const field = form.elements[name];
    if (error) error.textContent = message;
    if (field) field.setAttribute('aria-invalid', String(Boolean(message)));
  }

  function initCheckout() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    const params = new URLSearchParams(location.search);
    const orderId = params.get('order');
    if (orderId) {
      document.getElementById('checkout-content').hidden = true;
      document.getElementById('confirmation').hidden = false;
      document.getElementById('order-number').textContent = orderId;
      return;
    }
    renderCheckoutSummary();
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form).entries());
      const errors = {
        name: values.name.trim().length >= 2 ? '' : 'Please enter your full name (at least 2 characters).',
        phone: /^\d{10}$/.test(values.phone.trim()) ? '' : 'Enter a valid 10-digit phone number.',
        address: values.address.trim().length >= 8 ? '' : 'Please enter a complete address (at least 8 characters).',
        pincode: /^\d{6}$/.test(values.pincode.trim()) ? '' : 'Enter a valid 6-digit pincode.'
      };
      Object.entries(errors).forEach(([name, error]) => setFieldError(form, name, error));
      const invalid = Object.keys(errors).find((name) => errors[name]);
      if (invalid) { form.elements[invalid].focus(); return; }
      if (!getCart().length) { showToast('Your basket is empty. Add a product before checkout.'); return; }
      const cart = getCart();
      const sum = subtotal(cart);
      const order = { number: `SUN-${Date.now().toString().slice(-7)}`, name: values.name.trim(), phone: values.phone.trim(), address: values.address.trim(), pincode: values.pincode.trim(), total: sum + deliveryFee(sum) - discountFor(sum), items: cart, createdAt: new Date().toISOString() };
      const orders = read(KEYS.orders, []);
      orders.push(order);
      write(KEYS.orders, orders);
      write(KEYS.cart, []);
      write(KEYS.coupon, null);
      location.href = `checkout.html?order=${encodeURIComponent(order.number)}`;
    });
  }

  function initContact() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form).entries());
      const errors = {
        name: values.name.trim().length >= 2 ? '' : 'Please enter your name (at least 2 characters).',
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ? '' : 'Enter a valid email address.',
        message: values.message.trim().length >= 10 ? '' : 'Please write a message of at least 10 characters.'
      };
      Object.entries(errors).forEach(([name, error]) => setFieldError(form, name, error));
      const invalid = Object.keys(errors).find((name) => errors[name]);
      if (invalid) { form.elements[invalid].focus(); return; }
      const messages = read(KEYS.messages, []);
      messages.push({ name: values.name.trim(), email: values.email.trim(), message: values.message.trim(), createdAt: new Date().toISOString() });
      write(KEYS.messages, messages);
      form.reset();
      const success = document.getElementById('contact-success');
      success.hidden = false;
      success.textContent = 'Thanks for your note! This demo has saved it in this browser.';
      success.className = 'form-message success';
    });
  }

  function init() {
    header(); footer(); updateBadge(); renderFeatured(); renderCatalog(); renderCart(); initCheckout(); initContact();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();