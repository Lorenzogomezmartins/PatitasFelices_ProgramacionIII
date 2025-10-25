const express = require('express');
const router = express.Router();

const crearUsuario = require('../controllers/usuario/CrearUsuario'); // POST /login
const listadoUsuarios = require('../controllers/usuario/ListadoUsuarios'); // GET /
const agregarProductoCarrito = require('../controllers/usuario/AgregarProductoAlCarrito');
const eliminarProductoCarrito = require('../controllers/usuario/EliminarProductoDelCarrito');
const modificarCantidadCarrito = require('../controllers/usuario/ModificarCarrito');
const vaciarCarrito = require('../controllers/usuario/VaciarCarrito');
const finalizarCompra = require('../controllers/usuario/FinalizarCompra');

// Crear usuario al hacer login
router.post('/login', crearUsuario);

// Listar todos los usuarios
router.get('/', listadoUsuarios);

// Rutas del carrito
router.post('/carrito/agregar', agregarProductoCarrito);
router.delete('/carrito/eliminar', eliminarProductoCarrito);
router.put('/carrito/modificar', modificarCantidadCarrito);
router.delete('/carrito/vaciar', vaciarCarrito);
router.post('/carrito/finalizar', finalizarCompra);

module.exports = router;
