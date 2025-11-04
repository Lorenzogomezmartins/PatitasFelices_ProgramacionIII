// Función: crearAdmin
//
// Descripción:
// Crea un nuevo administrador en la base de datos.
//
// Parámetros esperados en req.body:
// - nombre: String (obligatorio) - Nombre del administrador
// - email: String (obligatorio) - Correo electrónico único
// - password: String (obligatorio) - Contraseña (se hash automáticamente en el modelo)
// - rol: String ('admin' o 'superadmin', opcional; por defecto 'admin')
//
// Funcionamiento:
// - Valida que nombre, email y password estén presentes
// - Verifica que no exista otro admin con el mismo email
// - Crea un nuevo documento Admin y lo guarda en la base de datos
// - Responde con mensaje de éxito y objeto admin creado
// - En caso de error, responde con código HTTP y mensaje correspondiente

const Admin = require('../../models/admin');

const crearAdmin = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, mensaje: 'Faltan datos obligatorios.' });
    }

    const existeAdmin = await Admin.findOne({ email });
    if (existeAdmin) {
      return res.status(400).json({ ok: false, mensaje: 'El correo ya está registrado.' });
    }

    const nuevoAdmin = new Admin({ nombre, email, password, rol: rol || 'admin' });
    await nuevoAdmin.save();

    res.status(201).json({ ok: true, mensaje: 'Administrador creado con éxito.', admin: nuevoAdmin });
  } catch (error) {
    console.error("❌ Error al crear administrador:", error);
    res.status(500).json({ ok: false, mensaje: 'Error al crear administrador.', error: error.message });
  }
};


module.exports = crearAdmin;
