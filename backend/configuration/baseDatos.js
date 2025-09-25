const {Pool} = require('pg');
require('dotenv').config();

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