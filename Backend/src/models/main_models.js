// --------------------------------------------------------------
// Inicialización central de modelos de Mongoose para Patitas Felices
//
// Modelos incluidos:
// - Admin: Administradores del sistema (admin / superadmin)
// - Usuario: Usuarios registrados en la web
// - Producto: Productos disponibles
// - Carrito: Carrito activo del usuario
// - Ticket: Comprobante de compra generado a partir del carrito
//
// Relaciones conceptuales:
// - Un Admin puede administrar muchos Productos
// - Un Usuario puede tener un Carrito y generar muchos Tickets
// - Un Carrito pertenece a un Usuario y contiene varios Productos
// - Un Ticket pertenece a un Usuario y contiene varios Productos
// --------------------------------------------------------------

const Admin = require('./admin');
const Usuario = require('./usuario');
const Producto = require('./producto');

module.exports = {
  Admin,
  Usuario,
  Producto,
};
