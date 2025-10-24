const express = require('express');
const router = express.Router();

// Importar controladores
const CrearAdmin = require('../controllers/admin/CrearAdmin');
const ObtenerAdmins = require('../controllers/admin/ObtenerAdmin');
const ObtenerAdminPorId = require('../controllers/admin/ObtenerAdminPorId');
const ActualizarAdmin = require('../controllers/admin/ActualizarAdmin');
const EliminarAdmin = require('../controllers/admin/EliminarAdmin');

// RUTAS CRUD
router.get('/', ObtenerAdmins);                // GET → todos los administradores
router.get('/:id', ObtenerAdminPorId);         // GET → un administrador por ID
router.post('/', CrearAdmin);                  // POST → crear administrador
router.put('/:id', ActualizarAdmin);           // PUT → actualizar administrador por ID
router.delete('/:id', EliminarAdmin);          // DELETE → eliminar administrador por ID

module.exports = router;
