package io.nutchai.hrm.repos;

import io.nutchai.hrm.domain.ResProvince;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResProvinceRepository extends JpaRepository<ResProvince, Long> {

    boolean existsByCodeIgnoreCase(String code);

}
