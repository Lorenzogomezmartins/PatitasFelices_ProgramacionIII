const API_PRODUCTOS = "http://localhost:4000/api/productos";
const API_USUARIOS = "http://localhost:4000/api/usuarios";

document.addEventListener("DOMContentLoaded", () => {
  cargarProductosAdmin();
  cargarUsuarios();
});

/* ==========================================
   PRODUCTOS - Listado en tabla con Acciones
========================================== */
async function cargarProductosAdmin() {
  const contenedor = document.getElementById("divListado");
  if (!contenedor) return console.error("❌ No existe el contenedor 'divListado'");

  contenedor.innerHTML = `<p>Cargando productos...</p>`;

  try {
    const response = await fetch(API_PRODUCTOS);
    const data = await response.json();

    if (!data.ok) throw new Error(data.message || "Error al obtener productos");
    if (!data.productos || data.productos.length === 0) {
      contenedor.innerHTML = `<p style="color:red;">No hay productos disponibles.</p>`;
      return;
    }

    const table = document.createElement("table");
    table.className = "table table-striped table-hover table-sm";
    table.innerHTML = `
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Marca</th>
          <th>Categoría</th>
          <th>Mascota</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Activo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    data.productos.forEach(prod => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod._id}</td>
        <td>${prod.nombre}</td>
        <td>${prod.marca}</td>
        <td>${prod.categoria}</td>
        <td>${prod.tipo_mascota || "-"}</td>
        <td>$${prod.precio?.toLocaleString() || "-"}</td>
        <td>${prod.stock ?? "-"}</td>
        <td>${prod.activo ? "Sí" : "No"}</td>
        <td>
          <button class="btn btn-sm btn-primary editar-btn" title="Editar producto">
            <i class="bi bi-pencil"></i>
          </button>
        </td>
      `;
      // Llamar al formulario al hacer clic
      tr.querySelector(".editar-btn").addEventListener("click", () => abrirFormularioEdicion(prod));
      tbody.appendChild(tr);
    });

    contenedor.innerHTML = "";
    contenedor.appendChild(table);

  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
    contenedor.innerHTML = `<p style="color:red; font-weight:bold;">❌ Error al cargar productos: ${error.message}</p>`;
  }
}

/* ==========================================
   USUARIOS - Listado en tabla
========================================== */
async function cargarUsuarios() {
  const contenedor = document.getElementById("divListadoUsuarios");
  if (!contenedor) return console.error("❌ No existe el contenedor 'divListadoUsuarios'");

  contenedor.innerHTML = `<p>Cargando usuarios...</p>`;

  try {
    const response = await fetch(API_USUARIOS);
    const data = await response.json();

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

/* ==========================================
   FORMULARIO - Abrir y llenar datos del producto
========================================== */
function abrirFormularioEdicion(producto) {
  document.getElementById("productoId").value = producto._id;
  document.getElementById("productoNombre").value = producto.nombre;
  document.getElementById("productoMarca").value = producto.marca;
  document.getElementById("productoCategoria").value = producto.categoria;
  document.getElementById("productoMascota").value = producto.tipo_mascota || "";
  document.getElementById("productoPrecio").value = producto.precio || 0;
  document.getElementById("productoStock").value = producto.stock ?? 0;
  document.getElementById("productoActivo").checked = producto.activo;

  // Mostrar el formulario si estaba oculto
  document.getElementById("formProducto").scrollIntoView({ behavior: "smooth" });
}
