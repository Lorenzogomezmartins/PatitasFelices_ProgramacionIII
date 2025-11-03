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
    return this.fetchAPI("admin"); // GET /api/admin
  },
  getAdminPorId(id) {
    return this.fetchAPI(`admin/${id}`);
  },
  crearAdmin(data) {
    return this.fetchAPI("admin", { method: "POST", body: JSON.stringify(data) });
  },
  actualizarAdmin(id, data) {
    return this.fetchAPI(`admin/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  eliminarAdmin(id) {
    return this.fetchAPI(`admin/${id}`, { method: "DELETE" });
  },

  /** ===============================
   * PRODUCTOS
   * =============================== */
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

  /** ===============================
   * USUARIOS
   * =============================== */
  getUsuarios() {
    return this.fetchAPI("usuarios"); // GET /usuarios
  },

  getUsuarioPorId(id) {
    return this.fetchAPI(`usuarios/${id}`); // GET /usuarios/:id
  },

  loginUsuario(data) {
    return this.fetchAPI("usuarios/login", { method: "POST", body: JSON.stringify(data) }); // POST /usuarios/login
  },

  modificarUsuario(id, data) {
    return this.fetchAPI(`usuarios/${id}`, { method: "PUT", body: JSON.stringify(data) }); // PUT /usuarios/:id
  },

  eliminarUsuario(id) {
    return this.fetchAPI(`usuarios/${id}`, { method: "DELETE" }); // DELETE /usuarios/:id
  },


  crearTicket(usuarioId, data) {
    return this.fetchAPI(`usuarios/${usuarioId}/tickets`, { method: "POST", body: JSON.stringify(data) }); // POST /usuarios/:id/tickets
  },

  obtenerTickets(page = 1) {
  return this.fetchAPI(`usuarios/obtenerTickets?page=${page}`)
    .catch(async error => {
      // intentar ver lo que llega si no es JSON
      const res = await fetch(`${window.API_BASE_URL}/usuarios/obtenerTickets?page=${page}`);
      const text = await res.text();
      console.log("Respuesta del servidor:", text);
      throw error;
    })
  },
};

