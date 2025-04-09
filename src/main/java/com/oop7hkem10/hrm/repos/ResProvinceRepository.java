package com.oop7hkem10.hrm.repos;

import com.oop7hkem10.hrm.domain.ResProvince;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResProvinceRepository extends JpaRepository<ResProvince, Long> {

    boolean existsByCodeIgnoreCase(String code);

}
