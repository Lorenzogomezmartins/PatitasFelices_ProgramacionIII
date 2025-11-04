// Conexión a MongoDB
// Función para conectar la aplicación a la base de datos PatitasFelices.
// Uso de mongoose.connect con configuración moderna.
//
// - process.env.MONGO_URI: URL de conexión a MongoDB
// - useNewUrlParser: true, para usar el nuevo parser de URL
// - useUnifiedTopology: true, para la nueva gestión de topología
//
// En caso de error, muestra mensaje y detiene la aplicación.


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Conexión a la base de datos PatitasFelices en MongoDB local
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado correctamente.');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1); // Detiene la app si no se puede conectar
  }
};

module.exports = connectDB;
