package io.saugio50.hrm.service;

import io.saugio50.hrm.domain.HrContract;
import io.saugio50.hrm.domain.HrDepartment;
import io.saugio50.hrm.domain.HrEmployee;
import io.saugio50.hrm.domain.HrJobPosition;
import io.saugio50.hrm.domain.HrJobTitle;
import io.saugio50.hrm.domain.ResCompany;
import io.saugio50.hrm.domain.ResDistrict;
import io.saugio50.hrm.domain.ResDistrictWard;
import io.saugio50.hrm.domain.ResProvince;
import io.saugio50.hrm.domain.ResUser;
import io.saugio50.hrm.model.HrEmployeeDTO;
import io.saugio50.hrm.repos.HrContractRepository;
import io.saugio50.hrm.repos.HrDepartmentRepository;
import io.saugio50.hrm.repos.HrEmployeeRepository;
import io.saugio50.hrm.repos.HrJobPositionRepository;
import io.saugio50.hrm.repos.HrJobTitleRepository;
import io.saugio50.hrm.repos.ResCompanyRepository;
import io.saugio50.hrm.repos.ResDistrictRepository;
import io.saugio50.hrm.repos.ResDistrictWardRepository;
import io.saugio50.hrm.repos.ResProvinceRepository;
import io.saugio50.hrm.repos.ResUserRepository;
import io.saugio50.hrm.util.NotFoundException;
import io.saugio50.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class HrEmployeeService {

    private final HrEmployeeRepository hrEmployeeRepository;
    private final ResCompanyRepository resCompanyRepository;
    private final HrDepartmentRepository hrDepartmentRepository;
    private final HrJobPositionRepository hrJobPositionRepository;
    private final HrJobTitleRepository hrJobTitleRepository;
    private final ResProvinceRepository resProvinceRepository;
    private final ResDistrictRepository resDistrictRepository;
    private final ResDistrictWardRepository resDistrictWardRepository;
    private final ResUserRepository resUserRepository;
    private final HrContractRepository hrContractRepository;

    public HrEmployeeService(final HrEmployeeRepository hrEmployeeRepository,
            final ResCompanyRepository resCompanyRepository,
            final HrDepartmentRepository hrDepartmentRepository,
            final HrJobPositionRepository hrJobPositionRepository,
            final HrJobTitleRepository hrJobTitleRepository,
            final ResProvinceRepository resProvinceRepository,
            final ResDistrictRepository resDistrictRepository,
            final ResDistrictWardRepository resDistrictWardRepository,
            final ResUserRepository resUserRepository,
            final HrContractRepository hrContractRepository) {
        this.hrEmployeeRepository = hrEmployeeRepository;
        this.resCompanyRepository = resCompanyRepository;
        this.hrDepartmentRepository = hrDepartmentRepository;
        this.hrJobPositionRepository = hrJobPositionRepository;
        this.hrJobTitleRepository = hrJobTitleRepository;
        this.resProvinceRepository = resProvinceRepository;
        this.resDistrictRepository = resDistrictRepository;
        this.resDistrictWardRepository = resDistrictWardRepository;
        this.resUserRepository = resUserRepository;
        this.hrContractRepository = hrContractRepository;
    }

    public List<HrEmployeeDTO> findAll() {
        final List<HrEmployee> hrEmployees = hrEmployeeRepository.findAll(Sort.by("id"));
        return hrEmployees.stream()
                .map(hrEmployee -> mapToDTO(hrEmployee, new HrEmployeeDTO()))
                .toList();
    }

    public HrEmployeeDTO get(final Long id) {
        return hrEmployeeRepository.findById(id)
                .map(hrEmployee -> mapToDTO(hrEmployee, new HrEmployeeDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final HrEmployeeDTO hrEmployeeDTO) {
        final HrEmployee hrEmployee = new HrEmployee();
        mapToEntity(hrEmployeeDTO, hrEmployee);
        return hrEmployeeRepository.save(hrEmployee).getId();
    }

    public void update(final Long id, final HrEmployeeDTO hrEmployeeDTO) {
        final HrEmployee hrEmployee = hrEmployeeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(hrEmployeeDTO, hrEmployee);
        hrEmployeeRepository.save(hrEmployee);
    }

    public void delete(final Long id) {
        hrEmployeeRepository.deleteById(id);
    }

    private HrEmployeeDTO mapToDTO(final HrEmployee hrEmployee, final HrEmployeeDTO hrEmployeeDTO) {
        hrEmployeeDTO.setId(hrEmployee.getId());
        hrEmployeeDTO.setName(hrEmployee.getName());
        hrEmployeeDTO.setCode(hrEmployee.getCode());
        hrEmployeeDTO.setEmail(hrEmployee.getEmail());
        hrEmployeeDTO.setWorkPhone(hrEmployee.getWorkPhone());
        hrEmployeeDTO.setGender(hrEmployee.getGender());
        hrEmployeeDTO.setStatus(hrEmployee.getStatus());
        hrEmployeeDTO.setDateJoin(hrEmployee.getDateJoin());
        hrEmployeeDTO.setDateLeft(hrEmployee.getDateLeft());
        hrEmployeeDTO.setCountry(hrEmployee.getCountry());
        hrEmployeeDTO.setIdNumber(hrEmployee.getIdNumber());
        hrEmployeeDTO.setIdDate(hrEmployee.getIdDate());
        hrEmployeeDTO.setIdAddress(hrEmployee.getIdAddress());
        hrEmployeeDTO.setBirthday(hrEmployee.getBirthday());
        hrEmployeeDTO.setPlaceOfBirth(hrEmployee.getPlaceOfBirth());
        hrEmployeeDTO.setPermanentAddress(hrEmployee.getPermanentAddress());
        hrEmployeeDTO.setCurrentAddress(hrEmployee.getCurrentAddress());
        hrEmployeeDTO.setPassport(hrEmployee.getPassport());
        hrEmployeeDTO.setMaritalStatus(hrEmployee.getMaritalStatus());
        hrEmployeeDTO.setEmergencyContact(hrEmployee.getEmergencyContact());
        hrEmployeeDTO.setEmergencyPhone(hrEmployee.getEmergencyPhone());
        hrEmployeeDTO.setSocialInsuranceCode(hrEmployee.getSocialInsuranceCode());
        hrEmployeeDTO.setTaxCode(hrEmployee.getTaxCode());
        hrEmployeeDTO.setReligion(hrEmployee.getReligion());
        hrEmployeeDTO.setIsUnion(hrEmployee.getIsUnion());
        hrEmployeeDTO.setCompany(hrEmployee.getCompany() == null ? null : hrEmployee.getCompany().getId());
        hrEmployeeDTO.setDepartment(hrEmployee.getDepartment() == null ? null : hrEmployee.getDepartment().getId());
        hrEmployeeDTO.setJobPosition(hrEmployee.getJobPosition() == null ? null : hrEmployee.getJobPosition().getId());
        hrEmployeeDTO.setJobTitle(hrEmployee.getJobTitle() == null ? null : hrEmployee.getJobTitle().getId());
        hrEmployeeDTO.setProvince(hrEmployee.getProvince() == null ? null : hrEmployee.getProvince().getId());
        hrEmployeeDTO.setDistrict(hrEmployee.getDistrict() == null ? null : hrEmployee.getDistrict().getId());
        hrEmployeeDTO.setWard(hrEmployee.getWard() == null ? null : hrEmployee.getWard().getId());
        hrEmployeeDTO.setUser(hrEmployee.getUser() == null ? null : hrEmployee.getUser().getId());
        hrEmployeeDTO.setManager(hrEmployee.getManager() == null ? null : hrEmployee.getManager().getId());
        return hrEmployeeDTO;
    }

    private HrEmployee mapToEntity(final HrEmployeeDTO hrEmployeeDTO, final HrEmployee hrEmployee) {
        hrEmployee.setName(hrEmployeeDTO.getName());
        hrEmployee.setCode(hrEmployeeDTO.getCode());
        hrEmployee.setEmail(hrEmployeeDTO.getEmail());
        hrEmployee.setWorkPhone(hrEmployeeDTO.getWorkPhone());
        hrEmployee.setGender(hrEmployeeDTO.getGender());
        hrEmployee.setStatus(hrEmployeeDTO.getStatus());
        hrEmployee.setDateJoin(hrEmployeeDTO.getDateJoin());
        hrEmployee.setDateLeft(hrEmployeeDTO.getDateLeft());
        hrEmployee.setCountry(hrEmployeeDTO.getCountry());
        hrEmployee.setIdNumber(hrEmployeeDTO.getIdNumber());
        hrEmployee.setIdDate(hrEmployeeDTO.getIdDate());
        hrEmployee.setIdAddress(hrEmployeeDTO.getIdAddress());
        hrEmployee.setBirthday(hrEmployeeDTO.getBirthday());
        hrEmployee.setPlaceOfBirth(hrEmployeeDTO.getPlaceOfBirth());
        hrEmployee.setPermanentAddress(hrEmployeeDTO.getPermanentAddress());
        hrEmployee.setCurrentAddress(hrEmployeeDTO.getCurrentAddress());
        hrEmployee.setPassport(hrEmployeeDTO.getPassport());
        hrEmployee.setMaritalStatus(hrEmployeeDTO.getMaritalStatus());
        hrEmployee.setEmergencyContact(hrEmployeeDTO.getEmergencyContact());
        hrEmployee.setEmergencyPhone(hrEmployeeDTO.getEmergencyPhone());
        hrEmployee.setSocialInsuranceCode(hrEmployeeDTO.getSocialInsuranceCode());
        hrEmployee.setTaxCode(hrEmployeeDTO.getTaxCode());
        hrEmployee.setReligion(hrEmployeeDTO.getReligion());
        hrEmployee.setIsUnion(hrEmployeeDTO.getIsUnion());
        final ResCompany company = hrEmployeeDTO.getCompany() == null ? null : resCompanyRepository.findById(hrEmployeeDTO.getCompany())
                .orElseThrow(() -> new NotFoundException("company not found"));
        hrEmployee.setCompany(company);
        final HrDepartment department = hrEmployeeDTO.getDepartment() == null ? null : hrDepartmentRepository.findById(hrEmployeeDTO.getDepartment())
                .orElseThrow(() -> new NotFoundException("department not found"));
        hrEmployee.setDepartment(department);
        final HrJobPosition jobPosition = hrEmployeeDTO.getJobPosition() == null ? null : hrJobPositionRepository.findById(hrEmployeeDTO.getJobPosition())
                .orElseThrow(() -> new NotFoundException("jobPosition not found"));
        hrEmployee.setJobPosition(jobPosition);
        final HrJobTitle jobTitle = hrEmployeeDTO.getJobTitle() == null ? null : hrJobTitleRepository.findById(hrEmployeeDTO.getJobTitle())
                .orElseThrow(() -> new NotFoundException("jobTitle not found"));
        hrEmployee.setJobTitle(jobTitle);
        final ResProvince province = hrEmployeeDTO.getProvince() == null ? null : resProvinceRepository.findById(hrEmployeeDTO.getProvince())
                .orElseThrow(() -> new NotFoundException("province not found"));
        hrEmployee.setProvince(province);
        final ResDistrict district = hrEmployeeDTO.getDistrict() == null ? null : resDistrictRepository.findById(hrEmployeeDTO.getDistrict())
                .orElseThrow(() -> new NotFoundException("district not found"));
        hrEmployee.setDistrict(district);
        final ResDistrictWard ward = hrEmployeeDTO.getWard() == null ? null : resDistrictWardRepository.findById(hrEmployeeDTO.getWard())
                .orElseThrow(() -> new NotFoundException("ward not found"));
        hrEmployee.setWard(ward);
        final ResUser user = hrEmployeeDTO.getUser() == null ? null : resUserRepository.findById(hrEmployeeDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        hrEmployee.setUser(user);
        final HrEmployee manager = hrEmployeeDTO.getManager() == null ? null : hrEmployeeRepository.findById(hrEmployeeDTO.getManager())
                .orElseThrow(() -> new NotFoundException("manager not found"));
        hrEmployee.setManager(manager);
        return hrEmployee;
    }

    public boolean userExists(final Long id) {
        return hrEmployeeRepository.existsByUserId(id);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final HrEmployee hrEmployee = hrEmployeeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final HrEmployee managerHrEmployee = hrEmployeeRepository.findFirstByManagerAndIdNot(hrEmployee, hrEmployee.getId());
        if (managerHrEmployee != null) {
            referencedWarning.setKey("hrEmployee.hrEmployee.manager.referenced");
            referencedWarning.addParam(managerHrEmployee.getId());
            return referencedWarning;
        }
        final HrContract employeeHrContract = hrContractRepository.findFirstByEmployee(hrEmployee);
        if (employeeHrContract != null) {
            referencedWarning.setKey("hrEmployee.hrContract.employee.referenced");
            referencedWarning.addParam(employeeHrContract.getId());
            return referencedWarning;
        }
        return null;
    }

}
