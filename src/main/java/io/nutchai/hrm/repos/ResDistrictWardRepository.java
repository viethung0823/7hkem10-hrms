package io.nutchai.hrm.repos;

import io.nutchai.hrm.domain.ResDistrictWard;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResDistrictWardRepository extends JpaRepository<ResDistrictWard, Long> {

    boolean existsByCodeIgnoreCase(String code);

}
