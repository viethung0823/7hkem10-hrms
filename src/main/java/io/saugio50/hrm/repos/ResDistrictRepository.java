package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.ResDistrict;
import io.saugio50.hrm.domain.ResProvince;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResDistrictRepository extends JpaRepository<ResDistrict, Long> {

    ResDistrict findFirstByProvince(ResProvince resProvince);

    boolean existsByCodeIgnoreCase(String code);

}
