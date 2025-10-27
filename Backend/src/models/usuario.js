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

    //Lista de tickets (historial de compras)
    tickets: [
      {
        _id: false,
        productos: [
          {_id: false,
            prod: {
            _id: {
            type: String,
            ref: 'Producto', // referencia al modelo Producto
            required: true
          },
          cantidad: {
            type: Number,
            required: [true, 'La cantidad es obligatoria.'],
            min: [0, 'La cantidad no puede ser negativa.']
          }
          }
        }
        ],
        total: {
          type: Number,
          required: [true, 'El total es obligatorio.'],
          min: [0, 'El total no puede ser negativo.']
        },
        fechaDeCompra: {
          type: Date,
          default: Date.now,
          required: true
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
