package com.oop7hkem10.hrm.repos;

import com.oop7hkem10.hrm.domain.HrJobTitle;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HrJobTitleRepository extends JpaRepository<HrJobTitle, Long> {

    boolean existsByCodeIgnoreCase(String code);

}
