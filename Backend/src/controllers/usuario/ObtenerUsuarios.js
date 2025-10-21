/**
 * CrearUsuario.js
 * Crea un usuario al hacer login, si no existe.
 */

const Usuario = require('../../models/usuario');

const crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({ ok: false, error: 'Nombre y apellido son obligatorios' });
    }

    // Buscar si ya existe
    let usuario = await Usuario.findOne({ nombre, apellido });
    if (!usuario) {
      usuario = await Usuario.create({ nombre, apellido });
    }

    res.json({ ok: true, mensaje: 'Usuario listo', usuario });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Error al crear/obtener usuario', detalles: error.message });
  }
};

module.exports = crearUsuario;
