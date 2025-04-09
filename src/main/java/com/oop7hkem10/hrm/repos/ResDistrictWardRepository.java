package com.oop7hkem10.hrm.repos;

import com.oop7hkem10.hrm.domain.ResDistrict;
import com.oop7hkem10.hrm.domain.ResDistrictWard;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResDistrictWardRepository extends JpaRepository<ResDistrictWard, Long> {

    ResDistrictWard findFirstByDistrict(ResDistrict resDistrict);

    boolean existsByCodeIgnoreCase(String code);

}
