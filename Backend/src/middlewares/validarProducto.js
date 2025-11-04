// Middleware de Validación de Producto
//
// Descripción:
// Valida los datos enviados para crear o actualizar un producto
// usando express-validator.
//
// Campos validados:
// - codigo: obligatorio, 3-20 caracteres
// - nombre: obligatorio, 3-100 caracteres
// - marca: obligatorio, 2-50 caracteres
// - categoria: obligatorio, 'alimento' o 'juguete'
// - tipo_mascota: obligatorio, 'perro' o 'gato'
// - tamaño: opcional, 'pequeño', 'mediano' o 'grande'
// - precio: obligatorio, número > 0
// - stock: opcional, entero >= 0
// - activo: opcional, booleano
// - urls: obligatorio, array con al menos una URL
//
// Funcionalidad:
// - Si hay errores, responde con status 400 y detalles de validación
// - Si todo es correcto, llama a next() para continuar


const { body, validationResult } = require('express-validator');

const validarProducto = [
  // Validaciones básicas
  body('codigo')
    .exists().withMessage('El código es obligatorio')
    .isLength({ min: 3, max: 20 }).withMessage('El código debe tener entre 3 y 20 caracteres'),

  body('nombre')
    .exists().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

  body('marca')
    .exists().withMessage('La marca es obligatoria')
    .isLength({ min: 2, max: 50 }).withMessage('La marca debe tener entre 2 y 50 caracteres'),

  body('categoria')
    .exists().withMessage('La categoría es obligatoria')
    .isIn(['alimento', 'juguete']).withMessage('Categoría inválida'),

  body('tipo_mascota')
    .exists().withMessage('El tipo de mascota es obligatorio')
    .isIn(['perro', 'gato']).withMessage('Tipo de mascota inválido'),

  body('tamaño')
    .optional()
    .isIn(['pequeño', 'mediano', 'grande']).withMessage('Tamaño inválido'),

  body('precio')
    .exists().withMessage('El precio es obligatorio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock no puede ser negativo'),

  body('activo')
    .optional()
    .isBoolean().withMessage('Activo debe ser booleano'),

  body('urls')
    .exists().withMessage('Debe incluir al menos una URL de imagen')
    .isArray({ min: 1 }).withMessage('Debe haber al menos una imagen'),

  // Middleware final para capturar errores
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        ok: false,
        error: 'Datos inválidos',
        detalles: errores.array().map(err => err.msg)
      });
    }
    next();
  }
];

module.exports = validarProducto;
