/**
 * Obtener un producto por su código
 */
const Producto = require('../../models/producto');

const obtenerProductoPorCodigo = async (req, res) => {
  try {
    // 🔹 Buscar el producto según su código
    const producto = await Producto.findOne({ codigo: req.params.codigo });

    // Si no se encuentra
    if (!producto) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado con ese código' });
    }

    // Si se encuentra correctamente
    res.json({ ok: true, producto });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ ok: false, error: 'Error al obtener producto' });
  }
};

module.exports = obtenerProductoPorCodigo;
