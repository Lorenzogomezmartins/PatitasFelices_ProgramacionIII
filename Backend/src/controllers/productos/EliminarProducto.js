// Función: eliminarProducto
//
// Descripción:
// Elimina un producto de la base de datos según su código (_id).
//
// Parámetros esperados:
// - req.params.id: String, código del producto a eliminar
//
// Funcionamiento:
// - Busca y elimina el producto por _id usando findOneAndDelete
// - Si no existe, responde con 404 (Producto no encontrado)
// - Si se elimina correctamente, responde con mensaje de éxito
// - Maneja errores generales con status 500


const Producto = require('../../models/producto');

const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findOneAndDelete({ _id: req.params.id }); // 👈 usar _id

    if (!producto) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado con ese código' });
    }

    res.json({ ok: true, mensaje: `Producto con código ${req.params.id} eliminado correctamente` });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ ok: false, error: 'Error al eliminar producto' });
  }
};

module.exports = eliminarProducto;
