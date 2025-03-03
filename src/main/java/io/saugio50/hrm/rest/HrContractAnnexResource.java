package io.saugio50.hrm.rest;

import io.saugio50.hrm.domain.HrContract;
import io.saugio50.hrm.model.HrContractAnnexDTO;
import io.saugio50.hrm.repos.HrContractRepository;
import io.saugio50.hrm.service.HrContractAnnexService;
import io.saugio50.hrm.util.CustomCollectors;
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
@RequestMapping(value = "/api/hrContractAnnexes", produces = MediaType.APPLICATION_JSON_VALUE)
public class HrContractAnnexResource {

    private final HrContractAnnexService hrContractAnnexService;
    private final HrContractRepository hrContractRepository;

    public HrContractAnnexResource(final HrContractAnnexService hrContractAnnexService,
            final HrContractRepository hrContractRepository) {
        this.hrContractAnnexService = hrContractAnnexService;
        this.hrContractRepository = hrContractRepository;
    }

    @GetMapping
    public ResponseEntity<List<HrContractAnnexDTO>> getAllHrContractAnnexes() {
        return ResponseEntity.ok(hrContractAnnexService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrContractAnnexDTO> getHrContractAnnex(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(hrContractAnnexService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createHrContractAnnex(
            @RequestBody @Valid final HrContractAnnexDTO hrContractAnnexDTO) {
        final Long createdId = hrContractAnnexService.create(hrContractAnnexDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateHrContractAnnex(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final HrContractAnnexDTO hrContractAnnexDTO) {
        hrContractAnnexService.update(id, hrContractAnnexDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteHrContractAnnex(@PathVariable(name = "id") final Long id) {
        hrContractAnnexService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/contractValues")
    public ResponseEntity<Map<Long, Long>> getContractValues() {
        return ResponseEntity.ok(hrContractRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(HrContract::getId, HrContract::getId)));
    }

}
