require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Importar rutas principales
const RoutesMain = require('./src/routes/RoutesMain');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Servir carpeta de imágenes
app.use('/resources', express.static(path.join(__dirname, 'src', 'resources')));

// Rutas principales
app.use('/api', RoutesMain);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend de PatitasFelices funcionando!');
});

// Función principal para conectar MongoDB y arrancar servidor
async function main() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB conectado correctamente.');

    // Arrancar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB:', err.message);
    process.exit(1);
  }
}

// Ejecutar main
main();
