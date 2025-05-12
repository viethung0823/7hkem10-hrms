package com.oop7hkem10.hrm.rest;

import com.oop7hkem10.hrm.model.ResUserRoleDTO;
import com.oop7hkem10.hrm.service.ResUserRoleService;
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
@RequestMapping(value = "/api/resUserRoles", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResUserRoleResource {

    private final ResUserRoleService resUserRoleService;

    public ResUserRoleResource(final ResUserRoleService resUserRoleService) {
        this.resUserRoleService = resUserRoleService;
    }

    @GetMapping
    public ResponseEntity<List<ResUserRoleDTO>> getAllResUserRoles() {
        return ResponseEntity.ok(resUserRoleService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResUserRoleDTO> getResUserRole(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(resUserRoleService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createResUserRole(
            @RequestBody @Valid final ResUserRoleDTO resUserRoleDTO) {
        final Long createdId = resUserRoleService.create(resUserRoleDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateResUserRole(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final ResUserRoleDTO resUserRoleDTO) {
        resUserRoleService.update(id, resUserRoleDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteResUserRole(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = resUserRoleService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        resUserRoleService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
