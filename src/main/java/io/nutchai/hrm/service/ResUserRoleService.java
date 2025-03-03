package io.saugio50.hrm.service;

import io.saugio50.hrm.domain.ResUserRole;
import io.saugio50.hrm.model.ResUserRoleDTO;
import io.saugio50.hrm.repos.ResUserRepository;
import io.saugio50.hrm.repos.ResUserRoleRepository;
import io.saugio50.hrm.util.NotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@Transactional
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
        final ResUserRole resUserRole = resUserRoleRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        // remove many-to-many relations at owning side
        resUserRepository.findAllByRole(resUserRole)
                .forEach(resUser -> resUser.getRole().remove(resUserRole));
        resUserRoleRepository.delete(resUserRole);
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

}
