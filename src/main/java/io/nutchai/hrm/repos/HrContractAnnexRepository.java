package io.nutchai.hrm.repos;

import io.nutchai.hrm.domain.HrContract;
import io.nutchai.hrm.domain.HrContractAnnex;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrContractAnnexRepository extends JpaRepository<HrContractAnnex, Long> {

    HrContractAnnex findFirstByContract(HrContract hrContract);

}
