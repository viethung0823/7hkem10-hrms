package com.oop7hkem10.hrm.rest;

import com.oop7hkem10.hrm.model.HrContractDTO;
import com.oop7hkem10.hrm.service.HrContractService;
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
@RequestMapping(value = "/api/hrContracts", produces = MediaType.APPLICATION_JSON_VALUE)
public class HrContractResource {

    private final HrContractService hrContractService;

    public HrContractResource(final HrContractService hrContractService) {
        this.hrContractService = hrContractService;
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

}
