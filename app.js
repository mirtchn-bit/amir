// Dastlabki localStorage
if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
if (!localStorage.getItem('admins')) localStorage.setItem('admins', JSON.stringify([]));
if (!localStorage.getItem('products')) {
  // Standart bir nechta mahsulotlar
  const defaultProducts = [
    { id: 1, name: "Smartfon Redmi Note 13 Pro", price: 3500000, discount: 2990000, img: "https://picsum.photos/300/200?random=1" },
    { id: 2, name: "Noutbuk Lenovo IdeaPad 3", price: 6200000, discount: 5800000, img: "https://picsum.photos/300/200?random=2" },
    { id: 3, name: "Simsiz quloqchin AirPro 2", price: 450000, discount: 290000, img: "https://picsum.photos/300/200?random=3" }
  ];
  localStorage.setItem('products', JSON.stringify(defaultProducts));
}

let currentUser = null;

// Modal
function openAuthModal() { document.getElementById('auth-modal').classList.remove('hidden'); }
function closeAuthModal() { document.getElementById('auth-modal').classList.add('hidden'); }

function switchAuthTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('form-register').classList.toggle('hidden', tab !== 'register');
}

function showSection(sectionId) {
  ['public-products', 'admin-panel', 'owner-panel'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(sectionId).classList.remove('hidden');

  if (sectionId === 'public-products') renderProducts();
  if (sectionId === 'owner-panel') { renderOwnerProducts(); renderAdmins(); }
}

// KIRISH TIZIMI
function handleLogin() {
  const role = document.getElementById('login-role').value;
  const login = document.getElementById('login-username').value.trim();
  const pass = document.getElementById('login-password').value.trim();

  if (role === 'owner') {
    if (login === 'amir' && pass === 'amorxon201101') {
      currentUser = { login: 'amir', role: 'owner' };
      showSection('owner-panel');
      updateUI();
      closeAuthModal();
    } else {
      alert("Ega panel paroli yoki logini xato!");
    }
  } else if (role === 'admin') {
    let admins = JSON.parse(localStorage.getItem('admins'));
    let found = admins.find(a => a.login === login && a.pass === pass);
    if (found) {
      currentUser = { login, role: 'admin' };
      showSection('admin-panel');
      updateUI();
      closeAuthModal();
    } else {
      alert("Admin logini yoki paroli xato!");
    }
  } else {
    let users = JSON.parse(localStorage.getItem('users'));
    let found = users.find(u => u.login === login && u.pass === pass);
    if (found) {
      currentUser = { login, role: 'user' };
      alert("Muvaffaqiyatli kirdingiz!");
      updateUI();
      closeAuthModal();
    } else {
      alert("Foydalanuvchi topilmadi!");
    }
  }
}

function handleRegister() {
  const login = document.getElementById('reg-username').value.trim();
  const pass = document.getElementById('reg-password').value.trim();

  if (!login || !pass) return alert("To'ldiring!");

  let users = JSON.parse(localStorage.getItem('users'));
  if (users.find(u => u.login === login)) return alert("Bu login band!");

  users.push({ login, pass });
  localStorage.setItem('users', JSON.stringify(users));
  alert("Ro'yxatdan o'tdingiz!");
  switchAuthTab('login');
}

function updateUI() {
  document.getElementById('logout-btn').classList.remove('hidden');
  document.getElementById('login-nav-btn').classList.add('hidden');
}

function logout() {
  currentUser = null;
  document.getElementById('logout-btn').classList.add('hidden');
  document.getElementById('login-nav-btn').classList.remove('hidden');
  showSection('public-products');
}

// EGA PANEL — MAHSULOT QO'SHISH VA NARX O'ZGARTIRISH
function addProduct() {
  const name = document.getElementById('prod-name').value.trim();
  const img = document.getElementById('prod-img').value.trim() || 'https://picsum.photos/300/200';
  const price = Number(document.getElementById('prod-price').value);
  const discount = Number(document.getElementById('prod-discount').value);

  if (!name || !price) return alert("Nomi va narxini kiriting!");

  let products = JSON.parse(localStorage.getItem('products'));
  products.push({ id: Date.now(), name, img, price, discount });
  localStorage.setItem('products', JSON.stringify(products));

  alert("Mahsulot qo'shildi!");
  renderOwnerProducts();
  renderProducts();
}

function deleteProduct(id) {
  let products = JSON.parse(localStorage.getItem('products'));
  products = products.filter(p => p.id !== id);
  localStorage.setItem('products', JSON.stringify(products));
  renderOwnerProducts();
}

function editPrice(id) {
  let products = JSON.parse(localStorage.getItem('products'));
  let prod = products.find(p => p.id === id);
  
  let newPrice = prompt("Yangi narxni kiriting:", prod.price);
  let newDiscount = prompt("Yangi chegirma narxini kiriting:", prod.discount);

  if (newPrice) {
    prod.price = Number(newPrice);
    prod.discount = Number(newDiscount) || Number(newPrice);
    localStorage.setItem('products', JSON.stringify(products));
    renderOwnerProducts();
  }
}

// EGA PANEL — ADMIN YARATISH
function createAdmin() {
  const login = document.getElementById('new-admin-login').value.trim();
  const pass = document.getElementById('new-admin-password').value.trim();

  if (!login || !pass) return alert("Login va parol yozing!");

  let admins = JSON.parse(localStorage.getItem('admins'));
  if (admins.find(a => a.login === login)) return alert("Bu admin allaqachon bor!");

  admins.push({ login, pass });
  localStorage.setItem('admins', JSON.stringify(admins));
  alert("Yangi admin yaratildi!");
  renderAdmins();
}

function renderAdmins() {
  const tbody = document.getElementById('admin-table-body');
  tbody.innerHTML = '';
  let admins = JSON.parse(localStorage.getItem('admins'));

  admins.forEach((a, index) => {
    tbody.innerHTML += `
      <tr>
        <td><b>${a.login}</b></td>
        <td><span class="badge-admin">Admin</span></td>
        <td><button class="btn btn-danger" onclick="deleteAdmin(${index})"><i class="fa-solid fa-trash"></i></button></td>
      </tr>
    `;
  });
}

function deleteAdmin(index) {
  let admins = JSON.parse(localStorage.getItem('admins'));
  admins.splice(index, 1);
  localStorage.setItem('admins', JSON.stringify(admins));
  renderAdmins();
}

// RENDER MAHSULOTLAR
function renderProducts() {
  const grid = document.getElementById('product-list');
  grid.innerHTML = '';
  let products = JSON.parse(localStorage.getItem('products'));
  document.getElementById('product-count').innerText = `${products.length} ta mahsulot`;

  products.forEach(p => {
    grid.innerHTML += `
      <div class="product-card">
        <div class="product-img-box">
          <img src="${p.img}" alt="${p.name}">
          ${p.discount < p.price ? '<span class="badge-discount">CHEGIRMA</span>' : ''}
        </div>
        <div class="product-body">
          <div class="product-title">${p.name}</div>
          <div class="price-box">
            ${p.discount < p.price ? `<div class="old-price">${p.price.toLocaleString()} so'm</div>` : ''}
            <div class="current-price">${(p.discount || p.price).toLocaleString()} so'm</div>
          </div>
          <button class="cart-btn-pro"><i class="fa-solid fa-cart-shopping"></i> Savatga</button>
        </div>
      </div>
    `;
  });
}

function renderOwnerProducts() {
  const tbody = document.getElementById('owner-product-table');
  tbody.innerHTML = '';
  let products = JSON.parse(localStorage.getItem('products'));

  products.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td><img src="${p.img}" width="40" height="40" style="object-fit:cover; border-radius:4px;"></td>
        <td><b>${p.name}</b></td>
        <td>${p.price.toLocaleString()} so'm</td>
        <td><b style="color:var(--primary)">${(p.discount || p.price).toLocaleString()} so'm</b></td>
        <td>
          <button class="btn btn-outline" style="padding:4px 8px;" onclick="editPrice(${p.id})"><i class="fa-solid fa-pen"></i> Narxni o'zgartirish</button>
          <button class="btn btn-danger" style="padding:4px 8px;" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
  });
}

// ADMIN PANEL TABS
function switchAdminTab(tab) {
  ['orders', 'delivery', 'support'].forEach(t => {
    document.getElementById(`admin-tab-${t}`).classList.add('hidden');
  });
  document.getElementById(`admin-tab-${tab}`).classList.remove('hidden');
}

// Boshlang'ich render
renderProducts();
