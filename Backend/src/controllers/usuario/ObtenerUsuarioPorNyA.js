const Usuario = require('../../models/usuario');

const obtenerUsuarioPorNombreApellido = async (req, res) => {
  try {
    const { nombre, apellido } = req.params;
    
    // 🔑 1. Validar parámetros esenciales
    if (!nombre || !apellido) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Debe proporcionar nombre y apellido' 
      });
    }

    let usuario = null;

    //  2. Intento de búsqueda exacta (case-sensitive)
    usuario = await Usuario.findOne({
      nombre: nombre,
      apellido: apellido
    });

    //  3. Si no encuentra, intenta con búsqueda exacta case-insensitive
    if (!usuario) {
      // Escapar caracteres especiales para el regex
      const nombreEscapado = nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const apellidoEscapado = apellido.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      usuario = await Usuario.findOne({
        // ^...$ asegura que solo coincidan los nombres completos
        nombre: { $regex: new RegExp(`^${nombreEscapado}$`, 'i') },
        apellido: { $regex: new RegExp(`^${apellidoEscapado}$`, 'i') },
      });
    }

    //  Usuario no encontrado (404)
    if (!usuario) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Usuario no encontrado con ese nombre y apellido',
        buscado: { nombre, apellido }
      });
    }

    //  Éxito
    res.json({ ok: true, usuario });
  } catch (error) {
    console.error(' ERROR en la búsqueda por Nombre y Apellido:', error.message);
    
    // Error de servidor (500)
    res.status(500).json({ 
      ok: false, 
      error: 'Error interno del servidor',
      detalle: error.message 
    });
  }
};

module.exports = obtenerUsuarioPorNombreApellido;