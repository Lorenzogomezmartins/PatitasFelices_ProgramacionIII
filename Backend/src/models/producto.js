const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: [true, 'El código del producto es obligatorio.'],
    unique: true,
    minlength: [3, 'El código debe tener al menos 3 caracteres.'],
    maxlength: [20, 'El código no puede superar los 20 caracteres.']
  },
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio.'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres.'],
    maxlength: [100, 'El nombre no puede superar los 100 caracteres.']
  },
  categoria: {
    type: String,
    enum: ['alimento', 'juguete'],
    required: [true, 'La categoría del producto es obligatoria.']
  },
  tipo_mascota: {
    type: String,
    enum: ['perro', 'gato'],
    required: [true, 'El tipo de mascota es obligatorio.']
  },
  precio: {
    type: Number,
    required: [true, 'El precio del producto es obligatorio.'],
    min: [0.01, 'El precio debe ser mayor a 0.']
  },
  marca: {
    type: String,
    required: [true, 'La marca del producto es obligatoria.'],
    minlength: [2, 'La marca debe tener al menos 2 caracteres.'],
    maxlength: [50, 'La marca no puede superar los 50 caracteres.']
  },
  urls: {
    type: [String],
    required: [true, 'Debe incluir al menos una imagen del producto.'],
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: 'Debe haber al menos una URL de imagen.'
    }
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'El stock no puede ser negativo.']
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'producto'
});

module.exports = mongoose.model('Producto', productoSchema);
