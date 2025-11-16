<p align="center">
  <img src="frontend/imágenes/Logo.png" width="120" alt="Logo de la veterinaria">
</p>


<h3 align="center">Lorenzo Gomez Martins y Santino Jonas Fernandez</h3>

<p align="center">
  💻 Trabajo Integrador Final · 🏫 UTN Avellaneda · 🗓️ Año 2025
</p>

---

<p align="center">
  🐾 <strong>PatitasFelices</strong> es tu tienda digital de confianza para consentir a tus mascotas de manera rápida y sencilla.<br/>
  Aquí encontrarás alimentos, juguetes y accesorios de calidad para perros y gatos, todo pensado para hacer feliz a tu compañero peludo. ¡Compra fácil, recibe rápido y haz sonreír a tu mascota!
</p>

---

## 🐶 ¿Qué ofrecemos en PatitasFelices?

En PatitasFelices encontrarás todo lo que tu mascota necesita para ser feliz y saludable:

### 🍖 Alimentos
- Comida seca y húmeda para perros y gatos
- Snacks y premios naturales
-  Diferentes tamaños de alimentos (grandes, medianos y pequeños)

### 🧸 Juguetes
- Pelotas, mordedores
- Peluches

> Todos nuestros productos están seleccionados pensando en la **salud**, el **bienestar** y la **diversión** de tu mascota.

---

## 🧾 Flujo del Usuario

### 👤 Cliente:
1. Ingresa su nombre
2. Redirecciona al Panel de Usuarios
3. Filtra por Alimento y/o jueguete, perro o gato y/o por tamaños
4. Selecciona un producto para guardar en el carrito
5. Confirma compra
6. Obtiene un **ticket** con  los datos importantes

### 🔐 Administrador y Superadministrador:
1. Inicia sesión(genera un token)
2. Redirecciona al panel de Admnistradores o Superadministradores Dependiendo el rol.
3. Lista y agrega Usuarios.
4. Lista, agrega, elimina o modifica Administradores (Solo accesible para el panel Superadmin).
5. Lista, agrega, filtra o modifica productos.

---

## 🛠️ Tecnologías Utilizadas

| Área             | Tecnologías                                     |
|------------------|--------------------------------------------------|
| 🧑‍🎨 Frontend      | HTML, CSS, JavaScript, Bootstrap         |
| ⚙️ Backend        | Node.js, Express.js, EJS, Mongoose        |
| 🗃️ Base de datos  | MongoDb                              |
| 🔒 Seguridad      | Bcrypt, dotenv, validaciones Joi, middlewares,  |
| 🧾 Otros          | Multer (carga de imágenes)      |

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=html,css,js,nodejs,MongoDb,git,github" />
  </a>
</p>

---

## 🧱 Estructura del Proyecto

mi-proyecto/
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── resources/
│   │   └── routes/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── imagenes/
│   ├── pages/
│   ├── scripts/
│   └── styles/
│
├── .gitignore
└── README.md

---

## 🧩 Funciones

### Clientes
- 🛠️ Interfaz responsiva
- 📍 Selector por tipo de producto, mascota o tamaño
- 📄 Ticket con detalles (cliente, producto, fecha, precio)
- 🌗 Alternar modo claro y modo oscuro con persistencia

### Administrador
- 🔐 Login con contraseña hash y token
- 📋 CRUD completo de productos
- ✏️ Cambio de Estado activo/inactivo
- 🧾 Estadisticas

---

## 🧪 Seguridad y Validaciones

- 🔒 Hash de contraseñas y token
- ✅ Productos inactivos ocultos en el Panel de Usuarios
- 🚫 Validar rol (Administrador y Superadministrador)
- 📋 Cargado de imagenes con Multer

---


## 📫 Contactos:
Lorenzo Gomez Martins
- 📧  lorenzogomezmartins@gmail.com
- 💼 [LinkedIn](en/lorenzo-gomez-martins-ab942b299)  
- 🧠 Portafolio y proyectos: [GitHub](https://github.com/Lorenzogomezmartins)

Santino Jonas Fernandez
- 📧  santinojonasfernandez14@gmail.com
- 💼 [https://www.linkedin.com/in/santino-fernandez/)  
- 🧠 Portafolio y proyectos: [GitHub](https://github.com/santinojfernandezz)


---
