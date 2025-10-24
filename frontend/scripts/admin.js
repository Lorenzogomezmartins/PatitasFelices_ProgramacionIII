function volverAlLogin() {
  // Cambiá esta ruta según tu dashboard real
  window.location.href = "../pages/Login-admin.html";
}

// Evento del botón
document.addEventListener("DOMContentLoaded", () => {
  const btnVolver = document.getElementById("logout-btn");
  if (btnVolver) btnVolver.addEventListener("click", volverAlLogin);
});
