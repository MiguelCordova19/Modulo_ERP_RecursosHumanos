const { pool } = require('../configuration/baseDatos');

class MenuController {
    
    // Obtener todos los menús con estructura jerárquica
    static async obtenerTodos(req, res) {
        try {
            const query = `SELECT * FROM obtener_menus_activos();`;
            
            const resultado = await pool.query(query);
            const menusJerarquicos = MenuController.organizarMenusJerarquicos(resultado.rows);
            
            res.status(200).json({
                success: true,
                data: menusJerarquicos,
                total: resultado.rows.length,
                message: 'Menús obtenidos exitosamente'
            });
            
        } catch (error) {
            console.error('Error al obtener menús:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    // Organizar menús en estructura jerárquica
    static organizarMenusJerarquicos(menus) {
        const menuMap = new Map();
        const menusPrincipales = [];

        menus.forEach(menu => {
            menuMap.set(menu.menu_id, {
                ...menu,
                hijos: []
            });
        });

        menus.forEach(menu => {
            const menuActual = menuMap.get(menu.menu_id);
            
            if (menu.menu_padre === null || menu.menu_padre === 0) {
                menusPrincipales.push(menuActual);
            } else {
                const padre = menuMap.get(menu.menu_padre);
                if (padre) {
                    padre.hijos.push(menuActual);
                }
            }
        });

        menusPrincipales.forEach(menu => {
            if (menu.hijos && menu.hijos.length > 0) {
                menu.hijos.sort((a, b) => a.menu_posicion - b.menu_posicion);
                
                menu.hijos.forEach(hijo => {
                    if (hijo.hijos && hijo.hijos.length > 0) {
                        hijo.hijos.sort((a, b) => a.menu_posicion - b.menu_posicion);
                    }
                });
            }
        });

        return menusPrincipales;
    }

    // Obtener menú por ID
    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de menú inválido'
                });
            }

            const query = `SELECT * FROM RRHH_MMENU WHERE Menu_Id = $1 AND Menu_Estado = 1`;
            const resultado = await pool.query(query, [id]);
            
            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Menú no encontrado'
                });
            }
            
            res.status(200).json({
                success: true,
                data: resultado.rows[0],
                message: 'Menú obtenido exitosamente'
            });
            
        } catch (error) {
            console.error('Error al obtener menú por ID:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
}

module.exports = MenuController;