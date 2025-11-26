-- =====================================================
-- Script: Procedimientos almacenados para RRHH_MMOTIVOPRESTAMO
-- Descripción: CRUD completo para motivos de préstamos
-- Fecha: 2025-11-06
-- =====================================================

USE ERP_RecursosHumanos;
GO

-- =====================================================
-- SP: Listar motivos de préstamo por empresa
-- =====================================================
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

-- =====================================================
-- SP: Obtener motivo de préstamo por ID
-- =====================================================
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

-- =====================================================
-- SP: Crear motivo de préstamo
-- =====================================================
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
        
        -- Validar que la descripción no esté vacía
        IF LTRIM(RTRIM(@Descripcion)) = ''
        BEGIN
            RAISERROR('La descripción no puede estar vacía', 16, 1);
            RETURN;
        END
        
        -- Validar que la empresa exista
        IF NOT EXISTS (SELECT 1 FROM dbo.RRHH_MEMPRESA WHERE iEmpresa_Id = @EmpresaId)
        BEGIN
            RAISERROR('La empresa especificada no existe', 16, 1);
            RETURN;
        END
        
        -- Validar que no exista un motivo con la misma descripción en la empresa
        IF EXISTS (
            SELECT 1 
            FROM dbo.RRHH_MMOTIVOPRESTAMO 
            WHERE tMP_Descripcion = @Descripcion 
                AND iEmpresa_Id = @EmpresaId
                AND iMP_Estado = 1
        )
        BEGIN
            RAISERROR('Ya existe un motivo activo con esta descripción en la empresa', 16, 1);
            RETURN;
        END
        
        -- Insertar el nuevo motivo
        INSERT INTO dbo.RRHH_MMOTIVOPRESTAMO (
            tMP_Descripcion,
            iMP_Estado,
            iEmpresa_Id,
            dtMP_FechaCreacion
        )
        VALUES (
            @Descripcion,
            1, -- Estado activo por defecto
            @EmpresaId,
            GETDATE()
        );
        
        SET @MotivoId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        
        -- Retornar el motivo creado
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

-- =====================================================
-- SP: Actualizar motivo de préstamo
-- =====================================================
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
        
        -- Validar que el motivo exista y pertenezca a la empresa
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
        
        -- Validar que la descripción no esté vacía
        IF LTRIM(RTRIM(@Descripcion)) = ''
        BEGIN
            RAISERROR('La descripción no puede estar vacía', 16, 1);
            RETURN;
        END
        
        -- Validar que no exista otro motivo con la misma descripción
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
        
        -- Actualizar el motivo
        UPDATE dbo.RRHH_MMOTIVOPRESTAMO
        SET 
            tMP_Descripcion = @Descripcion,
            dtMP_FechaModificacion = GETDATE()
        WHERE iMMMotivoPrestamo_Id = @MotivoId
            AND iEmpresa_Id = @EmpresaId;
        
        COMMIT TRANSACTION;
        
        -- Retornar el motivo actualizado
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

-- =====================================================
-- SP: Eliminar (cambiar estado) motivo de préstamo
-- =====================================================
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
        
        -- Validar que el motivo exista y pertenezca a la empresa
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
        
        -- Cambiar estado a inactivo (0)
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
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END
GO

PRINT 'Procedimientos almacenados creados exitosamente';
GO
