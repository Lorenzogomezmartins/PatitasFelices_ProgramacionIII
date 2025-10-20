const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario es obligatorio.'],
    },

    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producto',
          required: [true, 'El producto es obligatorio.'],
        },
        cantidad: {
          type: Number,
          required: [true, 'La cantidad es obligatoria.'],
          min: [1, 'La cantidad mínima es 1.'],
        },
      },
    ],

    total: {
      type: Number,
      default: 0,
      min: [0, 'El total no puede ser negativo.'],
    },

    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket', //  Relación: ticket generado desde este carrito
      default: null,
    },

    creadoEn: {
      type: Date,
      default: Date.now,
    },

    actualizadoEn: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// Middleware para actualizar la fecha de modificación
carritoSchema.pre('save', function (next) {
  this.actualizadoEn = new Date();
  next();
});

module.exports = mongoose.model('Carrito', carritoSchema);