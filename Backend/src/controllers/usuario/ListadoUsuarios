// ListadoUsuarios.js
const Usuario = require('../../models/usuario');

const listadoUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, 'nombre apellido fechaIngreso'); // Solo campos que necesites
    res.json({ ok: true, usuarios });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ ok: false, error: 'Error al obtener usuarios', detalles: error.message });
  }
};

module.exports = listadoUsuarios;
