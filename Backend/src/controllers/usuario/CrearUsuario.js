// Función: crearUsuario
//
// Descripción:
// Crea un usuario nuevo si no existe, utilizado típicamente al
// hacer login por primera vez.
//
// Parámetros esperados en req.body:
// - nombre: String, obligatorio
// - apellido: String, obligatorio
//
// Funcionamiento:
// - Valida que nombre y apellido estén presentes
// - Busca si ya existe un usuario con el mismo nombre y apellido
// - Si no existe, lo crea
// - Responde con el objeto usuario y mensaje de éxito
// - Maneja errores generales con status 500



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
