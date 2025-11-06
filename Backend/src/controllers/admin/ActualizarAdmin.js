// --------------------------------------------------------------
// Función: actualizarAdmin
//
// Descripción:
// Actualiza los datos de un administrador existente en la base de datos.
//
// Parámetros esperados en req.body:
// - nombre: String 
// - email: String 
// - password: String ( se guarda en hash si se proporciona)
// - rol: String ('admin' o 'superadmin')
// - activo: Boolean 
//
// Funcionamiento:
// - Busca al administrador por ID (req.params.id)
// - Si no existe, responde con 404
// - Si se proporciona contraseña, la encripta con bcrypt
// - Actualiza los campos proporcionados y guarda los cambios
// - Responde con mensaje de éxito y objeto admin actualizado
// --------------------------------------------------------------

const Admin = require('../../models/admin');
const bcrypt = require('bcryptjs');

const actualizarAdmin = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
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

    await admin.save();
    res.status(200).json({ mensaje: 'Administrador actualizado con éxito.', admin });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar administrador.', error: error.message });
  }
};

module.exports = actualizarAdmin;
