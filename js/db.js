// ============================================================
// LUMYRA – Database (localStorage simulation)
// ============================================================

const DB = {
  // ===== PRODUCTS =====
  products: [
    {
      id: 1,
      name: "LUMYRA Classic",
      description: "Bougie haute performance avec purification intégrée. Design en verre premium.",
      longDesc: "La LUMYRA Classic est notre flagship. Conçue avec les meilleurs matériaux, elle offre une expérience de purification de l'air exceptionnelle tout en illuminant votre intérieur.",
      price: 299,
      image: "../images/candle_dome.jpeg",
      badge: "Bestseller",
      burnTime: "40 heures",
      size: "Grande",
      stock: 15
    },
    {
      id: 2,
      name: "LUMYRA Mini",
      description: "Version compacte et accessible. Parfaite pour les petits espaces.",
      longDesc: "La LUMYRA Mini reprend toute la technologie de la version Classic dans un format compact. Idéale pour les chambres, bureaux et espaces intimistes.",
      price: 169,
      image: "../images/candle_glass.jpeg",
      badge: null,
      burnTime: "25 heures",
      size: "Petite",
      stock: 22
    },
    {
      id: 3,
      name: "Purification Duo Pack",
      description: "1 Classic + 1 Mini. Emballage élégant. Option cadeau parfaite.",
      longDesc: "Le Duo Pack est notre offre la plus complète. Deux bougies complémentaires dans un coffret premium. Idéal comme cadeau ou pour purifier plusieurs espaces.",
      price: 299,
      image: "../images/packaging.jpeg",
      badge: "Meilleure valeur",
      burnTime: "65 heures combinées",
      size: "Coffret",
      stock: 8
    },
    {
      id: 4,
      name: "Limited Gold Edition",
      description: "Design exclusif avec finition dorée. Disponibilité limitée.",
      longDesc: "La Gold Edition est une pièce d'exception. Habillage exclusif avec finitions or, disponible en quantité très limitée. Pour les amateurs d'excellence.",
      price: 289,
      image: "../images/candle_dark.jpeg",
      badge: "Édition Limitée",
      burnTime: "40 heures",
      size: "Grande",
      stock: 5
    }
  ],

  // ===== USERS =====
  initUsers() {
    if (!localStorage.getItem('lumyra_users')) {
      const defaultAdmin = [{
        id: 'admin_001',
        name: 'Admin LUMYRA',
        email: 'admin@lumyra.com',
        password: btoa('admin123'),
        role: 'admin',
        createdAt: new Date().toISOString(),
        orders: []
      }];
      localStorage.setItem('lumyra_users', JSON.stringify(defaultAdmin));
    }
    if (!localStorage.getItem('lumyra_orders')) {
      localStorage.setItem('lumyra_orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('lumyra_cart')) {
      localStorage.setItem('lumyra_cart', JSON.stringify([]));
    }
  },

  getUsers() {
    return JSON.parse(localStorage.getItem('lumyra_users') || '[]');
  },

  saveUsers(users) {
    localStorage.setItem('lumyra_users', JSON.stringify(users));
  },

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email === email.toLowerCase());
  },

  createUser(name, email, password) {
    const users = this.getUsers();
    if (this.getUserByEmail(email)) return { error: 'Email déjà utilisé.' };
    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email: email.toLowerCase(),
      password: btoa(password),
      role: 'user',
      createdAt: new Date().toISOString(),
      orders: []
    };
    users.push(newUser);
    this.saveUsers(users);
    return { success: true, user: newUser };
  },

  loginUser(email, password) {
    const user = this.getUserByEmail(email);
    if (!user) return { error: 'Email introuvable.' };
    if (atob(user.password) !== password) return { error: 'Mot de passe incorrect.' };
    return { success: true, user };
  },

  // ===== SESSION =====
  getCurrentUser() {
    const data = sessionStorage.getItem('lumyra_session');
    return data ? JSON.parse(data) : null;
  },

  setSession(user) {
    sessionStorage.setItem('lumyra_session', JSON.stringify(user));
  },

  clearSession() {
    sessionStorage.removeItem('lumyra_session');
  },

  // ===== CART =====
  getCart() {
    return JSON.parse(localStorage.getItem('lumyra_cart') || '[]');
  },

  saveCart(cart) {
    localStorage.setItem('lumyra_cart', JSON.stringify(cart));
    this.updateCartUI();
  },

  addToCart(productId, qty = 1) {
    const cart = this.getCart();
    const product = this.products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(i => i.productId === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId, qty, name: product.name, price: product.price, image: product.image });
    }
    this.saveCart(cart);
    this.showToast(`${product.name} ajouté au panier ✓`);
  },

  removeFromCart(productId) {
    const cart = this.getCart().filter(i => i.productId !== productId);
    this.saveCart(cart);
  },

  updateQty(productId, qty) {
    const cart = this.getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) {
      item.qty = Math.max(1, qty);
      this.saveCart(cart);
    }
  },

  getCartTotal() {
    return this.getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  clearCart() {
    this.saveCart([]);
  },

  updateCartUI() {
    const count = this.getCart().reduce((sum, i) => sum + i.qty, 0);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = count;
  },

  // ===== ORDERS =====
  getOrders() {
    return JSON.parse(localStorage.getItem('lumyra_orders') || '[]');
  },

  createOrder(userId, userName, items, total, address) {
    const orders = this.getOrders();
    const order = {
      id: 'ORD_' + Date.now(),
      userId,
      userName,
      items,
      total,
      address,
      status: 'En attente',
      createdAt: new Date().toISOString()
    };
    orders.unshift(order);
    localStorage.setItem('lumyra_orders', JSON.stringify(orders));

    // Update user orders
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.orders = user.orders || [];
      user.orders.push(order.id);
      this.saveUsers(users);
    }
    return order;
  },

  getUserOrders(userId) {
    return this.getOrders().filter(o => o.userId === userId);
  },

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem('lumyra_orders', JSON.stringify(orders));
    }
  },

  // ===== TOAST =====
  showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
};

// Initialize DB on load
DB.initUsers();
