// Middleware de Autenticación de Administradores
//
// Descripción:
// Verifica que la solicitud incluya un token JWT válido en el header
// 'Authorization'. Permite acceso solo a usuarios con token de admin.
//
// Funcionamiento:
// - Extrae el token del header 'Authorization' (Bearer <token>)
// - Valida el token usando JWT y la clave secreta (process.env.JWT_SECRET)
// - Si es válido, agrega la información decodificada a req.admin
// - Si no es válido o no existe, responde con 401 (no autorizado)
//
// Uso:
// app.use(authAdmin) en rutas que requieren privilegios de administrador


const jwt = require('jsonwebtoken');
require('dotenv').config();

const authAdmin = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ ok: false, mensaje: 'Token no proporcionado.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // guarda id y rol
    next();

  } catch (error) {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado.' });
  }
};

module.exports = authAdmin;
