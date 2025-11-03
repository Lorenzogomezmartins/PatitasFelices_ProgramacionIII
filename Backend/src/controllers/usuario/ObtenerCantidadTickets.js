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
