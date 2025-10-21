require('dotenv').config();
const mongoose = require('mongoose');
const conectarDB = require('./src/config/db'); 

// Importar modelos desde src/models
const Producto = require('./src/models/producto');
const Usuario = require('./src/models/usuario');
const Admin = require('./src/models/admin');

const cargarDatos = async () => {
  try {
    // Conexión a MongoDB
    await conectarDB();

    // Limpiar colecciones para evitar duplicados
    await Producto.deleteMany();
    await Usuario.deleteMany();
    await Admin.deleteMany();
    console.log('Colecciones limpiadas');

    // --- PRODUCTOS ---
    const productos = await Producto.insertMany([
      {
        codigo: 'A001',
        nombre: 'Alimento premium para perros',
        categoria: 'alimento',
        tipo_mascota: 'perro',
        precio: 4500,
        marca: 'DogLife',
        urls: ['https://ejemplo.com/perro1.jpg'],
        stock: 25,
      },
      {
        codigo: 'J002',
        nombre: 'Pelota interactiva para gatos',
        categoria: 'juguete',
        tipo_mascota: 'gato',
        precio: 1300,
        marca: 'CatFun',
        urls: ['https://ejemplo.com/gato1.jpg'],
        stock: 40,
      }
    ]);

    // --- USUARIOS ---
    const usuarios = await Usuario.insertMany([
      { nombre: 'Laura', apellido: 'Fernández' },
      { nombre: 'Carlos', apellido: 'Gómez' },
      { nombre: 'Sofía', apellido: 'Martínez' }
    ]);

    // --- ADMINS ---
    const superadmin = await Admin.create({
      email: 'superadmin@patitas.com',
      nombre: 'Lucía',
      password: '123456',
      rol: 'superadmin'
    });

    const admin1 = await Admin.create({
      email: 'admin1@patitas.com',
      nombre: 'Diego',
      password: '123456',
      rol: 'admin'
    });

    const admin2 = await Admin.create({
      email: 'admin2@patitas.com',
      nombre: 'Romina',
      password: '123456',
      rol: 'admin'
    });

    console.log('Datos cargados correctamente');
    console.log({
      productosCreados: productos.length,
      usuariosCreados: usuarios.length,
      adminsCreados: 3
    });

    // Cerrar conexión
    mongoose.connection.close();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    mongoose.connection.close();
  }
};

// Ejecutar la función
cargarDatos();
