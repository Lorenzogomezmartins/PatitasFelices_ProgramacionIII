// Función: agregarTicket
//
// Descripción:
// Agrega un nuevo ticket (compra) al historial de un usuario.
//
// Parámetros:
// - req.params.id: String, ID del usuario
// - req.body:
//    - productos: Array de objetos con referencia a Producto y cantidad
//    - total: Number, total de la compra
//
// Funcionamiento:
// - Valida que exista la lista de productos y que el total sea positivo
// - Busca al usuario por ID
// - Construye un nuevo ticket con fecha de compra actual
// - Agrega el ticket al array de tickets del usuario y guarda cambios
// - Responde con 201 y lista de tickets actualizada


const Usuario = require('../../models/usuario');

const agregarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    let { productos, total } = req.body;

    // 🔹 Convertir total a número por seguridad
    total = Number(total);

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ ok: false, error: 'Debe enviar una lista de productos válida' });
    }

    if (isNaN(total) || total <= 0) {
      return res.status(400).json({ ok: false, error: 'El total debe ser un número positivo' });
    }

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    }

    // 🔹 Crear un nuevo ticket según el esquema
    const nuevoTicket = {
      productos: productos.map(p => ({
        prod: {
          _id: p.prod._id,
          cantidad: Number(p.prod.cantidad)
        }
      })),
      total,
      fechaDeCompra: new Date() 
    };

    usuario.tickets.push(nuevoTicket);

    await usuario.save();

    res.status(201).json({
      ok: true,
      mensaje: 'Ticket agregado correctamente',
      tickets: usuario.tickets
    });
  } catch (error) {
    console.error("Error detallado al agregar ticket:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = agregarTicket;
