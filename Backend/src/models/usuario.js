// Modelo Usuario
// Representa a los usuarios registrados en Patitas Felices.
// Campos:
// - nombre: String, obligatorio, mínimo 2 caracteres
// - apellido: String, obligatorio, mínimo 2 caracteres
// - fechaIngreso: Date, fecha de registro, por defecto ahora, inmutable
// - tickets: Array de objetos (historial de compras), cada ticket incluye:
//    - productos: Array de objetos con referencia a Producto y cantidad
//    - total: Number, obligatorio, no negativo
//    - fechaDeCompra: Date, obligatorio, por defecto ahora


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
