package io.saugio50.hrm.service;

import io.saugio50.hrm.domain.HrEmployee;
import io.saugio50.hrm.domain.ResUser;
import io.saugio50.hrm.domain.ResUserRole;
import io.saugio50.hrm.model.ResUserDTO;
import io.saugio50.hrm.repos.HrEmployeeRepository;
import io.saugio50.hrm.repos.ResUserRepository;
import io.saugio50.hrm.repos.ResUserRoleRepository;
import io.saugio50.hrm.util.NotFoundException;
import io.saugio50.hrm.util.ReferencedWarning;
import jakarta.transaction.Transactional;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class ResUserService {

    private final ResUserRepository resUserRepository;
    private final ResUserRoleRepository resUserRoleRepository;
    private final HrEmployeeRepository hrEmployeeRepository;

    public ResUserService(final ResUserRepository resUserRepository,
            final ResUserRoleRepository resUserRoleRepository,
            final HrEmployeeRepository hrEmployeeRepository) {
        this.resUserRepository = resUserRepository;
        this.resUserRoleRepository = resUserRoleRepository;
        this.hrEmployeeRepository = hrEmployeeRepository;
    }

    public List<ResUserDTO> findAll() {
        final List<ResUser> resUsers = resUserRepository.findAll(Sort.by("id"));
        return resUsers.stream()
                .map(resUser -> mapToDTO(resUser, new ResUserDTO()))
                .toList();
    }

    public ResUserDTO get(final Long id) {
        return resUserRepository.findById(id)
                .map(resUser -> mapToDTO(resUser, new ResUserDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ResUserDTO resUserDTO) {
        final ResUser resUser = new ResUser();
        mapToEntity(resUserDTO, resUser);
        return resUserRepository.save(resUser).getId();
    }

    public void update(final Long id, final ResUserDTO resUserDTO) {
        final ResUser resUser = resUserRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(resUserDTO, resUser);
        resUserRepository.save(resUser);
    }

    public void delete(final Long id) {
        resUserRepository.deleteById(id);
    }

    private ResUserDTO mapToDTO(final ResUser resUser, final ResUserDTO resUserDTO) {
        resUserDTO.setId(resUser.getId());
        resUserDTO.setUsername(resUser.getUsername());
        resUserDTO.setPassword(resUser.getPassword());
        resUserDTO.setName(resUser.getName());
        resUserDTO.setRole(resUser.getRole().stream()
                .map(resUserRole -> resUserRole.getId())
                .toList());
        return resUserDTO;
    }

    private ResUser mapToEntity(final ResUserDTO resUserDTO, final ResUser resUser) {
        resUser.setUsername(resUserDTO.getUsername());
        resUser.setPassword(resUserDTO.getPassword());
        resUser.setName(resUserDTO.getName());
        final List<ResUserRole> role = resUserRoleRepository.findAllById(
                resUserDTO.getRole() == null ? Collections.emptyList() : resUserDTO.getRole());
        if (role.size() != (resUserDTO.getRole() == null ? 0 : resUserDTO.getRole().size())) {
            throw new NotFoundException("one of role not found");
        }
        resUser.setRole(new HashSet<>(role));
        return resUser;
    }

    public boolean usernameExists(final String username) {
        return resUserRepository.existsByUsernameIgnoreCase(username);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final ResUser resUser = resUserRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final HrEmployee userHrEmployee = hrEmployeeRepository.findFirstByUser(resUser);
        if (userHrEmployee != null) {
            referencedWarning.setKey("resUser.hrEmployee.user.referenced");
            referencedWarning.addParam(userHrEmployee.getId());
            return referencedWarning;
        }
        return null;
    }

}
