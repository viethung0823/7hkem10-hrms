package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.ResDistrict;
import io.saugio50.hrm.domain.ResDistrictWard;
import io.saugio50.hrm.domain.ResLocation;
import io.saugio50.hrm.domain.ResProvince;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResLocationRepository extends JpaRepository<ResLocation, Long> {

    ResLocation findFirstByDistricWard(ResDistrictWard resDistrictWard);

    ResLocation findFirstByProvince(ResProvince resProvince);

    ResLocation findFirstByDistrict(ResDistrict resDistrict);

    boolean existsByDistricWardId(Long id);

}
