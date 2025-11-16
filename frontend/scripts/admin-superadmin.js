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
const API_ADMIN = "http://localhost:4000/api/admin";

let adminActualId = null; 

document.addEventListener("DOMContentLoaded", () => {
  cargarAdmins();

  const btnAgregarAdmin = document.getElementById("btnAgregarAdmin");
  if (btnAgregarAdmin) {
    btnAgregarAdmin.type = "button";
    btnAgregarAdmin.addEventListener("click", async function(event) {
      event.preventDefault();
      await crearAdmin();
    });
  }

  const btnActualizarAdmin = document.getElementById("btnActualizarAdmin");
  if (btnActualizarAdmin) {
    btnActualizarAdmin.type = "button";
    btnActualizarAdmin.addEventListener("click", async function(event) {
      event.preventDefault();
      await actualizarAdmin();
    });
  }
  const token = localStorage.getItem("token");
  const admin = JSON.parse(localStorage.getItem("adminLogeado"));

  if (!token || !admin) {
    alert("Debes iniciar sesión.");
    window.location.href = "../pages/login-admin.html";
    return;
  }
});


//crear administrador
async function crearAdmin() {
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
    const res = await fetch(API_ADMIN, { method: "POST", body: JSON.stringify({ nombre, email, password, rol }), headers: { "Content-Type": "application/json" } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || "Error al crear admin");

    // Si todo sale bien
    mostrarMensaje(" Administrador creado correctamente", "success");
    document.getElementById("frmAdmins").reset();
    cargarAdmins();          

  } catch (error) {
    console.error(" Error al crear admin:", error);
    mostrarMensaje(` ${error.message}`, "error");
  }
};

// actualizar administrador
async function actualizarAdmin() {
    const _id = adminActualId;
    const nombre = document.getElementById("inputNombreAdmin").value.trim();
    const email = document.getElementById("inputEmailAdmin").value.trim();
    const password = document.getElementById("inputPasswordAdmin").value;
    const rol = document.getElementById("inputRolAdmin").value;

    if (!nombre || !email || !rol) {
      mostrarMensaje("Nombre, Email y Rol son obligatorios", "error");
      return;
    }
    if (!_id) {
      mostrarMensaje("No hay administrador seleccionado", "error");
      return;
    }

    try {
      mostrarMensaje(" Administrador actualizado correctamente", "success");
      document.getElementById("frmAdmins").reset();
      btnActualizarAdmin.style.display = "none";
      const res = await fetch(`${API_ADMIN}/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // 👈 FALTABA ESTO
        },
        body: JSON.stringify({ nombre, email, password, rol }),
      });      
      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Error al actualizar producto");


      // Actualiza solo la fila correspondiente en la tabla
      actualizarFilaAdmin(data.admin);

      adminActualId = null;
    } catch (error) {
      console.error("Error al actualizar admin:", error);
      mostrarMensaje(` ${error.message}`, "error");
    }
  };


// CARGAR ADMIN EN LA TABLA
async function cargarAdmins() {
  const contenedor = document.getElementById("divListadoAdmins");
  contenedor.innerHTML = `<p>Cargando administradores...</p>`;

  try {
    const response = await fetch(API_ADMIN);
    const data = await response.json();
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
    console.error(" Error al cargar administradores:", error);
    contenedor.innerHTML = `<p style="color:red;"> Error: ${error.message}</p>`;
  }
}

// CARGAR ADMIN EN FORMULARIO
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

// ACTUALIZAR FILA DE ADMIN
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
    const res = await fetch(`${API_ADMIN}/${adminId}`, { method: "DELETE" });
    const data = await res.json();

    // Validación de respuesta coherente con el backend
    if (!res.ok || data.ok === false) {
      const mensajeError =
        data.mensaje || data.error || "Error al eliminar administrador.";
      throw new Error(mensajeError);
    }

    mostrarMensaje(" Administrador eliminado correctamente", "success");
    cargarAdmins();
  } catch (error) {
    console.error(" Error al eliminar admin:", error);
    mostrarMensaje(` ${error.message}`, "error");
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

