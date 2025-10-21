const express = require('express');
const router = express.Router();

const crearUsuario = require('../controllers/usuario/ObtenerUsuarios');
const agregarProductoCarrito = require('../controllers/usuario/AgregarProductoAlCarrito');
const eliminarProductoCarrito = require('../controllers/usuario/EliminarProductoDelCarrito');
const modificarCantidadCarrito = require('../controllers/usuario/ModificarCarrito');
const vaciarCarrito = require('../controllers/usuario/VaciarCarrito');
const finalizarCompra = require('../controllers/usuario/FinalizarCompra');

// Login / crear usuario si no existe
router.post('/login', crearUsuario);

// Rutas del carrito
router.post('/carrito/agregar', agregarProductoCarrito);
router.delete('/carrito/eliminar', eliminarProductoCarrito);
router.put('/carrito/modificar', modificarCantidadCarrito);
router.delete('/carrito/vaciar', vaciarCarrito);
router.post('/carrito/finalizar', finalizarCompra);

module.exports = router;
