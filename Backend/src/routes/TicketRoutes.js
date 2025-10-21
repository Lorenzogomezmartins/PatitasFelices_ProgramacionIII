const express = require('express');
const router = express.Router();

const { obtenerTickets, obtenerTicketPorId } = require('../controllers/ticket/ObtenerTicket');

// GET → Todos los tickets
router.get('/', obtenerTickets);

// GET → Ticket por ID
router.get('/:id', obtenerTicketPorId);

module.exports = router;
