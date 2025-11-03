const Producto = require("../../models/producto");

/**
 * Actualizar un producto existente
 */
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    let { nombre, categoria, tipo_mascota, precio, marca, stock, activo, tamano } = req.body;

    // Limpiar strings
    nombre = nombre?.trim();
    marca = marca?.trim();
    categoria = categoria?.trim();
    tipo_mascota = tipo_mascota?.trim();
    tamano = tamano?.trim();

    // Parsear valores numéricos
    precio = parseFloat(precio);
    stock = parseInt(stock) || 0;

    // Parsear activo
    activo = activo === undefined ? true : (activo === "true" || activo === true);

    // Validaciones estrictas (opcional: podrías permitir que solo algunos campos se actualicen)
    if (
      !nombre?.length ||
      !marca?.length ||
      !categoria?.length ||
      !tipo_mascota?.length ||
      !tamano?.length ||
      isNaN(precio)
    ) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    // URL de la imagen
    const url = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Construir objeto con campos a actualizar
    const datosActualizados = { nombre, categoria, tipo_mascota, precio, marca, stock, activo, tamano };
    if (url) datosActualizados.urls = [url]; // reemplaza la imagen si se subió una

    // Actualizar producto
    const producto = await Producto.findByIdAndUpdate(
      id,
      { $set: datosActualizados },
      { new: true, runValidators: true }
    );

    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado." });

    res.json({ mensaje: "✅ Producto actualizado correctamente.", producto });

  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ mensaje: `Error al actualizar producto: ${error.message}` });
  }
};

module.exports = actualizarProducto;
