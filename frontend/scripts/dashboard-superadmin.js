// Archivo: adminDashboard.js
//
// Descripción:
// Gestiona la interfaz de administradores en el frontend. Permite crear, editar,
// actualizar y eliminar administradores, mostrar la lista en tabla y mostrar
// mensajes de estado flotantes.
//
// Variables:
// - adminActualId: ID del admin que se está editando
//
// Funcionalidades:
// - Crear admin: valida campos, llama al backend y recarga la tabla
// - Modificar admin: edita admin seleccionado y actualiza su fila
// - Cargar admins: obtiene admins del backend y genera tabla dinámica
// - Cargar admin en formulario: rellena inputs para edición
// - Eliminar admin: confirma y elimina admin, recarga tabla
// - Mensajes flotantes: muestra alertas por 3 segundos

let adminActualId = null; 

document.addEventListener("DOMContentLoaded", () => {
  cargarAdmins();

  const btnAgregarAdmin = document.getElementById("btnAgregarAdmin");
  const frmAdmins = document.getElementById("frmAdmins");
  const btnActualizarAdmin = document.getElementById("btnActualizarAdmin");

  // ----------------------
  // AGREGAR ADMIN
  // ----------------------
 btnAgregarAdmin.addEventListener("click", async () => {
  const nombre = document.getElementById("inputNombreAdmin").value.trim();
  const email = document.getElementById("inputEmailAdmin").value.trim();
  const password = document.getElementById("inputPasswordAdmin").value;
  const rol = document.getElementById("inputRolAdmin").value;

  // Validación de campos obligatorios
  if (!nombre || !email || !password || !rol) {
    mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }

  try {
    // Llamada al backend para crear admin
    const response = await apiClient.crearAdmin({ nombre, email, password, rol });

    // Verificación de error devuelto por el backend
    if (response.mensaje && response.mensaje.toLowerCase().includes("error")) {
      throw new Error(response.mensaje);
    }

    // Si todo sale bien
    mostrarMensaje("✅ Administrador creado correctamente", "success");
    frmAdmins.reset();      
    cargarAdmins();          

  } catch (error) {
    console.error("❌ Error al crear admin:", error);
    mostrarMensaje(`❌ ${error.message}`, "error");
  }
});
  // ----------------------
  // MODIFICAR ADMIN 
  // ----------------------
  btnActualizarAdmin.addEventListener("click", async () => {
    if (!adminActualId) {
      mostrarMensaje("No hay administrador seleccionado", "error");
      return;
    }

    const nombre = document.getElementById("inputNombreAdmin").value.trim();
    const email = document.getElementById("inputEmailAdmin").value.trim();
    const rol = document.getElementById("inputRolAdmin").value;

    if (!nombre || !email || !rol) {
      mostrarMensaje("Nombre, Email y Rol son obligatorios", "error");
      return;
    }

    try {
      const payload = { nombre, email, rol };
      const response = await apiClient.actualizarAdmin(adminActualId, payload);

      if (!response.ok) {
        throw new Error(response.mensaje || "Error desconocido al actualizar admin");
      }

      mostrarMensaje("✅ Administrador actualizado correctamente", "success");
      frmAdmins.reset();
      btnActualizarAdmin.style.display = "none";

      // Actualiza solo la fila correspondiente en la tabla
      actualizarFilaAdmin(response.admin);

      adminActualId = null;
    } catch (error) {
      console.error("Error al actualizar admin:", error);
      mostrarMensaje(`❌ ${error.message}`, "error");
    }
  });

  // ----------------------
  // LIMPIAR FORMULARIO
  // ----------------------
  frmAdmins.addEventListener("reset", () => {
    if (btnActualizarAdmin) btnActualizarAdmin.style.display = "none";
    adminActualId = null;
  });
});

// CARGAR ADMIN EN LA TABLA
async function cargarAdmins() {
  const contenedor = document.getElementById("divListadoAdmins");
  contenedor.innerHTML = `<p>Cargando administradores...</p>`;

  try {
    const data = await apiClient.getAdmins();
    if (!data.ok || !data.usuarios || data.usuarios.length === 0) {
      contenedor.innerHTML = `<p style="color:red;">No hay administradores disponibles.</p>`;
      return;
    }

    const soloAdmins = data.usuarios.filter(a => a.rol.toLowerCase() === "admin");

    const table = document.createElement("table");
    table.className = "table table-striped table-hover table-sm";
    table.innerHTML = `
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    soloAdmins.forEach(admin => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${admin._id}</td>
        <td>${admin.nombre}</td>
        <td>${admin.email}</td>
        <td>${admin.rol}</td>
        <td>
          <button class="btn btn-sm btn-primary editar-admin-btn">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger eliminar-admin-btn">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;

      // ELIMINAR ADMIN
      tr.querySelector(".eliminar-admin-btn").addEventListener("click", () => eliminarAdmin(admin._id));

      // EDITAR ADMIN
      tr.querySelector(".editar-admin-btn").addEventListener("click", () => cargarAdminEnFormulario(admin));

      tbody.appendChild(tr);
    });

    contenedor.innerHTML = "";
    contenedor.appendChild(table);

  } catch (error) {
    console.error("❌ Error al cargar administradores:", error);
    contenedor.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
  }
}

// ----------------------
// CARGAR ADMIN EN FORMULARIO
// ----------------------
function cargarAdminEnFormulario(admin) {
  const inputNombre = document.getElementById("inputNombreAdmin");
  const inputEmail = document.getElementById("inputEmailAdmin");
  const inputRol = document.getElementById("inputRolAdmin");
  const btnActualizarAdmin = document.getElementById("btnActualizarAdmin");

  inputNombre.value = admin.nombre;
  inputEmail.value = admin.email;
  inputRol.value = admin.rol;

  // Mostrar botón actualizar
  btnActualizarAdmin.style.display = "inline-block";

  // Guardar el ID del admin a modificar
  adminActualId = admin._id;
}

// ----------------------
// ACTUALIZAR FILA DE ADMIN
// ----------------------
function actualizarFilaAdmin(adminActualizado) {
  const filas = document.querySelectorAll("#divListadoAdmins tbody tr");
  filas.forEach(fila => {
    if (fila.children[0].textContent === adminActualizado._id) {
      fila.children[1].textContent = adminActualizado.nombre;
      fila.children[2].textContent = adminActualizado.email;
      fila.children[3].textContent = adminActualizado.rol;
    }
  });
}
// ELIMINAR ADMIN
async function eliminarAdmin(adminId) {
  if (!confirm("¿Desea eliminar este administrador?")) return;

  try {
    await apiClient.eliminarAdmin(adminId);
    mostrarMensaje("Administrador eliminado correctamente", "success");
    cargarAdmins();
  } catch (error) {
    console.error("Error al eliminar admin:", error);
    mostrarMensaje(`${error.message}`, "error");
  }
}

// MENSAJES FLOTANTES
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
