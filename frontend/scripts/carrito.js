// Carrito y Tickets - Dashboard Usuario
//
// Maneja:
// - Modo oscuro con persistencia en localStorage
// - Carrito de compras: agregar, eliminar, modificar cantidades, vaciar
// - Confirmación de compra: envía ticket al backend y muestra ticket
// - Visualización y descarga de ticket en PDF
// - Navegación: botón "Seguir comprando" al dashboard
//
// Dependencias: html2pdf.js para generar PDF



document.addEventListener("DOMContentLoaded", () => {
  // Inicialización
  aplicarModoOscuro();
  mostrarCarrito();
  const usuario = JSON.parse(localStorage.getItem("usuarioLoggeado"));

  if (!usuario) {
    alert("Debes iniciar sesión.");
    window.location.href = "../pages/login-user.html";
    return;
  }
  const btnVaciar = document.getElementById("vaciar-carrito-btn");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      if (confirm("¿Seguro que quieres vaciar el carrito?")) {
        vaciarCarrito();
      }
    });
  }

  const btnConfirmar = document.getElementById("confirmar-compra-btn");
  if (btnConfirmar) btnConfirmar.addEventListener("click", confirmarCompra);

  const btnCerrarTicket = document.getElementById("cerrar-ticket-btn");
  if (btnCerrarTicket) btnCerrarTicket.addEventListener("click", cerrarTicket);

  const btnDescargarPDF = document.getElementById("descargar-pdf-btn");
  if (btnDescargarPDF) btnDescargarPDF.addEventListener("click", descargarPDF);

  const btnVolver = document.getElementById("btn-volver");
  if (btnVolver) btnVolver.addEventListener("click", volverAlDashboard);
});


// Modo Oscuro - Persistencia
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


// Funciones de Carrito
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

// Confirmar Compra (Guarda Ticket en Backend y Muestra Ticket)
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

  const total = carrito.reduce(
    (sum, item) => sum + Number(item.precio) * Number(item.cantidad),
    0
  );

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

    await fetch("http://localhost:4000/api/productos/restarStock", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productos: carrito.map(item => ({
          id: item._id,
          cantidad: item.cantidad
        }))
      })
    });

    usuario.tickets = data.tickets;
    localStorage.setItem("usuarioLoggeado", JSON.stringify(usuario));

    mostrarTicket(usuario, carrito, total);

    mostrarCarrito();

  } catch (error) {
    console.error("Error al confirmar compra:", error);
    alert("Error al confirmar compra. Intenta nuevamente.");
  }
}


// Función para mostrar ticket
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

// Otros
function cerrarTicket() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("ticket").style.display = "none";
  location.reload();
  vaciarCarrito();
}

async function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Obtener datos
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const usuario = JSON.parse(localStorage.getItem("usuarioLoggeado"));
  const fecha = new Date().toLocaleString("es-AR");

  if (!usuario || !usuario.nombre) {
    alert("No hay usuario logueado.");
    return;
  }

  if (carrito.length === 0) {
    alert("El carrito está vacío, no se puede generar el ticket.");
    return;
  }

  // 🔹 Logo
  const logoUrl = "../imagenes/Logo.png"; // ruta relativa desde tu HTML
  const img = new Image();
  img.src = logoUrl;

  // Esperar que cargue antes de usarlo
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  // Agregar logo (x, y, ancho, alto)
  doc.addImage(img, "PNG", 15, 10, 30, 25);

  // Encabezado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("TICKET DE COMPRA", 105, 25, { align: "center" });

  doc.setFontSize(11);
  doc.text(`Cliente: ${usuario.nombre}`, 20, 45);
  doc.text(`Fecha: ${fecha}`, 20, 52);

  // Tabla
  let y = 65;
  doc.setFillColor(230, 230, 230);
  doc.rect(20, y, 170, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.text("Producto", 25, y + 7);
  doc.text("Cantidad", 110, y + 7);
  doc.text("Precio", 155, y + 7);

  y += 12;
  doc.setFont("helvetica", "normal");

  let total = 0;
  carrito.forEach((item) => {
    const precioTotal = Number(item.precio) * Number(item.cantidad);
    total += precioTotal;

    doc.rect(20, y, 170, 10);
    doc.text(String(item.nombre), 25, y + 7);
    doc.text(String(item.cantidad), 120, y + 7);
    doc.text(`ARS ${precioTotal.toFixed(2)}`, 155, y + 7);
    y += 10;
  });

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text(`Total a pagar: ARS ${total.toFixed(2)}`, 20, y);

  y += 10;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("¡Gracias por su compra!", 105, y, { align: "center" });

  doc.save(`ticket_${usuario.nombre.replace(/\s+/g, "_")}.pdf`);
}


function volverAlDashboard() {
  window.location.href = "../pages/dashboard-user.html";
}

