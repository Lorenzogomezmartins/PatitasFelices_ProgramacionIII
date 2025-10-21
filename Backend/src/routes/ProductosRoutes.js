const express = require('express');
const router = express.Router();

// Importar controladores
const crearProducto = require('../controllers/producto/CrearProducto');
const obtenerProductos = require('../controllers/producto/ObtenerProductos');
const obtenerProductoPorCodigo = require('../controllers/producto/ObtenerProductoPorCodigo');
const actualizarProducto = require('../controllers/producto/ActualizarProducto');
const eliminarProducto = require('../controllers/producto/EliminarProducto');

// RUTAS CRUD
router.get('/', ObtenerProductos);                   // GET → todos los productos
router.get('/:codigo', ObtenerProductoPorCodigo);   // GET → un producto por código
router.post('/', CrearProducto);                    // POST → crear producto
router.put('/:codigo', ActualizarProducto);         // PUT → actualizar producto por código
router.delete('/:codigo', EliminarProducto);       // DELETE → eliminar producto por código

module.exports = router;
