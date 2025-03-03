package io.nutchai.hrm.rest;

import io.nutchai.hrm.domain.HrDepartment;
import io.nutchai.hrm.domain.ResCompany;
import io.nutchai.hrm.domain.ResLocation;
import io.nutchai.hrm.model.HrJobPositionDTO;
import io.nutchai.hrm.repos.HrDepartmentRepository;
import io.nutchai.hrm.repos.ResCompanyRepository;
import io.nutchai.hrm.repos.ResLocationRepository;
import io.nutchai.hrm.service.HrJobPositionService;
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
@RequestMapping(value = "/api/hrJobPositions", produces = MediaType.APPLICATION_JSON_VALUE)
public class HrJobPositionResource {

    private final HrJobPositionService hrJobPositionService;
    private final ResCompanyRepository resCompanyRepository;
    private final HrDepartmentRepository hrDepartmentRepository;
    private final ResLocationRepository resLocationRepository;

    public HrJobPositionResource(final HrJobPositionService hrJobPositionService,
            final ResCompanyRepository resCompanyRepository,
            final HrDepartmentRepository hrDepartmentRepository,
            final ResLocationRepository resLocationRepository) {
        this.hrJobPositionService = hrJobPositionService;
        this.resCompanyRepository = resCompanyRepository;
        this.hrDepartmentRepository = hrDepartmentRepository;
        this.resLocationRepository = resLocationRepository;
    }

    @GetMapping
    public ResponseEntity<List<HrJobPositionDTO>> getAllHrJobPositions() {
        return ResponseEntity.ok(hrJobPositionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrJobPositionDTO> getHrJobPosition(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(hrJobPositionService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createHrJobPosition(
            @RequestBody @Valid final HrJobPositionDTO hrJobPositionDTO) {
        final Long createdId = hrJobPositionService.create(hrJobPositionDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateHrJobPosition(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final HrJobPositionDTO hrJobPositionDTO) {
        hrJobPositionService.update(id, hrJobPositionDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteHrJobPosition(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = hrJobPositionService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        hrJobPositionService.delete(id);
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

    @GetMapping("/locationValues")
    public ResponseEntity<Map<Long, Long>> getLocationValues() {
        return ResponseEntity.ok(resLocationRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResLocation::getId, ResLocation::getId)));
    }

}
