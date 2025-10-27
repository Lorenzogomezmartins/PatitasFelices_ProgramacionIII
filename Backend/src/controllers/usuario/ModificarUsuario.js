const Usuario = require('../../models/usuario');

const modificarUsuario = async (req, res) => {
  try {
    const { nombre, apellido } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido },
      { new: true, runValidators: true }
    );

    if (!usuario) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    }

    res.json({
      ok: true,
      mensaje: 'Usuario modificado correctamente',
      usuario
    });
  } catch (error) {
    console.error('❌ Error al modificar usuario:', error);
    res.status(500).json({ ok: false, error: 'Error al modificar usuario' });
  }
};

module.exports = modificarUsuario;
