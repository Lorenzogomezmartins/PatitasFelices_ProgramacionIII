const express = require('express');
const router = express.Router();

// Routers
const productoRoutes = require('./ProductosRoutes');
const usuarioRoutes = require('./UsuarioRoutes');
const ticketRoutes = require('./TicketRoutes');
const adminRoutes = require('./AdminRoutes');

// Prefijos de rutas
router.use('/productos', productoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/tickets', ticketRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
