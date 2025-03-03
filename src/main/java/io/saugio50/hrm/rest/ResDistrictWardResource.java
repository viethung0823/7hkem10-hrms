package io.saugio50.hrm.rest;

import io.saugio50.hrm.domain.ResDistrict;
import io.saugio50.hrm.model.ResDistrictWardDTO;
import io.saugio50.hrm.repos.ResDistrictRepository;
import io.saugio50.hrm.service.ResDistrictWardService;
import io.saugio50.hrm.util.CustomCollectors;
import io.saugio50.hrm.util.ReferencedException;
import io.saugio50.hrm.util.ReferencedWarning;
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
@RequestMapping(value = "/api/resDistrictWards", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResDistrictWardResource {

    private final ResDistrictWardService resDistrictWardService;
    private final ResDistrictRepository resDistrictRepository;

    public ResDistrictWardResource(final ResDistrictWardService resDistrictWardService,
            final ResDistrictRepository resDistrictRepository) {
        this.resDistrictWardService = resDistrictWardService;
        this.resDistrictRepository = resDistrictRepository;
    }

    @GetMapping
    public ResponseEntity<List<ResDistrictWardDTO>> getAllResDistrictWards() {
        return ResponseEntity.ok(resDistrictWardService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResDistrictWardDTO> getResDistrictWard(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(resDistrictWardService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createResDistrictWard(
            @RequestBody @Valid final ResDistrictWardDTO resDistrictWardDTO) {
        final Long createdId = resDistrictWardService.create(resDistrictWardDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateResDistrictWard(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final ResDistrictWardDTO resDistrictWardDTO) {
        resDistrictWardService.update(id, resDistrictWardDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteResDistrictWard(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = resDistrictWardService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        resDistrictWardService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/districtValues")
    public ResponseEntity<Map<Long, String>> getDistrictValues() {
        return ResponseEntity.ok(resDistrictRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResDistrict::getId, ResDistrict::getName)));
    }

}
