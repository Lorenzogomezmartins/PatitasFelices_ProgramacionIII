const express = require('express');
const router = express.Router();

// Controladores
const crearProducto = require('../controllers/productos/CrearProducto');
const obtenerProductos = require('../controllers/productos/ObtenerProductos');
const obtenerProductoPorCodigo = require('../controllers/productos/ObtenerProductoPorCodigo');
const actualizarProducto = require('../controllers/productos/ActualizarProductos');
const eliminarProducto = require('../controllers/productos/EliminarProducto');

// Middleware de validación
const validarProducto = require('../middlewares/validarProducto');

// RUTAS CRUD
router.get('/', obtenerProductos);
router.get('/:codigo', obtenerProductoPorCodigo);
router.post('/', validarProducto, crearProducto); // <-- aplicamos middleware
router.put('/:codigo', validarProducto, actualizarProducto);
router.delete('/:codigo', eliminarProducto);

module.exports = router;
