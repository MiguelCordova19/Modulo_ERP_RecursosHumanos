const {Pool} = require('pg');
const path = require('path');

// Cargar .env desde la carpeta backend específicamente
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Debug: Mostrar variables de entorno (solo en desarrollo)
console.log('🔍 Variables de entorno cargadas:');
console.log(`   DB_HOST: ${process.env.DB_HOST}`);
console.log(`   DB_PORT: ${process.env.DB_PORT}`);
console.log(`   DB_NAME: ${process.env.DB_NAME}`);
console.log(`   DB_USER: ${process.env.DB_USER}`);
console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' : 'NO DEFINIDA'}`);

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

const probarConexion = async () => {
    try {
        const cliente = await pool.connect();
        console.log('Conexion exitosa');
        console.log(`Base de datos: ${process.env.DB_NAME}`);
    } catch (error) {
        console.error('Error al conectar con PostgreSQL', error.message)
    }
};

module.exports = {pool, probarConexion};