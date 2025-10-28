// C:\...\PatitasFelices_ProgramacionIII\Backend\src\controllers\productos\CrearProducto.js

// 1. Dependencias globales (SIEMPRE usando require)
const cloudinary = require('cloudinary').v2;
const Producto = require('../../models/producto');

// 2. Configuración de Cloudinary (Debe ir fuera de la función, pero no debe usar await)
// ⚠️ Asegúrate de tener estas variables de entorno configuradas
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Controlador para crear un nuevo producto, subiendo la imagen Base64 a Cloudinary.
 */
const crearProducto = async (req, res) => {
    try {
        const datos = { ...req.body };
        const base64Urls = datos.urls; // Esto es ['data:image/...']

        // 1. Manejo y Subida de Base64 a Cloudinary
        // Este bloque contiene el 'await' y está correctamente dentro de la función async.
        if (base64Urls && Array.isArray(base64Urls) && base64Urls.length > 0) {
            const uploadedUrls = [];
            
            for (const base64String of base64Urls) {
                const uploadResponse = await cloudinary.uploader.upload(base64String, {
                    folder: "productos-ecom", // Carpeta en Cloudinary
                });
                console.log("2. Subida a Cloudinary exitosa. URL:", uploadResponse.secure_url);
                uploadedUrls.push(uploadResponse.secure_url);
            }
            
            // Reemplazamos el Base64 con las URLS públicas
            datos.urls = uploadedUrls;
        }
        console.log("3. Datos enviados a Mongoose:", datos.urls);
        // 🔹 Conversión de tipos numéricos
        if (datos.precio !== undefined) datos.precio = parseFloat(datos.precio);
        if (datos.stock !== undefined) datos.stock = parseInt(datos.stock);

        // 🔹 Verificar si ya existe un producto con el mismo código (o ID)
        const existe = await Producto.findOne({ codigo: datos.codigo });
        if (existe) {
             return res.status(400).json({
                 ok: false,
                 error: `Ya existe un producto con el código "${datos.codigo}".`
             });
        }
        
        // 3. Crear producto con las URLs públicas
        const producto = await Producto.create(datos);

        res.status(201).json({
            ok: true,
            mensaje: 'Producto creado correctamente',
            producto
        });
    } catch (error) {
        // Manejo de errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const detalles = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ ok: false, error: 'Datos inválidos', detalles });
        }
        
        // Manejar otros errores (incluyendo los de Cloudinary)
        console.error('Error al crear producto o subir imagen:', error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor o al subir imagen' });
    }
};

// 3. Exportación (CommonJS)
module.exports = crearProducto;