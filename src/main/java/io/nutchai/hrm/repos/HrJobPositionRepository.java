package io.nutchai.hrm.repos;

import io.nutchai.hrm.domain.HrDepartment;
import io.nutchai.hrm.domain.HrJobPosition;
import io.nutchai.hrm.domain.ResCompany;
import io.nutchai.hrm.domain.ResLocation;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrJobPositionRepository extends JpaRepository<HrJobPosition, Long> {

    HrJobPosition findFirstByCompany(ResCompany resCompany);

    HrJobPosition findFirstByDepartment(HrDepartment hrDepartment);

    HrJobPosition findFirstByLocation(ResLocation resLocation);

}
