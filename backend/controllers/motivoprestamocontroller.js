const { pool } = require('../configuration/baseDatos');

class MotivoPrestamoController {
    
    // Obtener todos los motivos
    static async obtenerTodos(req, res) {
        try {
            const query = `
                SELECT 
                    motivo_id as id,
                    motivo_codigo as codigo,
                    motivo_descripcion as descripcion,
                    motivo_estado as estado
                FROM RRHH_MOTIVO_PRESTAMO 
                WHERE motivo_estado = 1 
                ORDER BY motivo_codigo ASC
            `;
            
            const resultado = await pool.query(query);
            
            res.status(200).json({
                success: true,
                data: resultado.rows,
                total: resultado.rows.length,
                message: 'Motivos obtenidos exitosamente'
            });
            
        } catch (error) {
            console.error('❌ Error al obtener motivos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    // Obtener motivo por ID
    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            
            const query = `
                SELECT 
                    motivo_id as id,
                    motivo_codigo as codigo,
                    motivo_descripcion as descripcion,
                    motivo_estado as estado
                FROM RRHH_MOTIVO_PRESTAMO 
                WHERE motivo_id = $1
            `;
            
            const resultado = await pool.query(query, [id]);
            
            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Motivo no encontrado'
                });
            }
            
            res.status(200).json({
                success: true,
                data: resultado.rows[0],
                message: 'Motivo obtenido exitosamente'
            });
            
        } catch (error) {
            console.error('❌ Error al obtener motivo:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Crear nuevo motivo
    static async crear(req, res) {
        try {
            const { codigo, descripcion, estado = 1 } = req.body;
            
            if (!codigo || !descripcion) {
                return res.status(400).json({
                    success: false,
                    message: 'Código y descripción son obligatorios'
                });
            }

            const query = `
                INSERT INTO RRHH_MOTIVO_PRESTAMO 
                (motivo_codigo, motivo_descripcion, motivo_estado)
                VALUES ($1, $2, $3)
                RETURNING 
                    motivo_id as id,
                    motivo_codigo as codigo,
                    motivo_descripcion as descripcion,
                    motivo_estado as estado
            `;
            
            const resultado = await pool.query(query, [codigo, descripcion, estado]);
            
            res.status(201).json({
                success: true,
                data: resultado.rows[0],
                message: 'Motivo creado exitosamente'
            });
            
        } catch (error) {
            console.error('❌ Error al crear motivo:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Actualizar motivo
    static async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { codigo, descripcion, estado } = req.body;
            
            const query = `
                UPDATE RRHH_MOTIVO_PRESTAMO 
                SET 
                    motivo_codigo = COALESCE($1, motivo_codigo),
                    motivo_descripcion = COALESCE($2, motivo_descripcion),
                    motivo_estado = COALESCE($3, motivo_estado)
                WHERE motivo_id = $4
                RETURNING 
                    motivo_id as id,
                    motivo_codigo as codigo,
                    motivo_descripcion as descripcion,
                    motivo_estado as estado
            `;
            
            const resultado = await pool.query(query, [codigo, descripcion, estado, id]);
            
            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Motivo no encontrado'
                });
            }
            
            res.status(200).json({
                success: true,
                data: resultado.rows[0],
                message: 'Motivo actualizado exitosamente'
            });
            
        } catch (error) {
            console.error('❌ Error al actualizar motivo:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Eliminar motivo (cambiar estado)
    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            
            const query = `
                UPDATE RRHH_MOTIVO_PRESTAMO 
                SET motivo_estado = 0
                WHERE motivo_id = $1
                RETURNING 
                    motivo_id as id,
                    motivo_codigo as codigo,
                    motivo_descripcion as descripcion,
                    motivo_estado as estado
            `;
            
            const resultado = await pool.query(query, [id]);
            
            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Motivo no encontrado'
                });
            }
            
            res.status(200).json({
                success: true,
                data: resultado.rows[0],
                message: 'Motivo eliminado exitosamente'
            });
            
        } catch (error) {
            console.error('❌ Error al eliminar motivo:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}

module.exports = MotivoPrestamoController;