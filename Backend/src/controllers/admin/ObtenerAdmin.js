const Admin = require('../../models/admin');

const obtenerAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().populate('productos', 'nombre precio');
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener administradores.', error: error.message });
  }
};

module.exports = obtenerAdmins;
