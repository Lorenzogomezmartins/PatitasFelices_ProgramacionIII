const express = require('express');
const router = express.Router();

// Controladores
const crearProducto = require('../controllers/productos/CrearProducto');
const obtenerProductos = require('../controllers/productos/ObtenerProductos');
const obtenerProductoPorCodigo = require('../controllers/productos/ObtenerProductoPorCodigo');
const actualizarProducto = require('../controllers/productos/ActualizarProductos');
const eliminarProducto = require('../controllers/productos/EliminarProducto');

// Middlewares
const validarProducto = require('../middlewares/validarProducto');
const upload = require('../middlewares/multerUpload'); // 👈 Multer configurado para guardado local

// ===============================
// RUTAS CRUD DE PRODUCTOS
// ===============================

// Obtener todos los productos
router.get('/', obtenerProductos);

// Obtener un producto por su código (_id)
router.get('/obtenerporcodigo/:id', obtenerProductoPorCodigo);

// Crear producto con imagen local
router.post('/', upload.single('url'), crearProducto);

// Actualizar producto (si querés reemplazar imagen, se hace también con multer)
router.put('/:codigo', upload.single('url'), validarProducto, actualizarProducto);


// RUTA DELETE CORRECTA
router.delete('/:id', eliminarProducto);


module.exports = router;
