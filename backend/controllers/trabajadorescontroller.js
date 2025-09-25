const {pool} = require('../configuration/baseDatos');

const obtenerListaTrabajadores = async (req, res) => {
    try {
        const consulta = 'SELECT * FROM rrhh_trabajador';
        const resultado = await pool.query(consulta);

        res.json({
            exito: true,
            mensaje: 'Lista de trabajadores obtenida correctamente',
            datos: resultado.rows,
            total: resultado.rows.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener lista de trabajadores',
            error: error.message
        })
    }
};

module.exports = {
    obtenerListaTrabajadores
}