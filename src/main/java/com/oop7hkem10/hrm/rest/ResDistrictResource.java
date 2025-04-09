package com.oop7hkem10.hrm.rest;

import com.oop7hkem10.hrm.model.ResDistrictDTO;
import com.oop7hkem10.hrm.service.ResDistrictService;
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
@RequestMapping(value = "/api/resDistricts", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResDistrictResource {

    private final ResDistrictService resDistrictService;

    public ResDistrictResource(final ResDistrictService resDistrictService) {
        this.resDistrictService = resDistrictService;
    }

    @GetMapping
    public ResponseEntity<List<ResDistrictDTO>> getAllResDistricts() {
        return ResponseEntity.ok(resDistrictService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResDistrictDTO> getResDistrict(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(resDistrictService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createResDistrict(
            @RequestBody @Valid final ResDistrictDTO resDistrictDTO) {
        final Long createdId = resDistrictService.create(resDistrictDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateResDistrict(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final ResDistrictDTO resDistrictDTO) {
        resDistrictService.update(id, resDistrictDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteResDistrict(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = resDistrictService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        resDistrictService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
