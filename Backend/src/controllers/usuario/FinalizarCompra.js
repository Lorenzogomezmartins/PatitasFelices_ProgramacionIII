/**
 * FinalizarCompra.js
 * Genera ticket de compra usando productos del carrito.
 */

const Usuario = require('../../models/usuario');
const Ticket = require('../../models/ticket');
const Producto = require('../../models/producto');

const finalizarCompra = async (req, res) => {
  try {
    const { nombreUsuario, apellidoUsuario } = req.body;

    const usuario = await Usuario.findOne({ nombre: nombreUsuario, apellido: apellidoUsuario });
    if (!usuario) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    if (!usuario.carrito || usuario.carrito.length === 0) {
      return res.status(400).json({ ok: false, error: 'Carrito vacío' });
    }

    let total = 0;
    const productosConDetalle = [];

    for (const item of usuario.carrito) {
      const producto = await Producto.findOne({ codigo: item.codigo });
      if (!producto) continue;
      const subtotal = producto.precio * item.cantidad;
      total += subtotal;
      productosConDetalle.push({ codigo: producto.codigo, nombre: producto.nombre, cantidad: item.cantidad, subtotal });
    }

    const ticket = await Ticket.create({
      usuario: `${usuario.nombre} ${usuario.apellido}`,
      productos: productosConDetalle,
      total
    });

    usuario.carrito = [];
    await usuario.save();

    res.json({ ok: true, mensaje: 'Compra finalizada', ticket });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Error al finalizar compra', detalles: error.message });
  }
};

module.exports = finalizarCompra;
