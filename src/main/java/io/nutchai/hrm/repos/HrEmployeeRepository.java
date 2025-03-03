package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.HrDepartment;
import io.saugio50.hrm.domain.HrEmployee;
import io.saugio50.hrm.domain.HrJobPosition;
import io.saugio50.hrm.domain.HrJobTitle;
import io.saugio50.hrm.domain.ResCompany;
import io.saugio50.hrm.domain.ResDistrictWard;
import io.saugio50.hrm.domain.ResProvince;
import io.saugio50.hrm.domain.ResUser;
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
