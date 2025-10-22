const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/menucontroller');

// Solo rutas de consulta
router.get('/', MenuController.obtenerTodos);
router.get('/:id', MenuController.obtenerPorId);

module.exports = router;