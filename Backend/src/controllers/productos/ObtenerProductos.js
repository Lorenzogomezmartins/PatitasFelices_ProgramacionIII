/**
 * Obtener todos los productos
 * Opcionalmente se pueden filtrar por:
 * - categoria: 'alimento' | 'juguete'
 * - tipo_mascota: 'perro' | 'gato'
 * - activo: true | false
 */
const Producto = require('../../models/producto');

const obtenerProductos = async (req, res) => {
  try {
    const filtros = {};

    // Filtrado opcional por query params
    if (req.query.categoria) filtros.categoria = req.query.categoria;
    if (req.query.tipo_mascota) filtros.tipo_mascota = req.query.tipo_mascota;
    if (req.query.activo !== undefined) filtros.activo = req.query.activo === 'true';

    const productos = await Producto.find(filtros);

    res.json({ ok: true, total: productos.length, productos });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ ok: false, error: 'Error al obtener productos' });
  }
};

module.exports = obtenerProductos;
