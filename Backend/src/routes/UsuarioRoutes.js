const express = require('express');
const router = express.Router();

const crearUsuario = require('../controllers/usuario/CrearUsuario.js');
const listadoUsuarios = require('../controllers/usuario/ListadoUsuarios.js');
const agregarTicket = require('../controllers/usuario/AgregarTicket.js');
const eliminarUsuario = require('../controllers/usuario/EliminarUsuario.js');
const modificarUsuario = require('../controllers/usuario/ModificarUsuario.js');
const obtenerCantidadTickets = require('../controllers/usuario/ObtenerCantidadTickets.js');
const obtenerProductoMasVendido = require('../controllers/usuario/ObtenerProdMasVendido.js');
const obtenerTickets = require('../controllers/usuario/ObtenerTickets.js');
const obtenerUsuarioPorId = require('../controllers/usuario/ObtenerUsuarioporID.js');
const obtenerUsuarioPorNombreApellido = require('../controllers/usuario/ObtenerUsuarioPorNyA');

// Crear usuario al hacer login
router.post('/login', crearUsuario);

// Listado de todos los usuarios
router.get('/', listadoUsuarios);

// Búsqueda por nombre y apellido
router.get('/buscar/:nombre/:apellido', obtenerUsuarioPorNombreApellido);

// Tickets
router.get('/obtenerTickets', obtenerTickets);
router.get('/obtenerProdMasVendido', obtenerProductoMasVendido);
router.get('/obtenerCantidadTickets', obtenerCantidadTickets);
router.put('/agregarTicket/:id', agregarTicket);

// Usuarios individuales
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id', modificarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;
