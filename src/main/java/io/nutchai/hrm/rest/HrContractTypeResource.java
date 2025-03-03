package io.nutchai.hrm.rest;

import io.nutchai.hrm.model.HrContractTypeDTO;
import io.nutchai.hrm.service.HrContractTypeService;
import io.nutchai.hrm.util.ReferencedException;
import io.nutchai.hrm.util.ReferencedWarning;
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
@RequestMapping(value = "/api/hrContractTypes", produces = MediaType.APPLICATION_JSON_VALUE)
public class HrContractTypeResource {

    private final HrContractTypeService hrContractTypeService;

    public HrContractTypeResource(final HrContractTypeService hrContractTypeService) {
        this.hrContractTypeService = hrContractTypeService;
    }

    @GetMapping
    public ResponseEntity<List<HrContractTypeDTO>> getAllHrContractTypes() {
        return ResponseEntity.ok(hrContractTypeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrContractTypeDTO> getHrContractType(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(hrContractTypeService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createHrContractType(
            @RequestBody @Valid final HrContractTypeDTO hrContractTypeDTO) {
        final Long createdId = hrContractTypeService.create(hrContractTypeDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateHrContractType(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final HrContractTypeDTO hrContractTypeDTO) {
        hrContractTypeService.update(id, hrContractTypeDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteHrContractType(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = hrContractTypeService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        hrContractTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
