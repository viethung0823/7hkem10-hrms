package com.oop7hkem10.hrm.repos;

import com.oop7hkem10.hrm.domain.HrDepartment;
import com.oop7hkem10.hrm.domain.HrEmployee;
import com.oop7hkem10.hrm.domain.HrJobPosition;
import com.oop7hkem10.hrm.domain.HrJobTitle;
import com.oop7hkem10.hrm.domain.ResCompany;
import com.oop7hkem10.hrm.domain.ResDistrict;
import com.oop7hkem10.hrm.domain.ResDistrictWard;
import com.oop7hkem10.hrm.domain.ResProvince;
import com.oop7hkem10.hrm.domain.ResUser;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrEmployeeRepository extends JpaRepository<HrEmployee, Long> {

    HrEmployee findFirstByCompany(ResCompany resCompany);

    HrEmployee findFirstByDepartment(HrDepartment hrDepartment);

    HrEmployee findFirstByJobPosition(HrJobPosition hrJobPosition);

    HrEmployee findFirstByJobTitle(HrJobTitle hrJobTitle);

    HrEmployee findFirstByProvince(ResProvince resProvince);

    HrEmployee findFirstByDistrict(ResDistrict resDistrict);

    HrEmployee findFirstByWard(ResDistrictWard resDistrictWard);

    HrEmployee findFirstByUser(ResUser resUser);

    HrEmployee findFirstByManagerAndIdNot(HrEmployee hrEmployee, final Long id);

    boolean existsByUserId(Long id);

}
