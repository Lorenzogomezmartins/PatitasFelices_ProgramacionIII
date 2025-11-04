// Función: listadoUsuarios
//
// Descripción:
// Obtiene la lista de todos los usuarios registrados.
//
// Funcionamiento:
// - Recupera todos los usuarios de la base de datos
// - Solo devuelve los campos: nombre, apellido y fechaIngreso
// - Responde con JSON que incluye array de usuarios
// - Maneja errores generales con status 500


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
