package com.oop7hkem10.hrm.repos;

import com.oop7hkem10.hrm.domain.HrContract;
import com.oop7hkem10.hrm.domain.HrContractAnnex;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrContractAnnexRepository extends JpaRepository<HrContractAnnex, Long> {

    HrContractAnnex findFirstByContract(HrContract hrContract);

}
