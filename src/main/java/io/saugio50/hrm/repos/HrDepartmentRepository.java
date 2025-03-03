package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.HrDepartment;
import io.saugio50.hrm.domain.ResCompany;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrDepartmentRepository extends JpaRepository<HrDepartment, Long> {

    HrDepartment findFirstByParentAndIdNot(HrDepartment hrDepartment, final Long id);

    HrDepartment findFirstByCompany(ResCompany resCompany);

    boolean existsByCodeIgnoreCase(String code);

}
