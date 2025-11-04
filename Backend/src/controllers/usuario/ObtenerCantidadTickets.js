// Función: obtenerCantidadTickets
//
// Descripción:
// Calcula el total de tickets (compras) registrados en todos los usuarios.
//
// Funcionamiento:
// - Usa un pipeline de agregación de MongoDB:
//     1. $unwind sobre el array 'tickets' de cada usuario
//     2. $count para contar el total de tickets
// - Devuelve totalTickets en JSON
// - Si no hay tickets, devuelve 0
// - Maneja errores generales con status 500


const Usuario = require('../../models/usuario');

const obtenerCantidadTickets = async (req, res) => {
  try {
    const resultado = await Usuario.aggregate([
      { $unwind: '$tickets' }, 
      { $count: 'totalTickets' } 
    ]);

    const totalTickets = resultado.length > 0 ? resultado[0].totalTickets : 0;

    res.status(200).json({
      ok: true,
      totalTickets
    });
  } catch (error) {
    console.error('Error al contar los tickets:', error);
    res.status(500).json({
      ok: false,
      error: 'Error al contar los tickets'
    });
  }
};

module.exports = obtenerCantidadTickets;
