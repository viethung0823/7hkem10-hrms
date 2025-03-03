package io.nutchai.hrm.service;

import io.nutchai.hrm.domain.HrContract;
import io.nutchai.hrm.domain.HrDepartment;
import io.nutchai.hrm.domain.HrEmployee;
import io.nutchai.hrm.domain.HrJobPosition;
import io.nutchai.hrm.domain.ResCompany;
import io.nutchai.hrm.model.HrDepartmentDTO;
import io.nutchai.hrm.repos.HrContractRepository;
import io.nutchai.hrm.repos.HrDepartmentRepository;
import io.nutchai.hrm.repos.HrEmployeeRepository;
import io.nutchai.hrm.repos.HrJobPositionRepository;
import io.nutchai.hrm.repos.ResCompanyRepository;
import io.nutchai.hrm.util.NotFoundException;
import io.nutchai.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class HrDepartmentService {

    private final HrDepartmentRepository hrDepartmentRepository;
    private final ResCompanyRepository resCompanyRepository;
    private final HrJobPositionRepository hrJobPositionRepository;
    private final HrEmployeeRepository hrEmployeeRepository;
    private final HrContractRepository hrContractRepository;

    public HrDepartmentService(final HrDepartmentRepository hrDepartmentRepository,
            final ResCompanyRepository resCompanyRepository,
            final HrJobPositionRepository hrJobPositionRepository,
            final HrEmployeeRepository hrEmployeeRepository,
            final HrContractRepository hrContractRepository) {
        this.hrDepartmentRepository = hrDepartmentRepository;
        this.resCompanyRepository = resCompanyRepository;
        this.hrJobPositionRepository = hrJobPositionRepository;
        this.hrEmployeeRepository = hrEmployeeRepository;
        this.hrContractRepository = hrContractRepository;
    }

    public List<HrDepartmentDTO> findAll() {
        final List<HrDepartment> hrDepartments = hrDepartmentRepository.findAll(Sort.by("id"));
        return hrDepartments.stream()
                .map(hrDepartment -> mapToDTO(hrDepartment, new HrDepartmentDTO()))
                .toList();
    }

    public HrDepartmentDTO get(final Long id) {
        return hrDepartmentRepository.findById(id)
                .map(hrDepartment -> mapToDTO(hrDepartment, new HrDepartmentDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final HrDepartmentDTO hrDepartmentDTO) {
        final HrDepartment hrDepartment = new HrDepartment();
        mapToEntity(hrDepartmentDTO, hrDepartment);
        return hrDepartmentRepository.save(hrDepartment).getId();
    }

    public void update(final Long id, final HrDepartmentDTO hrDepartmentDTO) {
        final HrDepartment hrDepartment = hrDepartmentRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(hrDepartmentDTO, hrDepartment);
        hrDepartmentRepository.save(hrDepartment);
    }

    public void delete(final Long id) {
        hrDepartmentRepository.deleteById(id);
    }

    private HrDepartmentDTO mapToDTO(final HrDepartment hrDepartment,
            final HrDepartmentDTO hrDepartmentDTO) {
        hrDepartmentDTO.setId(hrDepartment.getId());
        hrDepartmentDTO.setCode(hrDepartment.getCode());
        hrDepartmentDTO.setName(hrDepartment.getName());
        hrDepartmentDTO.setParent(hrDepartment.getParent() == null ? null : hrDepartment.getParent().getId());
        hrDepartmentDTO.setCompany(hrDepartment.getCompany() == null ? null : hrDepartment.getCompany().getId());
        return hrDepartmentDTO;
    }

    private HrDepartment mapToEntity(final HrDepartmentDTO hrDepartmentDTO,
            final HrDepartment hrDepartment) {
        hrDepartment.setCode(hrDepartmentDTO.getCode());
        hrDepartment.setName(hrDepartmentDTO.getName());
        final HrDepartment parent = hrDepartmentDTO.getParent() == null ? null : hrDepartmentRepository.findById(hrDepartmentDTO.getParent())
                .orElseThrow(() -> new NotFoundException("parent not found"));
        hrDepartment.setParent(parent);
        final ResCompany company = hrDepartmentDTO.getCompany() == null ? null : resCompanyRepository.findById(hrDepartmentDTO.getCompany())
                .orElseThrow(() -> new NotFoundException("company not found"));
        hrDepartment.setCompany(company);
        return hrDepartment;
    }

    public boolean codeExists(final String code) {
        return hrDepartmentRepository.existsByCodeIgnoreCase(code);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final HrDepartment hrDepartment = hrDepartmentRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final HrDepartment parentHrDepartment = hrDepartmentRepository.findFirstByParentAndIdNot(hrDepartment, hrDepartment.getId());
        if (parentHrDepartment != null) {
            referencedWarning.setKey("hrDepartment.hrDepartment.parent.referenced");
            referencedWarning.addParam(parentHrDepartment.getId());
            return referencedWarning;
        }
        final HrJobPosition departmentHrJobPosition = hrJobPositionRepository.findFirstByDepartment(hrDepartment);
        if (departmentHrJobPosition != null) {
            referencedWarning.setKey("hrDepartment.hrJobPosition.department.referenced");
            referencedWarning.addParam(departmentHrJobPosition.getId());
            return referencedWarning;
        }
        final HrEmployee departmentHrEmployee = hrEmployeeRepository.findFirstByDepartment(hrDepartment);
        if (departmentHrEmployee != null) {
            referencedWarning.setKey("hrDepartment.hrEmployee.department.referenced");
            referencedWarning.addParam(departmentHrEmployee.getId());
            return referencedWarning;
        }
        final HrContract departmentHrContract = hrContractRepository.findFirstByDepartment(hrDepartment);
        if (departmentHrContract != null) {
            referencedWarning.setKey("hrDepartment.hrContract.department.referenced");
            referencedWarning.addParam(departmentHrContract.getId());
            return referencedWarning;
        }
        return null;
    }

}
