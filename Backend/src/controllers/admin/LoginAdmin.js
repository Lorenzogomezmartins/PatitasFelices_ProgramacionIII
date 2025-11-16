const Admin = require('../../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const LoginAdmin = async (req, res) => {
  try {
    const { nombre, password } = req.body;

    if (!nombre || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Nombre y contraseña son obligatorios'
      });
    }

    const admin = await Admin.findOne({ nombre });

    if (!admin) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Administrador no encontrado'
      });
    }

    const passValida = await bcrypt.compare(password, admin.password);

    if (!passValida) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Contraseña incorrecta'
      });
    }

    // TOKEN
    const token = jwt.sign(
      {
        id: admin._id,
        rol: admin.rol,
        nombre: admin.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } // ← 7d
    );

    return res.status(200).json({
      ok: true,
      mensaje: 'Login exitoso',
      admin,
      token
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno',
      error: error.message
    });
  }
};

module.exports = LoginAdmin;
