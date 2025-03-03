package io.nutchai.hrm.repos;

import io.nutchai.hrm.domain.ResUser;
import io.nutchai.hrm.domain.ResUserRole;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResUserRepository extends JpaRepository<ResUser, Long> {

    ResUser findFirstByRole(ResUserRole resUserRole);

    List<ResUser> findAllByRole(ResUserRole resUserRole);

    boolean existsByUsernameIgnoreCase(String username);

}
