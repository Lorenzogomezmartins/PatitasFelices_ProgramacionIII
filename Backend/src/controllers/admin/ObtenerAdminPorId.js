// Función: obtenerAdminPorId
//
// Descripción:
// Obtiene los datos de un administrador específico por su ID.
//
// Parámetros esperados en req.params:
// - id: String (ID del administrador a buscar)
//
// Funcionamiento:
// - Busca el administrador en la base de datos usando Admin.findById
// - Incluye información de los productos relacionados (solo nombre y precio) usando populate
// - Si no encuentra al administrador, responde con código 404 y mensaje correspondiente
// - Si lo encuentra, responde con código 200 y los datos del administrador
// - En caso de error, responde con código 500 y mensaje de error
const Admin = require('../../models/admin');

const obtenerAdminPorId = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('productos', 'nombre precio');

    if (!admin) {
      return res.status(404).json({ mensaje: 'Administrador no encontrado.' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el administrador.', error: error.message });
  }
};

module.exports = obtenerAdminPorId;
