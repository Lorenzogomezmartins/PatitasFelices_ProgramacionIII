const Admin = require('../../models/admin');

const obtenerAdminPorId = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('productos', 'nombre precio');

    if (!admin) {
      return res.status(404).json({ mensaje: 'Administrador no encontrado.' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el administrador.', error: error.message });
  }
};

module.exports = obtenerAdminPorId;
