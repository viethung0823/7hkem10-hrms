package com.oop7hkem10.hrm.repos;

import com.oop7hkem10.hrm.domain.ResUser;
import com.oop7hkem10.hrm.domain.ResUserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ResUserRepository extends JpaRepository<ResUser, Long> {

    ResUser findFirstByRole(ResUserRole resUserRole);

    boolean existsByUsernameIgnoreCase(String username);
    ResUser findByUsername(String username);

}
