package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.ResDistrictWard;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResDistrictWardRepository extends JpaRepository<ResDistrictWard, Long> {

    boolean existsByCodeIgnoreCase(String code);

}
