// =====================
// Modo Oscuro - Persistencia
// =====================
function aplicarModoOscuro() {
  const modoOscuroGuardado = localStorage.getItem("theme") === "dark";
  const root = document.documentElement;
  if (modoOscuroGuardado) {
    root.style.setProperty("--primary-color", "#756446ff");
    root.style.setProperty("--primary-light", "#645a49ff");
    root.style.setProperty("--bg-color", "#000000");
    root.style.setProperty("--text-dark", "#ffffff");
    root.style.setProperty("--text-light", "#cccccc");
    root.style.setProperty("--white", "#000000");
    root.style.setProperty("--gray-border", "#333333");
    root.style.setProperty("--hover-shadow", "0 8px 16px rgba(255,255,255,0.1)");
    document.body.classList.add("dark-mode");
  } else {
    root.style.setProperty("--primary-color", "#b3814d");
    root.style.setProperty("--primary-light", "#b3814d");
    root.style.setProperty("--bg-color", "#e6d3b7");
    root.style.setProperty("--text-dark", "#1f2937");
    root.style.setProperty("--text-light", "#6b7280");
    root.style.setProperty("--white", "#ffffff");
    root.style.setProperty("--gray-border", "#d1d5db");
    root.style.setProperty("--hover-shadow", "0 8px 16px rgba(0, 0, 0, 0.1)");
    document.body.classList.remove("dark-mode");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  aplicarModoOscuro();
  mostrarCarrito();

  document.getElementById("vaciar-carrito-btn").addEventListener("click", () => {
    if (confirm("¿Seguro que quieres vaciar el carrito?")) {
      vaciarCarrito();
    }
  });

  document
    .getElementById("confirmar-compra-btn")
    .addEventListener("click", confirmarCompra);
  document
    .getElementById("cerrar-ticket-btn")
    .addEventListener("click", cerrarTicket);
  document
    .getElementById("descargar-pdf-btn")
    .addEventListener("click", descargarPDF);
});

// =====================
// Funciones de Carrito
// =====================
function obtenerCarrito() {
  const carritoJSON = localStorage.getItem("carrito");
  return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarCarrito() {
  const contenedor = document.getElementById("carrito-contenedor");
  const carrito = obtenerCarrito();
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = `<tr><td colspan="5" style="text-align:center;">El carrito está vacío.</td></tr>`;
    document.getElementById("total-carrito").textContent = "Total: ARS 0";
    document.getElementById("cantidad-items").textContent = "Items: 0";
    return;
  }

  let total = 0;
  let cantidadItems = 0;

  carrito.forEach((item, index) => {
    const precio = Number(item.precio) || 0;
    const cantidad = Number(item.cantidad) || 1;
    total += precio * cantidad;
    cantidadItems += cantidad;

    const fila = document.createElement("tr");
    fila.classList.add("carrito-item");
    fila.innerHTML = `
      <td><img src="${item.imagen}" alt="Producto" class="carrito-img"></td>
      <td>${item.nombre}</td>
      <td>${item.marca}</td>
      <td>ARS ${precio.toFixed(2)}</td>
      <td>
        <input type="number" min="1" value="${cantidad}" class="cantidad-input" data-index="${index}">
      </td>
      <td><button data-index="${index}" class="btn-eliminar">Eliminar</button></td>
    `;
    contenedor.appendChild(fila);
  });

  document.getElementById("total-carrito").textContent = `Total: ARS ${total.toFixed(2)}`;
  document.getElementById("cantidad-items").textContent = `Items: ${cantidadItems}`;

  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.getAttribute("data-index"));
      eliminarDelCarrito(idx);
    });
  });

  document.querySelectorAll(".cantidad-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const idx = parseInt(e.target.getAttribute("data-index"));
      let carrito = obtenerCarrito();
      const nuevaCantidad = Math.max(1, parseInt(e.target.value));
      carrito[idx].cantidad = nuevaCantidad;
      guardarCarrito(carrito);
      mostrarCarrito();
    });
  });
}

function eliminarDelCarrito(index) {
  let carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  mostrarCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  mostrarCarrito();
}

// =====================
// Confirmar Compra (Guarda Ticket en Backend y Muestra Ticket)
// =====================
async function confirmarCompra() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuarioLoggeado"));
  if (!usuario || !usuario._id) {
    alert("No hay un usuario loggeado.");
    return;
  }

  const productos = carrito.map(item => ({
    prod: {
      _id: String(item._id),
      cantidad: Number(item.cantidad)
    }
  }));

  const total = carrito.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad), 0);

  try {
    const respuesta = await fetch(
      `http://localhost:4000/api/usuarios/agregarTicket/${usuario._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productos, total }),
      }
    );

    const data = await respuesta.json();

    if (!data.ok) {
      throw new Error(data.error || "Error al agregar el ticket");
    }

    // Actualizamos los tickets en localStorage
    usuario.tickets = data.tickets;
    localStorage.setItem("usuarioLoggeado", JSON.stringify(usuario));

    // Mostrar ticket en pantalla
    mostrarTicket(usuario, carrito, total);

    // Vaciar carrito
    vaciarCarrito();
    mostrarCarrito();

  } catch (error) {
    console.error("Error al confirmar compra:", error);
    alert("Error al confirmar compra. Intenta nuevamente.");
  }
}

// =====================
// Función para mostrar ticket
// =====================
function mostrarTicket(usuario, carrito, total) {
  const overlay = document.getElementById("overlay");
  const ticket = document.getElementById("ticket");
  const ticketContenido = document.getElementById("ticket-contenido");

  // Fecha actual
  const fecha = new Date().toLocaleString();

  // Construir HTML del ticket
  let html = `
    <p><strong>Nombre:</strong> ${usuario.nombre}</p>
    <p><strong>Fecha:</strong> ${fecha}</p>
    <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr>
          <th style="border-bottom: 1px solid #000;">Producto</th>
          <th style="border-bottom: 1px solid #000;">Cantidad</th>
          <th style="border-bottom: 1px solid #000;">Precio</th>
        </tr>
      </thead>
      <tbody>
  `;

  carrito.forEach(item => {
    html += `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>ARS ${(Number(item.precio) * Number(item.cantidad)).toFixed(2)}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <p style="margin-top:10px;"><strong>Total:</strong> ARS ${total.toFixed(2)}</p>
  `;

  ticketContenido.innerHTML = html;

  // Mostrar overlay y ticket
  overlay.style.display = "block";
  ticket.style.display = "block";
  document.getElementById("descargar-pdf-btn").style.display = "inline-block";
}

// =====================
// Otros
// =====================
function cerrarTicket() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("ticket").style.display = "none";
  location.reload();
}

function descargarPDF() {
  const element = document.getElementById("ticket");

  // Forzar que esté visible temporalmente
  element.style.display = "block";

  html2pdf()
    .set({
      margin: 0.5,
      filename: "ticket_reserva.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    })
    .from(element)
    .save()
    .then(() => {
      // Restaurar display original
      element.style.display = "none";
    });
}



// ====== Botón "Seguir comprando" ======
function volverAlDashboard() {
  window.location.href = "../pages/dashboard-user.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const btnVolver = document.getElementById("btn-volver");
  if (btnVolver) btnVolver.addEventListener("click", volverAlDashboard);
});
