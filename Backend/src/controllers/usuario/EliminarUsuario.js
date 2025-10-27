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
