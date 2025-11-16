// MODO OSCURO / CLARO EN LOGIN
//
// Funcionalidad:
// - Permite alternar entre modo oscuro y claro en la página de login.
// - Cambia colores de fondo, textos, bordes y sombras de inputs, botones,
//   navbar, cuadros de login, info-box y elementos secundarios (ej. test-user).
// - Guarda la preferencia del usuario en localStorage.
// - Actualiza el texto del botón según el modo activo.
// - Se aplica automáticamente el modo guardado al cargar la página.

function actualizarTextoBotonDark() {
  const btn = document.getElementById("dark-mode-toggle");
  if (!btn) return;
  btn.textContent = document.body.classList.contains("dark-mode")
    ? "Modo claro"
    : "Modo oscuro";
}

function aplicarModoOscuroLogin(activar) {
  const root = document.documentElement;
  const body = document.body;
  const labels = document.querySelectorAll("label, .form-label, .label-text");
  const inputs = document.querySelectorAll("input, select, textarea");
  const infoBoxTop = document.querySelector(".info-box-top");
  const loginBox = document.querySelector(".login-box");
  const navbar = document.querySelector(".navbar");
  const testUser = document.querySelector(".test-user");

  if (activar) {
    //  Activar modo oscuro
    root.style.setProperty("--primary-color", "#756446ff");
    root.style.setProperty("--primary-light", "#645a49ff");
    root.style.setProperty("--bg-color", "#000000");
    root.style.setProperty("--text-dark", "#ffffff");
    root.style.setProperty("--text-light", "#cccccc");
    root.style.setProperty("--white", "#000000");
    root.style.setProperty("--gray-border", "#333333");
    root.style.setProperty("--hover-shadow", "0 8px 16px rgba(255,255,255,0.1)");

    
    body.style.backgroundColor = "#0a0a0a";
    root.dataset.theme = "dark";


    // Info box superior
    if (infoBoxTop) {
      infoBoxTop.style.backgroundColor = "#1a1a1a";
      infoBoxTop.style.color = "#ffffff";
      infoBoxTop.style.border = "1px solid #333333";
      
      const h2 = infoBoxTop.querySelector("h2");
      if (h2) h2.style.color = "#ffffff";
      
      const paragraphs = infoBoxTop.querySelectorAll("p");
      paragraphs.forEach(p => {
        p.style.color = "#cccccc";
      });
    }

    // Cuadro de login
    if (loginBox) {
      loginBox.style.backgroundColor = "#1a1a1a";
      loginBox.style.border = "1px solid #333333";
      loginBox.style.boxShadow = "0 8px 16px rgba(255,255,255,0.05)";
      
      const h1 = loginBox.querySelector("h1");
      if (h1) h1.style.color = "#ffffff";
      
      const paragraphs = loginBox.querySelectorAll("p");
      paragraphs.forEach(p => {
        p.style.color = "#cccccc";
      });
    }

    // Test user box (solo en login-admin)
    if (testUser) {
      testUser.style.backgroundColor = "#1a1a1a";
      testUser.style.color = "#ffffff";
      
      const spans = testUser.querySelectorAll("span");
      spans.forEach(span => {
        span.style.color = "#b3814d";
      });
    }

    // Labels
    labels.forEach(label => {
      label.style.color = "#ffffff";
    });

    // Inputs
    inputs.forEach(input => {
      input.style.backgroundColor = "#0f0f0f";
      input.style.color = "#ffffff";
      input.style.border = "1px solid #524123ff";
    });

    // Botones
    const buttons = document.querySelectorAll("button[type='submit']");
    buttons.forEach(btn => {
      btn.style.backgroundColor = "#756446ff";
      btn.style.color = "#ffffff";
      btn.style.border = "1px solid #524123ff";
    });

    // Info text
    const infoText = document.querySelector(".info");
    if (infoText) {
      infoText.style.color = "#cccccc";
    }

    // Links de navegación
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
      link.style.color = "#ffffff";
    });

    const altLink = document.querySelector(".alt-link");
    if (altLink) {
      altLink.style.color = "#b3814d";
    }

  } else {
    //  Volver al modo claro
    root.style.setProperty("--primary-color", "#b3814d");
    root.style.setProperty("--primary-light", "#b3814d");
    root.style.setProperty("--bg-color", "#e6d3b7");
    root.style.setProperty("--text-dark", "#1f2937");
    root.style.setProperty("--text-light", "#6b7280");
    root.style.setProperty("--white", "#ffffff");
    root.style.setProperty("--gray-border", "#d1d5db");
    root.style.setProperty("--hover-shadow", "0 8px 16px rgba(0, 0, 0, 0.1)");

    body.classList.remove("dark-mode");
    body.style.backgroundColor = "";
    root.dataset.theme = "light";

    // Navbar
    if (navbar) {
      navbar.style.backgroundColor = "";
      navbar.style.borderBottom = "";
    }

    // Info box superior
    if (infoBoxTop) {
      infoBoxTop.style.backgroundColor = "";
      infoBoxTop.style.color = "";
      infoBoxTop.style.border = "";
      
      const h2 = infoBoxTop.querySelector("h2");
      if (h2) h2.style.color = "";
      
      const paragraphs = infoBoxTop.querySelectorAll("p");
      paragraphs.forEach(p => {
        p.style.color = "";
      });
    }

    // Cuadro de login
    if (loginBox) {
      loginBox.style.backgroundColor = "";
      loginBox.style.border = "";
      loginBox.style.boxShadow = "";
      
      const h1 = loginBox.querySelector("h1");
      if (h1) h1.style.color = "";
      
      const paragraphs = loginBox.querySelectorAll("p");
      paragraphs.forEach(p => {
        p.style.color = "";
      });
    }

    // Test user box
    if (testUser) {
      testUser.style.backgroundColor = "";
      testUser.style.border = "";
      testUser.style.color = "";
      
      const spans = testUser.querySelectorAll("span");
      spans.forEach(span => {
        span.style.color = "";
      });
    }

    // Labels
    labels.forEach(label => {
      label.style.color = "";
    });

    // Inputs
    inputs.forEach(input => {
      input.style.backgroundColor = "";
      input.style.color = "";
      input.style.border = "";
    });

    // Botones
    const buttons = document.querySelectorAll("button[type='submit']");
    buttons.forEach(btn => {
      btn.style.backgroundColor = "";
      btn.style.color = "";
      btn.style.border = "";
    });

    // Info text
    const infoText = document.querySelector(".info");
    if (infoText) {
      infoText.style.color = "";
    }

    // Links de navegación
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
      link.style.color = "";
    });

    const altLink = document.querySelector(".alt-link");
    if (altLink) {
      altLink.style.color = "";
    }
  }
}

function inicializarModoOscuroLogin() {
  const btn = document.getElementById("dark-mode-toggle");
  const modoOscuroGuardado = localStorage.getItem("theme") === "dark";
  
  // Aplicar el modo guardado al cargar
  if (modoOscuroGuardado) {
    aplicarModoOscuroLogin(true);
  }
  
  actualizarTextoBotonDark();
  
  if (btn) {
    btn.addEventListener("click", toggleDarkModeLogin);
  }
}

function toggleDarkModeLogin() {
  const isDark = document.documentElement.dataset.theme === "dark";
  
  // Alternar modo
  aplicarModoOscuroLogin(!isDark);
  
  // Guardar en localStorage
  localStorage.setItem("theme", !isDark ? "dark" : "light");
  
  // Actualizar texto del botón
  actualizarTextoBotonDark();
}

document.addEventListener("DOMContentLoaded", function() {
    inicializarModoOscuroLogin();
});