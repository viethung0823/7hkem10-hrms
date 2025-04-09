package com.oop7hkem10.hrm.service;

import com.oop7hkem10.hrm.domain.HrEmployee;
import com.oop7hkem10.hrm.domain.ResUser;
import com.oop7hkem10.hrm.domain.ResUserRole;
import com.oop7hkem10.hrm.model.ResUserDTO;
import com.oop7hkem10.hrm.repos.HrEmployeeRepository;
import com.oop7hkem10.hrm.repos.ResUserRepository;
import com.oop7hkem10.hrm.repos.ResUserRoleRepository;
import com.oop7hkem10.hrm.util.NotFoundException;
import com.oop7hkem10.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
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
        resUserDTO.setRole(resUser.getRole() == null ? null : resUser.getRole().getId());
        return resUserDTO;
    }

    private ResUser mapToEntity(final ResUserDTO resUserDTO, final ResUser resUser) {
        resUser.setUsername(resUserDTO.getUsername());
        resUser.setPassword(resUserDTO.getPassword());
        resUser.setName(resUserDTO.getName());
        final ResUserRole role = resUserDTO.getRole() == null ? null : resUserRoleRepository.findById(resUserDTO.getRole())
                .orElseThrow(() -> new NotFoundException("role not found"));
        resUser.setRole(role);
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
