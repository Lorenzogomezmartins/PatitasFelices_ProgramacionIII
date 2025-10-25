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
   * PRODUCTOS
   * =============================== */
  getProductos() {
    return this.fetchAPI("productos"); // GET /productos
  },

  getProductoPorId(id) {
    return this.fetchAPI(`productos/${id}`);
  },

  crearProducto(data) {
    return this.fetchAPI("productos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  actualizarProducto(id, data) {
    return this.fetchAPI(`productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  eliminarProducto(id) {
    return this.fetchAPI(`productos/${id}`, {
      method: "DELETE",
    });
  },

  /** ===============================
   * USUARIOS
   * =============================== */
  getUsuarios() {
    return this.fetchAPI("usuarios"); // GET /usuarios
  },

  registrarUsuario(data) {
    return this.fetchAPI("usuarios", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  loginUsuario(data) {
    return this.fetchAPI("usuarios/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** ===============================
   * TICKETS
   * =============================== */
  crearTicket(data) {
    return this.fetchAPI("tickets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
