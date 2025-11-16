// Función: obtenerUsuarioPorId
//
// Descripción:
// Recupera un usuario específico de la base de datos por su ID.
//
// Parámetros esperados:
// - req.params.id: String, ID del usuario a buscar
//
// Funcionamiento:
// - Valida que el ID sea un ObjectId válido
// - Busca el usuario por ID y realiza populate sobre 'tickets.productos' si es necesario
// - Si no existe el usuario, responde con 404
// - Si se encuentra, devuelve el objeto usuario en JSON
// - Maneja errores generales con status 500

const Usuario = require('../../models/usuario');
const mongoose = require('mongoose'); 

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const userId = req.params.id;

    //  Validar que el ID sea un ObjectId válido antes de buscar
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'ID de usuario no válido' 
      });
    }

    //  Buscar y popular (asumiendo que 'tickets.productos' son referencias)
    const usuario = await Usuario.findById(userId).populate('tickets.productos');

    if (!usuario) {
      // Usuario no encontrado (404)
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    }

    // Éxito
    res.json({ ok: true, usuario });
  } catch (error) {
    console.error(' Error al obtener usuario por ID:', error);
    // Error de servidor (500)
    res.status(500).json({ ok: false, error: 'Error interno al obtener usuario' });
  }
};

module.exports = obtenerUsuarioPorId;