const Producto = require('../../models/producto');

const crearProducto = async (req, res) => {
  try {
    const datos = { ...req.body };

    // Convertir tipos si vienen como string
    if (datos.precio !== undefined) datos.precio = parseFloat(datos.precio);
    if (datos.stock !== undefined) datos.stock = parseInt(datos.stock);

    // Manejo de imágenes si se suben archivos
    if (req.files && req.files.length > 0) {
      datos.urls = req.files.map(f => `/uploads/${f.filename}`);
    }

    // Crear producto
    const producto = await Producto.create(datos);

    res.status(201).json({
      ok: true,
      mensaje: 'Producto creado correctamente',
      producto
    });
  } catch (error) {
    // Error por código duplicado (como _id duplicado)
    if (error.code === 11000 && error.keyPattern?._id) {
      return res.status(400).json({
        ok: false,
        error: `Ya existe un producto con el código "${error.keyValue._id}".`
      });
    }

    // Error de validación
    if (error.name === 'ValidationError') {
      const detalles = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ ok: false, error: 'Datos inválidos', detalles });
    }

    console.error('Error al crear producto:', error);
    res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
};

module.exports = crearProducto;
