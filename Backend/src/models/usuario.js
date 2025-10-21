const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del usuario es obligatorio.'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres.']
    },
    apellido: {
      type: String,
      required: [true, 'El apellido del usuario es obligatorio.'],
      trim: true,
      minlength: [2, 'El apellido debe tener al menos 2 caracteres.']
    },
    fechaIngreso: {
      type: Date,
      default: Date.now,
      immutable: true
    },
    carrito: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'producto', // referencia al producto
          required: true
        },
        cantidad: {
          type: Number,
          required: true,
          min: [1, 'La cantidad mínima es 1']
        }
      }
    ]
  },
  {
    timestamps: false,
    versionKey: false
  }
);

module.exports = mongoose.model('Usuario', usuarioSchema);
