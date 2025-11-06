// Función: eliminarAdmin
//
// Descripción:
// Elimina un administrador existente de la base de datos.
//
// Parámetros esperados:
// - req.params.id: String (ID del administrador a eliminar)
//
// Funcionamiento:
// - Busca al administrador por su ID en la base de datos
// - Si no existe, responde con código 404 y mensaje de error
// - Si existe, lo elimina utilizando deleteOne()
// - Responde con mensaje de éxito al eliminarlo
// - En caso de error, responde con código 500 y mensaje correspondiente

const Admin = require('../../models/admin');

const eliminarAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Administrador no encontrado.',
      });
    }

    await admin.deleteOne();

    res.status(200).json({
      ok: true,
      mensaje: 'Administrador eliminado correctamente.',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al eliminar administrador.',
      error: error.message,
    });
  }
};

module.exports = eliminarAdmin;
