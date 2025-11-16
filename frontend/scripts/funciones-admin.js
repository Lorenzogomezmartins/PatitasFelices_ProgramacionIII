// ==========================================
// PANEL PARA ADMINISTRADORES
// ==========================================
//
// Funcionalidad:
// - Muestra tickets de usuarios con paginación y modal de detalles.
// - Calcula y muestra estadísticas de productos y usuarios.
// - Logout del administrador.
//

const API_PRODUCTOS = "http://localhost:4000/api/productos";
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const admin = JSON.parse(localStorage.getItem("adminLogeado"));

  if (!token || !admin) {
    alert("Debes iniciar sesión.");
    window.location.href = "../pages/login-admin.html";
    return;
  }
  cargarEstadisticas();
  inicializarLogout();
  cargarTickets();

  const btnVerMas = document.getElementById("btnVerMasTickets");
  if (btnVerMas) btnVerMas.addEventListener("click", cargarTickets);

  // 🩶 FIX warning aria-hidden del modal
  const modalTicket = document.getElementById("modalTicket");
  if (modalTicket) {
    modalTicket.addEventListener("hidden.bs.modal", () => {
      if (document.activeElement && modalTicket.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    });
    modalTicket.addEventListener("show.bs.modal", () => {
      modalTicket.removeAttribute("aria-hidden");
    });
  }
});

// ==========================================
// TICKETS DE USUARIOS CON PAGINACIÓN
// ==========================================
async function cargarTickets() {
  const contenedor = document.getElementById("divListadoTickets");
  const btnVerMas = document.getElementById("btnVerMasTickets");
  if (!contenedor) return console.error("No existe el contenedor 'divListadoTickets'");

  if (currentPage === 1) contenedor.innerHTML = `<p>Cargando tickets...</p>`;

  try {
    const res = await fetch(`http://localhost:4000/api/usuarios/obtenerTickets?page=${currentPage}`);
    const data = await res.json();

    if (!data.ok || !data.tickets?.length) {
      if (currentPage === 1) {
        contenedor.innerHTML = `<p style="color:red;">No hay tickets registrados.</p>`;
      } else if (btnVerMas) {
        btnVerMas.disabled = true;
        btnVerMas.textContent = "No hay más tickets";
      }
      return;
    }

    if (currentPage === 1) {
      contenedor.innerHTML = `
        <table id="tablaTickets" class="table table-striped table-hover table-sm">
          <thead class="table-dark">
            <tr>
              <th>Usuario</th>
              <th>Fecha de compra</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>`;
    }

    const tbody = document.querySelector("#tablaTickets tbody");

    for (const ticket of data.tickets) {
      const usuario = `${ticket.nombreUsuario} ${ticket.apellidoUsuario}`;
      const fecha = new Date(ticket.fechaDeCompra).toLocaleString();
      const total = `$${ticket.total.toLocaleString()}`;
      const productos = ticket.productos
        .map(p => `${p.prod?._id || "?"} (x${p.prod?.cantidad || 0})`)
        .join(", ");

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${usuario}</td>
        <td>${fecha}</td>
        <td>${productos}</td>
        <td>${total}</td>
        <td><button class="btn btn-sm btn-primary btn-detalles">Detalles</button></td>
      `;

      tbody.appendChild(tr);
      tr.querySelector(".btn-detalles").addEventListener("click", () => mostrarModal(ticket));
    }

    currentPage++;
  } catch (error) {
    console.error("Error al cargar tickets:", error);
    contenedor.innerHTML = `<p style="color:red; font-weight:bold;">Error al cargar tickets: ${error.message}</p>`;
  }
}

// ==========================================
// MODAL DE DETALLES DE TICKET
// ==========================================
async function mostrarModal(ticket) {
  // Eliminar modal anterior si existe
  const modalExistente = document.getElementById("modalTicket");
  if (modalExistente) modalExistente.remove();

  // Crear modal dinámico
  const modalHTML = `
    <div class="modal fade" id="modalTicket" tabindex="-1" aria-labelledby="modalTicketLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTicketLabel">Detalle del Ticket</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <p><strong>Usuario:</strong> <span id="modalUsuario"></span></p>
            <p><strong>Fecha de compra:</strong> <span id="modalFecha"></span></p>
            <p><strong>Total:</strong> $<span id="modalTotal"></span></p>
            <h6>Productos:</h6>
            <ul id="modalProductos"></ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Referencias al contenido
  const modalUsuario = document.getElementById("modalUsuario");
  const modalFecha = document.getElementById("modalFecha");
  const modalTotal = document.getElementById("modalTotal");
  const ulProductos = document.getElementById("modalProductos");

  // Rellenar datos del ticket
  modalUsuario.textContent = `${ticket.nombreUsuario} ${ticket.apellidoUsuario}`;
  modalFecha.textContent = new Date(ticket.fechaDeCompra).toLocaleString();
  modalTotal.textContent = ticket.total.toLocaleString();
  ulProductos.innerHTML = "";

  for (const p of ticket.productos) {
    const prodId = p.prod?._id;
    if (!prodId) continue;

    try {
      const res = await fetch(`http://localhost:4000/api/productos/obtenerporcodigo/${prodId}`);
      const data = await res.json();

      const li = document.createElement("li");
      if (!res.ok || !data.ok || !data.producto) {
        li.textContent = `Producto con ID ${prodId} no encontrado (HTTP ${res.status})`;
      } else {
        const producto = data.producto;
        li.innerHTML = `
          <strong>Nombre:</strong> ${producto.nombre} |
          <strong>Precio:</strong> $${producto.precio} |
          <strong>Tamaño:</strong> ${producto.tamano || "-"} |
          <strong>Cantidad:</strong> ${p.prod.cantidad}
        `;
      }
      ulProductos.appendChild(li);
    } catch (err) {
      const li = document.createElement("li");
      li.textContent = `Error al obtener producto: ${err.message}`;
      ulProductos.appendChild(li);
    }
  }

  // Crear y mostrar el modal
  const modal = new bootstrap.Modal(document.getElementById("modalTicket"), {
    backdrop: "static",
    keyboard: true,
  });

  // Evita warning de aria-hidden (quita foco antes de cerrar)
  const modalElement = document.getElementById("modalTicket");
  modalElement.addEventListener("hide.bs.modal", () => {
    if (document.activeElement && modalElement.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  });

  modal.show();

  // Eliminar modal del DOM al cerrarse (limpieza)
  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
}

// ==========================================
// ESTADÍSTICAS
// ==========================================
async function cargarEstadisticas() {
  const contenedor = document.getElementById("estadisticas");
  if (!contenedor) return;

  contenedor.innerHTML = `<p>Cargando estadísticas...</p>`;

  try {
    const [prodRes, vendidoRes, ventasRes, usersRes] = await Promise.all([
      fetch(API_PRODUCTOS),
      fetch("http://localhost:4000/api/usuarios/obtenerProdMasVendido"),
      fetch("http://localhost:4000/api/usuarios/obtenerCantidadTickets"),
      fetch("http://localhost:4000/api/usuarios")
    ]);

    const [dataProd, dataVendido, dataVentas, dataUsers] = await Promise.all([
      prodRes.json(),
      vendidoRes.json(),
      ventasRes.json(),
      usersRes.json()
    ]);

    if (!dataProd.ok || !dataProd.productos?.length)
      throw new Error("No hay productos disponibles.");

    const productos = dataProd.productos;
    const promedioPrecio =
      productos.reduce((sum, p) => sum + (p.precio || 0), 0) / productos.length;
    const prodMasCaro = productos.reduce((a, b) => (a.precio > b.precio ? a : b));
    const prodMasBarato = productos.reduce((a, b) => (a.precio < b.precio ? a : b));

    let prodMasVendido = "Sin ventas registradas";
    let cantProdMasVendido = 0;
    if (dataVendido.ok && dataVendido.productoMasVendido) {
      const { idProducto, totalVendido } = dataVendido.productoMasVendido;
      const encontrado = productos.find(p => p._id === idProducto);
      if (encontrado) prodMasVendido = encontrado.nombre;
      cantProdMasVendido = totalVendido;
    }

    const totalVentas = dataVentas.ok ? dataVentas.totalTickets : 0;
    const cantidadUsuarios = dataUsers.ok && dataUsers.usuarios
      ? dataUsers.usuarios.length
      : 0;

    const stats = [
      { titulo: "Precio promedio", valor: `$${promedioPrecio.toFixed(2)}` },
      { titulo: "Producto más caro", valor: `${prodMasCaro.nombre} ($${prodMasCaro.precio})` },
      { titulo: "Producto más barato", valor: `${prodMasBarato.nombre} ($${prodMasBarato.precio})` },
      { titulo: "Producto más vendido", valor: `${prodMasVendido} (${cantProdMasVendido} ventas)` },
      { titulo: "Total de ventas", valor: `${totalVentas}` },
      { titulo: "Cantidad de usuarios", valor: `${cantidadUsuarios}` }
    ];

    contenedor.innerHTML = `
      <div class="row g-3 mt-3 stats-container justify-content-center">
        ${stats.map(stat => `
          <div class="col-md-4">
            <div class="stat-card">
              <h6 class="stat-title">${stat.titulo}</h6>
              <p class="stat-value">${stat.valor}</p>
            </div>
          </div>`).join('')}
      </div>`;
  } catch (error) {
    console.error("❌ Error al cargar estadísticas:", error);
    contenedor.innerHTML = `<p style="color:red; font-weight:bold;">Error: ${error.message}</p>`;
  }
}

// ==========================================
// LOGOUT
// ==========================================
function inicializarLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("adminLogeado");
      window.location.href = "../pages/Login-admin.html";
    });
  }
}
