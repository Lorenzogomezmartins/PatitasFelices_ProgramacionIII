
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
      default: Date.now, // Se guarda automáticamente al crear el documento
      immutable: true // No se puede modificar después de creado
    }
  },
  {
    timestamps: false, // No se necesitan createdAt / updatedAt
    versionKey: false // Evita el campo __v de Mongoose
  }
);

module.exports = mongoose.model('Usuario', usuarioSchema);