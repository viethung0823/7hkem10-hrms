package io.saugio50.hrm.rest;

import io.saugio50.hrm.domain.ResDistrict;
import io.saugio50.hrm.domain.ResDistrictWard;
import io.saugio50.hrm.domain.ResProvince;
import io.saugio50.hrm.model.ResLocationDTO;
import io.saugio50.hrm.repos.ResDistrictRepository;
import io.saugio50.hrm.repos.ResDistrictWardRepository;
import io.saugio50.hrm.repos.ResProvinceRepository;
import io.saugio50.hrm.service.ResLocationService;
import io.saugio50.hrm.util.CustomCollectors;
import io.saugio50.hrm.util.ReferencedException;
import io.saugio50.hrm.util.ReferencedWarning;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
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
@RequestMapping(value = "/api/resLocations", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResLocationResource {

    private final ResLocationService resLocationService;
    private final ResDistrictWardRepository resDistrictWardRepository;
    private final ResProvinceRepository resProvinceRepository;
    private final ResDistrictRepository resDistrictRepository;

    public ResLocationResource(final ResLocationService resLocationService,
            final ResDistrictWardRepository resDistrictWardRepository,
            final ResProvinceRepository resProvinceRepository,
            final ResDistrictRepository resDistrictRepository) {
        this.resLocationService = resLocationService;
        this.resDistrictWardRepository = resDistrictWardRepository;
        this.resProvinceRepository = resProvinceRepository;
        this.resDistrictRepository = resDistrictRepository;
    }

    @GetMapping
    public ResponseEntity<List<ResLocationDTO>> getAllResLocations() {
        return ResponseEntity.ok(resLocationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResLocationDTO> getResLocation(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(resLocationService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createResLocation(
            @RequestBody @Valid final ResLocationDTO resLocationDTO) {
        final Long createdId = resLocationService.create(resLocationDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateResLocation(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final ResLocationDTO resLocationDTO) {
        resLocationService.update(id, resLocationDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteResLocation(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = resLocationService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        resLocationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/districWardValues")
    public ResponseEntity<Map<Long, String>> getDistricWardValues() {
        return ResponseEntity.ok(resDistrictWardRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResDistrictWard::getId, ResDistrictWard::getName)));
    }

    @GetMapping("/provinceValues")
    public ResponseEntity<Map<Long, String>> getProvinceValues() {
        return ResponseEntity.ok(resProvinceRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResProvince::getId, ResProvince::getName)));
    }

    @GetMapping("/districtValues")
    public ResponseEntity<Map<UUID, String>> getDistrictValues() {
        return ResponseEntity.ok(resDistrictRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResDistrict::getId, ResDistrict::getName)));
    }

}
