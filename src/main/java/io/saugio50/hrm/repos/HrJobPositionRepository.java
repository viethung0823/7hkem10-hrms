package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.HrDepartment;
import io.saugio50.hrm.domain.HrJobPosition;
import io.saugio50.hrm.domain.ResCompany;
import io.saugio50.hrm.domain.ResLocation;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrJobPositionRepository extends JpaRepository<HrJobPosition, Long> {

    HrJobPosition findFirstByCompany(ResCompany resCompany);

    HrJobPosition findFirstByDepartment(HrDepartment hrDepartment);

    HrJobPosition findFirstByLocation(ResLocation resLocation);

}
