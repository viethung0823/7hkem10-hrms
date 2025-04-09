package com.oop7hkem10.hrm.rest;

import com.oop7hkem10.hrm.model.HrDepartmentDTO;
import com.oop7hkem10.hrm.service.HrDepartmentService;
import com.oop7hkem10.hrm.util.ReferencedException;
import com.oop7hkem10.hrm.util.ReferencedWarning;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
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

    public HrDepartmentResource(final HrDepartmentService hrDepartmentService) {
        this.hrDepartmentService = hrDepartmentService;
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

}
