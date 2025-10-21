/**
 * Crear un nuevo producto (usando código como identificador único)
 */
const Producto = require('../../models/producto');

const crearProducto = async (req, res) => {
  try {
    const datos = { ...req.body };

    // Conversión de tipos numéricos si vienen como string
    if (datos.precio !== undefined) datos.precio = parseFloat(datos.precio);
    if (datos.stock !== undefined) datos.stock = parseInt(datos.stock);

    // Manejo de imágenes si se suben archivos
    if (req.files && req.files.length > 0) {
      datos.urls = req.files.map(f => `/uploads/${f.filename}`);
    }

    // 🔹 Verificar si ya existe un producto con el mismo código
    const existe = await Producto.findOne({ codigo: datos.codigo });
    if (existe) {
      return res.status(400).json({
        ok: false,
        error: `Ya existe un producto con el código "${datos.codigo}".`
      });
    }

    // Crear nuevo producto
    const producto = await Producto.create(datos);

    res.status(201).json({
      ok: true,
      mensaje: 'Producto creado correctamente',
      producto
    });
  } catch (error) {
    // Manejo de validaciones de Mongoose
    if (error.name === 'ValidationError') {
      const detalles = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ ok: false, error: 'Datos inválidos', detalles });
    }

    // Manejo de errores genéricos
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
};

module.exports = crearProducto;
