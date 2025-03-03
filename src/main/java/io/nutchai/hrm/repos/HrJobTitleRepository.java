package io.nutchai.hrm.repos;

import io.nutchai.hrm.domain.HrJobTitle;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrJobTitleRepository extends JpaRepository<HrJobTitle, Long> {

    boolean existsByCodeIgnoreCase(String code);

}
