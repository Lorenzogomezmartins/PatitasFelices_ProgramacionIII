const express = require('express');
const router = express.Router();

const authAdmin = require('../middlewares/authAdmin');

const CrearAdmin = require('../controllers/admin/CrearAdmin');
const ObtenerAdmins = require('../controllers/admin/ObtenerAdmin');
const ObtenerAdminPorId = require('../controllers/admin/ObtenerAdminPorId');
const ActualizarAdmin = require('../controllers/admin/ActualizarAdmin');
const EliminarAdmin = require('../controllers/admin/EliminarAdmin');
const LoginAdmin = require('../controllers/admin/LoginAdmin');

// LOGIN 
router.post('/login', LoginAdmin);

// TODO LO DEMÁS → REQUIERE TOKEN
router.use(authAdmin);

router.get('/', ObtenerAdmins);
router.get('/:id', ObtenerAdminPorId);
router.post('/', CrearAdmin);
router.put('/:id', ActualizarAdmin);
router.delete('/:id', EliminarAdmin);

module.exports = router;
