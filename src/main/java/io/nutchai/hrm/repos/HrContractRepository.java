package io.nutchai.hrm.repos;

import io.nutchai.hrm.domain.HrContract;
import io.nutchai.hrm.domain.HrContractType;
import io.nutchai.hrm.domain.HrDepartment;
import io.nutchai.hrm.domain.HrEmployee;
import io.nutchai.hrm.domain.HrJobPosition;
import io.nutchai.hrm.domain.HrJobTitle;
import io.nutchai.hrm.domain.ResCompany;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrContractRepository extends JpaRepository<HrContract, Long> {

    HrContract findFirstByEmployee(HrEmployee hrEmployee);

    HrContract findFirstByContractType(HrContractType hrContractType);

    HrContract findFirstByJobPosition(HrJobPosition hrJobPosition);

    HrContract findFirstByJobTitle(HrJobTitle hrJobTitle);

    HrContract findFirstByDepartment(HrDepartment hrDepartment);

    HrContract findFirstByCompany(ResCompany resCompany);

}
