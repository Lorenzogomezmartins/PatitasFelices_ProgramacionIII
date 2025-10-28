const Producto = require('../../models/producto');

const obtenerProductos = async (req, res) => {
  try {
    const filtros = {};

    // Filtrado opcional por query params
    if (req.query.categoria && req.query.categoria !== 'todos') {
      filtros.categoria = req.query.categoria; // Debe coincidir exactamente
    }
    if (req.query.tipo_mascota && req.query.tipo_mascota !== 'todos') {
      filtros.tipo_mascota = req.query.tipo_mascota;
    }
    if (req.query.tamaño && req.query.tamaño !== 'todos') {
      filtros.tamaño = req.query.tamaño;
    }
    if (req.query.activo !== undefined) {
      filtros.activo = req.query.activo === 'true';
    }

    const productos = await Producto.find(filtros);

    res.json({ ok: true, total: productos.length, productos });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ ok: false, error: 'Error al obtener productos' });
  }
};

module.exports = obtenerProductos;
