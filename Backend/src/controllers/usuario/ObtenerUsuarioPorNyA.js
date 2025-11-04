// Función: obtenerUsuarioPorNombreApellido
//
// Descripción:
// Busca un usuario en la base de datos por su nombre y apellido.
//
// Parámetros esperados:
// - req.params.nombre: String, nombre del usuario
// - req.params.apellido: String, apellido del usuario
//
// Funcionamiento:
// - Valida que nombre y apellido estén presentes
// - Intenta búsqueda exacta (case-sensitive)
// - Si no encuentra, realiza búsqueda case-insensitive usando regex
// - Si no existe, responde con 404 y muestra los valores buscados
// - Si se encuentra, devuelve el objeto usuario en JSON
// - Maneja errores generales con status 500


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