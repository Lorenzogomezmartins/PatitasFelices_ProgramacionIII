// Rutas Administradores
//
// Descripción:
// Archivo de enrutamiento que centraliza las operaciones sobre
// administradores del sistema.
//
// Funciones incluidas:
// - CrearAdmin        → crea un nuevo administrador
// - ObtenerAdmins     → lista todos los administradores
// - ObtenerAdminPorId → obtiene un administrador específico por ID
// - ActualizarAdmin   → modifica datos de un administrador
// - EliminarAdmin     → elimina un administrador
// - LoginAdmin        → permite iniciar sesión de admin/superadmin


const express = require('express');
const router = express.Router();
const CrearAdmin = require('../controllers/admin/CrearAdmin');
const ObtenerAdmins = require('../controllers/admin/ObtenerAdmin');
const ObtenerAdminPorId = require('../controllers/admin/ObtenerAdminPorId');
const ActualizarAdmin = require('../controllers/admin/ActualizarAdmin');
const EliminarAdmin = require('../controllers/admin/EliminarAdmin');
const LoginAdmin = require('../controllers/admin/LoginAdmin');

// Rutas
router.post('/login', LoginAdmin);             // POST → login de admin/superadmin
router.get('/', ObtenerAdmins);                // GET → todos los administradores
router.get('/:id', ObtenerAdminPorId);         // GET → un administrador por ID
router.post('/', CrearAdmin);                  // POST → crear administrador
router.put('/:id', ActualizarAdmin);           // PUT → actualizar administrador por ID
router.delete('/:id', EliminarAdmin);          // DELETE → eliminar administrador por ID

module.exports = router;
