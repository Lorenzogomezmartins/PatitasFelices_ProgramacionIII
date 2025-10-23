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
  const labels = document.querySelectorAll("label, .form-label, .label-text");
  const inputs = document.querySelectorAll("input, select, textarea");
  const subtitle = document.querySelector(".card-subtitle");

  if (activar) {
    // 🟣 Activar modo oscuro
    root.style.setProperty("--primary-color", "#756446ff");
    root.style.setProperty("--primary-light", "#645a49ff");
    root.style.setProperty("--bg-color", "#000000");
    root.style.setProperty("--text-dark", "#ffffff");
    root.style.setProperty("--text-light", "#cccccc");
    root.style.setProperty("--white", "#000000");
    root.style.setProperty("--gray-border", "#333333");
    root.style.setProperty("--hover-shadow", "0 8px 16px rgba(255,255,255,0.1)");

    body.classList.add("dark-mode");
    root.dataset.theme = "dark";

    labels.forEach(label => (label.style.color = "#ffffff"));
    if (subtitle) {
      subtitle.style.color = "rgba(157,164,179,1)";
    }

    inputs.forEach(input => {
      input.style.backgroundColor = "#1a1a1a";
      input.style.color = "#ffffff";
      input.style.border = "1px solid #524123ff";
    });

    // 🎨 Estilos específicos de tablas - modo oscuro
    const tablas = document.querySelectorAll("table, .table");
    tablas.forEach(tbl => {
      tbl.style.backgroundColor = "#0f0f0f";
      tbl.style.color = "#ffffff";
      tbl.style.borderCollapse = "collapse";
      tbl.style.border = "1px solid #333333";
      
      const ths = tbl.querySelectorAll("th");
      ths.forEach(th => {
        th.style.background = "#524123ff";
        th.style.color = "#ffffff";
        th.style.border = "1px solid #2b2b2b";
      });
      
      const tds = tbl.querySelectorAll("td");
      tds.forEach(td => {
        td.style.background = "#111111";
        td.style.color = "#ffffff";
        td.style.border = "1px solid #2b2b2b";
      });
    });
  } else {
    // 🟠 Volver al modo claro
    root.style.setProperty("--primary-color", "#b3814d");
    root.style.setProperty("--primary-light", "#b3814d");
    root.style.setProperty("--bg-color", "#e6d3b7");
    root.style.setProperty("--text-dark", "#1f2937");
    root.style.setProperty("--text-light", "#6b7280");
    root.style.setProperty("--white", "#ffffff");
    root.style.setProperty("--gray-border", "#d1d5db");
    root.style.setProperty("--hover-shadow", "0 8px 16px rgba(0, 0, 0, 0.1)");

    body.classList.remove("dark-mode");
    root.dataset.theme = "light";

    labels.forEach(label => (label.style.color = "#1f2937"));
    if (subtitle) {
      subtitle.style.color = "rgba(139,145,151,0.75)";
    }

    inputs.forEach(input => {
      input.style.backgroundColor = "#ffffff";
      input.style.color = "#1f2937";
      input.style.border = "1px solid #d1d5db";
    });

    // 🎨 Estilos específicos de tablas - modo claro
    const tablas = document.querySelectorAll("table, .table");
    tablas.forEach(tbl => {
      tbl.style.backgroundColor = "#ffffff";
      tbl.style.color = "var(--text-dark)";
      tbl.style.border = "1px solid var(--gray-border)";
      
      const ths = tbl.querySelectorAll("th");
      ths.forEach(th => {
        th.style.background = "linear-gradient(135deg, var(--primary-color), var(--primary-light))";
        th.style.color = "#ffffff";
      });
      
      const tds = tbl.querySelectorAll("td");
      tds.forEach(td => {
        td.style.background = "#ffffff";
        td.style.color = "var(--text-dark)";
        td.style.border = "1px solid var(--gray-border)";
      });
    });
  }
}

function inicializarModoOscuro() {
  const btn = document.getElementById("dark-mode-toggle");
  const modoOscuroGuardado = localStorage.getItem("theme") === "dark";
  
  // Aplicar el modo guardado al cargar
  if (modoOscuroGuardado) {
    aplicarModoOscuro(true);
  }
  
  actualizarTextoBotonDark();
  
  if (btn) {
    btn.addEventListener("click", toggleDarkMode);
  }
}

function toggleDarkMode() {
  const isDark = document.documentElement.dataset.theme === "dark";
  
  // Alternar modo
  aplicarModoOscuro(!isDark);
  
  // Guardar en localStorage
  localStorage.setItem("theme", !isDark ? "dark" : "light");
  
  // Actualizar texto del botón
  actualizarTextoBotonDark();
}

function inicializarLogout(rutaLogin) {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = rutaLogin;
    });
  }
}

document.addEventListener("DOMContentLoaded", inicializarModoOscuro);