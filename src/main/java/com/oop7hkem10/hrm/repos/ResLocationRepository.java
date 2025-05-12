package com.oop7hkem10.hrm.repos;

import com.oop7hkem10.hrm.domain.ResDistrict;
import com.oop7hkem10.hrm.domain.ResDistrictWard;
import com.oop7hkem10.hrm.domain.ResLocation;
import com.oop7hkem10.hrm.domain.ResProvince;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResLocationRepository extends JpaRepository<ResLocation, Long> {

    ResLocation findFirstByDistricWard(ResDistrictWard resDistrictWard);

    ResLocation findFirstByProvince(ResProvince resProvince);

    ResLocation findFirstByDistrict(ResDistrict resDistrict);

    boolean existsByDistricWardId(Long id);

}
