const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario es obligatorio.']
    },

    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producto',
          required: [true, 'El producto es obligatorio.']
        },
        cantidad: {
          type: Number,
          required: [true, 'La cantidad es obligatoria.'],
          min: [1, 'La cantidad mínima es 1.']
        },
        precio_unitario: {
          type: Number,
          required: [true, 'El precio unitario es obligatorio.'],
          min: [0.01, 'El precio unitario debe ser mayor a 0.']
        },
        subtotal: {
          type: Number,
          required: [true, 'El subtotal es obligatorio.'],
          min: [0, 'El subtotal no puede ser negativo.']
        }
      }
    ],

    subtotal: {
      type: Number,
      required: [true, 'El subtotal es obligatorio.'],
      min: [0, 'El subtotal no puede ser negativo.']
    },

    total: {
      type: Number,
      required: [true, 'El total es obligatorio.'],
      min: [0, 'El total no puede ser negativo.']
    },

    fecha_compra: {
      type: Date,
      default: Date.now,
      immutable: true 
    }
  },
  { 
    versionKey: false,
    timestamps: true 
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
