const Admin = require('../../models/admin');
const bcrypt = require('bcryptjs');

const loginAdmin = async (req, res) => {
  try {
    const { nombre, password } = req.body;

    if (!nombre || !password) {
      return res.status(400).json({ ok: false, mensaje: 'Faltan datos obligatorios.' });
    }

    // 🔹 Buscar admin existente
    const admin = await Admin.findOne({ nombre });

    if (!admin) {
      return res.status(404).json({ ok: false, mensaje: 'Administrador no encontrado.' });
    }

    // 🔹 Comparar contraseña
    const validPassword = password === admin.password;
    if (!validPassword) {
      return res.status(401).json({ ok: false, mensaje: 'Contraseña incorrecta.' });
    }

    // 🔹 Si todo está bien
    return res.status(200).json({
      ok: true,
      mensaje: 'Login exitoso.',
      admin: {
        _id: admin._id,
        nombre: admin.nombre,
        rol: admin.rol,
        email: admin.email,
      },
    });

  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el login.', error: error.message });
  }
};

module.exports = loginAdmin;