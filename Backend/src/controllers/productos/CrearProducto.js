const Producto = require('../../models/producto');

/**
 * Crear un nuevo producto con soporte para una imagen subida con Multer.
 */
const crearProducto = async (req, res) => {
  try {
    // Extraer datos del cuerpo y limpiar strings
    let { _id, nombre, categoria, tipo_mascota, precio, marca, stock, activo, tamano } = req.body;

_id = _id?.trim();
nombre = nombre?.trim();
marca = marca?.trim();
categoria = categoria?.trim();
tipo_mascota = tipo_mascota?.trim();
tamano = tamano?.trim();


    // Parsear valores numéricos
    precio = parseFloat(precio);
    stock = parseInt(stock) || 0;

    // Si no viene activo, asumir true
    activo = activo === undefined ? true : (activo === "true" || activo === true);

    // Validaciones estrictas
    if (
      !_id || !_id.length ||
      !nombre || !nombre.length ||
      !marca || !marca.length ||
      !categoria || !categoria.length ||
      !tipo_mascota || !tipo_mascota.length ||
      !tamano || !tamano.length ||
      isNaN(precio)
    ) {
      console.warn("⚠️ Campos inválidos:", { _id, nombre, marca, categoria, tipo_mascota, tamano, precio });
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    // Verificar que se haya subido una imagen
    if (!req.file) {
      console.warn("⚠️ No se recibió imagen en la solicitud.");
      return res.status(400).json({ mensaje: 'Debe subir al menos una imagen del producto.' });
    }

    // Construir URL de la imagen
    const url = `/uploads/${req.file.filename}`;

    // Crear instancia del producto
    const nuevoProducto = new Producto({
      _id,
      nombre,
      categoria,
      tipo_mascota,
      precio,
      marca,
      urls: [url],
      stock,
      activo,
      tamano,
    });

    // Guardar en la base de datos
    await nuevoProducto.save();

    console.log("✅ Producto guardado correctamente:", nuevoProducto);

    res.status(201).json({
      ok: true,
      mensaje: '✅ Producto creado correctamente.',
      producto: nuevoProducto,
    });

  } catch (error) {
    console.error('❌ Error al crear producto:', error);

    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ mensaje: `Error de validación: ${errores}` });
    }

    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
  }
};

module.exports = crearProducto;
