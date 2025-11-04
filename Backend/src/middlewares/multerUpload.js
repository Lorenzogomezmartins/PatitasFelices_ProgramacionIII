// Configuración de Multer para Subida de Imágenes
//
// Descripción:
// Permite subir imágenes al servidor y guardarlas en la carpeta /uploads.
//
// Funcionalidades:
// - Carpeta de destino: /uploads (se crea si no existe)
// - Nombres de archivo únicos: timestamp + número aleatorio + extensión original
// - Filtro de archivos: solo permite imágenes JPEG, JPG, PNG y WEBP
// - Uso: se exporta la instancia 'upload' para usar como middleware en rutas


const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Carpeta donde se guardarán las imágenes localmente
const uploadDir = path.join(__dirname, '../../uploads');

// Si no existe, la crea
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración del almacenamiento local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombreArchivo = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nombreArchivo);
  }
});

// Filtro de archivos permitidos
const fileFilter = (req, file, cb) => {
  const tipos = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (tipos.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, WEBP)'));
  }
};

// Exportar la instancia
const upload = multer({ storage, fileFilter });
module.exports = upload;
