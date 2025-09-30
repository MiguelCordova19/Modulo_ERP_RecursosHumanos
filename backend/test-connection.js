const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 DIAGNÓSTICO DE CONEXIÓN POSTGRESQL\n');

// Mostrar configuración actual
console.log('📋 Configuración actual:');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   Puerto: ${process.env.DB_PORT}`);
console.log(`   Base de datos: ${process.env.DB_NAME}`);
console.log(`   Usuario: ${process.env.DB_USER}`);
console.log(`   Contraseña: ${process.env.DB_PASSWORD ? '***' : 'NO DEFINIDA'}\n`);

// Función para probar diferentes configuraciones
async function probarConexion(config, descripcion) {
    console.log(`🧪 Probando: ${descripcion}`);
    
    const pool = new Pool(config);
    
    try {
        const cliente = await pool.connect();
        const result = await cliente.query('SELECT version()');
        console.log(`   ✅ ÉXITO: Conectado a PostgreSQL`);
        console.log(`   📊 Versión: ${result.rows[0].version.substring(0, 50)}...`);
        cliente.release();
        await pool.end();
        return true;
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.code} - ${error.message}`);
        if (error.code === '28P01') {
            console.log(`   💡 Sugerencia: Error de autenticación - verificar usuario/contraseña`);
        } else if (error.code === 'ECONNREFUSED') {
            console.log(`   💡 Sugerencia: No se puede conectar - verificar que PostgreSQL esté ejecutándose`);
        } else if (error.code === '3D000') {
            console.log(`   💡 Sugerencia: Base de datos no existe`);
        }
        await pool.end();
        return false;
    }
}

async function diagnosticar() {
    console.log('🚀 Iniciando diagnóstico...\n');
    
    // Configuración 1: Actual del .env
    const config1 = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    };
    
    const exito1 = await probarConexion(config1, 'Configuración actual (.env)');
    
    if (!exito1) {
        // Configuración 2: Forzar tipos de datos
        const config2 = {
            host: 'localhost',
            port: 5432,
            database: 'root',
            user: 'root',
            password: 'root'
        };
        
        await probarConexion(config2, 'Configuración hardcodeada');
        
        // Configuración 3: Con SSL deshabilitado
        const config3 = {
            host: 'localhost',
            port: 5432,
            database: 'root',
            user: 'root',
            password: 'root',
            ssl: false
        };
        
        await probarConexion(config3, 'Con SSL deshabilitado');
    }
    
    console.log('\n🔧 PRÓXIMOS PASOS:');
    if (exito1) {
        console.log('   ✅ La conexión funciona correctamente');
        console.log('   🚀 Puedes iniciar tu servidor Node.js');
    } else {
        console.log('   ❌ Hay un problema con la conexión desde Node.js');
        console.log('   🔍 Verifica que el archivo .env esté en la ubicación correcta');
        console.log('   📁 Debe estar en: backend/.env');
    }
}

diagnosticar().then(() => {
    console.log('\n✨ Diagnóstico completado');
    process.exit(0);
}).catch(error => {
    console.error('\n💥 Error en diagnóstico:', error);
    process.exit(1);
});