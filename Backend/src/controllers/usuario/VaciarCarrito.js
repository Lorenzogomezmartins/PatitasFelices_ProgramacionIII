/**
 * VaciarCarrito.js
 * Vacía el carrito de un usuario.
 */

const Usuario = require('../../models/usuario');

const vaciarCarrito = async (req, res) => {
  try {
    const { nombreUsuario, apellidoUsuario } = req.body;

    const usuario = await Usuario.findOne({ nombre: nombreUsuario, apellido: apellidoUsuario });
    if (!usuario) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    usuario.carrito = [];
    await usuario.save();

    res.json({ ok: true, mensaje: 'Carrito vaciado correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Error al vaciar carrito', detalles: error.message });
  }
};

module.exports = vaciarCarrito;
