require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const conectarDB = require('./src/config/db');
const RoutesMain = require('./src/routes/RoutesMain');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
conectarDB()
  .then(() => console.log('MongoDB conectado correctamente.'))
  .catch((err) => {
    console.error('Error al conectar con MongoDB:', err.message);
    process.exit(1);
  });

// Usar routes principales
app.use('/api', RoutesMain);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend de PatitasFelices funcionando!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
