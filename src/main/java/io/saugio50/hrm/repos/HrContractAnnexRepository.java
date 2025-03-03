package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.HrContract;
import io.saugio50.hrm.domain.HrContractAnnex;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrContractAnnexRepository extends JpaRepository<HrContractAnnex, Long> {

    HrContractAnnex findFirstByContract(HrContract hrContract);

}
