package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.ResDistrict;
import io.saugio50.hrm.domain.ResProvince;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResDistrictRepository extends JpaRepository<ResDistrict, UUID> {

    ResDistrict findFirstByProvince(ResProvince resProvince);

}
