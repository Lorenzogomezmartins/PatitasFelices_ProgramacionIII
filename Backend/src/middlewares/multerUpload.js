
const multer = require('multer');
const path = require('path');

// 1. Configuración de almacenamiento local
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Carpeta donde se guardarán las imágenes
        // Asegúrate de que esta carpeta exista: /src/resources/uploads/
        cb(null, path.join(__dirname, '../resources/uploads')); 
    },
    filename: (req, file, cb) => {
        // Renombrar el archivo para evitar conflictos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Inicialización de Multer
// El campo 'fotoProducto' debe coincidir con el nombre usado en FormData (Paso 1)
const upload = multer({ storage: storage }).single('fotoProducto'); 

module.exports = upload;