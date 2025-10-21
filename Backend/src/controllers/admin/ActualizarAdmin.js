const Admin = require('../../models/admin');
const bcrypt = require('bcryptjs');

const actualizarAdmin = async (req, res) => {
  try {
    const { nombre, email, password, rol, activo } = req.body;
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ mensaje: 'Administrador no encontrado.' });
    }

    // Si hay una nueva contraseña, la encripta
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    if (nombre) admin.nombre = nombre;
    if (email) admin.email = email;
    if (rol) admin.rol = rol;
    if (activo !== undefined) admin.activo = activo;

    await admin.save();
    res.status(200).json({ mensaje: 'Administrador actualizado con éxito.', admin });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar administrador.', error: error.message });
  }
};

module.exports = actualizarAdmin;
