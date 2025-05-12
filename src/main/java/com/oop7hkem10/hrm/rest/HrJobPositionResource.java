package com.oop7hkem10.hrm.rest;

import com.oop7hkem10.hrm.model.HrJobPositionDTO;
import com.oop7hkem10.hrm.service.HrJobPositionService;
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
@RequestMapping(value = "/api/hrJobPositions", produces = MediaType.APPLICATION_JSON_VALUE)
public class HrJobPositionResource {

    private final HrJobPositionService hrJobPositionService;

    public HrJobPositionResource(final HrJobPositionService hrJobPositionService) {
        this.hrJobPositionService = hrJobPositionService;
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

}
