// Función: obtenerProductoPorCodigo
//
// Descripción:
// Recupera un producto de la base de datos según su código (_id).
//
// Parámetros esperados:
// - req.params.id: String, código del producto a buscar
//
// Funcionamiento:
// - Busca el producto por _id usando findById
// - Si no existe, responde con 404 (Producto no encontrado)
// - Si se encuentra, devuelve el objeto producto en JSON
// - Maneja errores generales con status 500


const Producto = require('../../models/producto');

const obtenerProductoPorCodigo = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        ok: false,
        error: 'Producto no encontrado con ese ID',
      });
    }

    res.json({ ok: true, producto });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = obtenerProductoPorCodigo;
