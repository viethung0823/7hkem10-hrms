package com.oop7hkem10.hrm.service;

import com.oop7hkem10.hrm.domain.ResUser;
import com.oop7hkem10.hrm.domain.ResUserRole;
import com.oop7hkem10.hrm.model.ResUserRoleDTO;
import com.oop7hkem10.hrm.repos.ResUserRepository;
import com.oop7hkem10.hrm.repos.ResUserRoleRepository;
import com.oop7hkem10.hrm.util.NotFoundException;
import com.oop7hkem10.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ResUserRoleService {

    private final ResUserRoleRepository resUserRoleRepository;
    private final ResUserRepository resUserRepository;

    public ResUserRoleService(final ResUserRoleRepository resUserRoleRepository,
            final ResUserRepository resUserRepository) {
        this.resUserRoleRepository = resUserRoleRepository;
        this.resUserRepository = resUserRepository;
    }

    public List<ResUserRoleDTO> findAll() {
        final List<ResUserRole> resUserRoles = resUserRoleRepository.findAll(Sort.by("id"));
        return resUserRoles.stream()
                .map(resUserRole -> mapToDTO(resUserRole, new ResUserRoleDTO()))
                .toList();
    }

    public ResUserRoleDTO get(final Long id) {
        return resUserRoleRepository.findById(id)
                .map(resUserRole -> mapToDTO(resUserRole, new ResUserRoleDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ResUserRoleDTO resUserRoleDTO) {
        final ResUserRole resUserRole = new ResUserRole();
        mapToEntity(resUserRoleDTO, resUserRole);
        return resUserRoleRepository.save(resUserRole).getId();
    }

    public void update(final Long id, final ResUserRoleDTO resUserRoleDTO) {
        final ResUserRole resUserRole = resUserRoleRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(resUserRoleDTO, resUserRole);
        resUserRoleRepository.save(resUserRole);
    }

    public void delete(final Long id) {
        resUserRoleRepository.deleteById(id);
    }

    private ResUserRoleDTO mapToDTO(final ResUserRole resUserRole,
            final ResUserRoleDTO resUserRoleDTO) {
        resUserRoleDTO.setId(resUserRole.getId());
        resUserRoleDTO.setName(resUserRole.getName());
        return resUserRoleDTO;
    }

    private ResUserRole mapToEntity(final ResUserRoleDTO resUserRoleDTO,
            final ResUserRole resUserRole) {
        resUserRole.setName(resUserRoleDTO.getName());
        return resUserRole;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final ResUserRole resUserRole = resUserRoleRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final ResUser roleResUser = resUserRepository.findFirstByRole(resUserRole);
        if (roleResUser != null) {
            referencedWarning.setKey("resUserRole.resUser.role.referenced");
            referencedWarning.addParam(roleResUser.getId());
            return referencedWarning;
        }
        return null;
    }

}
