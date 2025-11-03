const Admin = require('../../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginAdmin = async (req, res) => {
  try {
    const { nombre, password } = req.body;

    if (!nombre || !password) {
      return res.status(400).json({ ok: false, mensaje: 'Faltan datos obligatorios.' });
    }

    // 🔹 Buscar admin por nombre (case-insensitive)
    const admin = await Admin.findOne({ nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } });
    if (!admin) {
      return res.status(404).json({ ok: false, mensaje: 'Administrador no encontrado.' });
    }

    // 🔹 Comparar contraseña con hash
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ ok: false, mensaje: 'Contraseña incorrecta.' });
    }

    // 🔹 Generar token JWT
    const token = jwt.sign(
      { id: admin._id, rol: admin.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // 🔹 Responder con token y datos del admin
    return res.status(200).json({
      ok: true,
      mensaje: 'Login exitoso.',
      token,
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
