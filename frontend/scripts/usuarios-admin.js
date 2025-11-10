// DASHBOARD ADMIN - USUARIOS
// Funcionalidad general:
// - Carga, crea y elimina usuarios desde la API.
// - Muestra mensajes de éxito y error.
// - Permite cerrar sesión (logout).
// - Pensado para el panel de administración de usuarios.
//
// Dependencias / Requisitos:
// - Un contenedor en HTML con id="divListadoUsuarios".
// - Un formulario con id="frmFormulario" y campos inputNombre y inputApellido.
// - Botón con id="btnAgregar" para crear usuario.
// - Botón con id="logout-btn" para cerrar sesión.
// - Bootstrap y Bootstrap Icons para estilos de tabla y botones.

const API_USUARIOS = "http://localhost:4000/api/usuarios";


document.addEventListener("DOMContentLoaded", () => {
  // Cargar usuarios
  cargarUsuarios();
  // Inicializar formulario de creación de usuario
  inicializarFormUsuario();

});

/*
   CARGAR USUARIOS
*/
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
    
      `;
      tbody.appendChild(tr);
    });

    contenedor.innerHTML = "";
    contenedor.appendChild(table);

  } catch (error) {
    console.error("❌ Error al cargar usuarios:", error);
    contenedor.innerHTML = `<p style="color:red; font-weight:bold;">❌ Error al cargar usuarios: ${error.message}</p>`;
  }
}

/*
   CREAR USUARIO
*/
function inicializarFormUsuario() {
  const btnAgregar = document.getElementById("btnAgregar"); 
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
     
      const res = await fetch(`${API_USUARIOS}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido })
      });
      const data = await res.json();

      if (!res.ok || !data.ok) throw new Error(data.error || "Error al crear usuario");

      mostrarMensaje(`✅ Usuario ${nombre} agregado correctamente`, "success");
      document.getElementById("frmFormulario").reset(); 
      cargarUsuarios();

    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      mostrarMensaje(`❌ ${error.message}`, "error");
    }
  });
}

/* 
   ELIMINAR USUARIO
*/
// async function eliminarUsuario(id) {
//   if (!id) return mostrarMensaje("⚠️ ID inválido", "error");
//   if (!confirm("¿Desea eliminar este usuario?")) return;

//   try {
//     const res = await fetch(`${API_USUARIOS}/${id}`, { method: "DELETE" });
//     const data = await res.json();

//     if (!res.ok || !data.ok) throw new Error(data.error || "Error al eliminar usuario");

//     mostrarMensaje("✅ Usuario eliminado correctamente", "success");
//     cargarUsuarios();

//   } catch (error) {
//     console.error("❌ Error al eliminar usuario:", error);
//     mostrarMensaje(`❌ ${error.message}`, "error");
//   }
// }

/* 
   MENSAJES
*/
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

