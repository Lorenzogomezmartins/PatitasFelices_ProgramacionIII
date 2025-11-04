// Rutas principales
//
// Descripción:
// Archivo central de enrutamiento que agrupa los routers de
// productos, usuarios y administradores, asignando prefijos
// para organizar las rutas de la API.
//
// Routers incluidos:
// - /productos → rutas CRUD y manejo de imágenes de productos
// - /usuarios  → rutas CRUD de usuarios y gestión de tickets
// - /admin     → rutas CRUD de administradores y login


const express = require('express');
const router = express.Router();

// Routers
const productoRoutes = require('./ProductosRoutes');
const usuarioRoutes = require('./UsuarioRoutes');
const adminRoutes = require('./AdminRoutes');

// Prefijos de rutas
router.use('/productos', productoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
