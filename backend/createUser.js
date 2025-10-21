const bcrypt = require('bcryptjs');
const { pool } = require('../configuration/baseDatos');

async function createUser() {
    try {
        console.log('🔐 Generando contraseña hasheada...');
        
        const password = 'admin123';
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        console.log(`Contraseña: ${password}`);
        console.log(`Hash: ${hashedPassword}`);
        
        // Verificar hash
        const isValid = await bcrypt.compare(password, hashedPassword);
        console.log(`Verificación: ${isValid ? 'CORRECTA' : 'ERROR'}`);
        
        if (!isValid) {
            throw new Error('Error en la generación del hash');
        }

        // Insertar usuario
        const query = `
            INSERT INTO RRHH_MUSUARIO (
                tU_Usuario, tU_Password, tU_ApellidoPaterno, tU_ApellidoMaterno, 
                tU_Nombres, iU_Empresa, iU_Sede, iU_TipoDocumento, tU_NroDocumento, 
                fU_FechaNacimiento, iU_Rol, iU_Puesto, tU_NroCelular, tU_Correo, iU_Estado
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING iMUsuario_Id, tU_Usuario, tU_Correo
        `;

        const values = [
            'admin',
            hashedPassword,
            'Administrador',
            'Sistema', 
            'Usuario',
            1, 1, 1, '12345678', '1990-01-01', 1, 1, '999999999', 'admin@empresa.com', 1
        ];

        const result = await pool.query(query, values);
        console.log('✅ Usuario creado:', result.rows[0]);

        // Verificar que se guardó bien
        const checkQuery = 'SELECT tU_Usuario, tU_Password FROM RRHH_MUSUARIO WHERE tU_Usuario = $1';
        const checkResult = await pool.query(checkQuery, ['admin']);
        
        if (checkResult.rows.length > 0) {
            const user = checkResult.rows[0];
            console.log('📋 Usuario en BD:', user.tu_usuario);
            
            // Test final
            const finalTest = await bcrypt.compare(password, user.tu_password);
            console.log(`🧪 Test final: ${finalTest ? 'CORRECTA' : 'ERROR'}`);
            
            if (finalTest) {
                console.log('\n✅ Usuario listo para login:');
                console.log(`   Usuario: admin`);
                console.log(`   Contraseña: admin123`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
        if (error.code === '23505') {
            console.log('💡 El usuario ya existe');
        }
    }
}

createUser();