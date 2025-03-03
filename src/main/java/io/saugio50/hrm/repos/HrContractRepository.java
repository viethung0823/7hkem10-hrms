package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.HrContract;
import io.saugio50.hrm.domain.HrContractType;
import io.saugio50.hrm.domain.HrDepartment;
import io.saugio50.hrm.domain.HrEmployee;
import io.saugio50.hrm.domain.HrJobPosition;
import io.saugio50.hrm.domain.HrJobTitle;
import io.saugio50.hrm.domain.ResCompany;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrContractRepository extends JpaRepository<HrContract, Long> {

    HrContract findFirstByEmployee(HrEmployee hrEmployee);

    HrContract findFirstByContractType(HrContractType hrContractType);

    HrContract findFirstByJobPosition(HrJobPosition hrJobPosition);

    HrContract findFirstByJobTitle(HrJobTitle hrJobTitle);

    HrContract findFirstByDepartment(HrDepartment hrDepartment);

    HrContract findFirstByCompany(ResCompany resCompany);

}
