// ============================================================
// LUMYRA – Auth Module
// ============================================================

const Auth = {
  init() {
    const user = DB.getCurrentUser();
    const authBtn = document.getElementById('auth-btn');
    if (!authBtn) return;

    if (user) {
      if (user.role === 'admin') {
        authBtn.textContent = 'Admin';
        authBtn.href = '../pages/admin.html';
        if (authBtn.pathname && authBtn.pathname.includes('admin')) {
          authBtn.href = 'admin.html';
        }
      } else {
        authBtn.textContent = user.name.split(' ')[0];
        authBtn.href = '#';
        authBtn.onclick = (e) => {
          e.preventDefault();
          if (confirm('Se déconnecter ?')) {
            DB.clearSession();
            window.location.reload();
          }
        };
      }
    }
    DB.updateCartUI();
  }
};
