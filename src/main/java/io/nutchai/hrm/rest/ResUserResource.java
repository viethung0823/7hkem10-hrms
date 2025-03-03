package io.nutchai.hrm.rest;

import io.nutchai.hrm.domain.ResUserRole;
import io.nutchai.hrm.model.ResUserDTO;
import io.nutchai.hrm.repos.ResUserRoleRepository;
import io.nutchai.hrm.service.ResUserService;
import io.nutchai.hrm.util.CustomCollectors;
import io.nutchai.hrm.util.ReferencedException;
import io.nutchai.hrm.util.ReferencedWarning;
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
@RequestMapping(value = "/api/resUsers", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResUserResource {

    private final ResUserService resUserService;
    private final ResUserRoleRepository resUserRoleRepository;

    public ResUserResource(final ResUserService resUserService,
            final ResUserRoleRepository resUserRoleRepository) {
        this.resUserService = resUserService;
        this.resUserRoleRepository = resUserRoleRepository;
    }

    @GetMapping
    public ResponseEntity<List<ResUserDTO>> getAllResUsers() {
        return ResponseEntity.ok(resUserService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResUserDTO> getResUser(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(resUserService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createResUser(@RequestBody @Valid final ResUserDTO resUserDTO) {
        final Long createdId = resUserService.create(resUserDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateResUser(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final ResUserDTO resUserDTO) {
        resUserService.update(id, resUserDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteResUser(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = resUserService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        resUserService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/roleValues")
    public ResponseEntity<Map<Long, Long>> getRoleValues() {
        return ResponseEntity.ok(resUserRoleRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(ResUserRole::getId, ResUserRole::getId)));
    }

}
