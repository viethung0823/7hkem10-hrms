package io.nutchai.hrm.rest;

import io.nutchai.hrm.model.HrJobTitleDTO;
import io.nutchai.hrm.service.HrJobTitleService;
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
@RequestMapping(value = "/api/hrJobTitles", produces = MediaType.APPLICATION_JSON_VALUE)
public class HrJobTitleResource {

    private final HrJobTitleService hrJobTitleService;

    public HrJobTitleResource(final HrJobTitleService hrJobTitleService) {
        this.hrJobTitleService = hrJobTitleService;
    }

    @GetMapping
    public ResponseEntity<List<HrJobTitleDTO>> getAllHrJobTitles() {
        return ResponseEntity.ok(hrJobTitleService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrJobTitleDTO> getHrJobTitle(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(hrJobTitleService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createHrJobTitle(
            @RequestBody @Valid final HrJobTitleDTO hrJobTitleDTO) {
        final Long createdId = hrJobTitleService.create(hrJobTitleDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateHrJobTitle(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final HrJobTitleDTO hrJobTitleDTO) {
        hrJobTitleService.update(id, hrJobTitleDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteHrJobTitle(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = hrJobTitleService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        hrJobTitleService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
