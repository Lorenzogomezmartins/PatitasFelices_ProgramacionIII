// Función: obtenerAdmins
//
// Descripción:
// Obtiene todos los administradores registrados en la base de datos.
//
// Funcionamiento:
// - Busca todos los documentos de la colección Admin cuyo rol sea "admin" (case-insensitive)
// - Incluye información de los productos relacionados (solo nombre y precio) usando populate
// - Responde con código 200 y un objeto JSON con ok: true y la lista de administradores
// - En caso de error, responde con código 500 y mensaje correspondiente
const Admin = require('../../models/admin');

const obtenerAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ rol: /admin/i });
    res.status(200).json({ ok: true, usuarios: admins });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener administradores.',
      error: error.message,
    });
  }
};
module.exports = obtenerAdmins;