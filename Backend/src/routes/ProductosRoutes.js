const express = require('express');
const router = express.Router();

// Controladores
const crearProducto = require('../controllers/productos/CrearProducto');
const obtenerProductos = require('../controllers/productos/ObtenerProductos');
const obtenerProductoPorCodigo = require('../controllers/productos/ObtenerProductoPorCodigo');
const actualizarProducto = require('../controllers/productos/ActualizarProductos');
const eliminarProducto = require('../controllers/productos/EliminarProducto');

// Middlewares
const upload = require('../middlewares/multerUpload'); 

// RUTAS CRUD DE PRODUCTOS

// Obtener todos los productos
router.get('/', obtenerProductos);

// Obtener un producto por su código (_id)
router.get('/obtenerporcodigo/:id', obtenerProductoPorCodigo);

// Crear producto con imagen local
router.post('/', upload.single('url'), crearProducto);

// Actualizar producto (si querés reemplazar imagen, se hace también con multer)
router.put('/modificar/:id', upload.single('url'), actualizarProducto);

// Eliminar producto
router.delete('/:id', eliminarProducto);


module.exports = router;
