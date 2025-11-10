/**
 * Función: cambiarEstadoProducto
 *
 * Objetivo:
 * Cambia el estado del campo "activo" de un producto.
 * Si está en true pasa a false; si está en false pasa a true.
 *
 * Parámetros:
 * - req.params.id: ID (_id) del producto cuyo estado se quiere modificar.
 *
 * Comportamiento:
 * - Busca el producto en la base de datos.
 * - Si no existe, devuelve 404.
 * - Si existe, invierte su estado y guarda el cambio.
 * - Devuelve el nuevo estado en la respuesta.
 */
const Producto = require('../../models/producto');

const cambiarEstadoProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el producto por código (_id)
    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({
        ok: false,
        error: 'Producto no encontrado con ese código'
      });
    }

    // Invertir el estado de "activo"
    producto.activo = !producto.activo;

    // Guardar cambios
    await producto.save();

    res.json({
      ok: true,
      mensaje: `Estado cambiado correctamente.`,
      producto: {
        id: producto._id,
        nuevoEstado: producto.activo ? 'activo' : 'inactivo'
      }
    });

  } catch (error) {
    console.error('Error al cambiar estado de producto:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al cambiar estado del producto'
    });
  }
};

module.exports = cambiarEstadoProducto;
