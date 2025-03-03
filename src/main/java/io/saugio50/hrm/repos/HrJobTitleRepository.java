package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.HrJobTitle;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrJobTitleRepository extends JpaRepository<HrJobTitle, Long> {

    boolean existsByCodeIgnoreCase(String code);

}
