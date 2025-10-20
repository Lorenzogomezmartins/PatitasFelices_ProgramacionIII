// --------------------------------------------------------------
// Modelo: Admin
// --------------------------------------------------------------
// Representa a los administradores del sistema.
//
// Campos:
// - nombre: Nombre del administrador
// - email: Correo de acceso (único)
// - password: Contraseña encriptada
// - rol: Rol dentro del sistema ('admin' o 'superadmin')
// - activo: Estado de activación
// - productos: Lista de productos que administra (referencias)
// --------------------------------------------------------------

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del administrador es obligatorio.'],
      minlength: [2, 'El nombre debe tener al menos 2 caracteres.'],
      maxlength: [100, 'El nombre no puede superar los 100 caracteres.'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Debe ser un correo electrónico válido.']
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria.'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres.'],
      maxlength: [255, 'La contraseña no puede superar los 255 caracteres.']
    },
    rol: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin'
    },
    activo: {
      type: Boolean,
      default: true
    },
    // Relación: Productos administrados por este admin
    productos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto'
      }
    ]
  },
  {
    timestamps: true, 
    collection: 'admin'
  }
);

module.exports = mongoose.model('Admin', adminSchema);