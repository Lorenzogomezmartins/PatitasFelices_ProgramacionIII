function volverAlLogin() {
  // Cambiá esta ruta según tu dashboard real
  window.location.href = "../pages/Login-admin.html";
}

function mostrarProductos(productos) {
    const divListado = document.getElementById("divListado");
    divListado.innerHTML = "";

    const tabla = document.createElement("table");
    tabla.className = "table table-striped table-hover align-middle";

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
          <th>ID</th>
          <th>Foto</th>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Stock</th>
          <th>Precio</th>
          <th>Tamaño</th>
          <th>Especie</th>
          <th>Acciones</th>
        </tr>`;
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");

    productos.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.tipo}</td>
            <td>${p.stock}</td>
            <td>${p.precio}</td>
            <td>${p.tamaño}</td>
            <td>${p.especie}</td>
            <td>
                <button class="btn btn-outline-primary btn-sm btnSeleccionar" title="Seleccionar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm btnEliminar" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        const btnSel = tr.querySelector(".btnSeleccionar");
        const btnDel = tr.querySelector(".btnEliminar");

        btnSel.addEventListener("click", () => modificarProducto(p));
        btnDel.addEventListener("click", () => eliminarProducto(p));

        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    divListado.appendChild(tabla);
}

function mostrarUsuarios(user) {
    const divListado = document.getElementById("divListado");
    divListado.innerHTML = "";

    const tabla = document.createElement("table");
    tabla.className = "table table-striped table-hover align-middle";

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Acciones</th>
        </tr>`;
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");

    user.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.apellido}</td>
            <td>
                <button class="btn btn-outline-primary btn-sm btnSeleccionar" title="Seleccionar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm btnEliminar" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        const btnSel = tr.querySelector(".btnSeleccionar");
        const btnDel = tr.querySelector(".btnEliminar");

        btnSel.addEventListener("click", () => modificarProducto(p));
        btnDel.addEventListener("click", () => eliminarProducto(p));

        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    divListado.appendChild(tabla);
}



function handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        currentImageData = e.target.result;
        displayImage(currentImageData);
      };
      reader.readAsDataURL(file);
    }

function displayImage(imageUrl) {
    const img = document.getElementById('foto_img');
    const placeholder = document.getElementById('upload-placeholder');
    
    img.src = imageUrl;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  }

function removeImage() {
    const img = document.getElementById('foto_img');
    const placeholder = document.getElementById('upload-placeholder');
    const fileInput = document.getElementById('inputFoto');
    
    img.src = '';
    img.style.display = 'none';
    placeholder.style.display = 'flex';
    fileInput.value = '';
    currentImageData = null;
  }

function resetForm() {
    document.getElementById('frmFormulario').reset();
    removeImage();
  }

  // // Ejemplo de uso de los botones
  // document.getElementById('btnAgregar').addEventListener('click', function() {
  //   if (!document.getElementById('frmFormulario').checkValidity()) {
  //     alert('Por favor completa todos los campos requeridos');
  //     return;
  //   }

  //   const producto = {
  //     id: document.getElementById('inputID').value,
  //     nombre: document.getElementById('inputNombre').value,
  //     tipo: document.getElementById('inputTipo').value,
  //     tamaño: document.getElementById('inputTamaño').value,
  //     precio: document.getElementById('inputPrecio').value,
  //     stock: document.getElementById('inputStock').value,
  //     imagen: currentImageData
  //   };

  //   console.log('Producto a agregar:', producto);
  //   alert('Producto agregado correctamente');
  //   resetForm();
  // });

  // document.getElementById('btnModificar').addEventListener('click', function() {
  //   if (!document.getElementById('frmFormulario').checkValidity()) {
  //     alert('Por favor completa todos los campos requeridos');
  //     return;
  //   }

  //   const producto = {
  //     id: document.getElementById('inputID').value,
  //     nombre: document.getElementById('inputNombre').value,
  //     tipo: document.getElementById('inputTipo').value,
  //     tamaño: document.getElementById('inputTamaño').value,
  //     precio: document.getElementById('inputPrecio').value,
  //     stock: document.getElementById('inputStock').value,
  //     imagen: currentImageData
  //   };

  //   console.log('Producto a modificar:', producto);
  //   alert('Producto modificado correctamente');
  // });

  // // Generar ID automático al cargar (solo para demostración)
  // document.getElementById('inputID').value = 'PROD-' + Math.floor(Math.random() * 10000);
  
// Evento del botón
document.addEventListener("DOMContentLoaded", () => {
  const btnVolver = document.getElementById("logout-btn");
  if (btnVolver) btnVolver.addEventListener("click", volverAlLogin);
});
