-- =====================================================
-- Script: Crear tabla de permisos (Rol-Menu)
-- Descripción: Tabla intermedia para asignar menús a roles
-- Fecha: 2025-10-27
-- =====================================================

-- Crear tabla de permisos (relación Rol-Menu)
CREATE TABLE IF NOT EXISTS public.rrhh_drol_menu (
    idrm_id SERIAL PRIMARY KEY,
    irm_rol INTEGER NOT NULL,
    irm_menu INTEGER NOT NULL,
    irm_estado INTEGER DEFAULT 1,
    CONSTRAINT fk_rol_menu_rol FOREIGN KEY (irm_rol) REFERENCES public.rrhh_mrol(imrol_id) ON DELETE CASCADE,
    CONSTRAINT fk_rol_menu_menu FOREIGN KEY (irm_menu) REFERENCES public.rrhh_mmenu(menu_id) ON DELETE CASCADE,
    CONSTRAINT uk_rol_menu UNIQUE (irm_rol, irm_menu)
);

-- Comentarios
COMMENT ON TABLE public.rrhh_drol_menu IS 'Tabla de permisos: relaciona roles con menús';
COMMENT ON COLUMN public.rrhh_drol_menu.idrm_id IS 'ID único del permiso';
COMMENT ON COLUMN public.rrhh_drol_menu.irm_rol IS 'ID del rol';
COMMENT ON COLUMN public.rrhh_drol_menu.irm_menu IS 'ID del menú';
COMMENT ON COLUMN public.rrhh_drol_menu.irm_estado IS 'Estado del permiso (1=Activo, 0=Inactivo)';

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_rol_menu_rol ON public.rrhh_drol_menu(irm_rol);
CREATE INDEX IF NOT EXISTS idx_rol_menu_menu ON public.rrhh_drol_menu(irm_menu);
CREATE INDEX IF NOT EXISTS idx_rol_menu_estado ON public.rrhh_drol_menu(irm_estado);

-- Insertar rol de dashboard (superadministrador) con ID 1
INSERT INTO public.rrhh_mrol (imrol_id, tr_descripcion, ir_estado, ir_empresa) 
VALUES (1, 'DASHBOARD', 1, NULL) 
ON CONFLICT (imrol_id) DO NOTHING;

-- Asignar todos los menús al rol DASHBOARD (superadministrador)
INSERT INTO public.rrhh_drol_menu (irm_rol, irm_menu, irm_estado)
SELECT 1, menu_id, 1
FROM public.rrhh_mmenu
WHERE menu_estado = 1
ON CONFLICT (irm_rol, irm_menu) DO NOTHING;

-- Actualizar secuencia del rol
SELECT setval('public.rrhh_mrol_imrol_id_seq', (SELECT MAX(imrol_id) FROM public.rrhh_mrol));

COMMIT;
