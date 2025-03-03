package io.nutchai.hrm.service;

import io.nutchai.hrm.domain.HrContract;
import io.nutchai.hrm.domain.HrDepartment;
import io.nutchai.hrm.domain.HrEmployee;
import io.nutchai.hrm.domain.HrJobPosition;
import io.nutchai.hrm.domain.ResCompany;
import io.nutchai.hrm.domain.ResLocation;
import io.nutchai.hrm.model.HrJobPositionDTO;
import io.nutchai.hrm.repos.HrContractRepository;
import io.nutchai.hrm.repos.HrDepartmentRepository;
import io.nutchai.hrm.repos.HrEmployeeRepository;
import io.nutchai.hrm.repos.HrJobPositionRepository;
import io.nutchai.hrm.repos.ResCompanyRepository;
import io.nutchai.hrm.repos.ResLocationRepository;
import io.nutchai.hrm.util.NotFoundException;
import io.nutchai.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class HrJobPositionService {

    private final HrJobPositionRepository hrJobPositionRepository;
    private final ResCompanyRepository resCompanyRepository;
    private final HrDepartmentRepository hrDepartmentRepository;
    private final ResLocationRepository resLocationRepository;
    private final HrEmployeeRepository hrEmployeeRepository;
    private final HrContractRepository hrContractRepository;

    public HrJobPositionService(final HrJobPositionRepository hrJobPositionRepository,
            final ResCompanyRepository resCompanyRepository,
            final HrDepartmentRepository hrDepartmentRepository,
            final ResLocationRepository resLocationRepository,
            final HrEmployeeRepository hrEmployeeRepository,
            final HrContractRepository hrContractRepository) {
        this.hrJobPositionRepository = hrJobPositionRepository;
        this.resCompanyRepository = resCompanyRepository;
        this.hrDepartmentRepository = hrDepartmentRepository;
        this.resLocationRepository = resLocationRepository;
        this.hrEmployeeRepository = hrEmployeeRepository;
        this.hrContractRepository = hrContractRepository;
    }

    public List<HrJobPositionDTO> findAll() {
        final List<HrJobPosition> hrJobPositions = hrJobPositionRepository.findAll(Sort.by("id"));
        return hrJobPositions.stream()
                .map(hrJobPosition -> mapToDTO(hrJobPosition, new HrJobPositionDTO()))
                .toList();
    }

    public HrJobPositionDTO get(final Long id) {
        return hrJobPositionRepository.findById(id)
                .map(hrJobPosition -> mapToDTO(hrJobPosition, new HrJobPositionDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final HrJobPositionDTO hrJobPositionDTO) {
        final HrJobPosition hrJobPosition = new HrJobPosition();
        mapToEntity(hrJobPositionDTO, hrJobPosition);
        return hrJobPositionRepository.save(hrJobPosition).getId();
    }

    public void update(final Long id, final HrJobPositionDTO hrJobPositionDTO) {
        final HrJobPosition hrJobPosition = hrJobPositionRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(hrJobPositionDTO, hrJobPosition);
        hrJobPositionRepository.save(hrJobPosition);
    }

    public void delete(final Long id) {
        hrJobPositionRepository.deleteById(id);
    }

    private HrJobPositionDTO mapToDTO(final HrJobPosition hrJobPosition,
            final HrJobPositionDTO hrJobPositionDTO) {
        hrJobPositionDTO.setId(hrJobPosition.getId());
        hrJobPositionDTO.setName(hrJobPosition.getName());
        hrJobPositionDTO.setIsRecruiting(hrJobPosition.getIsRecruiting());
        hrJobPositionDTO.setTargetRecruitment(hrJobPosition.getTargetRecruitment());
        hrJobPositionDTO.setJobSummary(hrJobPosition.getJobSummary());
        hrJobPositionDTO.setCompany(hrJobPosition.getCompany() == null ? null : hrJobPosition.getCompany().getId());
        hrJobPositionDTO.setDepartment(hrJobPosition.getDepartment() == null ? null : hrJobPosition.getDepartment().getId());
        hrJobPositionDTO.setLocation(hrJobPosition.getLocation() == null ? null : hrJobPosition.getLocation().getId());
        return hrJobPositionDTO;
    }

    private HrJobPosition mapToEntity(final HrJobPositionDTO hrJobPositionDTO,
            final HrJobPosition hrJobPosition) {
        hrJobPosition.setName(hrJobPositionDTO.getName());
        hrJobPosition.setIsRecruiting(hrJobPositionDTO.getIsRecruiting());
        hrJobPosition.setTargetRecruitment(hrJobPositionDTO.getTargetRecruitment());
        hrJobPosition.setJobSummary(hrJobPositionDTO.getJobSummary());
        final ResCompany company = hrJobPositionDTO.getCompany() == null ? null : resCompanyRepository.findById(hrJobPositionDTO.getCompany())
                .orElseThrow(() -> new NotFoundException("company not found"));
        hrJobPosition.setCompany(company);
        final HrDepartment department = hrJobPositionDTO.getDepartment() == null ? null : hrDepartmentRepository.findById(hrJobPositionDTO.getDepartment())
                .orElseThrow(() -> new NotFoundException("department not found"));
        hrJobPosition.setDepartment(department);
        final ResLocation location = hrJobPositionDTO.getLocation() == null ? null : resLocationRepository.findById(hrJobPositionDTO.getLocation())
                .orElseThrow(() -> new NotFoundException("location not found"));
        hrJobPosition.setLocation(location);
        return hrJobPosition;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final HrJobPosition hrJobPosition = hrJobPositionRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final HrEmployee jobPositionHrEmployee = hrEmployeeRepository.findFirstByJobPosition(hrJobPosition);
        if (jobPositionHrEmployee != null) {
            referencedWarning.setKey("hrJobPosition.hrEmployee.jobPosition.referenced");
            referencedWarning.addParam(jobPositionHrEmployee.getId());
            return referencedWarning;
        }
        final HrContract jobPositionHrContract = hrContractRepository.findFirstByJobPosition(hrJobPosition);
        if (jobPositionHrContract != null) {
            referencedWarning.setKey("hrJobPosition.hrContract.jobPosition.referenced");
            referencedWarning.addParam(jobPositionHrContract.getId());
            return referencedWarning;
        }
        return null;
    }

}
