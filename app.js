const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models'); // Importa Sequelize para la base de datos
const authRoutes = require('./routes/auth'); // Importa las rutas de autenticación
const productRoutes = require('./routes/products'); // Importa las rutas de productos
const categoryRoutes = require('./routes/categories'); //
// Inicializar Express
const app = express();

// Middleware
app.use(bodyParser.json());

// Rutas
app.use('/auth', authRoutes); // Usa las rutas de autenticación
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

// Inicializar el servidor
const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate(); // Conecta con la base de datos
    console.log('Base de datos conectada.');
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  } catch (error) {
    console.error('Error al conectar la base de datos:', error);
  }
});
