package io.nutchai.hrm.rest;

import io.nutchai.hrm.domain.HrContractType;
import io.nutchai.hrm.domain.HrDepartment;
import io.nutchai.hrm.domain.HrEmployee;
import io.nutchai.hrm.domain.HrJobPosition;
import io.nutchai.hrm.domain.HrJobTitle;
import io.nutchai.hrm.domain.ResCompany;
import io.nutchai.hrm.model.HrContractDTO;
import io.nutchai.hrm.repos.HrContractTypeRepository;
import io.nutchai.hrm.repos.HrDepartmentRepository;
import io.nutchai.hrm.repos.HrEmployeeRepository;
import io.nutchai.hrm.repos.HrJobPositionRepository;
import io.nutchai.hrm.repos.HrJobTitleRepository;
import io.nutchai.hrm.repos.ResCompanyRepository;
import io.nutchai.hrm.service.HrContractService;
import io.nutchai.hrm.util.CustomCollectors;
import io.nutchai.hrm.util.ReferencedException;
import io.nutchai.hrm.util.ReferencedWarning;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
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
@RequestMapping(value = "/api/hrContracts", produces = MediaType.APPLICATION_JSON_VALUE)
public class HrContractResource {

    private final HrContractService hrContractService;
    private final HrEmployeeRepository hrEmployeeRepository;
    private final HrContractTypeRepository hrContractTypeRepository;
    private final HrJobPositionRepository hrJobPositionRepository;
    private final HrJobTitleRepository hrJobTitleRepository;
    private final HrDepartmentRepository hrDepartmentRepository;
    private final ResCompanyRepository resCompanyRepository;

    public HrContractResource(final HrContractService hrContractService,
            final HrEmployeeRepository hrEmployeeRepository,
            final HrContractTypeRepository hrContractTypeRepository,
            final HrJobPositionRepository hrJobPositionRepository,
            final HrJobTitleRepository hrJobTitleRepository,
            final HrDepartmentRepository hrDepartmentRepository,
            final ResCompanyRepository resCompanyRepository) {
        this.hrContractService = hrContractService;
        this.hrEmployeeRepository = hrEmployeeRepository;
        this.hrContractTypeRepository = hrContractTypeRepository;
        this.hrJobPositionRepository = hrJobPositionRepository;
        this.hrJobTitleRepository = hrJobTitleRepository;
        this.hrDepartmentRepository = hrDepartmentRepository;
        this.resCompanyRepository = resCompanyRepository;
    }

    @GetMapping
    public ResponseEntity<List<HrContractDTO>> getAllHrContracts() {
        return ResponseEntity.ok(hrContractService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrContractDTO> getHrContract(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(hrContractService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createHrContract(
            @RequestBody @Valid final HrContractDTO hrContractDTO) {
        final Long createdId = hrContractService.create(hrContractDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateHrContract(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final HrContractDTO hrContractDTO) {
        hrContractService.update(id, hrContractDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteHrContract(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = hrContractService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        hrContractService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/employeeValues")
    public ResponseEntity<Map<Long, String>> getEmployeeValues() {
        return ResponseEntity.ok(hrEmployeeRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(HrEmployee::getId, HrEmployee::getName)));
    }

    @GetMapping("/contractTypeValues")
    public ResponseEntity<Map<Long, Long>> getContractTypeValues() {
        return ResponseEntity.ok(hrContractTypeRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(HrContractType::getId, HrContractType::getId)));
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

    @GetMapping("/departmentValues")
    public ResponseEntity<Map<Long, String>> getDepartmentValues() {
        return ResponseEntity.ok(hrDepartmentRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(HrDepartment::getId, HrDepartment::getCode)));
    }

    @GetMapping("/companyValues")
    public ResponseEntity<Map<Long, Long>> getCompanyValues() {
        return ResponseEntity.ok(resCompanyRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResCompany::getId, ResCompany::getId)));
    }

}
