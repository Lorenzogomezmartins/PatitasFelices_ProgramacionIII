/* ==========================================
   DASHBOARD ADMIN - PRODUCTOS Y USUARIOS
========================================== */
const API_PRODUCTOS = "http://localhost:4000/api/productos";
const API_USUARIOS = "http://localhost:4000/api/usuarios";

document.addEventListener("DOMContentLoaded", () => {
  cargarProductosAdmin();
  cargarUsuarios();
  cargarAdmins();

  // Botón Agregar producto
  const btnAgregarProducto = document.querySelector("#productos #btnAgregar");
  if (btnAgregarProducto) btnAgregarProducto.addEventListener("click", crearProducto);

  // Manejo de imagen
  const inputFoto = document.getElementById("inputFoto");
  if (inputFoto) inputFoto.addEventListener("change", handleImageUpload);
});

/* ==========================================
   CARGAR PRODUCTOS
========================================== */
async function cargarProductosAdmin() {
  const contenedor = document.getElementById("divListado");
  if (!contenedor) return console.error("No existe el contenedor 'divListado'");

  contenedor.innerHTML = `<p>Cargando productos...</p>`;

  try {
    const res = await fetch(API_PRODUCTOS);
    const data = await res.json();

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
          <th>Código</th>
          <th>Nombre</th>
          <th>Marca</th>
          <th>Categoría</th>
          <th>Tamaño</th>
          <th>Tipo mascota</th>
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
        <td>${prod.codigo}</td>
        <td>${prod.nombre}</td>
        <td>${prod.marca || "-"}</td>
        <td>${prod.categoria || "-"}</td>
        <td>${prod.tamaño || "-"}</td>
        <td>${prod.tipo_mascota || "-"}</td>
        <td>$${prod.precio?.toLocaleString() || "-"}</td>
        <td>${prod.stock ?? "-"}</td>
        <td>${prod.activo ? "Sí" : "No"}</td>
        <td>
          <div class="d-flex justify-content-center gap-1">
            <button class="btn btn-sm btn-primary editar-btn"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger eliminar-btn"><i class="bi bi-trash"></i></button>
          </div>
        </td>
      `;
      tr.querySelector(".editar-btn").addEventListener("click", () => abrirFormularioEdicion(prod));
      tr.querySelector(".eliminar-btn").addEventListener("click", () => eliminarProducto(prod.codigo));
      tbody.appendChild(tr);
    });

    contenedor.innerHTML = "";
    contenedor.appendChild(table);

  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
    contenedor.innerHTML = `<p style="color:red;">❌ Error al cargar productos: ${error.message}</p>`;
  }
}

/* ==========================================
   CREAR PRODUCTO (sin Multer, usando Base64)
========================================== */
async function crearProducto() {
  const codigo = document.getElementById("inputCodigoProducto").value.trim();
  const nombre = document.getElementById("inputNombreProducto")?.value.trim();
  const marca = document.getElementById("inputMarca")?.value.trim();
  const categoria = document.getElementById("inputCategoria")?.value;
  const tamaño = document.getElementById("inputTamaño")?.value;
  const tipo_mascota = document.getElementById("inputTipoDeMascota")?.value;
  const precio = parseFloat(document.getElementById("inputPrecio")?.value);
  const stock = parseInt(document.getElementById("inputStock")?.value) || 0;
  const activo = document.getElementById("inputActivo")?.checked ?? true;

  if (!codigo || !nombre) {
    mostrarMensaje("⚠️ Código y Nombre son obligatorios", "error");
    return;
  }

  // Convertimos la imagen a Base64
  const inputFoto = document.getElementById("inputFoto");
  let fotoBase64 = null;
  if (inputFoto?.files?.length > 0) {
    fotoBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject("Error al leer la imagen");
      reader.readAsDataURL(inputFoto.files[0]);
    });
  }

  if (!fotoBase64) {
    mostrarMensaje("⚠️ Debe incluir una imagen del producto", "error");
    return;
  }

  // JSON completo a enviar al backend
  const datos = {
    codigo, nombre, marca, categoria, tamaño, tipo_mascota,
    precio, stock, activo, urls: [fotoBase64]
  };

  try {
    const res = await fetch(API_PRODUCTOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || "Error al crear producto");

    mostrarMensaje(`✅ Producto ${codigo} agregado correctamente`, "success");
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
async function eliminarProducto(codigo) {
  if (!codigo) return mostrarMensaje("⚠️ Código inválido", "error");
  if (!confirm("¿Desea eliminar este producto?")) return;

  try {
    const res = await fetch(`${API_PRODUCTOS}/${codigo}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok || !data.ok) throw new Error(data.error || "Error al eliminar");
    mostrarMensaje(`✅ Producto ${codigo} eliminado`, "success");
    cargarProductosAdmin();
  } catch (error) {
    console.error(error);
    mostrarMensaje(`❌ ${error.message}`, "error");
  }
}

/* ==========================================
   USUARIOS
========================================== */
async function cargarUsuarios() {
  const contenedor = document.getElementById("divListadoUsuarios");
  if (!contenedor) return;

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
   FORMULARIO EDICIÓN
========================================== */
function abrirFormularioEdicion(producto) {
  document.getElementById("inputCodigoProducto").value = producto.codigo;
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

/**
 * Carga los administradores desde el backend
 */
async function cargarAdmins() {
  const contenedor = document.getElementById("divListadoAdmins");
  if (!contenedor) return console.error("No existe el contenedor 'divListadoAdmins'");

  contenedor.innerHTML = `<p>Cargando administradores...</p>`;

  try {
    const data = await apiClient.getAdmins(); // usamos tu apiClient

    if (!data.ok || !data.usuarios || data.usuarios.length === 0) {
      contenedor.innerHTML = `<p style="color:red;">No hay administradores disponibles.</p>`;
      return;
    }

    const table = document.createElement("table");
    table.className = "table table-striped table-hover table-sm";
    table.innerHTML = `
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    data.usuarios.forEach(admin => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${admin._id}</td>
        <td>${admin.nombre}</td>
        <td>${admin.email}</td>
        <td>${admin.rol}</td>
      `;
      tbody.appendChild(tr);
    });

    contenedor.innerHTML = "";
    contenedor.appendChild(table);

  } catch (error) {
    console.error("❌ Error al cargar administradores:", error);
    contenedor.innerHTML = `<p style="color:red;">❌ Error al cargar administradores: ${error.message}</p>`;
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
