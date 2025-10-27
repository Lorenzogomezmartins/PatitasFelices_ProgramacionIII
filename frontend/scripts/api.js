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
    return this.fetchAPI("usuarios");
  },
 getAdmins() { 
  return this.fetchAPI("admin"); // ✅ coincide
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
};
