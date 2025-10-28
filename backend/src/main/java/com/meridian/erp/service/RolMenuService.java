package com.meridian.erp.service;

import com.meridian.erp.dto.AsignarRolRequest;
import com.meridian.erp.dto.RolMenuResponse;
import com.meridian.erp.entity.Menu;
import com.meridian.erp.entity.Rol;
import com.meridian.erp.entity.RolMenu;
import com.meridian.erp.repository.MenuRepository;
import com.meridian.erp.repository.RolMenuRepository;
import com.meridian.erp.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolMenuService {
    
    private final RolMenuRepository rolMenuRepository;
    private final MenuRepository menuRepository;
    private final RolRepository rolRepository;
    
    /**
     * Obtener todos los menús y roles para la matriz de asignación
     */
    public RolMenuResponse obtenerMatrizRolMenu(Integer empresaId) {
        // Obtener todos los menús activos
        List<Menu> menus = menuRepository.findByEstadoOrderByPosicionAsc(1);
        
        // Obtener roles de la empresa (excluir rol DASHBOARD con id=1)
        List<Rol> roles = rolRepository.findByEmpresaIdAndEstado(empresaId.longValue(), 1)
                .stream()
                .filter(rol -> rol.getId() != 1) // Excluir rol DASHBOARD
                .collect(Collectors.toList());
        
        // Obtener todos los permisos existentes
        List<RolMenu> permisos = rolMenuRepository.findAll();
        
        // Convertir a DTOs
        List<RolMenuResponse.MenuDto> menuDtos = menus.stream()
                .map(menu -> RolMenuResponse.MenuDto.builder()
                        .menuId(menu.getId())
                        .menuNombre(menu.getNombre())
                        .menuRuta(menu.getRuta())
                        .menuIcon(menu.getIcon())
                        .menuPadre(menu.getMenuPadre())
                        .menuNivel(menu.getNivel())
                        .menuPosicion(menu.getPosicion())
                        .build())
                .collect(Collectors.toList());
        
        List<RolMenuResponse.RolDto> rolDtos = roles.stream()
                .map(rol -> RolMenuResponse.RolDto.builder()
                        .rolId(rol.getId())
                        .rolDescripcion(rol.getDescripcion())
                        .empresaId(rol.getEmpresaId())
                        .build())
                .collect(Collectors.toList());
        
        List<RolMenuResponse.PermisoDto> permisoDtos = permisos.stream()
                .filter(p -> p.getEstado() == 1)
                .map(permiso -> RolMenuResponse.PermisoDto.builder()
                        .rolId(permiso.getRolId())
                        .menuId(permiso.getMenuId())
                        .build())
                .collect(Collectors.toList());
        
        return RolMenuResponse.builder()
                .menus(menuDtos)
                .roles(rolDtos)
                .permisos(permisoDtos)
                .build();
    }
    
    /**
     * Asignar menús a un rol
     */
    @Transactional
    public void asignarMenusARol(AsignarRolRequest request) {
        // Validar que no sea el rol DASHBOARD
        if (request.getRolId() == 1) {
            throw new IllegalArgumentException("No se puede modificar el rol DASHBOARD");
        }
        
        // Eliminar permisos anteriores del rol
        rolMenuRepository.deleteByRolId(request.getRolId());
        
        // Crear nuevos permisos
        List<RolMenu> nuevosPermisos = request.getMenuIds().stream()
                .map(menuId -> RolMenu.builder()
                        .rolId(request.getRolId())
                        .menuId(menuId)
                        .estado(1)
                        .build())
                .collect(Collectors.toList());
        
        rolMenuRepository.saveAll(nuevosPermisos);
    }
    
    /**
     * Obtener menús asignados a un rol específico
     */
    public List<Integer> obtenerMenusPorRol(Integer rolId) {
        return rolMenuRepository.findMenuIdsByRolId(rolId);
    }
    
    /**
     * Obtener menús con permisos para un usuario (basado en su rol)
     */
    public List<Menu> obtenerMenusConPermiso(Integer rolId) {
        // Si es rol DASHBOARD (id=1), retornar todos los menús
        if (rolId == 1) {
            return menuRepository.findByEstadoOrderByPosicionAsc(1);
        }
        
        // Obtener IDs de menús permitidos
        List<Integer> menuIds = rolMenuRepository.findMenuIdsByRolId(rolId);
        
        // Obtener los menús completos
        return menuRepository.findAllById(menuIds);
    }
}
