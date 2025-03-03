package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.ResDistrictWard;
import io.saugio50.hrm.domain.ResLocation;
import io.saugio50.hrm.domain.ResProvince;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResLocationRepository extends JpaRepository<ResLocation, Long> {

    ResLocation findFirstByDistricWard(ResDistrictWard resDistrictWard);

    ResLocation findFirstByProvince(ResProvince resProvince);

    boolean existsByDistricWardId(Long id);

}
