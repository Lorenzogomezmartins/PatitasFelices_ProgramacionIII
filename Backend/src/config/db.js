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
