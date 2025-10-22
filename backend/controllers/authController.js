// controllers/authController.js
const bcrypt = require('bcryptjs');
const { pool } = require('../configuration/baseDatos');

/**
 * Controlador para manejar el login de usuarios
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validación de datos de entrada
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'El usuario debe tener al menos 3 caracteres'
            });
        }

        console.log(`🔐 Intento de login para usuario: ${username}`);

        // Consultar usuario en la base de datos
        const query = `
            SELECT 
                u.iMUsuario_Id,
                u.tU_Usuario,
                u.tU_Password,
                u.tU_ApellidoPaterno,
                u.tU_ApellidoMaterno,
                u.tU_Nombres,
                u.tU_Correo,
                u.iU_Empresa,
                u.iU_Sede,
                u.iU_Rol,
                u.iU_Puesto,
                u.iU_Estado,
                e.tE_Descripcion as empresa_nombre,
                e.iE_Estado as empresa_estado
            FROM RRHH_MUSUARIO u
            INNER JOIN RRHH_MEMPRESA e ON u.iU_Empresa = e.iMEmpresa_Id
            WHERE u.tU_Usuario = $1
        `;

        const result = await pool.query(query, [username]);

        // Verificar si el usuario existe
        if (result.rows.length === 0) {
            console.log(`❌ Usuario no encontrado: ${username}`);
            return res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }

        const user = result.rows[0];

        // Verificar estado del usuario
        if (user.iu_estado !== 1) {
            console.log(`⚠️ Usuario inactivo: ${username}`);
            return res.status(403).json({
                success: false,
                message: 'Usuario inactivo. Contacte al administrador'
            });
        }

        // Verificar estado de la empresa
        if (user.empresa_estado !== 1) {
            console.log(`⚠️ Empresa inactiva para usuario: ${username}`);
            return res.status(403).json({
                success: false,
                message: 'Empresa inactiva. Contacte al administrador'
            });
        }

        // Verificar contraseña
        let isPasswordValid = false;

        if (user.tu_password) {
            // Si la contraseña está hasheada con bcrypt
            if (user.tu_password.startsWith('$2b$') || user.tu_password.startsWith('$2a$')) {
                isPasswordValid = await bcrypt.compare(password, user.tu_password);
            } else {
                // Comparación directa (solo para desarrollo)
                isPasswordValid = password === user.tu_password;
            }
        }

        if (!isPasswordValid) {
            console.log(`❌ Contraseña incorrecta para usuario: ${username}`);
            return res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }

        // Construir nombre completo
        const nombreCompleto = `${user.tu_nombres || ''} ${user.tu_apellidopaterno || ''} ${user.tu_apellidomaterno || ''}`.trim();

        // Login exitoso
        console.log(`✅ Login exitoso para usuario: ${username} - Empresa: ${user.empresa_nombre}`);

        // Preparar respuesta
        const userData = {
            usuario_id: user.imusuario_id,
            usuario: user.tu_usuario,
            nombre_completo: nombreCompleto,
            correo: user.tu_correo,
            empresa_id: user.iu_empresa,
            empresa_nombre: user.empresa_nombre,
            sede_id: user.iu_sede,
            rol_id: user.iu_rol,
            puesto_id: user.iu_puesto
        };

        // Opcional: Registrar el login en auditoría (si tienes la tabla)
        try {
            await pool.query(
                `INSERT INTO RRHH_LOG_LOGIN (iU_Usuario, dL_FechaHora, tL_IP) 
                 VALUES ($1, NOW(), $2)
                 ON CONFLICT DO NOTHING`,
                [user.imusuario_id, req.ip || req.connection.remoteAddress || 'unknown']
            );
        } catch (logError) {
            console.warn('⚠️ No se pudo registrar el log de login:', logError.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: userData
        });

    } catch (error) {
        console.error('❌ Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Controlador para manejar el logout
 */
const logout = async (req, res) => {
    try {
        const { usuario_id } = req.body;

        if (usuario_id) {
            // Registrar el logout en auditoría
            try {
                await pool.query(
                    `INSERT INTO RRHH_LOG_LOGOUT (iU_Usuario, dL_FechaHora) 
                     VALUES ($1, NOW())
                     ON CONFLICT DO NOTHING`,
                    [usuario_id]
                );
            } catch (logError) {
                console.warn('⚠️ No se pudo registrar el log de logout');
            }
        }

        console.log(`🚪 Logout exitoso para usuario ID: ${usuario_id}`);

        return res.status(200).json({
            success: true,
            message: 'Logout exitoso'
        });

    } catch (error) {
        console.error('❌ Error en logout:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al cerrar sesión'
        });
    }
};

/**
 * Controlador para verificar sesión activa
 */
const verifySession = async (req, res) => {
    try {
        const { usuario_id } = req.body;

        if (!usuario_id) {
            return res.status(401).json({
                success: false,
                message: 'No hay sesión activa'
            });
        }

        const result = await pool.query(
            `SELECT 
                u.iMUsuario_Id,
                u.tU_Usuario,
                u.iU_Estado,
                e.iE_Estado as empresa_estado
             FROM RRHH_MUSUARIO u
             INNER JOIN RRHH_MEMPRESA e ON u.iU_Empresa = e.iMEmpresa_Id
             WHERE u.iMUsuario_Id = $1`,
            [usuario_id]
        );

        if (result.rows.length === 0 || result.rows[0].iu_estado !== 1) {
            return res.status(401).json({
                success: false,
                message: 'Sesión inválida'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Sesión válida'
        });

    } catch (error) {
        console.error('❌ Error al verificar sesión:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al verificar sesión'
        });
    }
};

module.exports = {
    login,
    logout,
    verifySession
};