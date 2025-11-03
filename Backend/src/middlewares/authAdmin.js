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
