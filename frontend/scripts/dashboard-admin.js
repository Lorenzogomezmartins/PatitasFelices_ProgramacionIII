/* ========================================== 
   DASHBOARD ADMIN - PRODUCTOS
========================================== */
const API_PRODUCTOS = "http://localhost:4000/api/productos";

// Variables globales de filtros
let filtroCategoria = "todos";
let filtroTipoMascota = "todos";
let filtroTamano = "todos";

// Función para normalizar textos (minúscula y sin tildes)
function normalizar(texto) {
  return texto?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

document.addEventListener("DOMContentLoaded", () => {
  cargarProductosAdmin();
  cargarTickets();
  inicializarLogout();
  cargarEstadisticas();

  // Botón Agregar producto
  const btnAgregarProducto = document.getElementById("btnAgregarProducto");
  if (btnAgregarProducto) {
    btnAgregarProducto.type = "button";
    btnAgregarProducto.addEventListener("click", async function(event) {
      event.preventDefault();
      await crearProducto();
    });
  }

  // Manejo de imagen
  const inputFoto = document.getElementById("inputFoto");
  if (inputFoto) inputFoto.addEventListener("change", handleImageUpload);

  // Filtros
  inicializarFiltrosSelects();

  // Búsqueda por código
  const inputBuscarCodigo = document.getElementById("buscarCodigo");
  if (inputBuscarCodigo) {
    inputBuscarCodigo.addEventListener("input", () => cargarProductosAdmin());
  }

  // Botón Ver más tickets
  const btnVerMas = document.getElementById("btnVerMasTickets");
  if (btnVerMas) btnVerMas.addEventListener("click", cargarTickets);
});

/* ==========================================
   INICIALIZAR FILTROS (SELECTS)
========================================== */
function inicializarFiltrosSelects() {
  const selectCategoria = document.getElementById("filtroCategoria");
  const selectMascota = document.getElementById("filtroMascota");
  const selectTamano = document.getElementById("filtroTamaño");
  const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");

  if (selectCategoria) selectCategoria.addEventListener("change", () => { filtroCategoria = selectCategoria.value; cargarProductosAdmin(); });
  if (selectMascota) selectMascota.addEventListener("change", () => { filtroTipoMascota = selectMascota.value; cargarProductosAdmin(); });
  if (selectTamano) selectTamano.addEventListener("change", () => { filtroTamano = selectTamano.value; cargarProductosAdmin(); });

  if (btnLimpiarFiltros) {
    btnLimpiarFiltros.addEventListener("click", () => {
      filtroCategoria = "todos"; filtroTipoMascota = "todos"; filtroTamano = "todos";
      if (selectCategoria) selectCategoria.value = "todos";
      if (selectMascota) selectMascota.value = "todos";
      if (selectTamano) selectTamano.value = "todos";
      cargarProductosAdmin();
    });
  }
}

/* ==========================================
   CARGAR PRODUCTOS
========================================== */
async function cargarProductosAdmin() {
  const contenedor = document.getElementById("divListado");
  if (!contenedor) return console.error("❌ No existe el contenedor 'divListado'");

  contenedor.innerHTML = `<p>Cargando productos...</p>`;

  try {
    const response = await fetch(API_PRODUCTOS);
    const data = await response.json();
    if (!data.ok) throw new Error(data.message || "Error al obtener productos");
    if (!data.productos || data.productos.length === 0) { contenedor.innerHTML = `<p style="color:red;">No hay productos disponibles.</p>`; return; }

    const codigoBusqueda = document.getElementById("buscarCodigo")?.value.trim().toLowerCase();

    const productosFiltrados = data.productos.filter(prod => {
      const catOk = filtroCategoria === "todos" || normalizar(prod.categoria) === normalizar(filtroCategoria);
      const tipoOk = filtroTipoMascota === "todos" || normalizar(prod.tipo_mascota) === normalizar(filtroTipoMascota);
      const tamOk = filtroTamano === "todos" || normalizar(prod.tamano) === normalizar(filtroTamano);
      const codigoOk = !codigoBusqueda || prod._id.toLowerCase().includes(codigoBusqueda);
      return catOk && tipoOk && tamOk && codigoOk;
    });

    if (productosFiltrados.length === 0) {
      contenedor.innerHTML = `<p style="color:red;">No se encontró el producto con ese código.</p>`;
      return;
    }

    const table = document.createElement("table");
    table.className = "table table-striped table-hover table-sm";
    table.innerHTML = `
      <thead class="table-dark">
        <tr>
          <th>ID</th><th>Nombre</th><th>Marca</th><th>Categoría</th>
          <th>Mascota</th><th>Tamaño</th><th>Precio</th><th>Stock</th>
          <th>Activo</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    productosFiltrados.forEach(prod => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod._id}</td><td>${prod.nombre}</td><td>${prod.marca || "-"}</td>
        <td>${prod.categoria}</td><td>${prod.tipo_mascota || "-"}</td><td>${prod.tamano || "-"}</td>
        <td>$${prod.precio?.toLocaleString() || "-"}</td><td>${prod.stock ?? "-"}</td>
        <td>${prod.activo ? "Sí" : "No"}</td>
        <td>
          <button class="btn btn-sm btn-primary editar-btn"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger eliminar-btn"><i class="bi bi-trash"></i></button>
        </td>
      `;
      tr.querySelector(".editar-btn").addEventListener("click", () => abrirFormularioEdicion(prod));
      tr.querySelector(".eliminar-btn").addEventListener("click", () => eliminarProducto(prod._id));
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
   CREAR PRODUCTO
========================================== */
async function crearProducto() {
  const _id = document.getElementById("inputCodigoProducto")?.value.trim();
  const nombre = document.getElementById("inputNombreProducto")?.value.trim();
  const marca = document.getElementById("inputMarca")?.value.trim();
  const categoria = document.getElementById("inputCategoria")?.value?.trim();
  const tamano = document.getElementById("inputTamaño")?.value?.trim();
  const tipo_mascota = document.getElementById("inputTipoDeMascota")?.value?.trim();
  const precioStr = document.getElementById("inputPrecio")?.value;
  const stockStr = document.getElementById("inputStock")?.value;

  // Validación de campos obligatorios
  if (!_id || !nombre || !marca || !categoria || !tamano || !tipo_mascota) {
    mostrarMensaje("⚠️ Todos los campos son obligatorios", "error");
    return;
  }

  // Parsear valores numéricos
  const precio = parseFloat(precioStr);
  const stock = parseInt(stockStr) || 0;
  if (isNaN(precio)) {
    mostrarMensaje("⚠️ El precio debe ser un número válido", "error");
    return;
  }

  // Checkbox activo
  const activoInput = document.getElementById("inputActivo");
  const activo = activoInput?.checked ?? true;

  // Validar que se haya seleccionado una imagen
  const inputFoto = document.getElementById("inputFoto");
  if (!inputFoto?.files?.length) {
    mostrarMensaje("⚠️ Debe seleccionar una imagen", "error");
    return;
  }

  // Preparar FormData
  const formData = new FormData();
  formData.append("_id", _id);
  formData.append("nombre", nombre);
  formData.append("marca", marca);
  formData.append("categoria", categoria);
  formData.append("tamano", tamano);
  formData.append("tipo_mascota", tipo_mascota);
  formData.append("precio", precio.toString());
  formData.append("stock", stock.toString());
  formData.append("activo", activo.toString());
  formData.append("url", inputFoto.files[0]);

  // Enviar al backend
  try {
    const res = await fetch(API_PRODUCTOS, { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || "Error al crear producto");

    mostrarMensaje("✅ Producto agregado correctamente", "success");
    document.getElementById("frmFormulario").reset();
    removeImage();
    cargarProductosAdmin();
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    mostrarMensaje(`❌ ${error.message}`, "error");
  }
}

/* ==========================================
   ELIMINAR PRODUCTO
========================================== */
async function eliminarProducto(id) {
  if (!id) return mostrarMensaje("⚠️ ID inválido", "error");
  if (!confirm("¿Desea eliminar este producto?")) return;

  try {
    const res = await fetch(`${API_PRODUCTOS}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || "Error al eliminar producto");

    mostrarMensaje("✅ Producto eliminado correctamente", "success");
    cargarProductosAdmin();
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    mostrarMensaje(`❌ ${error.message}`, "error");
  }
}

/* ==========================================
   FORMULARIO EDICIÓN
========================================== */
function abrirFormularioEdicion(producto) {
  document.getElementById("inputCodigoProducto").value = producto._id; // CORREGIDO
  document.getElementById("inputNombreProducto").value = producto.nombre;
  document.getElementById("inputMarca").value = producto.marca || "";
  document.getElementById("inputCategoria").value = producto.categoria || "";
  document.getElementById("inputTamaño").value = producto.tamaño || "";
  document.getElementById("inputTipoDeMascota").value = producto.tipo_mascota || "";
  document.getElementById("inputPrecio").value = producto.precio || 0;
  document.getElementById("inputStock").value = producto.stock ?? 0;
  document.getElementById("inputActivo").checked = producto.activo ?? true;

  if (producto.urls?.length > 0) {
    const img = document.getElementById("foto_img");
    img.src = producto.urls[0];
    img.style.display = "block";
    document.getElementById("upload-placeholder").style.display = "none";
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
  div.style.cursor = "pointer";
  div.addEventListener("click", () => div.remove());
  document.body.appendChild(div);
}

/* ==========================================
   MANEJO DE IMAGEN
========================================== */
function handleImageUpload(event) {
  const file = event.target.files[0];
  const img = document.getElementById("foto_img");
  const placeholder = document.getElementById("upload-placeholder");

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      img.src = e.target.result;
      img.style.display = "block";
      placeholder.style.display = "none";
    };
    reader.readAsDataURL(file);
  } else {
    removeImage();
  }
}

function removeImage() {
  const img = document.getElementById("foto_img");
  const input = document.getElementById("inputFoto");
  const placeholder = document.getElementById("upload-placeholder");

  img.src = "";
  img.style.display = "none";
  input.value = "";
  placeholder.style.display = "block";
}

/* ==========================================
   Tickets
========================================== */
let currentPage = 1;

async function cargarTickets() {
  const contenedor = document.getElementById("divListadoTickets");
  const btnVerMas = document.getElementById("btnVerMasTickets");

  if (!contenedor) return console.error("No existe el contenedor 'divListadoTickets'");

  if (currentPage === 1) contenedor.innerHTML = `<p>Cargando tickets...</p>`;

  try {
    const response = await fetch(`http://localhost:4000/api/usuarios/obtenerTickets?page=${currentPage}`);
    const data = await response.json();

    if (!data.ok || !data.tickets || data.tickets.length === 0) {
      if (currentPage === 1) contenedor.innerHTML = `<p style="color:red;">No hay tickets registrados.</p>`;
      else if (btnVerMas) { btnVerMas.disabled = true; btnVerMas.textContent = "No hay más tickets"; }
      return;
    }

    if (currentPage === 1) {
      contenedor.innerHTML = "";
      const table = document.createElement("table");
      table.id = "tablaTickets";
      table.className = "table table-striped table-hover table-sm";
      table.innerHTML = `
        <thead class="table-dark">
          <tr>
            <th>Usuario</th><th>Fecha de compra</th><th>Productos</th><th>Total</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      contenedor.appendChild(table);
    }

    const tbody = document.querySelector("#tablaTickets tbody");

    data.tickets.forEach(ticket => {
      const tr = document.createElement("tr");
      const usuario = `${ticket.nombreUsuario} ${ticket.apellidoUsuario}`;
      const fecha = new Date(ticket.fechaDeCompra).toLocaleString();
      const total = `${ticket.total}`;
      const productos = ticket.productos
        .map(p => `${p.prod?._id || "?"} (x${p.prod?.cantidad || 0})`)
        .join(", ");
      tr.innerHTML = `<td>${usuario}</td><td>${fecha}</td><td>${productos}</td><td>${total}</td>`;
      tbody.appendChild(tr);
    });

    currentPage++;

  } catch (error) {
    console.error("Error al cargar tickets:", error);
    contenedor.innerHTML = `<p style="color:red; font-weight:bold;">Error al cargar tickets: ${error.message}</p>`;
  }
}

/* ==========================================
   ESTADÍSTICAS DE PRODUCTOS Y USUARIOS
========================================== */
async function cargarEstadisticas() {
  const contenedor = document.getElementById("estadisticas");
  if (!contenedor) return;

  contenedor.innerHTML = `<p>Cargando estadísticas...</p>`;

  try {
    const responseProd = await fetch(API_PRODUCTOS);
    const dataProd = await responseProd.json();
    if (!dataProd.ok || !dataProd.productos) throw new Error(dataProd.message || "Error al obtener productos");
    const productos = dataProd.productos;
    if (productos.length === 0) {
      contenedor.innerHTML = `<p style="color:red;">No hay productos para calcular estadísticas.</p>`;
      return;
    }

    const totalPrecios = productos.reduce((sum, p) => sum + (p.precio || 0), 0);
    const promedioPrecio = totalPrecios / productos.length;
    const prodMasCaro = productos.reduce((max, p) => p.precio > max.precio ? p : max, productos[0]);
    const prodMasBarato = productos.reduce((min, p) => p.precio < min.precio ? p : min, productos[0]);
    const prodMasVendido = productos.reduce((max, p) => (p.vendidos || 0) > (max.vendidos || 0) ? p : max, productos[0]);
    const totalVentas = productos.reduce((sum, p) => sum + (p.vendidos || 0), 0);

    const responseUsers = await fetch("http://localhost:4000/api/usuarios");
    const dataUsers = await responseUsers.json();
    const cantidadUsuarios = dataUsers.ok && dataUsers.usuarios ? dataUsers.usuarios.length : 0;

    const stats = [
      { titulo: "Precio promedio", valor: `$${promedioPrecio.toFixed(2)}` },
      { titulo: "Producto más caro", valor: `${prodMasCaro.nombre} ($${prodMasCaro.precio?.toLocaleString()})` },
      { titulo: "Producto más barato", valor: `${prodMasBarato.nombre} ($${prodMasBarato.precio?.toLocaleString()})` },
      { titulo: "Más vendido", valor: `${prodMasVendido.nombre} (${prodMasVendido.vendidos || 0} ventas)` },
      { titulo: "Total de ventas", valor: `${totalVentas}` },
      { titulo: "Cantidad de usuarios", valor: `${cantidadUsuarios}` }
    ];

    contenedor.innerHTML = `
      <div class="row g-3 mt-3">
        ${stats.map(stat => `
          <div class="col-md-4">
            <div style="
              background-color: #b3814d;
              color: white;
              border-radius: 12px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
              padding: 20px;
              text-align: center;
            ">
              <h6 style="font-weight:600; margin-bottom:8px;">${stat.titulo}</h6>
              <p style="font-size:1.2rem; margin:0;">${stat.valor}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;

  } catch (error) {
    console.error("❌ Error al cargar estadísticas:", error);
    contenedor.innerHTML = `<p style="color:red; font-weight:bold;">Error al cargar estadísticas: ${error.message}</p>`;
  }
}

/* ==========================================
   LOGOUT
========================================== */
function inicializarLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminLogeado");
    window.location.href = "../pages/Login-admin.html";
  });
}
