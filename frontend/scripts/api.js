// Descripción:
// Cliente JavaScript para consumir la API desde el frontend.
// Proporciona funciones para interactuar con los distintos
// módulos de la aplicación: administradores, productos, usuarios
// y tickets.
//
// Funcionalidades principales:
// - fetchAPI(): método genérico para realizar llamadas HTTP a la API
// - Administradores: CRUD y login
// - Productos: CRUD y gestión de imágenes
// - Usuarios: CRUD, login y búsqueda por nombre/apellido
// - Tickets: agregar tickets, listar tickets paginados,
//   contar tickets y obtener el producto más vendido
//
// Uso general:
//   const datos = await window.apiClient.getUsuarios();
//   const nuevoProducto = await window.apiClient.crearProducto(data);

window.API_BASE_URL = "http://localhost:4000/api";

window.apiClient = {
  async fetchAPI(endpoint, options = {}) {
    const fullUrl = `${window.API_BASE_URL}/${endpoint}`;

    try {
      const response = await fetch(fullUrl, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ Error al conectar con la API (${endpoint}):`, error.message);
      throw error;
    }
  },
/** ===============================
 * ADMINISTRADORES
 * =============================== */
getAdmins() {
  return this.fetchAPI("admin"); 
},
getAdminPorId(id) {
  return this.fetchAPI(`admin/${id}`); 
},
crearAdmin(data) {
  return this.fetchAPI("admin", {
    method: "POST",
    body: JSON.stringify(data),
  }); 
},
actualizarAdmin(id, data) {
  return this.fetchAPI(`admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }); 
},
eliminarAdmin(id) {
  return this.fetchAPI(`admin/${id}`, {
    method: "DELETE",
  }); 
},


  // ===============================
  // PRODUCTOS
  // ===============================
  getProductos() {
    return this.fetchAPI("productos"); 
  },
  getProductoPorCodigo(codigo) {
    return this.fetchAPI(`productos/${codigo}`); 
  },
  crearProducto(data) {
    return this.fetchAPI("productos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  actualizarProducto(codigo, data) {
    return this.fetchAPI(`productos/${codigo}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  eliminarProducto(codigo) {
    return this.fetchAPI(`productos/${codigo}`, {
      method: "DELETE",
    });
  },

  // ===============================
  // USUARIOS
  // ===============================
  getUsuarios() {
    return this.fetchAPI("usuarios"); 
  },
  getUsuarioPorId(id) {
    return this.fetchAPI(`usuarios/${id}`); 
  },
  loginUsuario(data) {
    return this.fetchAPI("usuarios/login", {
      method: "POST",
      body: JSON.stringify(data),
    }); 
  },
  modificarUsuario(id, data) {
    return this.fetchAPI(`usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }); 
  },
  eliminarUsuario(id) {
    return this.fetchAPI(`usuarios/${id}`, {
      method: "DELETE",
    }); 
  },

  // ===============================
  // TICKETS 
  // ===============================
  agregarTicket(usuarioId, data) {
    return this.fetchAPI(`usuarios/agregarTicket/${usuarioId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }); 
  },
  obtenerTickets(page = 1) {
    return this.fetchAPI(`usuarios/obtenerTickets?page=${page}`).catch(async (error) => {
      
      const res = await fetch(`${window.API_BASE_URL}/usuarios/obtenerTickets?page=${page}`);
      const text = await res.text();
      console.log("Respuesta del servidor:", text);
      throw error;
    });
  },
  obtenerTicketPorId(id) {
    return this.fetchAPI(`usuarios/obtenerTicket/${id}`); 
  },
  obtenerCantidadTickets() {
    return this.fetchAPI("usuarios/obtenerCantidadTickets"); 
  },
  obtenerProductoMasVendido() {
    return this.fetchAPI("usuarios/obtenerProdMasVendido"); 
  },
};
