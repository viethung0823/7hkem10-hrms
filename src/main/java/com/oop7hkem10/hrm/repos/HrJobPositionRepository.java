package com.oop7hkem10.hrm.repos;

import com.oop7hkem10.hrm.domain.HrDepartment;
import com.oop7hkem10.hrm.domain.HrJobPosition;
import com.oop7hkem10.hrm.domain.ResCompany;
import com.oop7hkem10.hrm.domain.ResLocation;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrJobPositionRepository extends JpaRepository<HrJobPosition, Long> {

    HrJobPosition findFirstByCompany(ResCompany resCompany);

    HrJobPosition findFirstByDepartment(HrDepartment hrDepartment);

    HrJobPosition findFirstByLocation(ResLocation resLocation);

}
