const Producto = require("../../models/producto");

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    let { nombre, categoria, tipo_mascota, precio, marca, stock, activo, tamano } = req.body;

    // URL de la nueva imagen si se subió
    const url = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Buscar producto existente
    const productoExistente = await Producto.findById(id);
    if (!productoExistente) {
      return res.status(404).json({ ok: false, mensaje: "Producto no encontrado." });
    }

    // Construir objeto solo con campos enviados
    const datosActualizados = {};

    if (nombre) datosActualizados.nombre = nombre.trim();
    if (marca) datosActualizados.marca = marca.trim();
    if (categoria) datosActualizados.categoria = categoria.trim().toLowerCase();
    if (tipo_mascota) datosActualizados.tipo_mascota = tipo_mascota.trim().toLowerCase();
    if (tamano) datosActualizados.tamano = tamano.trim().toLowerCase();
    if (precio !== undefined && !isNaN(precio)) datosActualizados.precio = Number(precio);
    if (stock !== undefined && !isNaN(stock)) datosActualizados.stock = Number(stock);
    if (activo !== undefined) datosActualizados.activo = activo === "true" || activo === true;

    // Manejo de imagen: preservar si no hay nueva
    if (url) {
      datosActualizados.urls = [url];
    } else {
      datosActualizados.urls = productoExistente.urls;
    }

    // Preservar código original
    datosActualizados._id = productoExistente._id;

    // Actualizar producto
    const productoActualizado = await Producto.findOneAndUpdate(
      { _id: id },
      { $set: datosActualizados },
      { new: true, runValidators: true, context: "query" }
    );

    res.json({
      ok: true,
      mensaje: "✅ Producto actualizado correctamente.",
      producto: productoActualizado,
    });

  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar producto",
      error: error.message,
    });
  }
};

module.exports = actualizarProducto;
