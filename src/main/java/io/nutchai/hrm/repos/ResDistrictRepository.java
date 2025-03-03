package io.nutchai.hrm.repos;

import io.nutchai.hrm.domain.ResDistrict;
import io.nutchai.hrm.domain.ResProvince;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResDistrictRepository extends JpaRepository<ResDistrict, UUID> {

    ResDistrict findFirstByProvince(ResProvince resProvince);

}
