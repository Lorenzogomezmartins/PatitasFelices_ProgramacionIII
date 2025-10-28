/* ==========================================
   DASHBOARD ADMIN - USUARIOS
========================================== */
const API_USUARIOS = "http://localhost:4000/api/usuarios";

/* ==========================================
   DOCUMENT READY
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
  inicializarFormUsuario();
  inicializarLogout();
});

/* ==========================================
   CARGAR USUARIOS
========================================== */
async function cargarUsuarios() {
  const contenedor = document.getElementById("divListadoUsuarios");
  if (!contenedor) return console.error("No existe el contenedor 'divListadoUsuarios'");

  contenedor.innerHTML = `<p>Cargando usuarios...</p>`;

  try {
    const res = await fetch(API_USUARIOS);
    const data = await res.json();

    if (!data.ok || !data.usuarios || data.usuarios.length === 0) {
      contenedor.innerHTML = `<p style="color:red;">No hay usuarios registrados.</p>`;
      return;
    }

    const table = document.createElement("table");
    table.className = "table table-striped table-hover table-sm";
    table.innerHTML = `
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Fecha de ingreso</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    data.usuarios.forEach(user => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user._id}</td>
        <td>${user.nombre}</td>
        <td>${user.apellido}</td>
        <td>${user.fechaIngreso ? new Date(user.fechaIngreso).toLocaleDateString() : "-"}</td>
        <td>
          <button class="btn btn-sm btn-danger eliminar-btn" title="Eliminar usuario">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tr.querySelector(".eliminar-btn").addEventListener("click", () => eliminarUsuario(user._id));
      tbody.appendChild(tr);
    });

    contenedor.innerHTML = "";
    contenedor.appendChild(table);

  } catch (error) {
    console.error("❌ Error al cargar usuarios:", error);
    contenedor.innerHTML = `<p style="color:red; font-weight:bold;">❌ Error al cargar usuarios: ${error.message}</p>`;
  }
}

/* ==========================================
   CREAR USUARIO
========================================== */
function inicializarFormUsuario() {
  const btnAgregar = document.getElementById("btnAgregar"); // coincide con tu HTML
  if (!btnAgregar) return;

  btnAgregar.addEventListener("click", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("inputNombre")?.value.trim();
    const apellido = document.getElementById("inputApellido")?.value.trim();

    if (!nombre || !apellido) {
      mostrarMensaje("Nombre y Apellido son obligatorios", "error");
      return;
    }

    try {
      // 🔹 Cambiado a /login
      const res = await fetch(`${API_USUARIOS}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido })
      });
      const data = await res.json();

      if (!res.ok || !data.ok) throw new Error(data.error || "Error al crear usuario");

      mostrarMensaje(`✅ Usuario ${nombre} agregado correctamente`, "success");
      document.getElementById("frmFormulario").reset(); // coincide con tu HTML
      cargarUsuarios();

    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      mostrarMensaje(`❌ ${error.message}`, "error");
    }
  });
}

/* ==========================================
   ELIMINAR USUARIO
========================================== */
async function eliminarUsuario(id) {
  if (!id) return mostrarMensaje("⚠️ ID inválido", "error");
  if (!confirm("¿Desea eliminar este usuario?")) return;

  try {
    const res = await fetch(`${API_USUARIOS}/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok || !data.ok) throw new Error(data.error || "Error al eliminar usuario");

    mostrarMensaje("✅ Usuario eliminado correctamente", "success");
    cargarUsuarios();

  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    mostrarMensaje(`❌ ${error.message}`, "error");
  }
}

/* ==========================================
   MENSAJES
========================================== */
function mostrarMensaje(texto, tipo) {
  const div = document.createElement("div");
  div.textContent = texto;
  div.className = tipo === "error" ? "alert alert-danger" : "alert alert-success";
  div.style.position = "fixed";
  div.style.top = "20px";
  div.style.right = "20px";
  div.style.zIndex = "9999";
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

/* ==========================================
   LOGOUT
========================================== */
function inicializarLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("adminLogeado");
      window.location.href = "../pages/Login-admin.html";
    });
  }
}
