package com.meridian.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RolMenuResponse {
    private List<MenuDto> menus;
    private List<RolDto> roles;
    private List<PermisoDto> permisos;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MenuDto {
        private Integer menuId;
        private String menuNombre;
        private String menuRuta;
        private String menuIcon;
        private Integer menuPadre;
        private Integer menuNivel;
        private Integer menuPosicion;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RolDto {
        private Integer rolId;
        private String rolDescripcion;
        private Long empresaId;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PermisoDto {
        private Integer rolId;
        private Integer menuId;
    }
}
