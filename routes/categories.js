const express = require('express');
const router = express.Router();
const { Category } = require('../models'); // Asegúrate de importar el modelo Category

// Crear una nueva categoría
router.post('/', async (req, res) => {
  try {
    const { name } = req.body; // Obtener el nombre de la categoría desde el cuerpo de la solicitud

    // Validar que se haya pasado un nombre
    if (!name) {
      return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
    }

    // Crear la nueva categoría
    const category = await Category.create({ name });

    res.status(201).json({
      message: 'Categoría creada exitosamente',
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al crear la categoría',
      error: error.message,
    });
  }
});

module.exports = router;

router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll({ include: { model: Category, as: 'category' } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});
