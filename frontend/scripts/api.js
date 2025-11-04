// ===============================
// CONFIGURACIÓN BASE
// ===============================
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

  // ===============================
  // ADMINISTRADORES
  // ===============================
  getAdmins() {
    return this.fetchAPI("admin"); // GET /api/admin
  },
  getAdminPorId(id) {
    return this.fetchAPI(`admin/${id}`); // GET /api/admin/:id
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
    return this.fetchAPI("productos"); // GET /api/productos
  },
  getProductoPorCodigo(codigo) {
    return this.fetchAPI(`productos/${codigo}`); // GET /api/productos/:codigo
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
    return this.fetchAPI("usuarios"); // GET /api/usuarios
  },
  getUsuarioPorId(id) {
    return this.fetchAPI(`usuarios/${id}`); // GET /api/usuarios/:id
  },
  loginUsuario(data) {
    return this.fetchAPI("usuarios/login", {
      method: "POST",
      body: JSON.stringify(data),
    }); // POST /api/usuarios/login
  },
  modificarUsuario(id, data) {
    return this.fetchAPI(`usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }); // PUT /api/usuarios/:id
  },
  eliminarUsuario(id) {
    return this.fetchAPI(`usuarios/${id}`, {
      method: "DELETE",
    }); // DELETE /api/usuarios/:id
  },

  // ===============================
  // TICKETS (RUTAS SINCRONIZADAS CON BACKEND)
  // ===============================
  agregarTicket(usuarioId, data) {
    return this.fetchAPI(`usuarios/agregarTicket/${usuarioId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }); // PUT /api/usuarios/agregarTicket/:id
  },
  obtenerTickets(page = 1) {
    return this.fetchAPI(`usuarios/obtenerTickets?page=${page}`).catch(async (error) => {
      // Debug opcional para ver respuesta cruda del servidor
      const res = await fetch(`${window.API_BASE_URL}/usuarios/obtenerTickets?page=${page}`);
      const text = await res.text();
      console.log("Respuesta del servidor:", text);
      throw error;
    });
  },
  obtenerTicketPorId(id) {
    return this.fetchAPI(`usuarios/obtenerTicket/${id}`); // GET /api/usuarios/obtenerTicket/:id
  },
  obtenerCantidadTickets() {
    return this.fetchAPI("usuarios/obtenerCantidadTickets"); // GET /api/usuarios/obtenerCantidadTickets
  },
  obtenerProductoMasVendido() {
    return this.fetchAPI("usuarios/obtenerProdMasVendido"); // GET /api/usuarios/obtenerProdMasVendido
  },
};
