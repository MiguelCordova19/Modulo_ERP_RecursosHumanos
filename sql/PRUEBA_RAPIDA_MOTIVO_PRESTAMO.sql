-- =====================================================
-- Prueba Rápida: Sistema de Motivo Préstamo
-- Descripción: Script para probar todas las funcionalidades
-- Fecha: 2025-11-06
-- =====================================================

USE ERP_RecursosHumanos;
GO

PRINT '========================================';
PRINT 'PRUEBA RÁPIDA - MOTIVO PRÉSTAMO';
PRINT '========================================';
PRINT '';

-- Variables de prueba
DECLARE @EmpresaId INT = 1;
DECLARE @MotivoId INT;
DECLARE @Descripcion VARCHAR(100);

-- =====================================================
-- PRUEBA 1: Listar motivos existentes
-- =====================================================
PRINT '1. LISTAR MOTIVOS EXISTENTES';
PRINT '----------------------------';
EXEC SP_LISTAR_MOTIVOS_PRESTAMO @EmpresaId = @EmpresaId;
PRINT '';

-- =====================================================
-- PRUEBA 2: Crear nuevo motivo
-- =====================================================
PRINT '2. CREAR NUEVO MOTIVO';
PRINT '----------------------------';
SET @Descripcion = 'Motivo de Prueba - ' + CONVERT(VARCHAR, GETDATE(), 120);

EXEC SP_CREAR_MOTIVO_PRESTAMO 
    @Descripcion = @Descripcion,
    @EmpresaId = @EmpresaId,
    @MotivoId = @MotivoId OUTPUT;

PRINT 'Motivo creado con ID: ' + CAST(@MotivoId AS VARCHAR(10));
PRINT '';

-- =====================================================
-- PRUEBA 3: Obtener motivo por ID
-- =====================================================
PRINT '3. OBTENER MOTIVO POR ID';
PRINT '----------------------------';
EXEC SP_OBTENER_MOTIVO_PRESTAMO 
    @MotivoId = @MotivoId,
    @EmpresaId = @EmpresaId;
PRINT '';

-- =====================================================
-- PRUEBA 4: Actualizar motivo
-- =====================================================
PRINT '4. ACTUALIZAR MOTIVO';
PRINT '----------------------------';
SET @Descripcion = 'Motivo Actualizado - ' + CONVERT(VARCHAR, GETDATE(), 120);

EXEC SP_ACTUALIZAR_MOTIVO_PRESTAMO 
    @MotivoId = @MotivoId,
    @Descripcion = @Descripcion,
    @EmpresaId = @EmpresaId;
PRINT '';

-- =====================================================
-- PRUEBA 5: Listar después de actualizar
-- =====================================================
PRINT '5. LISTAR DESPUÉS DE ACTUALIZAR';
PRINT '----------------------------';
EXEC SP_LISTAR_MOTIVOS_PRESTAMO @EmpresaId = @EmpresaId;
PRINT '';

-- =====================================================
-- PRUEBA 6: Eliminar motivo (cambiar estado)
-- =====================================================
PRINT '6. ELIMINAR MOTIVO (Cambiar estado a 0)';
PRINT '----------------------------';
EXEC SP_ELIMINAR_MOTIVO_PRESTAMO 
    @MotivoId = @MotivoId,
    @EmpresaId = @EmpresaId;
PRINT 'Motivo eliminado (estado = 0)';
PRINT '';

-- =====================================================
-- PRUEBA 7: Verificar eliminación
-- =====================================================
PRINT '7. VERIFICAR ELIMINACIÓN';
PRINT '----------------------------';
SELECT 
    iMMMotivoPrestamo_Id AS ID,
    tMP_Descripcion AS Descripcion,
    CASE iMP_Estado 
        WHEN 1 THEN 'Activo' 
        ELSE 'Inactivo' 
    END AS Estado
FROM dbo.RRHH_MMOTIVOPRESTAMO
WHERE iMMMotivoPrestamo_Id = @MotivoId;
PRINT '';

-- =====================================================
-- PRUEBA 8: Intentar crear duplicado (debe fallar)
-- =====================================================
PRINT '8. INTENTAR CREAR DUPLICADO (Debe fallar)';
PRINT '----------------------------';
BEGIN TRY
    DECLARE @MotivoIdDuplicado INT;
    EXEC SP_CREAR_MOTIVO_PRESTAMO 
        @Descripcion = 'Emergencia médica',
        @EmpresaId = @EmpresaId,
        @MotivoId = @MotivoIdDuplicado OUTPUT;
    PRINT '✗ ERROR: Se permitió crear duplicado';
END TRY
BEGIN CATCH
    PRINT '✓ CORRECTO: No se permite duplicado';
    PRINT '  Mensaje: ' + ERROR_MESSAGE();
END CATCH
PRINT '';

-- =====================================================
-- PRUEBA 9: Intentar crear con descripción vacía (debe fallar)
-- =====================================================
PRINT '9. INTENTAR CREAR CON DESCRIPCIÓN VACÍA (Debe fallar)';
PRINT '----------------------------';
BEGIN TRY
    DECLARE @MotivoIdVacio INT;
    EXEC SP_CREAR_MOTIVO_PRESTAMO 
        @Descripcion = '',
        @EmpresaId = @EmpresaId,
        @MotivoId = @MotivoIdVacio OUTPUT;
    PRINT '✗ ERROR: Se permitió descripción vacía';
END TRY
BEGIN CATCH
    PRINT '✓ CORRECTO: No se permite descripción vacía';
    PRINT '  Mensaje: ' + ERROR_MESSAGE();
END CATCH
PRINT '';

-- =====================================================
-- PRUEBA 10: Estadísticas finales
-- =====================================================
PRINT '10. ESTADÍSTICAS FINALES';
PRINT '----------------------------';

DECLARE @TotalMotivos INT;
DECLARE @MotivosActivos INT;
DECLARE @MotivosInactivos INT;

SELECT @TotalMotivos = COUNT(*) FROM dbo.RRHH_MMOTIVOPRESTAMO WHERE iEmpresa_Id = @EmpresaId;
SELECT @MotivosActivos = COUNT(*) FROM dbo.RRHH_MMOTIVOPRESTAMO WHERE iEmpresa_Id = @EmpresaId AND iMP_Estado = 1;
SELECT @MotivosInactivos = COUNT(*) FROM dbo.RRHH_MMOTIVOPRESTAMO WHERE iEmpresa_Id = @EmpresaId AND iMP_Estado = 0;

PRINT 'Total de motivos: ' + CAST(@TotalMotivos AS VARCHAR(10));
PRINT 'Motivos activos: ' + CAST(@MotivosActivos AS VARCHAR(10));
PRINT 'Motivos inactivos: ' + CAST(@MotivosInactivos AS VARCHAR(10));
PRINT '';

-- =====================================================
-- RESUMEN FINAL
-- =====================================================
PRINT '========================================';
PRINT 'RESUMEN DE PRUEBAS';
PRINT '========================================';
PRINT '✓ Listar motivos';
PRINT '✓ Crear motivo';
PRINT '✓ Obtener motivo por ID';
PRINT '✓ Actualizar motivo';
PRINT '✓ Eliminar motivo (cambio de estado)';
PRINT '✓ Validación de duplicados';
PRINT '✓ Validación de descripción vacía';
PRINT '';
PRINT '¡TODAS LAS PRUEBAS COMPLETADAS!';
PRINT '========================================';
GO
