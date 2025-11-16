// Servidor Backend de PatitasFelices
//
// Descripción:
// Inicializa el servidor Express, conecta con MongoDB y define 
// rutas y middleware principales.
//
// Funcionalidades principales:
// - Conexión a MongoDB usando mongoose con URI desde .env
// - Middleware:
//     - express.json() y express.urlencoded() para parseo de JSON y forms
//     - cors() para habilitar solicitudes desde otros dominios
// - Servir imágenes estáticamente desde /uploads
// - Rutas principales montadas en /api (RoutesMain)
// - Ruta de prueba en /
// - Inicio del servidor en puerto definido por process.env.PORT o 4000


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

// Servir imágenes estáticamente
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas principales
app.use('/api', RoutesMain);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend de PatitasFelices funcionando!');
});

// Función principal para conectar MongoDB y arrancar servidor
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(' MongoDB conectado correctamente.');

    app.listen(PORT, () => {
      console.log(` Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(' Error al conectar con MongoDB:', err.message);
    process.exit(1);
  }
}

// Ejecutar main
main();
