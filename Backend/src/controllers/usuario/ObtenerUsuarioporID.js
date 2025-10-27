const Usuario = require('../../models/usuario');
const mongoose = require('mongoose'); // Importar mongoose para la validación del ObjectId

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const userId = req.params.id;

    // 🔑 1. Validar que el ID sea un ObjectId válido antes de buscar
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'ID de usuario no válido' 
      });
    }

    // 🔍 2. Buscar y popular (asumiendo que 'tickets.productos' son referencias)
    const usuario = await Usuario.findById(userId).populate('tickets.productos');

    if (!usuario) {
      // ✅ Usuario no encontrado (404)
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    }

    // ✅ Éxito
    res.json({ ok: true, usuario });
  } catch (error) {
    console.error('❌ Error al obtener usuario por ID:', error);
    // 💥 Error de servidor (500)
    res.status(500).json({ ok: false, error: 'Error interno al obtener usuario' });
  }
};

module.exports = obtenerUsuarioPorId;