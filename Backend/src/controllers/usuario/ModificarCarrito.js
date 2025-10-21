/**
 * ModificarCantidadCarrito.js
 * Modifica cantidad de un producto en carrito por código.
 */

const Usuario = require('../../models/usuario');

const modificarCantidadCarrito = async (req, res) => {
  try {
    const { nombreUsuario, apellidoUsuario, codigoProducto, nuevaCantidad } = req.body;

    const usuario = await Usuario.findOne({ nombre: nombreUsuario, apellido: apellidoUsuario });
    if (!usuario) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    const item = usuario.carrito.find(item => item.codigo === codigoProducto);
    if (!item) return res.status(404).json({ ok: false, error: 'Producto no está en el carrito' });

    item.cantidad = nuevaCantidad;
    await usuario.save();

    res.json({ ok: true, mensaje: 'Cantidad actualizada', carrito: usuario.carrito });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Error al modificar cantidad', detalles: error.message });
  }
};

module.exports = modificarCantidadCarrito;
