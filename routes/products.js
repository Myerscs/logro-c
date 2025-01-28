const express = require('express');
const router = express.Router();
const { Product, Category} = require('../models'); // Asegúrate de que el modelo esté importado correctamente
// Asignar una categoría a un producto existente
router.patch('/:id/category', async (req, res) => {
    try {
      const { id } = req.params; // ID del producto
      const { categoryId } = req.body; // Nueva categoría
  
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      product.categoryId = categoryId; // Actualiza la categoría
      await product.save();
  
      res.status(200).json({
        message: 'Categoría asignada al producto',
        product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al asignar la categoría',
        error: error.message,
      });
    }
  });
// Crear un producto
router.post('/', async (req, res) => {
  try {
    const { name, price, stock, categoryId } = req.body;
    const product = await Product.create({ name, price, stock, categoryId });
    res.status(201).json({
      message: 'Producto creado',
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al crear el producto',
      error: error.message,
    });
  }
  
});
// Actualizar un producto existente
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params; // ID del producto a actualizar
      const { name, price, stock, categoryId } = req.body; // Nuevos datos
  
      // Buscar el producto por su ID
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      // Actualizar los datos del producto
      product.name = name || product.name;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.categoryId = categoryId || product.categoryId;
  
      // Guardar los cambios en la base de datos
      await product.save();
  
      res.status(200).json({
        message: 'Producto actualizado',
        product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al actualizar el producto',
        error: error.message,
      });
    }
  });
  // Obtener todos los productos con su categoría
router.get('/', async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [{
          model: Category,
          as: 'category', // El alias que definimos en la asociación
          attributes: ['id', 'name'], // Solo seleccionamos los campos relevantes de la categoría
        }],
      });
  
      res.status(200).json({
        message: 'Productos con categorías',
        products,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al obtener los productos con categorías',
        error: error.message,
      });
    }
  });

// Asignar un producto a una categoría
router.post('/:productId/category', async (req, res) => {
    try {
      const { productId } = req.params; // Obtener el ID del producto desde los parámetros de la URL
      const { categoryId } = req.body; // Obtener el ID de la categoría desde el cuerpo de la solicitud
  
      // Verificar si el producto existe
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      // Verificar si la categoría existe
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
  
      // Asignar la categoría al producto (actualizar el campo `categoryId`)
      product.categoryId = categoryId;
      await product.save(); // Guardar los cambios
  
      res.status(200).json({
        message: 'Producto asignado a la categoría exitosamente',
        product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al asignar producto a la categoría',
        error: error.message,
      });
    }
  });
// Filtrar productos por categoría
router.get('/category/:categoryId', async (req, res) => {
    try {
      const { categoryId } = req.params; // Obtener el ID de la categoría desde los parámetros de la URL
  
      // Buscar productos que pertenecen a la categoría
      const products = await Product.findAll({
        where: { categoryId }, // Filtrar por categoryId
        include: [{
          model: Category,
          as: 'category', // Alias para la relación
          attributes: ['id', 'name'], // Seleccionar los campos relevantes de la categoría
        }],
      });
  
      // Si no hay productos para esa categoría
      if (products.length === 0) {
        return res.status(404).json({ message: 'No hay productos en esta categoría' });
      }
  
      res.status(200).json({
        message: `Productos en la categoría con ID ${categoryId}`,
        products,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al filtrar los productos por categoría',
        error: error.message,
      });
    }
  });  

// Eliminar un producto
router.delete('/:productId', async (req, res) => {
    try {
      const { productId } = req.params; // Obtener el ID del producto desde los parámetros de la URL
  
      // Buscar el producto por ID
      const product = await Product.findByPk(productId);
  
      // Verificar si el producto existe
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      // Eliminar el producto
      await product.destroy(); // Esto eliminará el producto de la base de datos
  
      res.status(200).json({
        message: `Producto con ID ${productId} eliminado exitosamente`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al eliminar el producto',
        error: error.message,
      });
    }
  });
module.exports = router;

