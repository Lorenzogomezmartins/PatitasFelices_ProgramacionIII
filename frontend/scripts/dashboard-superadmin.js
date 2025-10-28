document.addEventListener("DOMContentLoaded", () => {
  cargarAdmins();
  cargarTickets();
  inicializarLogout();

  const btnAgregarAdmin = document.getElementById("btnAgregarAdmin");
  const btnActualizarAdmin = document.getElementById("btnActualizarAdmin");

  // AGREGAR ADMIN
  btnAgregarAdmin.addEventListener("click", async () => {
    const nombre = document.getElementById("inputNombreAdmin").value.trim();
    const email = document.getElementById("inputEmailAdmin").value.trim();
    const password = document.getElementById("inputPasswordAdmin").value;
    const rol = document.getElementById("inputRolAdmin").value;

    if (!nombre || !email || !password || !rol) {
      mostrarMensaje("Todos los campos son obligatorios", "error");
      return;
    }

    try {
      await apiClient.crearAdmin({ nombre, email, password, rol });
      mostrarMensaje("✅ Administrador creado correctamente", "success");
      cargarAdmins();
      document.getElementById("frmAdmins").reset();
    } catch (error) {
      console.error("❌ Error al crear admin:", error);
      mostrarMensaje(`❌ ${error.message}`, "error");
    }
  });
  document.getElementById("frmAdmins").addEventListener("reset", () => {
    btnActualizarAdmin.style.display = "none";
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
          <th>Contraseña</th>
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
        <td>••••••</td>
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

// CARGAR ADMIN EN EL FORMULARIO
function cargarAdminEnFormulario(admin) {
  document.getElementById("inputNombreAdmin").value = admin.nombre;
  document.getElementById("inputEmailAdmin").value = admin.email;
  document.getElementById("inputPasswordAdmin").value = "";
  document.getElementById("inputRolAdmin").value = admin.rol;

  const btnActualizarAdmin = document.getElementById("btnActualizarAdmin");
  btnActualizarAdmin.style.display = "inline-block";

  btnActualizarAdmin.onclick = async () => {
    const nombre = document.getElementById("inputNombreAdmin").value.trim();
    const email = document.getElementById("inputEmailAdmin").value.trim();
    const password = document.getElementById("inputPasswordAdmin").value;
    const rol = document.getElementById("inputRolAdmin").value;

    if (!nombre || !email || !rol) {
      mostrarMensaje("Nombre, Email y Rol son obligatorios", "error");
      return;
    }

    try {
      await apiClient.actualizarAdmin(admin._id, { nombre, email, password, rol });
      mostrarMensaje("✅ Administrador actualizado correctamente", "success");
      cargarAdmins();
      document.getElementById("frmAdmins").reset();
      btnActualizarAdmin.style.display = "none";
    } catch (error) {
      console.error("❌ Error al actualizar admin:", error);
      mostrarMensaje(`❌ ${error.message}`, "error");
    }
  };
}

// ELIMINAR ADMIN
async function eliminarAdmin(adminId) {
  if (!confirm("¿Desea eliminar este administrador?")) return;

  try {
    await apiClient.eliminarAdmin(adminId);
    mostrarMensaje("✅ Administrador eliminado correctamente", "success");
    cargarAdmins();
  } catch (error) {
    console.error("❌ Error al eliminar admin:", error);
    mostrarMensaje(`❌ ${error.message}`, "error");
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

let currentPage = 1;

async function cargarTickets() {
  const contenedor = document.getElementById("divListadoTickets");
  const btnVerMas = document.getElementById("btnVerMasTickets");

  if (!contenedor) return console.error("No existe el contenedor 'divListadoTickets'");

  // Mostrar mensaje de carga solo la primera vez
  if (currentPage === 1) contenedor.innerHTML = `<p>Cargando tickets...</p>`;

  try {
    // Fetch a tu endpoint: GET /usuarios/obtenerTickets?page=#
    const response = await fetch(`http://localhost:4000/api/usuarios/obtenerTickets?page=${currentPage}`);
    const data = await response.json();

    if (!data.ok || !data.tickets || data.tickets.length === 0) {
      if (currentPage === 1) {
        contenedor.innerHTML = `<p style="color:red;">No hay tickets registrados.</p>`;
      } else {
        btnVerMas.disabled = true;
        btnVerMas.textContent = "No hay más tickets";
      }
      return;
    }

    // Si es la primera página, crear tabla
    if (currentPage === 1) {
      contenedor.innerHTML = "";
      const table = document.createElement("table");
      table.id = "tablaTickets";
      table.className = "table table-striped table-hover table-sm";
      table.innerHTML = `
        <thead class="table-dark">
          <tr>
            <th>Usuario</th>
            <th>Fecha de compra</th>
            <th>Productos</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      contenedor.appendChild(table);
    }

    const tbody = document.querySelector("#tablaTickets tbody");

    // Agregar los nuevos tickets a la tabla
    data.tickets.forEach(ticket => {
      const tr = document.createElement("tr");

      const usuario = `${ticket.nombreUsuario} ${ticket.apellidoUsuario}`;
      const fecha = new Date(ticket.fechaDeCompra).toLocaleString();
      const total = `${ticket.total}`;
      const productos = ticket.productos
        .map(p => `${p.prod?._id || "?"} (x${p.prod?.cantidad || 0})`)
        .join(", ");

      tr.innerHTML = `
        <td>${usuario}</td>
        <td>${fecha}</td>
        <td>${productos}</td>
        <td>${total}</td>
      `;
      tbody.appendChild(tr);
    });

    currentPage++;

  } catch (error) {
    console.error("Error al cargar tickets:", error);
    contenedor.innerHTML = `<p style="color:red; font-weight:bold;">Error al cargar tickets: ${error.message}</p>`;
  }
}
function inicializarLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("adminLogeado");

      window.location.href = "../pages/Login-admin.html";
    });
  }
}
