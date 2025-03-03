package io.nutchai.hrm.rest;

import io.nutchai.hrm.model.ResCompanyDTO;
import io.nutchai.hrm.service.ResCompanyService;
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
@RequestMapping(value = "/api/resCompanies", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResCompanyResource {

    private final ResCompanyService resCompanyService;

    public ResCompanyResource(final ResCompanyService resCompanyService) {
        this.resCompanyService = resCompanyService;
    }

    @GetMapping
    public ResponseEntity<List<ResCompanyDTO>> getAllResCompanies() {
        return ResponseEntity.ok(resCompanyService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResCompanyDTO> getResCompany(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(resCompanyService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createResCompany(
            @RequestBody @Valid final ResCompanyDTO resCompanyDTO) {
        final Long createdId = resCompanyService.create(resCompanyDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateResCompany(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final ResCompanyDTO resCompanyDTO) {
        resCompanyService.update(id, resCompanyDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteResCompany(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = resCompanyService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        resCompanyService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
