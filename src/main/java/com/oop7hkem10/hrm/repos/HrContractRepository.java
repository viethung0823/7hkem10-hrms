package com.oop7hkem10.hrm.repos;

import com.oop7hkem10.hrm.domain.HrContract;
import com.oop7hkem10.hrm.domain.HrContractType;
import com.oop7hkem10.hrm.domain.HrDepartment;
import com.oop7hkem10.hrm.domain.HrEmployee;
import com.oop7hkem10.hrm.domain.HrJobPosition;
import com.oop7hkem10.hrm.domain.HrJobTitle;
import com.oop7hkem10.hrm.domain.ResCompany;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrContractRepository extends JpaRepository<HrContract, Long> {

    HrContract findFirstByEmployee(HrEmployee hrEmployee);

    HrContract findFirstByContractType(HrContractType hrContractType);

    HrContract findFirstByJobPosition(HrJobPosition hrJobPosition);

    HrContract findFirstByJobTitle(HrJobTitle hrJobTitle);

    HrContract findFirstByDepartment(HrDepartment hrDepartment);

    HrContract findFirstByCompany(ResCompany resCompany);

}
