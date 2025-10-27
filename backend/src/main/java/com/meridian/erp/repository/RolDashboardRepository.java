package com.meridian.erp.repository;

import com.meridian.erp.entity.RolDashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolDashboardRepository extends JpaRepository<RolDashboard, Integer> {
    List<RolDashboard> findByEstado(Integer estado);
}
