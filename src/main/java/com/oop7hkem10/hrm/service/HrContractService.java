package com.oop7hkem10.hrm.service;

import com.oop7hkem10.hrm.domain.HrContract;
import com.oop7hkem10.hrm.domain.HrContractAnnex;
import com.oop7hkem10.hrm.domain.HrContractType;
import com.oop7hkem10.hrm.domain.HrDepartment;
import com.oop7hkem10.hrm.domain.HrEmployee;
import com.oop7hkem10.hrm.domain.HrJobPosition;
import com.oop7hkem10.hrm.domain.HrJobTitle;
import com.oop7hkem10.hrm.domain.ResCompany;
import com.oop7hkem10.hrm.model.HrContractDTO;
import com.oop7hkem10.hrm.repos.HrContractAnnexRepository;
import com.oop7hkem10.hrm.repos.HrContractRepository;
import com.oop7hkem10.hrm.repos.HrContractTypeRepository;
import com.oop7hkem10.hrm.repos.HrDepartmentRepository;
import com.oop7hkem10.hrm.repos.HrEmployeeRepository;
import com.oop7hkem10.hrm.repos.HrJobPositionRepository;
import com.oop7hkem10.hrm.repos.HrJobTitleRepository;
import com.oop7hkem10.hrm.repos.ResCompanyRepository;
import com.oop7hkem10.hrm.util.NotFoundException;
import com.oop7hkem10.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class HrContractService {

    private final HrContractRepository hrContractRepository;
    private final HrEmployeeRepository hrEmployeeRepository;
    private final HrContractTypeRepository hrContractTypeRepository;
    private final HrJobPositionRepository hrJobPositionRepository;
    private final HrJobTitleRepository hrJobTitleRepository;
    private final HrDepartmentRepository hrDepartmentRepository;
    private final ResCompanyRepository resCompanyRepository;
    private final HrContractAnnexRepository hrContractAnnexRepository;

    public HrContractService(final HrContractRepository hrContractRepository,
            final HrEmployeeRepository hrEmployeeRepository,
            final HrContractTypeRepository hrContractTypeRepository,
            final HrJobPositionRepository hrJobPositionRepository,
            final HrJobTitleRepository hrJobTitleRepository,
            final HrDepartmentRepository hrDepartmentRepository,
            final ResCompanyRepository resCompanyRepository,
            final HrContractAnnexRepository hrContractAnnexRepository) {
        this.hrContractRepository = hrContractRepository;
        this.hrEmployeeRepository = hrEmployeeRepository;
        this.hrContractTypeRepository = hrContractTypeRepository;
        this.hrJobPositionRepository = hrJobPositionRepository;
        this.hrJobTitleRepository = hrJobTitleRepository;
        this.hrDepartmentRepository = hrDepartmentRepository;
        this.resCompanyRepository = resCompanyRepository;
        this.hrContractAnnexRepository = hrContractAnnexRepository;
    }

    public List<HrContractDTO> findAll() {
        final List<HrContract> hrContracts = hrContractRepository.findAll(Sort.by("id"));
        return hrContracts.stream()
                .map(hrContract -> mapToDTO(hrContract, new HrContractDTO()))
                .toList();
    }

    public HrContractDTO get(final Long id) {
        return hrContractRepository.findById(id)
                .map(hrContract -> mapToDTO(hrContract, new HrContractDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final HrContractDTO hrContractDTO) {
        final HrContract hrContract = new HrContract();
        mapToEntity(hrContractDTO, hrContract);
        return hrContractRepository.save(hrContract).getId();
    }

    public void update(final Long id, final HrContractDTO hrContractDTO) {
        final HrContract hrContract = hrContractRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(hrContractDTO, hrContract);
        hrContractRepository.save(hrContract);
    }

    public void delete(final Long id) {
        hrContractRepository.deleteById(id);
    }

    private HrContractDTO mapToDTO(final HrContract hrContract, final HrContractDTO hrContractDTO) {
        hrContractDTO.setId(hrContract.getId());
        hrContractDTO.setName(hrContract.getName());
        hrContractDTO.setCode(hrContract.getCode());
        hrContractDTO.setDateFrom(hrContract.getDateFrom());
        hrContractDTO.setDateTo(hrContract.getDateTo());
        hrContractDTO.setSalary(hrContract.getSalary());
        hrContractDTO.setStatus(hrContract.getStatus());
        hrContractDTO.setEmployee(hrContract.getEmployee() == null ? null : hrContract.getEmployee().getId());
        hrContractDTO.setContractType(hrContract.getContractType() == null ? null : hrContract.getContractType().getId());
        hrContractDTO.setJobPosition(hrContract.getJobPosition() == null ? null : hrContract.getJobPosition().getId());
        hrContractDTO.setJobTitle(hrContract.getJobTitle() == null ? null : hrContract.getJobTitle().getId());
        hrContractDTO.setDepartment(hrContract.getDepartment() == null ? null : hrContract.getDepartment().getId());
        hrContractDTO.setCompany(hrContract.getCompany() == null ? null : hrContract.getCompany().getId());
        return hrContractDTO;
    }

    private HrContract mapToEntity(final HrContractDTO hrContractDTO, final HrContract hrContract) {
        hrContract.setName(hrContractDTO.getName());
        hrContract.setCode(hrContractDTO.getCode());
        hrContract.setDateFrom(hrContractDTO.getDateFrom());
        hrContract.setDateTo(hrContractDTO.getDateTo());
        hrContract.setSalary(hrContractDTO.getSalary());
        hrContract.setStatus(hrContractDTO.getStatus());
        final HrEmployee employee = hrContractDTO.getEmployee() == null ? null : hrEmployeeRepository.findById(hrContractDTO.getEmployee())
                .orElseThrow(() -> new NotFoundException("employee not found"));
        hrContract.setEmployee(employee);
        final HrContractType contractType = hrContractDTO.getContractType() == null ? null : hrContractTypeRepository.findById(hrContractDTO.getContractType())
                .orElseThrow(() -> new NotFoundException("contractType not found"));
        hrContract.setContractType(contractType);
        final HrJobPosition jobPosition = hrContractDTO.getJobPosition() == null ? null : hrJobPositionRepository.findById(hrContractDTO.getJobPosition())
                .orElseThrow(() -> new NotFoundException("jobPosition not found"));
        hrContract.setJobPosition(jobPosition);
        final HrJobTitle jobTitle = hrContractDTO.getJobTitle() == null ? null : hrJobTitleRepository.findById(hrContractDTO.getJobTitle())
                .orElseThrow(() -> new NotFoundException("jobTitle not found"));
        hrContract.setJobTitle(jobTitle);
        final HrDepartment department = hrContractDTO.getDepartment() == null ? null : hrDepartmentRepository.findById(hrContractDTO.getDepartment())
                .orElseThrow(() -> new NotFoundException("department not found"));
        hrContract.setDepartment(department);
        final ResCompany company = hrContractDTO.getCompany() == null ? null : resCompanyRepository.findById(hrContractDTO.getCompany())
                .orElseThrow(() -> new NotFoundException("company not found"));
        hrContract.setCompany(company);
        return hrContract;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final HrContract hrContract = hrContractRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final HrContractAnnex contractHrContractAnnex = hrContractAnnexRepository.findFirstByContract(hrContract);
        if (contractHrContractAnnex != null) {
            referencedWarning.setKey("hrContract.hrContractAnnex.contract.referenced");
            referencedWarning.addParam(contractHrContractAnnex.getId());
            return referencedWarning;
        }
        return null;
    }

}
