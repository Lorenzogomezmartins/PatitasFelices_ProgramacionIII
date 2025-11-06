// Modo Oscuro
//
// Funcionalidad:
// - Alterna entre modo oscuro y claro.
// - Persiste la preferencia en localStorage.
// - Botón #dark-mode-toggle alterna el modo.
// - Se aplica al cargar la página.


function actualizarTextoBotonDark() {
  const btn = document.getElementById("dark-mode-toggle");
  if (!btn) return;
  btn.textContent = document.body.classList.contains("dark-mode")
    ? "Modo claro"
    : "Modo oscuro";
}

function aplicarModoOscuro(activar) {
  const root = document.documentElement;
  const body = document.body;

  if (activar) {
    body.classList.add("dark-mode");
    root.dataset.theme = "dark";
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
    root.dataset.theme = "light";
    localStorage.setItem("theme", "light");
  }

  actualizarTextoBotonDark();
}

function inicializarModoOscuro() {
  const btn = document.getElementById("dark-mode-toggle");
  const modoOscuroGuardado = localStorage.getItem("theme") === "dark";

  aplicarModoOscuro(modoOscuroGuardado);

  if (btn) {
    btn.addEventListener("click", () => {
      const esOscuro = document.body.classList.contains("dark-mode");
      aplicarModoOscuro(!esOscuro);
    });
  }
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", inicializarModoOscuro);