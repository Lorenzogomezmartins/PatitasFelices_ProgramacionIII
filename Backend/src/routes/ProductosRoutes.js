const express = require('express');
const router = express.Router();

// Importar controladores
const crearProducto = require('../controllers/productos/CrearProducto');
const obtenerProductos = require('../controllers/productos/ObtenerProductos');
const obtenerProductoPorCodigo = require('../controllers/productos/ObtenerProductoPorCodigo');
const actualizarProducto = require('../controllers/productos/ActualizarProductos');
const eliminarProducto = require('../controllers/productos/EliminarProducto');

// RUTAS CRUD
router.get('/', obtenerProductos);                   // GET → todos los productos
router.get('/:codigo', obtenerProductoPorCodigo);   // GET → un producto por código
router.post('/', crearProducto);                    // POST → crear producto
router.put('/:codigo', actualizarProducto);         // PUT → actualizar producto por código
router.delete('/:codigo', eliminarProducto);       // DELETE → eliminar producto por código

module.exports = router;
