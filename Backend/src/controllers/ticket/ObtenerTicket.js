/**
 * ObtenerTickets.js
 * Devuelve todos los tickets o un ticket específico por ID.
 */

const Ticket = require('../../models/ticket');

const obtenerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json({ ok: true, tickets });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Error al obtener tickets', detalles: error.message });
  }
};

const obtenerTicketPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ ok: false, error: 'Ticket no encontrado' });

    res.json({ ok: true, ticket });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Error al obtener ticket', detalles: error.message });
  }
};

module.exports = { obtenerTickets, obtenerTicketPorId };
