package io.saugio50.hrm.repos;

import io.saugio50.hrm.domain.ResUser;
import io.saugio50.hrm.domain.ResUserRole;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResUserRepository extends JpaRepository<ResUser, Long> {

    ResUser findFirstByRole(ResUserRole resUserRole);

    List<ResUser> findAllByRole(ResUserRole resUserRole);

    boolean existsByUsernameIgnoreCase(String username);

}
