const Producto = require('../../models/producto');

const crearProducto = async (req, res) => {
  try {
    const datos = { ...req.body };

    // Convertir tipos simples
    datos.precio = parseFloat(datos.precio);
    datos.stock = parseInt(datos.stock);
    datos.activo = datos.activo === 'true' || datos.activo === true;

    // Asegurarse que urls sea un array (si vienen como string desde frontend)
    if (typeof datos.urls === 'string') datos.urls = [datos.urls];

    const producto = await Producto.create(datos);

    res.status(201).json({
      ok: true,
      mensaje: 'Producto creado correctamente',
      producto
    });
  } catch (error) {
    console.error('❌ Error al crear producto:', error);

    if (error.code === 11000 && error.keyPattern?.codigo) {
      return res.status(400).json({
        ok: false,
        error: `Ya existe un producto con el código "${error.keyValue.codigo}".`
      });
    }

    if (error.name === 'ValidationError') {
      const detalles = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ ok: false, error: 'Datos inválidos', detalles });
    }

    res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
};

module.exports = crearProducto;
