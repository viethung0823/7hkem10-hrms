package io.saugio50.hrm.service;

import io.saugio50.hrm.domain.HrContract;
import io.saugio50.hrm.domain.HrDepartment;
import io.saugio50.hrm.domain.HrEmployee;
import io.saugio50.hrm.domain.HrJobPosition;
import io.saugio50.hrm.domain.ResCompany;
import io.saugio50.hrm.model.ResCompanyDTO;
import io.saugio50.hrm.repos.HrContractRepository;
import io.saugio50.hrm.repos.HrDepartmentRepository;
import io.saugio50.hrm.repos.HrEmployeeRepository;
import io.saugio50.hrm.repos.HrJobPositionRepository;
import io.saugio50.hrm.repos.ResCompanyRepository;
import io.saugio50.hrm.util.NotFoundException;
import io.saugio50.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ResCompanyService {

    private final ResCompanyRepository resCompanyRepository;
    private final HrDepartmentRepository hrDepartmentRepository;
    private final HrJobPositionRepository hrJobPositionRepository;
    private final HrEmployeeRepository hrEmployeeRepository;
    private final HrContractRepository hrContractRepository;

    public ResCompanyService(final ResCompanyRepository resCompanyRepository,
            final HrDepartmentRepository hrDepartmentRepository,
            final HrJobPositionRepository hrJobPositionRepository,
            final HrEmployeeRepository hrEmployeeRepository,
            final HrContractRepository hrContractRepository) {
        this.resCompanyRepository = resCompanyRepository;
        this.hrDepartmentRepository = hrDepartmentRepository;
        this.hrJobPositionRepository = hrJobPositionRepository;
        this.hrEmployeeRepository = hrEmployeeRepository;
        this.hrContractRepository = hrContractRepository;
    }

    public List<ResCompanyDTO> findAll() {
        final List<ResCompany> resCompanies = resCompanyRepository.findAll(Sort.by("id"));
        return resCompanies.stream()
                .map(resCompany -> mapToDTO(resCompany, new ResCompanyDTO()))
                .toList();
    }

    public ResCompanyDTO get(final Long id) {
        return resCompanyRepository.findById(id)
                .map(resCompany -> mapToDTO(resCompany, new ResCompanyDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ResCompanyDTO resCompanyDTO) {
        final ResCompany resCompany = new ResCompany();
        mapToEntity(resCompanyDTO, resCompany);
        return resCompanyRepository.save(resCompany).getId();
    }

    public void update(final Long id, final ResCompanyDTO resCompanyDTO) {
        final ResCompany resCompany = resCompanyRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(resCompanyDTO, resCompany);
        resCompanyRepository.save(resCompany);
    }

    public void delete(final Long id) {
        resCompanyRepository.deleteById(id);
    }

    private ResCompanyDTO mapToDTO(final ResCompany resCompany, final ResCompanyDTO resCompanyDTO) {
        resCompanyDTO.setId(resCompany.getId());
        resCompanyDTO.setName(resCompany.getName());
        resCompanyDTO.setAddress(resCompany.getAddress());
        resCompanyDTO.setPhone(resCompany.getPhone());
        resCompanyDTO.setEmail(resCompany.getEmail());
        resCompanyDTO.setWebsite(resCompany.getWebsite());
        resCompanyDTO.setTaxCode(resCompany.getTaxCode());
        return resCompanyDTO;
    }

    private ResCompany mapToEntity(final ResCompanyDTO resCompanyDTO, final ResCompany resCompany) {
        resCompany.setName(resCompanyDTO.getName());
        resCompany.setAddress(resCompanyDTO.getAddress());
        resCompany.setPhone(resCompanyDTO.getPhone());
        resCompany.setEmail(resCompanyDTO.getEmail());
        resCompany.setWebsite(resCompanyDTO.getWebsite());
        resCompany.setTaxCode(resCompanyDTO.getTaxCode());
        return resCompany;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final ResCompany resCompany = resCompanyRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final HrDepartment companyHrDepartment = hrDepartmentRepository.findFirstByCompany(resCompany);
        if (companyHrDepartment != null) {
            referencedWarning.setKey("resCompany.hrDepartment.company.referenced");
            referencedWarning.addParam(companyHrDepartment.getId());
            return referencedWarning;
        }
        final HrJobPosition companyHrJobPosition = hrJobPositionRepository.findFirstByCompany(resCompany);
        if (companyHrJobPosition != null) {
            referencedWarning.setKey("resCompany.hrJobPosition.company.referenced");
            referencedWarning.addParam(companyHrJobPosition.getId());
            return referencedWarning;
        }
        final HrEmployee companyHrEmployee = hrEmployeeRepository.findFirstByCompany(resCompany);
        if (companyHrEmployee != null) {
            referencedWarning.setKey("resCompany.hrEmployee.company.referenced");
            referencedWarning.addParam(companyHrEmployee.getId());
            return referencedWarning;
        }
        final HrContract companyHrContract = hrContractRepository.findFirstByCompany(resCompany);
        if (companyHrContract != null) {
            referencedWarning.setKey("resCompany.hrContract.company.referenced");
            referencedWarning.addParam(companyHrContract.getId());
            return referencedWarning;
        }
        return null;
    }

}
