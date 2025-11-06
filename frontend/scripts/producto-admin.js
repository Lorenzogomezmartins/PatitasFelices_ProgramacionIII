// PANEL PARA ADMINISTRADORES(manejo de productos)
//
// Funcionalidad:
// - Maneja la carga, filtrado, creación, edición y eliminación
//   de productos desde la interfaz de administrador.
// - Maneja imagen de producto con vista previa y eliminación.
const API_PRODUCTOS = "http://localhost:4000/api/productos";


document.addEventListener("DOMContentLoaded", () => {
  // Cargar productos en el panel admin
  cargarProductosAdmin();

  // Botón Agregar producto
  const btnAgregarProducto = document.getElementById("btnAgregarProducto");
  if (btnAgregarProducto) {
    btnAgregarProducto.type = "button";
    btnAgregarProducto.addEventListener("click", async function(event) {
      event.preventDefault();
      await crearProducto();
    });
  }

  // Botón modificar producto
  const btnActualizarProducto = document.getElementById("btnModificarProd");
  if (btnActualizarProducto) {
    btnActualizarProducto.type = "button";
    btnActualizarProducto.addEventListener("click", async function(event) {
      event.preventDefault();
      await actualizarProducto();
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

});


// Función para normalizar textos 
function normalizar(texto) {
  return texto?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Funcion para cargar y mostrar productos en el panel admin
async function cargarProductosAdmin() {
  const contenedor = document.getElementById("divListadoProd");
  if (!contenedor) return console.error("❌ No existe el contenedor 'divListadoProd'");

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

// Crear producto
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
    document.getElementById("frmFormProd").reset();
    removeImage();
    cargarProductosAdmin();
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    mostrarMensaje(`❌ ${error.message}`, "error");
  }
}

// Eliminar producto
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

//actualizar producto
async function actualizarProducto() {
  try {
    const _id = document.getElementById("inputCodigoProducto")?.value.trim();
    const nombre = document.getElementById("inputNombreProducto")?.value.trim();
    const marca = document.getElementById("inputMarca")?.value.trim();
    const categoria = document.getElementById("inputCategoria")?.value?.trim();
    const tamano = document.getElementById("inputTamaño")?.value?.trim();
    const tipo_mascota = document.getElementById("inputTipoDeMascota")?.value?.trim();
    const precioStr = document.getElementById("inputPrecio")?.value;
    const stockStr = document.getElementById("inputStock")?.value;
    const activo = document.getElementById("inputActivo")?.checked ?? true;
    const inputFoto = document.getElementById("inputFoto");

    if (!_id) {
      mostrarMensaje("⚠️ Debe especificar el código del producto a actualizar", "error");
      return;
    }

    console.log("🟡 Ejecutando actualizarProducto()");

    const precio = parseFloat(precioStr);
    const stock = parseInt(stockStr) || 0;

    // Construir FormData solo con los campos modificados
    const formData = new FormData();
    if (nombre) formData.append("nombre", nombre);
    if (marca) formData.append("marca", marca);
    if (categoria) formData.append("categoria", categoria);
    if (tamano) formData.append("tamano", tamano);
    if (tipo_mascota) formData.append("tipo_mascota", tipo_mascota);
    if (!isNaN(precio)) formData.append("precio", precio);
    if (!isNaN(stock)) formData.append("stock", stock);
    formData.append("activo", activo);
    if (inputFoto?.files?.length > 0) {
      formData.append("url", inputFoto.files[0]);
    }

    // Debug
    for (let [key, value] of formData.entries()) {
      console.log("FormData:", key, value);
    }

    const res = await fetch(`http://localhost:4000/api/productos/modificar/${_id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.mensaje || "Error al actualizar producto");

    mostrarMensaje("✅ Producto actualizado correctamente", "success");
    document.getElementById("frmFormProd").reset();
    removeImage();
    cargarProductosAdmin();

  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    mostrarMensaje(`❌ ${error.message}`, "error");
  }
}

// Abrir formulario de edición con datos del producto
function abrirFormularioEdicion(producto) {
  document.getElementById("inputCodigoProducto").value = producto._id; 
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
    const preview = document.getElementById("upload-placeholder");

    // URL completa
    const urlCompleta = `http://localhost:4000${producto.urls[0]}`;

    img.src = urlCompleta;
    img.style.display = "block";

    preview.src = urlCompleta;
    preview.style.display = "block"; 
    document.getElementById("upload-placeholder").style.display = "none";
  }
}

// Manejo de imagen
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


// Variables globales de filtros
let filtroCategoria = "todos";
let filtroTipoMascota = "todos";
let filtroTamano = "todos";

// Filtros
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

// Mensajes
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

  