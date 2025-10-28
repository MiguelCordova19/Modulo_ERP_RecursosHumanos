package com.meridian.erp.service;

import com.meridian.erp.dto.MenuDTO;
import com.meridian.erp.entity.Menu;
import com.meridian.erp.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {
    
    private final MenuRepository menuRepository;
    
    public List<Menu> findAllActive() {
        return menuRepository.findByEstadoOrderByPosicionAsc(1);
    }
    
    public List<Menu> findAll() {
        return menuRepository.findAll();
    }
    
    /**
     * Obtiene los menús activos organizados en estructura jerárquica
     */
    public List<MenuDTO> findAllActiveHierarchical() {
        List<Menu> menus = menuRepository.findByEstadoOrderByPosicionAsc(1);
        return organizarMenusJerarquicos(menus);
    }
    
    /**
     * Organiza los menús en estructura jerárquica
     */
    private List<MenuDTO> organizarMenusJerarquicos(List<Menu> menus) {
        // Crear mapa de menús
        Map<Integer, MenuDTO> menuMap = new HashMap<>();
        
        // Convertir entidades a DTOs
        for (Menu menu : menus) {
            MenuDTO dto = new MenuDTO(
                menu.getId(),
                menu.getRuta(),
                menu.getIcon(),
                menu.getNombre(),
                menu.getEstado(),
                menu.getMenuPadre(),
                menu.getNivel(),
                menu.getPosicion()
            );
            menuMap.put(menu.getId(), dto);
        }
        
        // Lista de menús principales (sin padre)
        List<MenuDTO> menusPrincipales = new ArrayList<>();
        
        // Organizar jerarquía
        for (MenuDTO menu : menuMap.values()) {
            if (menu.getMenu_padre() == null || menu.getMenu_padre() == 0) {
                // Es un menú principal
                menusPrincipales.add(menu);
            } else {
                // Es un submenú, agregarlo a su padre
                MenuDTO padre = menuMap.get(menu.getMenu_padre());
                if (padre != null) {
                    padre.getHijos().add(menu);
                }
            }
        }
        
        // Ordenar menús principales por posición
        menusPrincipales.sort(Comparator.comparing(MenuDTO::getMenu_posicion));
        
        // Ordenar hijos recursivamente
        for (MenuDTO menu : menusPrincipales) {
            ordenarHijosRecursivamente(menu);
        }
        
        return menusPrincipales;
    }
    
    /**
     * Ordena los hijos de un menú recursivamente
     */
    private void ordenarHijosRecursivamente(MenuDTO menu) {
        if (menu.getHijos() != null && !menu.getHijos().isEmpty()) {
            menu.getHijos().sort(Comparator.comparing(MenuDTO::getMenu_posicion));
            for (MenuDTO hijo : menu.getHijos()) {
                ordenarHijosRecursivamente(hijo);
            }
        }
    }
}
