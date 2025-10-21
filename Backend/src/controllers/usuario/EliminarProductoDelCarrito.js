/**
 * EliminarProductoCarrito.js
 * Elimina un producto del carrito por código.
 */

const Usuario = require('../../models/usuario');

const eliminarProductoCarrito = async (req, res) => {
  try {
    const { nombreUsuario, apellidoUsuario, codigoProducto } = req.body;

    const usuario = await Usuario.findOne({ nombre: nombreUsuario, apellido: apellidoUsuario });
    if (!usuario) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    usuario.carrito = usuario.carrito.filter(item => item.codigo !== codigoProducto);
    await usuario.save();

    res.json({ ok: true, mensaje: 'Producto eliminado del carrito', carrito: usuario.carrito });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Error al eliminar producto', detalles: error.message });
  }
};

module.exports = eliminarProductoCarrito;
