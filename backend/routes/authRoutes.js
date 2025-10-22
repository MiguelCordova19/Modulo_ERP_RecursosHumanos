// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar usuario
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión de usuario
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   POST /api/auth/verify-session
 * @desc    Verificar si la sesión es válida
 * @access  Public
 */
router.post('/verify-session', authController.verifySession);

module.exports = router;