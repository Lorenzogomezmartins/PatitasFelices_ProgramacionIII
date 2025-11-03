const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del administrador es obligatorio.'],
      minlength: 2,
      maxlength: 100,
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
      minlength: 4,
      maxlength: 255
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

// 🔹 Antes de guardar o actualizar, hashea la contraseña
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Admin', adminSchema);
