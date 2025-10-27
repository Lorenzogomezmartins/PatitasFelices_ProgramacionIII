const Usuario = require('../../models/usuario');

const agregarTicket = async (req, res) => {
  try {
    const { id } = req.params; // id del usuario
    const { productos } = req.body; // lista de ObjectId de productos

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ ok: false, error: 'Debe enviar una lista de productos válida' });
    }

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    }

    // Agregar ticket nuevo
    usuario.tickets.push({
      productos,
      fechaDeCompra: new Date()
    });

    await usuario.save();

    res.status(201).json({
      ok: true,
      mensaje: 'Ticket agregado correctamente',
      tickets: usuario.tickets
    });
  } catch (error) {
    console.error('❌ Error al agregar ticket:', error);
    res.status(500).json({ ok: false, error: 'Error al agregar ticket' });
  }
};

module.exports = agregarTicket;
