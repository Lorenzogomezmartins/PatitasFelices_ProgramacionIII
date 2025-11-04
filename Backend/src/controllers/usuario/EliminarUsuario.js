// Función: eliminarUsuario
//
// Descripción:
// Elimina un usuario de la base de datos según su ID.
//
// Parámetros esperados:
// - req.params.id: String, ID del usuario a eliminar
//
// Funcionamiento:
// - Busca y elimina el usuario por ID usando findByIdAndDelete
// - Si no existe, responde con 404 (Usuario no encontrado)
// - Si se elimina correctamente, responde con mensaje de éxito
// - Maneja errores generales con status 500


const Usuario = require('../../models/usuario');

const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuario) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    }

    res.json({
      ok: true,
      mensaje: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ ok: false, error: 'Error al eliminar usuario' });
  }
};

module.exports = eliminarUsuario;
