const express = require('express');
const router = express.Router();

// Routers
const productoRoutes = require('./ProductosRoutes');
const usuarioRoutes = require('./UsuarioRoutes');
const ticketRoutes = require('./TicketRoutes');

// Prefijos de rutas
router.use('/productos', productoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
