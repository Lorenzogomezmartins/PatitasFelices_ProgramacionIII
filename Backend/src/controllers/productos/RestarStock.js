const Producto = require("../../models/producto");

const restarStock = async (req, res) => {
  try {
    const { productos } = req.body; // [{ id: "...", cantidad: N }, ...]

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ ok: false, mensaje: "No se enviaron productos válidos." });
    }

    // Recorremos cada producto y restamos su stock
    for (const item of productos) {
      const { id, cantidad } = item;

      const producto = await Producto.findById(id);
      if (!producto) continue; // Si no se encuentra, se salta

      // Si hay stock suficiente, se resta
      if (producto.stock >= cantidad) {
        producto.stock -= cantidad;
        await producto.save();
      }
    }

    res.json({ ok: true, mensaje: "Stock actualizado correctamente." });
  } catch (error) {
    console.error("Error al restar stock:", error);
    res.status(500).json({ ok: false, mensaje: "Error al actualizar el stock." });
  }
};

module.exports = restarStock;
