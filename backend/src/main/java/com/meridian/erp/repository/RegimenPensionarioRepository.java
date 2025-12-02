package com.meridian.erp.repository;

import com.meridian.erp.entity.RegimenPensionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegimenPensionarioRepository extends JpaRepository<RegimenPensionario, Integer> {
}
