-- Script para verificar y corregir la base de datos
-- Ejecutar este script si tienes problemas con el login

-- ============================================
-- 1. VERIFICAR DATOS EXISTENTES
-- ============================================

-- Ver empresas
SELECT 'EMPRESAS:' as tabla;
SELECT * FROM rrhh_mempresa;

-- Ver usuarios
SELECT 'USUARIOS:' as tabla;
SELECT 
    imusuario_id,
    tu_usuario,
    tu_nombres,
    tu_apellidopaterno,
    iu_empresa,
    iu_estado
FROM rrhh_musuario;

-- ============================================
-- 2. INSERTAR EMPRESA SI NO EXISTE
-- ============================================

-- Insertar empresa de prueba
INSERT INTO rrhh_mempresa (imempresa_id, te_descripcion, ie_estado)
VALUES (1, 'EMPRESA TEST', 1)
ON CONFLICT (imempresa_id) DO UPDATE 
SET te_descripcion = 'EMPRESA TEST',
    ie_estado = 1;

-- ============================================
-- 3. ACTUALIZAR USUARIO ADMIN
-- ============================================

-- Actualizar usuario admin para asegurarse de que tenga empresa
UPDATE rrhh_musuario 
SET 
    iu_empresa = 1,
    tu_nombres = 'Usuario',
    tu_apellidopaterno = 'Administrador',
    tu_apellidomaterno = 'Chidoris',
    iu_estado = 1,
    tu_correo = 'admin@empresa.com'
WHERE tu_usuario = 'admin';

-- ============================================
-- 4. VERIFICAR CONTRASEÑA DEL ADMIN
-- ============================================

-- Ver la contraseña encriptada del admin
SELECT 
    tu_usuario,
    tu_password,
    CASE 
        WHEN tu_password LIKE '$2%' THEN 'Contraseña encriptada correctamente'
        ELSE 'ADVERTENCIA: Contraseña no está encriptada'
    END as estado_password
FROM rrhh_musuario 
WHERE tu_usuario = 'admin';

-- Si la contraseña no está encriptada, actualizarla
-- Contraseña: admin123
UPDATE rrhh_musuario 
SET tu_password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu'
WHERE tu_usuario = 'admin' 
AND tu_password NOT LIKE '$2%';

-- ============================================
-- 5. VERIFICACIÓN FINAL
-- ============================================

SELECT 'VERIFICACIÓN FINAL:' as resultado;

SELECT 
    u.imusuario_id,
    u.tu_usuario,
    u.tu_nombres || ' ' || u.tu_apellidopaterno || ' ' || u.tu_apellidomaterno as nombre_completo,
    u.tu_correo,
    u.iu_empresa,
    e.te_descripcion as empresa,
    u.iu_estado,
    CASE 
        WHEN u.iu_estado = 1 THEN 'Activo'
        ELSE 'Inactivo'
    END as estado_texto,
    CASE 
        WHEN u.tu_password LIKE '$2%' THEN 'OK'
        ELSE 'ERROR'
    END as password_estado
FROM rrhh_musuario u
LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id
WHERE u.tu_usuario = 'admin';

-- ============================================
-- 6. MENSAJES DE AYUDA
-- ============================================

SELECT 'Si ves este mensaje, el script se ejecutó correctamente.' as mensaje;
SELECT 'Ahora reinicia el backend y prueba el login con:' as instruccion;
SELECT '  Usuario: admin' as credencial_1;
SELECT '  Contraseña: admin123' as credencial_2;
