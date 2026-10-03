// Boshlang'ich localStorage sozlari
if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
if (!localStorage.getItem('admins')) localStorage.setItem('admins', JSON.stringify([]));
if (!localStorage.getItem('videos')) localStorage.setItem('videos', JSON.stringify([]));

let currentUser = null;

// Modal boshqaruvi
function openAuthModal() {
  document.getElementById('auth-modal').classList.remove('hidden');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function switchAuthTab(tab) {
  const loginTab = document.getElementById('tab-login');
  const regTab = document.getElementById('tab-register');
  const loginForm = document.getElementById('form-login');
  const regForm = document.getElementById('form-register');

  if (tab === 'login') {
    loginTab.classList.add('active');
    regTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
  } else {
    regTab.classList.add('active');
    loginTab.classList.remove('active');
    regForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

// Sahifalarni almashtirish
function showSection(sectionId) {
  const sections = ['public-videos', 'user-panel', 'admin-panel', 'owner-panel'];
  sections.forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');

  if (sectionId === 'public-videos') renderVideos();
  if (sectionId === 'admin-panel') renderAdminTable();
  if (sectionId === 'owner-panel') renderAdmins();
}

// Ro'yxatdan o'tish (User)
function handleRegister() {
  const login = document.getElementById('reg-username').value.trim();
  const pass = document.getElementById('reg-password').value.trim();

  if (!login || !pass) return alert("Barcha maydonlarni to'ldiring!");

  let users = JSON.parse(localStorage.getItem('users'));
  if (users.find(u => u.login === login)) return alert("Bu login allaqachon mavjud!");

  users.push({ login, pass });
  localStorage.setItem('users', JSON.stringify(users));
  alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
  switchAuthTab('login');
}

// Kirish Tizimi
function handleLogin() {
  const role = document.getElementById('login-role').value;
  const login = document.getElementById('login-username').value.trim();
  const pass = document.getElementById('login-password').value.trim();

  if (role === 'owner') {
    if (login === 'amir' && pass === 'amorxon201101') {
      currentUser = { login: 'amir', role: 'owner' };
      showSection('owner-panel');
      updateNavUI();
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
      updateNavUI();
      closeAuthModal();
    } else {
      alert("Admin ma'lumotlari xato!");
    }
  } else {
    let users = JSON.parse(localStorage.getItem('users'));
    let found = users.find(u => u.login === login && u.pass === pass);
    if (found) {
      currentUser = { login, role: 'user' };
      showSection('user-panel');
      updateNavUI();
      closeAuthModal();
    } else {
      alert("Foydalanuvchi topilmadi!");
    }
  }
}

function updateNavUI() {
  document.getElementById('logout-btn').classList.remove('hidden');
}

function logout() {
  currentUser = null;
  document.getElementById('logout-btn').classList.add('hidden');
  showSection('public-videos');
}

// Video Yuklash
function uploadVideo() {
  const title = document.getElementById('video-title').value.trim();
  const fileInput = document.getElementById('video-file');
  const file = fileInput.files[0];

  if (!title || !file) return alert("Barcha ma'lumotlarni kiriting!");

  const reader = new FileReader();
  reader.onload = function (e) {
    let videos = JSON.parse(localStorage.getItem('videos'));
    videos.push({
      id: Date.now(),
      title,
      src: e.target.result,
      uploader: currentUser.login,
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem('videos', JSON.stringify(videos));
    alert("Video muvaffaqiyatli saqlandi!");
    showSection('public-videos');
  };
  reader.readAsDataURL(file);
}

// Videolarni chiqarish
function renderVideos() {
  const grid = document.getElementById('video-list');
  grid.innerHTML = '';
  let videos = JSON.parse(localStorage.getItem('videos'));

  document.getElementById('video-count').innerText = `${videos.length} ta video`;

  if (videos.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted)">Hozircha videolar yo\'q.</p>';
    return;
  }

  videos.forEach(v => {
    grid.innerHTML += `
      <div class="video-card">
        <video controls src="${v.src}"></video>
        <div class="video-info">
          <h3>${v.title}</h3>
          <span class="video-author"><i class="fa-solid fa-user"></i> ${v.uploader} • ${v.date}</span>
        </div>
      </div>
    `;
  });
}

// Admin Video Table
function renderAdminTable() {
  const tbody = document.getElementById('admin-video-table');
  tbody.innerHTML = '';
  let videos = JSON.parse(localStorage.getItem('videos'));

  videos.forEach(v => {
    tbody.innerHTML += `
      <tr>
        <td><b>${v.title}</b></td>
        <td>${v.uploader}</td>
        <td>${v.date}</td>
        <td><button class="btn btn-danger" onclick="deleteVideo(${v.id})"><i class="fa-solid fa-trash"></i> O'chirish</button></td>
      </tr>
    `;
  });
}

function deleteVideo(id) {
  let videos = JSON.parse(localStorage.getItem('videos'));
  videos = videos.filter(v => v.id !== id);
  localStorage.setItem('videos', JSON.stringify(videos));
  renderAdminTable();
}

// Ega Paneli — Admin Yaratish
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
        <td>${a.login}</td>
        <td><span class="count-badge">Admin</span></td>
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

// Dastlabki yuklash
renderVideos();
