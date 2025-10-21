/**
 * AgregarProductoCarrito.js
 * Agrega un prod/**
 * AgregarProductoCarrito.js
 * Agrega un producto al carrito de un usuario (buscando producto por código).
 */

const Usuario = require('../../models/usuario');
const Producto = require('../../models/producto');

const agregarProductoCarrito = async (req, res) => {
  try {
    const { nombreUsuario, apellidoUsuario, codigoProducto, cantidad } = req.body;

    if (!nombreUsuario || !apellidoUsuario) {
      return res.status(400).json({ ok: false, error: 'Usuario requerido' });
    }

    const usuario = await Usuario.findOne({ nombre: nombreUsuario, apellido: apellidoUsuario });
    if (!usuario) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    const producto = await Producto.findOne({ codigo: codigoProducto });
    if (!producto) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });

    if (!usuario.carrito) usuario.carrito = [];

    const itemExistente = usuario.carrito.find(item => item.codigo === codigoProducto);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      usuario.carrito.push({ codigo: producto.codigo, cantidad });
    }

    await usuario.save();
    res.json({ ok: true, mensaje: 'Producto agregado al carrito', carrito: usuario.carrito });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Error al agregar producto', detalles: error.message });
  }
};

module.exports = agregarProductoCarrito;
