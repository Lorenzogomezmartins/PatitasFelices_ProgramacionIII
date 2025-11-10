// Rutas Productos
//
// Descripción:
// Archivo de enrutamiento para manejar operaciones sobre productos
// de PatitasFelices. Centraliza las funciones CRUD y manejo de imágenes.
//
// Funciones incluidas:
// - crearProducto           → crea un nuevo producto con imagen
// - obtenerProductos        → lista todos los productos
// - obtenerProductoPorCodigo → obtiene un producto por su código (_id)
// - actualizarProducto      → modifica un producto y su imagen opcional
// - cambiarEstadoProd        → elimina un producto
// - restarStock             → resta stock de productos
// Middleware:
// - upload (Multer) para manejo de imágenes locales

const express = require('express');
const router = express.Router();

// Controladores
const crearProducto = require('../controllers/productos/CrearProducto');
const obtenerProductos = require('../controllers/productos/ObtenerProductos');
const obtenerProductoPorCodigo = require('../controllers/productos/ObtenerProductoPorCodigo');
const actualizarProducto = require('../controllers/productos/ActualizarProductos');
const cambiarEstadoProd = require('../controllers/productos/CambiarEstadoProd');
const restarStock = require("../controllers/productos/RestarStock");


// Middlewares
const upload = require('../middlewares/multerUpload'); 

// RUTAS CRUD DE PRODUCTOS

router.get('/', obtenerProductos);

router.get('/obtenerporcodigo/:id', obtenerProductoPorCodigo);

router.post('/', upload.single('url'), crearProducto);

router.put('/modificar/:id', upload.single('url'), actualizarProducto);

router.put('/estado/:id', cambiarEstadoProd);

router.put("/restarstock", restarStock);

module.exports = router;
