package com.oop7hkem10.hrm.repos;

import com.oop7hkem10.hrm.domain.HrDepartment;
import com.oop7hkem10.hrm.domain.ResCompany;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrDepartmentRepository extends JpaRepository<HrDepartment, Long> {

    HrDepartment findFirstByParentAndIdNot(HrDepartment hrDepartment, final Long id);

    HrDepartment findFirstByCompany(ResCompany resCompany);

    boolean existsByCodeIgnoreCase(String code);

}
