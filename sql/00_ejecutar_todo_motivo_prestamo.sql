-- =====================================================
-- Script Consolidado: Configuración Completa de Motivo Préstamo
-- Descripción: Ejecuta todos los scripts necesarios en orden
-- Fecha: 2025-11-06
-- =====================================================

USE ERP_RecursosHumanos;
GO

PRINT '========================================';
PRINT 'INICIANDO CONFIGURACIÓN DE MOTIVO PRÉSTAMO';
PRINT '========================================';
PRINT '';

-- =====================================================
-- PASO 1: CREAR TABLA
-- =====================================================
PRINT 'PASO 1: Creando tabla RRHH_MMOTIVOPRESTAMO...';
PRINT '';

-- Verificar si la tabla existe y eliminarla si es necesario
IF OBJECT_ID('dbo.RRHH_MMOTIVOPRESTAMO', 'U') IS NOT NULL
BEGIN
    PRINT '  - Eliminando tabla existente...';
    DROP TABLE dbo.RRHH_MMOTIVOPRESTAMO;
END
GO

-- Crear la tabla
CREATE TABLE dbo.RRHH_MMOTIVOPRESTAMO (
    iMMMotivoPrestamo_Id INT IDENTITY(1,1) NOT NULL,
    tMP_Descripcion VARCHAR(100) NOT NULL,
    iMP_Estado INT NOT NULL DEFAULT 1,
    iEmpresa_Id INT NOT NULL,
    dtMP_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    dtMP_FechaModificacion DATETIME NULL,
    
    CONSTRAINT PK_RRHH_MMOTIVOPRESTAMO PRIMARY KEY (iMMMotivoPrestamo_Id),
    CONSTRAINT FK_RRHH_MMOTIVOPRESTAMO_Empresa FOREIGN KEY (iEmpresa_Id) 
        REFERENCES dbo.RRHH_MEMPRESA(iEmpresa_Id)
);
GO

-- Crear índices
CREATE INDEX IX_RRHH_MMOTIVOPRESTAMO_Estado 
    ON dbo.RRHH_MMOTIVOPRESTAMO(iMP_Estado);
GO

CREATE INDEX IX_RRHH_MMOTIVOPRESTAMO_Empresa 
    ON dbo.RRHH_MMOTIVOPRESTAMO(iEmpresa_Id);
GO

CREATE INDEX IX_RRHH_MMOTIVOPRESTAMO_Empresa_Estado 
    ON dbo.RRHH_MMOTIVOPRESTAMO(iEmpresa_Id, iMP_Estado);
GO

PRINT '  ✓ Tabla creada exitosamente';
PRINT '';

-- =====================================================
-- PASO 2: INSERTAR DATOS DE EJEMPLO
-- =====================================================
PRINT 'PASO 2: Insertando datos de ejemplo...';
PRINT '';

DECLARE @EmpresaId INT;

-- Obtener el ID de la primera empresa activa
SELECT TOP 1 @EmpresaId = iEmpresa_Id 
FROM dbo.RRHH_MEMPRESA 
WHERE iEmpresa_Estado = 1
ORDER BY iEmpresa_Id;

IF @EmpresaId IS NOT NULL
BEGIN
    PRINT '  - Empresa ID: ' + CAST(@EmpresaId AS VARCHAR(10));
    
    INSERT INTO dbo.RRHH_MMOTIVOPRESTAMO (tMP_Descripcion, iMP_Estado, iEmpresa_Id)
    VALUES 
        ('Emergencia médica', 1, @EmpresaId),
        ('Educación', 1, @EmpresaId),
        ('Vivienda', 1, @EmpresaId),
        ('Vehículo', 1, @EmpresaId),
        ('Calamidad doméstica', 1, @EmpresaId),
        ('Gastos personales', 1, @EmpresaId),
        ('Consolidación de deudas', 1, @EmpresaId);
    
    PRINT '  ✓ ' + CAST(@@ROWCOUNT AS VARCHAR(10)) + ' registros insertados';
END
ELSE
BEGIN
    PRINT '  ⚠ No se encontró ninguna empresa activa';
END
PRINT '';

-- =====================================================
-- PASO 3: CREAR PROCEDIMIENTOS ALMACENADOS
-- =====================================================
PRINT 'PASO 3: Creando procedimientos almacenados...';
PRINT '';

-- SP: Listar motivos
IF OBJECT_ID('dbo.SP_LISTAR_MOTIVOS_PRESTAMO', 'P') IS NOT NULL
    DROP PROCEDURE dbo.SP_LISTAR_MOTIVOS_PRESTAMO;
GO

CREATE PROCEDURE dbo.SP_LISTAR_MOTIVOS_PRESTAMO
    @EmpresaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        iMMMotivoPrestamo_Id AS id,
        tMP_Descripcion AS descripcion,
        iMP_Estado AS estado,
        iEmpresa_Id AS empresaId,
        dtMP_FechaCreacion AS fechaCreacion,
        dtMP_FechaModificacion AS fechaModificacion
    FROM dbo.RRHH_MMOTIVOPRESTAMO
    WHERE iEmpresa_Id = @EmpresaId
    ORDER BY tMP_Descripcion;
END
GO

PRINT '  ✓ SP_LISTAR_MOTIVOS_PRESTAMO creado';

-- SP: Obtener motivo por ID
IF OBJECT_ID('dbo.SP_OBTENER_MOTIVO_PRESTAMO', 'P') IS NOT NULL
    DROP PROCEDURE dbo.SP_OBTENER_MOTIVO_PRESTAMO;
GO

CREATE PROCEDURE dbo.SP_OBTENER_MOTIVO_PRESTAMO
    @MotivoId INT,
    @EmpresaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        iMMMotivoPrestamo_Id AS id,
        tMP_Descripcion AS descripcion,
        iMP_Estado AS estado,
        iEmpresa_Id AS empresaId,
        dtMP_FechaCreacion AS fechaCreacion,
        dtMP_FechaModificacion AS fechaModificacion
    FROM dbo.RRHH_MMOTIVOPRESTAMO
    WHERE iMMMotivoPrestamo_Id = @MotivoId
        AND iEmpresa_Id = @EmpresaId;
END
GO

PRINT '  ✓ SP_OBTENER_MOTIVO_PRESTAMO creado';

-- SP: Crear motivo
IF OBJECT_ID('dbo.SP_CREAR_MOTIVO_PRESTAMO', 'P') IS NOT NULL
    DROP PROCEDURE dbo.SP_CREAR_MOTIVO_PRESTAMO;
GO

CREATE PROCEDURE dbo.SP_CREAR_MOTIVO_PRESTAMO
    @Descripcion VARCHAR(100),
    @EmpresaId INT,
    @MotivoId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF LTRIM(RTRIM(@Descripcion)) = ''
        BEGIN
            RAISERROR('La descripción no puede estar vacía', 16, 1);
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM dbo.RRHH_MEMPRESA WHERE iEmpresa_Id = @EmpresaId)
        BEGIN
            RAISERROR('La empresa especificada no existe', 16, 1);
            RETURN;
        END
        
        IF EXISTS (
            SELECT 1 
            FROM dbo.RRHH_MMOTIVOPRESTAMO 
            WHERE tMP_Descripcion = @Descripcion 
                AND iEmpresa_Id = @EmpresaId
                AND iMP_Estado = 1
        )
        BEGIN
            RAISERROR('Ya existe un motivo activo con esta descripción', 16, 1);
            RETURN;
        END
        
        INSERT INTO dbo.RRHH_MMOTIVOPRESTAMO (
            tMP_Descripcion,
            iMP_Estado,
            iEmpresa_Id,
            dtMP_FechaCreacion
        )
        VALUES (
            @Descripcion,
            1,
            @EmpresaId,
            GETDATE()
        );
        
        SET @MotivoId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        
        SELECT 
            iMMMotivoPrestamo_Id AS id,
            tMP_Descripcion AS descripcion,
            iMP_Estado AS estado,
            iEmpresa_Id AS empresaId,
            dtMP_FechaCreacion AS fechaCreacion
        FROM dbo.RRHH_MMOTIVOPRESTAMO
        WHERE iMMMotivoPrestamo_Id = @MotivoId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END
GO

PRINT '  ✓ SP_CREAR_MOTIVO_PRESTAMO creado';

-- SP: Actualizar motivo
IF OBJECT_ID('dbo.SP_ACTUALIZAR_MOTIVO_PRESTAMO', 'P') IS NOT NULL
    DROP PROCEDURE dbo.SP_ACTUALIZAR_MOTIVO_PRESTAMO;
GO

CREATE PROCEDURE dbo.SP_ACTUALIZAR_MOTIVO_PRESTAMO
    @MotivoId INT,
    @Descripcion VARCHAR(100),
    @EmpresaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF NOT EXISTS (
            SELECT 1 
            FROM dbo.RRHH_MMOTIVOPRESTAMO 
            WHERE iMMMotivoPrestamo_Id = @MotivoId 
                AND iEmpresa_Id = @EmpresaId
        )
        BEGIN
            RAISERROR('El motivo no existe o no pertenece a la empresa', 16, 1);
            RETURN;
        END
        
        IF LTRIM(RTRIM(@Descripcion)) = ''
        BEGIN
            RAISERROR('La descripción no puede estar vacía', 16, 1);
            RETURN;
        END
        
        IF EXISTS (
            SELECT 1 
            FROM dbo.RRHH_MMOTIVOPRESTAMO 
            WHERE tMP_Descripcion = @Descripcion 
                AND iEmpresa_Id = @EmpresaId
                AND iMMMotivoPrestamo_Id != @MotivoId
                AND iMP_Estado = 1
        )
        BEGIN
            RAISERROR('Ya existe otro motivo activo con esta descripción', 16, 1);
            RETURN;
        END
        
        UPDATE dbo.RRHH_MMOTIVOPRESTAMO
        SET 
            tMP_Descripcion = @Descripcion,
            dtMP_FechaModificacion = GETDATE()
        WHERE iMMMotivoPrestamo_Id = @MotivoId
            AND iEmpresa_Id = @EmpresaId;
        
        COMMIT TRANSACTION;
        
        SELECT 
            iMMMotivoPrestamo_Id AS id,
            tMP_Descripcion AS descripcion,
            iMP_Estado AS estado,
            iEmpresa_Id AS empresaId,
            dtMP_FechaCreacion AS fechaCreacion,
            dtMP_FechaModificacion AS fechaModificacion
        FROM dbo.RRHH_MMOTIVOPRESTAMO
        WHERE iMMMotivoPrestamo_Id = @MotivoId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END
GO

PRINT '  ✓ SP_ACTUALIZAR_MOTIVO_PRESTAMO creado';

-- SP: Eliminar motivo
IF OBJECT_ID('dbo.SP_ELIMINAR_MOTIVO_PRESTAMO', 'P') IS NOT NULL
    DROP PROCEDURE dbo.SP_ELIMINAR_MOTIVO_PRESTAMO;
GO

CREATE PROCEDURE dbo.SP_ELIMINAR_MOTIVO_PRESTAMO
    @MotivoId INT,
    @EmpresaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF NOT EXISTS (
            SELECT 1 
            FROM dbo.RRHH_MMOTIVOPRESTAMO 
            WHERE iMMMotivoPrestamo_Id = @MotivoId 
                AND iEmpresa_Id = @EmpresaId
        )
        BEGIN
            RAISERROR('El motivo no existe o no pertenece a la empresa', 16, 1);
            RETURN;
        END
        
        UPDATE dbo.RRHH_MMOTIVOPRESTAMO
        SET 
            iMP_Estado = 0,
            dtMP_FechaModificacion = GETDATE()
        WHERE iMMMotivoPrestamo_Id = @MotivoId
            AND iEmpresa_Id = @EmpresaId;
        
        COMMIT TRANSACTION;
        
        SELECT 1 AS success;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage2 NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage2, 16, 1);
    END CATCH
END
GO

PRINT '  ✓ SP_ELIMINAR_MOTIVO_PRESTAMO creado';
PRINT '';

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================
PRINT '========================================';
PRINT 'VERIFICACIÓN FINAL';
PRINT '========================================';
PRINT '';

-- Verificar tabla
IF OBJECT_ID('dbo.RRHH_MMOTIVOPRESTAMO', 'U') IS NOT NULL
    PRINT '✓ Tabla RRHH_MMOTIVOPRESTAMO existe';
ELSE
    PRINT '✗ ERROR: Tabla no existe';

-- Contar registros
DECLARE @TotalRegistros INT;
SELECT @TotalRegistros = COUNT(*) FROM dbo.RRHH_MMOTIVOPRESTAMO;
PRINT '✓ Total de registros: ' + CAST(@TotalRegistros AS VARCHAR(10));

-- Verificar procedimientos
DECLARE @TotalProcedimientos INT;
SELECT @TotalProcedimientos = COUNT(*) 
FROM sys.procedures 
WHERE name LIKE '%MOTIVO_PRESTAMO%';
PRINT '✓ Total de procedimientos: ' + CAST(@TotalProcedimientos AS VARCHAR(10));

PRINT '';
PRINT '========================================';
PRINT 'CONFIGURACIÓN COMPLETADA EXITOSAMENTE';
PRINT '========================================';
PRINT '';
PRINT 'Puedes probar el sistema con:';
PRINT 'EXEC SP_LISTAR_MOTIVOS_PRESTAMO @EmpresaId = 1';
PRINT '';

-- Mostrar datos insertados
SELECT 
    iMMMotivoPrestamo_Id AS ID,
    tMP_Descripcion AS Descripcion,
    CASE iMP_Estado 
        WHEN 1 THEN 'Activo' 
        ELSE 'Inactivo' 
    END AS Estado,
    iEmpresa_Id AS EmpresaID
FROM dbo.RRHH_MMOTIVOPRESTAMO
ORDER BY iMMMotivoPrestamo_Id;
GO
