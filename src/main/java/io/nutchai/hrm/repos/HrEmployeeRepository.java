package io.nutchai.hrm.repos;

import io.nutchai.hrm.domain.HrDepartment;
import io.nutchai.hrm.domain.HrEmployee;
import io.nutchai.hrm.domain.HrJobPosition;
import io.nutchai.hrm.domain.HrJobTitle;
import io.nutchai.hrm.domain.ResCompany;
import io.nutchai.hrm.domain.ResDistrictWard;
import io.nutchai.hrm.domain.ResProvince;
import io.nutchai.hrm.domain.ResUser;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrEmployeeRepository extends JpaRepository<HrEmployee, Long> {

    HrEmployee findFirstByCompany(ResCompany resCompany);

    HrEmployee findFirstByDepartment(HrDepartment hrDepartment);

    HrEmployee findFirstByJobPosition(HrJobPosition hrJobPosition);

    HrEmployee findFirstByJobTitle(HrJobTitle hrJobTitle);

    HrEmployee findFirstByProvince(ResProvince resProvince);

    HrEmployee findFirstByWard(ResDistrictWard resDistrictWard);

    HrEmployee findFirstByUser(ResUser resUser);

    HrEmployee findFirstByManagerAndIdNot(HrEmployee hrEmployee, final Long id);

    boolean existsByUserId(Long id);

}
