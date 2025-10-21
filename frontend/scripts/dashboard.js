function toggleDarkMode() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-mode");
  localStorage.setItem("modoOscuro", isDark);
  actualizarTextoBotonDark();
}

function actualizarTextoBotonDark() {
  const btn = document.getElementById("dark-mode-toggle");
  if (!btn) return;
  btn.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Modo claro"
    : "🌙 Modo oscuro";
}

function inicializarModoOscuro() {
  const btn = document.getElementById("dark-mode-toggle");
  const modoOscuroGuardado = localStorage.getItem("modoOscuro") === "true";
  if (modoOscuroGuardado) document.body.classList.add("dark-mode");
  actualizarTextoBotonDark();
  if (btn) btn.addEventListener("click", toggleDarkMode);
}

// 🚪 Logout genérico
function inicializarLogout(rutaLogin) {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = rutaLogin;
    });
  }
}

// Auto inicialización
document.addEventListener("DOMContentLoaded", inicializarModoOscuro);