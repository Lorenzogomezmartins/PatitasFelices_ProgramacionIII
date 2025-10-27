/**
 * Obtener un producto por su código
 */
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
