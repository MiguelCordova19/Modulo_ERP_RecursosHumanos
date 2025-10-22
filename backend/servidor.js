const express = require('express');
const cors = require('cors');
const path = require('path');
const { probarConexion } = require('./configuration/baseDatos');
const { obtenerListaTrabajadores } = require('./controllers/trabajadorescontroller');
const MenuController = require('./controllers/menucontroller');
const MotivoPrestamoController = require('./controllers/motivoprestamocontroller');

const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const puerto = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de peticiones (útil para desarrollo)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// 📁 Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// 🏠 Ruta principal - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// 🔐 Ruta para servir la página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

// 🧹 Ruta para limpiar sesión
app.get('/clear-session', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'clear-session.html'));
});

// 🔍 Ruta para servir el dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dashboard.html'));
});

// 🔐 Rutas de Autenticación
app.use('/api/auth', authRoutes);

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

// 🏥 Ruta de health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ============================================
// MANEJO DE ERROR 404 - DEBE IR AL FINAL
// ============================================

// Middleware para capturar todas las rutas no encontradas
app.use((req, res, next) => {
    console.log(`🚨 [404] Ruta no encontrada: ${req.method} ${req.path}`);
    
    // Verificar si es una petición API
    if (req.path.startsWith('/api/')) {
        // Para APIs, enviar JSON
        return res.status(404).json({
            error: 'Endpoint no encontrado',
            path: req.path,
            message: 'La ruta API solicitada no existe'
        });
    } else {
        // Para páginas web, enviar el HTML con Spline
        return res.status(404).sendFile(path.join(__dirname, '../frontend', '404.html'));
    }
});

// ============================================
// MANEJO DE ERRORES DEL SERVIDOR (500, etc.)
// ============================================

// Middleware de manejo de errores general
app.use((err, req, res, next) => {
    console.error('❌ Error del servidor:', err.stack);
    
    const statusCode = err.status || 500;
    
    // Si es petición API, enviar JSON
    if (req.path.startsWith('/api/')) {
        return res.status(statusCode).json({
            error: 'Error del servidor',
            message: err.message || 'Ha ocurrido un error interno',
            status: statusCode
        });
    } else {
        // Para páginas web, enviar página de error 500
        return res.status(statusCode).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error ${statusCode}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
                        color: white;
                    }
                    .error-container {
                        text-align: center;
                        padding: 40px;
                        background: rgba(0, 0, 0, 0.5);
                        border-radius: 20px;
                        backdrop-filter: blur(10px);
                        max-width: 600px;
                    }
                    h1 { 
                        font-size: 6rem; 
                        margin: 0;
                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                    }
                    h2 { 
                        font-size: 2rem; 
                        margin: 10px 0;
                        font-weight: 300;
                    }
                    p {
                        font-size: 1.2rem;
                        margin: 20px 0;
                        line-height: 1.6;
                    }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 15px 40px;
                        background: white;
                        color: #f5576c;
                        text-decoration: none;
                        border-radius: 50px;
                        font-weight: bold;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    }
                    a:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                    }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <h1>${statusCode}</h1>
                    <h2>Error del Servidor</h2>
                    <p>Lo sentimos, algo salió mal en el servidor.</p>
                    <a href="/">Volver al Inicio</a>
                </div>
            </body>
            </html>
        `);
    }
});

const iniciarServidor = async () => {
    try {
        console.log('╔════════════════════════════════════════╗');
        console.log('║   🚀 Iniciando Sistema RRHH...        ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('');
        
        // Probar conexión a la base de datos
        await probarConexion();
        console.log('');
        
        // Iniciar servidor Express
        app.listen(puerto, () => {
            console.log('╔════════════════════════════════════════╗');
            console.log('║  ✅ Servidor iniciado exitosamente    ║');
            console.log('╠════════════════════════════════════════╣');
            console.log(`║  📍 URL: http://localhost:${puerto}         ║`);
            console.log('╠════════════════════════════════════════╣');
            console.log(`║  🔐 Login: /api/auth/login             ║`);
            console.log(`║  🍽️  Menús: /api/menus                 ║`);
            console.log(`║  👥 Trabajadores: /api/trabajadores    ║`);
            console.log(`║  💰 Préstamos: /api/motivos-prestamo   ║`);
            console.log(`║  📊 Dashboard: /dashboard              ║`);
            console.log('╚════════════════════════════════════════╝');
        });
        
    } catch (error) {
        console.error('╔════════════════════════════════════════╗');
        console.error('║  ❌ Error al iniciar servidor          ║');
        console.error('╚════════════════════════════════════════╝');
        console.error(error);
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

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('📴 SIGTERM recibido. Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📴 SIGINT recibido. Cerrando servidor...');
    process.exit(0);
});

iniciarServidor();

module.exports = app;