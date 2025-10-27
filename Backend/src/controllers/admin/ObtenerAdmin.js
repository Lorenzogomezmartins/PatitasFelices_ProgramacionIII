const Admin = require('../../models/admin');

const obtenerAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ rol: /admin/i }).populate('productos', 'nombre precio');
    res.status(200).json({ ok: true, usuarios: admins });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener administradores.', error: error.message });
  }
};

module.exports = obtenerAdmins;