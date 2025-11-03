const Usuario = require('../../models/usuario');

const obtenerProductoMasVendido = async (req, res) => {
  try {
    const resultado = await Usuario.aggregate([
      { $unwind: "$tickets" },
      { $unwind: "$tickets.productos" },
      {
        $group: {
          _id: "$tickets.productos.prod._id", // ID del producto
          totalVendido: { $sum: "$tickets.productos.prod.cantidad" } // suma de cantidades
        }
      },
      { $sort: { totalVendido: -1 } },
      { $limit: 1 }
    ]);

    if (resultado.length === 0) {
      return res.status(200).json({
        ok: true,
        mensaje: "No hay ventas registradas aún.",
        productoMasVendido: null
      });
    }

    res.status(200).json({
      ok: true,
      productoMasVendido: {
        idProducto: resultado[0]._id,
        totalVendido: resultado[0].totalVendido
      }
    });
  } catch (error) {
    console.error("Error al obtener el producto más vendido:", error);
    res.status(500).json({
      ok: false,
      error: "Error al obtener el producto más vendido"
    });
  }
};

module.exports = obtenerProductoMasVendido;
