const Admin = require('../../models/admin');
const bcrypt = require('bcryptjs');

const crearAdmin = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' });
    }

    // Verificar si ya existe un admin con ese email
    const existeAdmin = await Admin.findOne({ email });
    if (existeAdmin) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    // Encriptar contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoAdmin = new Admin({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'admin'
    });

    await nuevoAdmin.save();
    res.status(201).json({ mensaje: 'Administrador creado con éxito.', admin: nuevoAdmin });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear administrador.', error: error.message });
  }
};

module.exports = crearAdmin;
