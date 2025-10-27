const express = require('express');
const router = express.Router();

const crearUsuario = require('../controllers/usuario/CrearUsuario.js');
const listadoUsuarios = require('../controllers/usuario/ListadoUsuarios.js');
const agregarTicket = require('../controllers/usuario/AgregarTicket.js');
const eliminarUsuario = require('../controllers/usuario/EliminarUsuario.js');
const modificarUsuario = require('../controllers/usuario/ModificarUsuario.js');
const obtenerTickets = require('../controllers/usuario/ObtenerTickets.js');
const obtenerUsuarioPorId = require('../controllers/usuario/ObtenerUsuarioporID.js');
const obtenerUsuarioPorNombreApellido = require('../controllers/usuario/ObtenerUsuarioPorNyA');

// Crear usuario al hacer login
router.post('/login', crearUsuario);
router.get('/', listadoUsuarios);

// Búsqueda por nombre y apellido
router.get('/buscar/:nombre/:apellido', obtenerUsuarioPorNombreApellido);

// Otras rutas
router.get('/obtenerTickets', obtenerTickets);
router.get('/:id', obtenerUsuarioPorId);
router.delete('/eliminarUsuario', eliminarUsuario);
router.put('/modificarUsuario', modificarUsuario);
router.put('/agregarTicket/:id', agregarTicket);

module.exports = router;