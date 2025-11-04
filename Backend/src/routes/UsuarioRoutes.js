// Rutas Usuarios
//
// Descripción:
// Archivo de enrutamiento para manejar operaciones sobre usuarios
// de PatitasFelices, incluyendo creación, modificación, eliminación,
// y gestión de tickets.
//
// Funciones incluidas:
// - crearUsuario                  → crea un usuario al hacer login
// - listadoUsuarios               → obtiene todos los usuarios
// - obtenerUsuarioPorNombreApellido → búsqueda de usuario por nombre y apellido
// - obtenerUsuarioPorId           → obtiene un usuario por su ID
// - eliminarUsuario               → elimina un usuario
// - agregarTicket                 → agrega un ticket a un usuario
// - obtenerTickets                → lista tickets con paginación
// - obtenerCantidadTickets        → cuenta total de tickets
// - obtenerProductoMasVendido     → devuelve el producto más vendido


const express = require('express');
const router = express.Router();

const crearUsuario = require('../controllers/usuario/CrearUsuario.js');
const listadoUsuarios = require('../controllers/usuario/ListadoUsuarios.js');
const agregarTicket = require('../controllers/usuario/AgregarTicket.js');
const eliminarUsuario = require('../controllers/usuario/EliminarUsuario.js');
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
router.delete('/:id', eliminarUsuario);

module.exports = router;
