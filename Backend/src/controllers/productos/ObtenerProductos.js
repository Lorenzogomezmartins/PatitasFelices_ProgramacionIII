const Producto = require('../../models/producto');

const obtenerProductos = async (req, res) => {
  try {
    const filtros = { activo: true }; // 👈 Solo productos activos por defecto

    // Filtrado opcional por query params
    if (req.query.categoria && req.query.categoria !== 'todos') {
      filtros.categoria = req.query.categoria;
    }
    if (req.query.tipo_mascota && req.query.tipo_mascota !== 'todos') {
      filtros.tipo_mascota = req.query.tipo_mascota;
    }
    if (req.query.tamano && req.query.tamano !== 'todos') {
      filtros.tamano = req.query.tamano;
    }

    const productos = await Producto.find(filtros);

    res.json({ ok: true, total: productos.length, productos });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ ok: false, error: 'Error al obtener productos' });
  }
};

module.exports = obtenerProductos;
