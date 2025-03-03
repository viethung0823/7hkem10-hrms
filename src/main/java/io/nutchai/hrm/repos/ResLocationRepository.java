package io.nutchai.hrm.repos;

import io.nutchai.hrm.domain.ResDistrictWard;
import io.nutchai.hrm.domain.ResLocation;
import io.nutchai.hrm.domain.ResProvince;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResLocationRepository extends JpaRepository<ResLocation, Long> {

    ResLocation findFirstByDistricWard(ResDistrictWard resDistrictWard);

    ResLocation findFirstByProvince(ResProvince resProvince);

    boolean existsByDistricWardId(Long id);

}
