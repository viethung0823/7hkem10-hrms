package io.nutchai.hrm.rest;

import io.nutchai.hrm.domain.HrDepartment;
import io.nutchai.hrm.domain.HrEmployee;
import io.nutchai.hrm.domain.HrJobPosition;
import io.nutchai.hrm.domain.HrJobTitle;
import io.nutchai.hrm.domain.ResCompany;
import io.nutchai.hrm.domain.ResDistrict;
import io.nutchai.hrm.domain.ResDistrictWard;
import io.nutchai.hrm.domain.ResProvince;
import io.nutchai.hrm.domain.ResUser;
import io.nutchai.hrm.model.HrEmployeeDTO;
import io.nutchai.hrm.repos.HrDepartmentRepository;
import io.nutchai.hrm.repos.HrEmployeeRepository;
import io.nutchai.hrm.repos.HrJobPositionRepository;
import io.nutchai.hrm.repos.HrJobTitleRepository;
import io.nutchai.hrm.repos.ResCompanyRepository;
import io.nutchai.hrm.repos.ResDistrictRepository;
import io.nutchai.hrm.repos.ResDistrictWardRepository;
import io.nutchai.hrm.repos.ResProvinceRepository;
import io.nutchai.hrm.repos.ResUserRepository;
import io.nutchai.hrm.service.HrEmployeeService;
import io.nutchai.hrm.util.CustomCollectors;
import io.nutchai.hrm.util.ReferencedException;
import io.nutchai.hrm.util.ReferencedWarning;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/hrEmployees", produces = MediaType.APPLICATION_JSON_VALUE)
public class HrEmployeeResource {

    private final HrEmployeeService hrEmployeeService;
    private final ResCompanyRepository resCompanyRepository;
    private final HrDepartmentRepository hrDepartmentRepository;
    private final HrJobPositionRepository hrJobPositionRepository;
    private final HrJobTitleRepository hrJobTitleRepository;
    private final ResProvinceRepository resProvinceRepository;
    private final ResDistrictRepository resDistrictRepository;
    private final ResDistrictWardRepository resDistrictWardRepository;
    private final ResUserRepository resUserRepository;
    private final HrEmployeeRepository hrEmployeeRepository;

    public HrEmployeeResource(final HrEmployeeService hrEmployeeService,
            final ResCompanyRepository resCompanyRepository,
            final HrDepartmentRepository hrDepartmentRepository,
            final HrJobPositionRepository hrJobPositionRepository,
            final HrJobTitleRepository hrJobTitleRepository,
            final ResProvinceRepository resProvinceRepository,
            final ResDistrictRepository resDistrictRepository,
            final ResDistrictWardRepository resDistrictWardRepository,
            final ResUserRepository resUserRepository,
            final HrEmployeeRepository hrEmployeeRepository) {
        this.hrEmployeeService = hrEmployeeService;
        this.resCompanyRepository = resCompanyRepository;
        this.hrDepartmentRepository = hrDepartmentRepository;
        this.hrJobPositionRepository = hrJobPositionRepository;
        this.hrJobTitleRepository = hrJobTitleRepository;
        this.resProvinceRepository = resProvinceRepository;
        this.resDistrictRepository = resDistrictRepository;
        this.resDistrictWardRepository = resDistrictWardRepository;
        this.resUserRepository = resUserRepository;
        this.hrEmployeeRepository = hrEmployeeRepository;
    }

    @GetMapping
    public ResponseEntity<List<HrEmployeeDTO>> getAllHrEmployees() {
        return ResponseEntity.ok(hrEmployeeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrEmployeeDTO> getHrEmployee(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(hrEmployeeService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createHrEmployee(
            @RequestBody @Valid final HrEmployeeDTO hrEmployeeDTO) {
        final Long createdId = hrEmployeeService.create(hrEmployeeDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateHrEmployee(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final HrEmployeeDTO hrEmployeeDTO) {
        hrEmployeeService.update(id, hrEmployeeDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteHrEmployee(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = hrEmployeeService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        hrEmployeeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/companyValues")
    public ResponseEntity<Map<Long, Long>> getCompanyValues() {
        return ResponseEntity.ok(resCompanyRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResCompany::getId, ResCompany::getId)));
    }

    @GetMapping("/departmentValues")
    public ResponseEntity<Map<Long, String>> getDepartmentValues() {
        return ResponseEntity.ok(hrDepartmentRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(HrDepartment::getId, HrDepartment::getCode)));
    }

    @GetMapping("/jobPositionValues")
    public ResponseEntity<Map<Long, Long>> getJobPositionValues() {
        return ResponseEntity.ok(hrJobPositionRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(HrJobPosition::getId, HrJobPosition::getId)));
    }

    @GetMapping("/jobTitleValues")
    public ResponseEntity<Map<Long, String>> getJobTitleValues() {
        return ResponseEntity.ok(hrJobTitleRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(HrJobTitle::getId, HrJobTitle::getName)));
    }

    @GetMapping("/provinceValues")
    public ResponseEntity<Map<Long, String>> getProvinceValues() {
        return ResponseEntity.ok(resProvinceRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResProvince::getId, ResProvince::getName)));
    }

    @GetMapping("/districtValues")
    public ResponseEntity<Map<UUID, String>> getDistrictValues() {
        return ResponseEntity.ok(resDistrictRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResDistrict::getId, ResDistrict::getName)));
    }

    @GetMapping("/wardValues")
    public ResponseEntity<Map<Long, String>> getWardValues() {
        return ResponseEntity.ok(resDistrictWardRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResDistrictWard::getId, ResDistrictWard::getName)));
    }

    @GetMapping("/userValues")
    public ResponseEntity<Map<Long, String>> getUserValues() {
        return ResponseEntity.ok(resUserRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResUser::getId, ResUser::getUsername)));
    }

    @GetMapping("/managerValues")
    public ResponseEntity<Map<Long, String>> getManagerValues() {
        return ResponseEntity.ok(hrEmployeeRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(HrEmployee::getId, HrEmployee::getName)));
    }

}
