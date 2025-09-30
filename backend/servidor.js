const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { probarConexion } = require('./configuration/baseDatos');
const { obtenerListaTrabajadores } = require('./controllers/trabajadorescontroller');
const MenuController = require('./controllers/menucontroller');
const MotivoPrestamoController = require('./controllers/motivoprestamocontroller');
const menuRoutes = require('./routes/menuRoutes');

const app = express();
const puerto = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// 🏠 Ruta principal - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// 🔍 Ruta para servir el dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dashboard.html'));
});

// 📊 API Routes - Trabajadores
app.get('/api/trabajadores', obtenerListaTrabajadores);

// 🍽️ API Routes - Menús
app.use('/api/menus', menuRoutes);

// Rutas para Motivo Préstamo
app.get('/api/motivos-prestamo', MotivoPrestamoController.obtenerTodos);
app.get('/api/motivos-prestamo/:id', MotivoPrestamoController.obtenerPorId);
app.post('/api/motivos-prestamo', MotivoPrestamoController.crear);
app.put('/api/motivos-prestamo/:id', MotivoPrestamoController.actualizar);
app.delete('/api/motivos-prestamo/:id', MotivoPrestamoController.eliminar);

const iniciarServidor = async () => {
    try {
        console.log('🔄 Iniciando servidor...');
        await probarConexion();
        
        app.listen(puerto, () => {
            console.log('🎉 ¡Servidor iniciado exitosamente!');
            console.log(`📍 URL: http://localhost:${puerto}`);
            console.log(`🔗 API Menús: http://localhost:${puerto}/api/menus`);
            console.log(`📊 Dashboard: http://localhost:${puerto}/dashboard`);
        });
        
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
};

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

iniciarServidor();