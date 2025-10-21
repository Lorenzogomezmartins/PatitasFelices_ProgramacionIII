/**
 * Eliminar un producto por su código
 */
const Producto = require('../../models/producto');

const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findOneAndDelete({ codigo: req.params.codigo });

    if (!producto) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado con ese código' });
    }

    res.json({ ok: true, mensaje: `Producto con código ${req.params.codigo} eliminado correctamente` });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ ok: false, error: 'Error al eliminar producto' });
  }
};

module.exports = eliminarProducto;
