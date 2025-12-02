-- =============================================
-- Tabla: RRHH_MTIPOCONTRATO
-- Descripción: Tabla maestra de tipos de contrato
-- Autor: Sistema RRHH
-- Fecha: 2024
-- =============================================

-- Eliminar tabla si existe
DROP TABLE IF EXISTS RRHH_MTIPOCONTRATO;

-- Crear tabla
CREATE TABLE RRHH_MTIPOCONTRATO (
    iMTipoContrato_Id SERIAL PRIMARY KEY,
    tTC_CodSunat VARCHAR(2) NOT NULL UNIQUE,
    tTC_Descripcion VARCHAR(100) NOT NULL,
    bTC_Estado BOOLEAN NOT NULL DEFAULT true,
    dtTC_FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dtTC_FechaModificacion TIMESTAMP NULL
);

-- Insertar datos iniciales
INSERT INTO RRHH_MTIPOCONTRATO (tTC_CodSunat, tTC_Descripcion, bTC_Estado)
VALUES
    ('01', 'A PLAZO INDETERMINADO', true),
    ('02', 'A TIEMPO PARCIAL', true),
    ('03', 'POR INICIO O INCREMENTO DE ACTIVIDAD', true),
    ('04', 'POR NECESIDADES DEL MERCADO', true),
    ('05', 'POR RECONVERSION DEL EMPRESARIAL', true),
    ('06', 'OCASIONAL', true),
    ('07', 'DE SUPLENCIA', true),
    ('08', 'DE EMERGENCIA', true),
    ('09', 'PARA OBRA DETERMINADA O SERVICIO ESPECIFICO', true),
    ('10', 'INTERMINENTE', true),
    ('11', 'DE TEMPORADA', true),
    ('12', 'DE EXPORTACION NO TRADICIONAL', true),
    ('13', 'DE EXTRANJERO', true),
    ('14', 'ADMINISTRACION DE SERVICIOS', true);

-- Crear índice para búsquedas
CREATE INDEX IX_RRHH_MTIPOCONTRATO_Estado
ON RRHH_MTIPOCONTRATO (bTC_Estado);

-- Verificar datos insertados
SELECT 
    iMTipoContrato_Id,
    tTC_CodSunat,
    tTC_Descripcion,
    bTC_Estado,
    dtTC_FechaCreacion
FROM RRHH_MTIPOCONTRATO
ORDER BY tTC_CodSunat;
