const API_URL = "http://localhost:4000/api/productos";

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});

/**
 * Obtiene los productos del backend y los muestra en la grilla
 */
async function cargarProductos() {
  const contenedor = document.getElementById("espacios-populares");

  // Mensaje mientras se cargan los productos
  contenedor.innerHTML = `<p class="loading">Cargando productos...</p>`;

  try {
    const respuesta = await fetch(API_URL);
    const data = await respuesta.json();

    if (!data.ok) throw new Error("Error al obtener productos");

    contenedor.innerHTML = "";

    if (data.productos.length === 0) {
      contenedor.innerHTML = `<p>No hay productos disponibles.</p>`;
      return;
    }

    data.productos.forEach((producto) => {
      const card = document.createElement("div");
      card.classList.add("property-card");

      // 🔹 Imagen del producto
      const imagen = producto.urls?.[0]
        ? `http://localhost:4000${producto.urls[0]}`
        : "../imagenes/no-image.png";

      card.innerHTML = `
        <div class="property-card-inner">
          <div class="property-image">
            <img src="${imagen}" alt="${producto.nombre}" loading="lazy">
          </div>
          <div class="property-info">
            <h2 class="property-title">${producto.nombre}</h2>
            <p class="property-brand"><strong>Marca:</strong> ${producto.marca}</p>
            <p class="property-category"><strong>Categoría:</strong> ${producto.categoria}</p>
            <p class="property-type"><strong>Mascota:</strong> ${producto.tipo_mascota}</p>
            <p class="property-price"><strong>Precio:</strong> $${producto.precio.toLocaleString()}</p>
            <p class="property-stock ${producto.stock > 0 ? 'en-stock' : 'sin-stock'}">
              ${producto.stock > 0 ? 'Stock disponible: ' + producto.stock : 'Sin stock'}
            </p>
          </div>
        </div>
      `;

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    contenedor.innerHTML = `<p style="color:red;">Error al cargar productos. Intenta más tarde.</p>`;
  }
}