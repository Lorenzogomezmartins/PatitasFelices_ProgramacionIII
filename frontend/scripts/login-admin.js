async function handleAdminLogin(event) {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");

  const nombre = nameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!nombre || !password) {
    alert("Por favor, ingresa tu nombre y contraseña.");
    return;
  }

  loginBtn.textContent = "Ingresando...";
  loginBtn.disabled = true;

  try {
    const API_URL_LOGIN = "http://localhost:4000/api/admin/login";

    const respuesta = await fetch(API_URL_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, password }),
    });

    const data = await respuesta.json();

    if (!respuesta.ok || !data.ok) {
      throw new Error(data.mensaje || "Error al iniciar sesión.");
    }

    // 🟢 Guardar datos en localStorage
    const admin = data.admin;
    localStorage.setItem("adminLogeado", JSON.stringify(admin));

    // Redirigir según el rol
    if (admin.rol === "superadmin") {
      window.location.href = "../pages/dashboard-superadmin.html";
    } else {
      window.location.href = "../pages/dashboard-admin.html";
    }

  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    loginBtn.textContent = "Iniciar sesión";
    loginBtn.disabled = false;
  }
}

function setupAdminLoginListeners() {
  const adminForm = document.getElementById("adminForm");
  const nameInput = document.getElementById("name");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");

  function checkInputs() {
    loginBtn.disabled = !(nameInput.value.trim() && passwordInput.value.trim());
  }

  nameInput.addEventListener("input", checkInputs);
  passwordInput.addEventListener("input", checkInputs);
  checkInputs();

  adminForm.addEventListener("submit", handleAdminLogin);
}

// Si ya está logueado, redirige directamente
document.addEventListener("DOMContentLoaded", () => {
  const adminLogeado = JSON.parse(localStorage.getItem("adminLogeado"));
  if (adminLogeado) {
    if (adminLogeado.rol === "superadmin") {
      window.location.href = "../pages/dashboard-superadmin.html";
    } else {
      window.location.href = "../pages/dashboard-admin.html";
    }
  } else {
    setupAdminLoginListeners();
  }
});
