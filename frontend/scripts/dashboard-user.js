// PANEL PARA  USUARIOS
//
// Funcionalidad:
// - Carga y muestra productos activos desde la API en tarjetas dinámicas.
// - Permite filtrar productos por categoría, tipo de mascota y tamaño.
// - Normaliza textos para evitar problemas con mayúsculas o acentos.
// - Maneja el carrito de compras en localStorage, sumando cantidad si el producto ya existe.
// - Muestra stock disponible y deshabilita botón si no hay stock.
// - Maneja logout de usuario y redirección a login.
// - Muestra mensajes de error cuando falla la carga de productos.

const API_URL = "http://localhost:4000/api/productos";

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  inicializarLogout();
  inicializarFiltros();
});

// Variables de filtros seleccionados
let filtroCategoria = "todos";
let filtroTipoMascota = "todos";
let filtroTamano = "todos";

// Función para normalizar textos 
function normalizar(texto) {
  return texto?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* ==========================================
   CARGAR PRODUCTOS
========================================== */
async function cargarProductos() {
  const contenedor = document.getElementById("espacios-populares");
  contenedor.innerHTML = `<p class="loading">Cargando productos...</p>`;

  try {
    const params = new URLSearchParams();
    if (filtroCategoria !== "todos") params.append("categoria", filtroCategoria);
    if (filtroTipoMascota !== "todos") params.append("tipo_mascota", filtroTipoMascota);
    if (filtroTamano !== "todos") params.append("tamano", filtroTamano);
    params.append("activo", "true"); // Solo productos activos

    const respuesta = await fetch(`${API_URL}?${params.toString()}`);
    const data = await respuesta.json();

    if (!data.ok) throw new Error("Error al obtener productos");

    const productos = data.productos || [];
    contenedor.innerHTML = ""; // Limpia antes de renderizar

    if (productos.length === 0) {
      contenedor.innerHTML = `<p>No hay productos disponibles.</p>`;
      return;
    }

    productos.forEach((producto) => {
      const coincideCategoria =
        filtroCategoria === "todos" || normalizar(producto.categoria) === normalizar(filtroCategoria);
      const coincideTipo =
        filtroTipoMascota === "todos" || normalizar(producto.tipo_mascota) === normalizar(filtroTipoMascota);
      const coincideTamano =
        filtroTamano === "todos" || normalizar(producto.tamano) === normalizar(filtroTamano);

      if (!coincideCategoria || !coincideTipo || !coincideTamano) return;

      const card = document.createElement("div");
      card.classList.add("property-card");

      const imagen = producto.urls?.[0]
        ? `http://localhost:4000${producto.urls[0]}`
        : "../imagenes/no-image.png";

      card.innerHTML = `
        <div class="property-image">
          <img src="${imagen}" alt="${producto.nombre}" loading="lazy">
        </div>
        <div class="property-info">
          <h2 class="property-title">${producto.nombre}</h2>
          <p class="property-price">Precio: $${producto.precio.toLocaleString()}</p>
          <p class="property-stock ${producto.stock > 0 ? "en-stock" : "sin-stock"}">
            ${producto.stock > 0 ? "Stock: " + producto.stock : "Sin stock"}
          </p>
          <p class="property-brand">Marca: ${producto.marca}</p>
          <p class="property-size">Tamaño: ${producto.tamano || "N/A"}</p>
          <button class="agregar-carrito-btn" ${producto.stock <= 0 ? "disabled" : ""}>
            <i class="fas fa-cart-plus"></i> Agregar al carrito
          </button>
        </div>
      `;

      card.querySelector(".agregar-carrito-btn").addEventListener("click", () => {
        agregarAlCarrito(producto, imagen);
      });

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    contenedor.innerHTML = `<p style="color:red;">Error al cargar productos. Intenta más tarde.</p>`;
  }
}

/* ==========================================
   AGREGAR PRODUCTO AL CARRITO
========================================== */
function agregarAlCarrito(producto, imagen) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const existente = carrito.find((item) => item._id === producto._id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      _id: producto._id,
      nombre: producto.nombre,
      marca: producto.marca,
      precio: producto.precio,
      imagen: imagen,
      cantidad: 1,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`"${producto.nombre}" agregado al carrito`);
}

/* ==========================================
   LOGOUT
========================================== */
function inicializarLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      localStorage.removeItem("usuarioLoggeado");
      window.location.href = "../pages/login-user.html";
    });
  }
}

/* ==========================================
   FILTROS
========================================== */
function inicializarFiltros() {
  const btnCategoria = document.querySelectorAll(".filter-categoria-btn");
  const btnTipo = document.querySelectorAll(".filter-mascota-btn");
  const btnTamano = document.querySelectorAll(".filter-tamaño-btn");

  // Filtro categoría
  btnCategoria.forEach(btn => {
    btn.addEventListener("click", () => {
      btnCategoria.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      filtroCategoria = btn.dataset.categoria;
      cargarProductos();
    });
  });

  // Filtro tipo de mascota
  btnTipo.forEach(btn => {
    btn.addEventListener("click", () => {
      btnTipo.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      filtroTipoMascota = btn.dataset.mascota;
      cargarProductos();
    });
  });

  // Filtro tamaño
  btnTamano.forEach(btn => {
    btn.addEventListener("click", () => {
      btnTamano.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      filtroTamano = btn.dataset["tamaño"]; 
      cargarProductos();
    });
  });
}

