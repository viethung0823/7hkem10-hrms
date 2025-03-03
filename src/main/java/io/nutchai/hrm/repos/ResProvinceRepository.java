package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.ResProvince;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResProvinceRepository extends JpaRepository<ResProvince, Long> {

    boolean existsByCodeIgnoreCase(String code);

}
