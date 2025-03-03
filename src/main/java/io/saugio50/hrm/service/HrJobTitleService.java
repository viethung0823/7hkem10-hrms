package io.saugio50.hrm.service;

import io.saugio50.hrm.domain.HrContract;
import io.saugio50.hrm.domain.HrEmployee;
import io.saugio50.hrm.domain.HrJobTitle;
import io.saugio50.hrm.model.HrJobTitleDTO;
import io.saugio50.hrm.repos.HrContractRepository;
import io.saugio50.hrm.repos.HrEmployeeRepository;
import io.saugio50.hrm.repos.HrJobTitleRepository;
import io.saugio50.hrm.util.NotFoundException;
import io.saugio50.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class HrJobTitleService {

    private final HrJobTitleRepository hrJobTitleRepository;
    private final HrEmployeeRepository hrEmployeeRepository;
    private final HrContractRepository hrContractRepository;

    public HrJobTitleService(final HrJobTitleRepository hrJobTitleRepository,
            final HrEmployeeRepository hrEmployeeRepository,
            final HrContractRepository hrContractRepository) {
        this.hrJobTitleRepository = hrJobTitleRepository;
        this.hrEmployeeRepository = hrEmployeeRepository;
        this.hrContractRepository = hrContractRepository;
    }

    public List<HrJobTitleDTO> findAll() {
        final List<HrJobTitle> hrJobTitles = hrJobTitleRepository.findAll(Sort.by("id"));
        return hrJobTitles.stream()
                .map(hrJobTitle -> mapToDTO(hrJobTitle, new HrJobTitleDTO()))
                .toList();
    }

    public HrJobTitleDTO get(final Long id) {
        return hrJobTitleRepository.findById(id)
                .map(hrJobTitle -> mapToDTO(hrJobTitle, new HrJobTitleDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final HrJobTitleDTO hrJobTitleDTO) {
        final HrJobTitle hrJobTitle = new HrJobTitle();
        mapToEntity(hrJobTitleDTO, hrJobTitle);
        return hrJobTitleRepository.save(hrJobTitle).getId();
    }

    public void update(final Long id, final HrJobTitleDTO hrJobTitleDTO) {
        final HrJobTitle hrJobTitle = hrJobTitleRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(hrJobTitleDTO, hrJobTitle);
        hrJobTitleRepository.save(hrJobTitle);
    }

    public void delete(final Long id) {
        hrJobTitleRepository.deleteById(id);
    }

    private HrJobTitleDTO mapToDTO(final HrJobTitle hrJobTitle, final HrJobTitleDTO hrJobTitleDTO) {
        hrJobTitleDTO.setId(hrJobTitle.getId());
        hrJobTitleDTO.setName(hrJobTitle.getName());
        hrJobTitleDTO.setCode(hrJobTitle.getCode());
        hrJobTitleDTO.setDescription(hrJobTitle.getDescription());
        return hrJobTitleDTO;
    }

    private HrJobTitle mapToEntity(final HrJobTitleDTO hrJobTitleDTO, final HrJobTitle hrJobTitle) {
        hrJobTitle.setName(hrJobTitleDTO.getName());
        hrJobTitle.setCode(hrJobTitleDTO.getCode());
        hrJobTitle.setDescription(hrJobTitleDTO.getDescription());
        return hrJobTitle;
    }

    public boolean codeExists(final String code) {
        return hrJobTitleRepository.existsByCodeIgnoreCase(code);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final HrJobTitle hrJobTitle = hrJobTitleRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final HrEmployee jobTitleHrEmployee = hrEmployeeRepository.findFirstByJobTitle(hrJobTitle);
        if (jobTitleHrEmployee != null) {
            referencedWarning.setKey("hrJobTitle.hrEmployee.jobTitle.referenced");
            referencedWarning.addParam(jobTitleHrEmployee.getId());
            return referencedWarning;
        }
        final HrContract jobTitleHrContract = hrContractRepository.findFirstByJobTitle(hrJobTitle);
        if (jobTitleHrContract != null) {
            referencedWarning.setKey("hrJobTitle.hrContract.jobTitle.referenced");
            referencedWarning.addParam(jobTitleHrContract.getId());
            return referencedWarning;
        }
        return null;
    }

}
