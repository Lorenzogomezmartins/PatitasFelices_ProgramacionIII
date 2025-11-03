const Admin = require('../../models/admin');

const crearAdmin = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    console.log("🔹 Datos recibidos para crear admin:", req.body);

    if (!nombre || !email || !password) {
      console.log("❌ Faltan datos obligatorios");
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' });
    }

    // Verificar si ya existe admin con ese email
    const existeAdmin = await Admin.findOne({ email });
    if (existeAdmin) {
      console.log("❌ El email ya está registrado:", email);
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    // Crear admin (el pre('save') del modelo se encarga del hash)
    const nuevoAdmin = new Admin({
      nombre,
      email,
      password,  // en claro, se hash automáticamente
      rol: rol || 'admin'
    });

  

    res.status(201).json({ mensaje: 'Administrador creado con éxito.', admin: nuevoAdmin });
  } catch (error) {
    console.error("❌ Error al crear administrador:", error);
    res.status(500).json({ mensaje: 'Error al crear administrador.', error: error.message });
  }
};

module.exports = crearAdmin;
