-- Script para verificar y actualizar el usuario admin
-- Ejecutar este script si tienes problemas para iniciar sesión

-- Ver el usuario actual
SELECT 
    imusuario_id,
    tu_usuario,
    tu_nombres,
    tu_apellidopaterno,
    iu_estado,
    tu_correo
FROM rrhh_musuario 
WHERE tu_usuario = 'admin';

-- Si necesitas actualizar la contraseña del admin a "admin123"
-- Descomenta las siguientes líneas:

-- UPDATE rrhh_musuario 
-- SET tu_password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu'
-- WHERE tu_usuario = 'admin';

-- Verificar la actualización
-- SELECT tu_usuario, tu_password FROM rrhh_musuario WHERE tu_usuario = 'admin';
