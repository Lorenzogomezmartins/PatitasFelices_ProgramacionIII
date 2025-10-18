// =====================
// Funciones de Carrito
// =====================

function obtenerCarrito() {
  const carritoJSON = localStorage.getItem('carrito');
  return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Mostrar el carrito en la tabla
function mostrarCarrito() {
  const contenedor = document.getElementById('carrito-contenedor');
  const carrito = obtenerCarrito();
  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = `<tr><td colspan="5" style="text-align:center;">El carrito está vacío.</td></tr>`;
    document.getElementById('total-carrito').textContent = 'Total: ARS 0';
    document.getElementById('cantidad-items').textContent = 'Items: 0';
    return;
  }

  let total = 0;
  let cantidadItems = 0;

  carrito.forEach((item, index) => {
    const precio = Number(item.precio) || 0;
    const cantidad = Number(item.cantidad) || 1;
    total += precio * cantidad;
    cantidadItems += cantidad;

    const fila = document.createElement('tr');
    fila.classList.add('carrito-item');
    fila.innerHTML = `
      <td><img src="${item.imagen || '../img/default.jpg'}" alt="Producto" class="carrito-img"></td>
      <td>${item.nombre}</td>
      <td>ARS ${precio.toFixed(2)}</td>
      <td>
        <input type="number" min="1" value="${cantidad}" class="cantidad-input" data-index="${index}">
      </td>
      <td><button data-index="${index}" class="btn-eliminar">Eliminar</button></td>
    `;
    contenedor.appendChild(fila);
  });

  document.getElementById('total-carrito').textContent = `Total: ARS ${total.toFixed(2)}`;
  document.getElementById('cantidad-items').textContent = `Items: ${cantidadItems}`;

  // Eventos dinámicos
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      eliminarDelCarrito(idx);
    });
  });

  document.querySelectorAll('.cantidad-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
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
  localStorage.removeItem('carrito');
  mostrarCarrito();
}

function confirmarCompra() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    alert('El carrito está vacío.');
    return;
  }

  let total = 0;
  const ticketContenido = document.getElementById('ticket-contenido');
  ticketContenido.innerHTML = '';

  carrito.forEach(item => {
    const precio = Number(item.precio) || 0;
    const cantidad = Number(item.cantidad) || 1;
    total += precio * cantidad;

    ticketContenido.innerHTML += `
      <div class="ticket-item">
        <p><strong>Espacio:</strong> ${item.nombre}</p>
        <p><strong>Categoría:</strong> ${item.categoria}</p>
        <p><strong>Precio:</strong> ARS ${precio.toFixed(2)}</p>
        <p><strong>Cantidad:</strong> ${cantidad}</p>
      </div>
    `;
  });

  const fecha = new Date().toLocaleString();
  ticketContenido.innerHTML += `<p style="text-align: right;"><strong>Total Pagado:</strong> ARS ${total.toFixed(2)}</p>`;
  ticketContenido.innerHTML += `<p style="text-align: right;">Fecha: ${fecha}</p>`;

  document.getElementById('overlay').style.display = 'block';
  document.getElementById('ticket').style.display = 'block';
  document.getElementById('descargar-pdf-btn').style.display = 'inline-block';

  document.getElementById('carrito-contenedor').style.display = 'none';
  document.getElementById('total-carrito').style.display = 'none';
  document.getElementById('cantidad-items').style.display = 'none';
  document.getElementById('acciones').style.display = 'none';

  vaciarCarrito();
}

function cerrarTicket() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('ticket').style.display = 'none';
  location.reload();
}

function descargarPDF() {
  const element = document.getElementById('ticket');
  html2pdf().set({
    margin: 0.5,
    filename: 'ticket_reserva.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).from(element).save();
}

// =====================
// Inicialización
// =====================
document.addEventListener('DOMContentLoaded', () => {
  mostrarCarrito();

  document.getElementById('vaciar-carrito-btn').addEventListener('click', () => {
    if (confirm('¿Seguro que quieres vaciar el carrito?')) {
      vaciarCarrito();
    }
  });

  document.getElementById('confirmar-compra-btn').addEventListener('click', confirmarCompra);
  document.getElementById('cerrar-ticket-btn').addEventListener('click', cerrarTicket);
  document.getElementById('descargar-pdf-btn').addEventListener('click', descargarPDF);
});


// ====== Botón "Seguir comprando" ======
function volverAlDashboard() {
  // ⚠️ Cambiá esta ruta según tu dashboard real
  window.location.href = "../pages/dashboard-user.html";
}

// Evento del botón
document.addEventListener("DOMContentLoaded", () => {
  const btnVolver = document.getElementById("btn-volver");
  if (btnVolver) btnVolver.addEventListener("click", volverAlDashboard);
});
