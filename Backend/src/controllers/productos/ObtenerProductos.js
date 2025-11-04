// Función: obtenerProductos
//
// Descripción:
// Recupera todos los productos de la base de datos, con soporte
// para filtros opcionales mediante query params.
//
// Query params opcionales:
// - categoria: Filtra por categoría ('alimento', 'juguete', 'todos')
// - tipo_mascota: Filtra por tipo de mascota ('perro', 'gato', 'todos')
// - tamano: Filtra por tamaño ('pequeño', 'mediano', 'grande', 'todos')
//
// Funcionamiento:
// - Aplica filtros solo si se proporcionan y no son 'todos'
// - Devuelve lista de productos y total en JSON
// - Maneja errores generales con status 500


const Producto = require('../../models/producto');

const obtenerProductos = async (req, res) => {
  try {
    // Traer todos los productos, sin filtrar por activo
    const filtros = {};

    // Filtrado opcional por query params
    if (req.query.categoria && req.query.categoria !== 'todos') filtros.categoria = req.query.categoria;
    if (req.query.tipo_mascota && req.query.tipo_mascota !== 'todos') filtros.tipo_mascota = req.query.tipo_mascota;
    if (req.query.tamano && req.query.tamano !== 'todos') filtros.tamano = req.query.tamano;

    const productos = await Producto.find(filtros); // <-- sin filtrar activo

    res.json({ ok: true, total: productos.length, productos });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ ok: false, error: 'Error al obtener productos' });
  }
};

module.exports = obtenerProductos;
