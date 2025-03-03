package io.saugio50.hrm.rest;

import io.saugio50.hrm.model.ResProvinceDTO;
import io.saugio50.hrm.service.ResProvinceService;
import io.saugio50.hrm.util.ReferencedException;
import io.saugio50.hrm.util.ReferencedWarning;
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
@RequestMapping(value = "/api/resProvinces", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResProvinceResource {

    private final ResProvinceService resProvinceService;

    public ResProvinceResource(final ResProvinceService resProvinceService) {
        this.resProvinceService = resProvinceService;
    }

    @GetMapping
    public ResponseEntity<List<ResProvinceDTO>> getAllResProvinces() {
        return ResponseEntity.ok(resProvinceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResProvinceDTO> getResProvince(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(resProvinceService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createResProvince(
            @RequestBody @Valid final ResProvinceDTO resProvinceDTO) {
        final Long createdId = resProvinceService.create(resProvinceDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateResProvince(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final ResProvinceDTO resProvinceDTO) {
        resProvinceService.update(id, resProvinceDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteResProvince(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = resProvinceService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        resProvinceService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
