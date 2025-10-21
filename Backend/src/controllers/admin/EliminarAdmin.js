const Admin = require('../../models/admin');

const eliminarAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ mensaje: 'Administrador no encontrado.' });
    }

    await admin.deleteOne();
    res.status(200).json({ mensaje: 'Administrador eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar administrador.', error: error.message });
  }
};

module.exports = eliminarAdmin;
