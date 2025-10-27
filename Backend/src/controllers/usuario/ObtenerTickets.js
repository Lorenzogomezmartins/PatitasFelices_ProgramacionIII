const Usuario = require('../../models/usuario');

const obtenerTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Pipeline de agregación
    const tickets = await Usuario.aggregate([
      { $unwind: '$tickets' }, // desestructura el array de tickets
      { $sort: { 'tickets.fechaDeCompra': -1 } }, // ordenar por fecha de compra descendente
      { $skip: skip }, // saltar los tickets de páginas anteriores
      { $limit: limit }, // tomar solo los 5 siguientes
      {
        $project: {
          usuarioId: '$_id',
          nombreUsuario: '$nombre',
          apellidoUsuario: '$apellido',
          fechaDeCompra: '$tickets.fechaDeCompra',
          productos: '$tickets.productos', 
          total:  '$tickets.total'
        }
      }
    ]);

    res.status(200).json({
      ok: true,
      page,
      tickets
    });
  } catch (error) {
    console.error('Error al obtener tickets paginados con agregación:', error);
    res.status(500).json({ ok: false, error: 'Error al obtener tickets' });
  }
};

module.exports = obtenerTickets;