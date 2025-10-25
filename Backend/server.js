require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const RoutesMain = require('./src/routes/RoutesMain');

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado correctamente.'))
  .catch((err) => {
    console.error('Error al conectar con MongoDB:', err.message);
    process.exit(1);
  });

// ✅ Servir carpeta de imágenes (importante)
app.use('/resources', express.static(path.join(__dirname, 'src', 'resources')));

// ✅ Usar rutas principales
app.use('/api', RoutesMain);

// ✅ Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend de PatitasFelices funcionando!');
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
