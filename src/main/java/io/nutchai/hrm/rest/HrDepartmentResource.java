package io.nutchai.hrm.rest;

import io.nutchai.hrm.domain.HrDepartment;
import io.nutchai.hrm.domain.ResCompany;
import io.nutchai.hrm.model.HrDepartmentDTO;
import io.nutchai.hrm.repos.HrDepartmentRepository;
import io.nutchai.hrm.repos.ResCompanyRepository;
import io.nutchai.hrm.service.HrDepartmentService;
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
@RequestMapping(value = "/api/hrDepartments", produces = MediaType.APPLICATION_JSON_VALUE)
public class HrDepartmentResource {

    private final HrDepartmentService hrDepartmentService;
    private final HrDepartmentRepository hrDepartmentRepository;
    private final ResCompanyRepository resCompanyRepository;

    public HrDepartmentResource(final HrDepartmentService hrDepartmentService,
            final HrDepartmentRepository hrDepartmentRepository,
            final ResCompanyRepository resCompanyRepository) {
        this.hrDepartmentService = hrDepartmentService;
        this.hrDepartmentRepository = hrDepartmentRepository;
        this.resCompanyRepository = resCompanyRepository;
    }

    @GetMapping
    public ResponseEntity<List<HrDepartmentDTO>> getAllHrDepartments() {
        return ResponseEntity.ok(hrDepartmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrDepartmentDTO> getHrDepartment(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(hrDepartmentService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createHrDepartment(
            @RequestBody @Valid final HrDepartmentDTO hrDepartmentDTO) {
        final Long createdId = hrDepartmentService.create(hrDepartmentDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateHrDepartment(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final HrDepartmentDTO hrDepartmentDTO) {
        hrDepartmentService.update(id, hrDepartmentDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteHrDepartment(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = hrDepartmentService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        hrDepartmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/parentValues")
    public ResponseEntity<Map<Long, String>> getParentValues() {
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
