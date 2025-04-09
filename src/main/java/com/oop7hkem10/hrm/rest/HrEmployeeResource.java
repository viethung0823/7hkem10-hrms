package com.oop7hkem10.hrm.rest;

import com.oop7hkem10.hrm.model.HrEmployeeDTO;
import com.oop7hkem10.hrm.service.HrEmployeeService;
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
@RequestMapping(value = "/api/hrEmployees", produces = MediaType.APPLICATION_JSON_VALUE)
public class HrEmployeeResource {

    private final HrEmployeeService hrEmployeeService;

    public HrEmployeeResource(final HrEmployeeService hrEmployeeService) {
        this.hrEmployeeService = hrEmployeeService;
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

}
