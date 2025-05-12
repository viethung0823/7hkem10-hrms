package com.oop7hkem10.hrm.repos;

import com.oop7hkem10.hrm.domain.ResDistrict;
import com.oop7hkem10.hrm.domain.ResProvince;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResDistrictRepository extends JpaRepository<ResDistrict, Long> {

    ResDistrict findFirstByProvince(ResProvince resProvince);

    boolean existsByCodeIgnoreCase(String code);

}
