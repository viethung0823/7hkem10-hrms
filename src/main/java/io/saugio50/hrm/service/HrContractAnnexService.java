package io.saugio50.hrm.service;

import io.saugio50.hrm.domain.HrContract;
import io.saugio50.hrm.domain.HrContractAnnex;
import io.saugio50.hrm.model.HrContractAnnexDTO;
import io.saugio50.hrm.repos.HrContractAnnexRepository;
import io.saugio50.hrm.repos.HrContractRepository;
import io.saugio50.hrm.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class HrContractAnnexService {

    private final HrContractAnnexRepository hrContractAnnexRepository;
    private final HrContractRepository hrContractRepository;

    public HrContractAnnexService(final HrContractAnnexRepository hrContractAnnexRepository,
            final HrContractRepository hrContractRepository) {
        this.hrContractAnnexRepository = hrContractAnnexRepository;
        this.hrContractRepository = hrContractRepository;
    }

    public List<HrContractAnnexDTO> findAll() {
        final List<HrContractAnnex> hrContractAnnexes = hrContractAnnexRepository.findAll(Sort.by("id"));
        return hrContractAnnexes.stream()
                .map(hrContractAnnex -> mapToDTO(hrContractAnnex, new HrContractAnnexDTO()))
                .toList();
    }

    public HrContractAnnexDTO get(final Long id) {
        return hrContractAnnexRepository.findById(id)
                .map(hrContractAnnex -> mapToDTO(hrContractAnnex, new HrContractAnnexDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final HrContractAnnexDTO hrContractAnnexDTO) {
        final HrContractAnnex hrContractAnnex = new HrContractAnnex();
        mapToEntity(hrContractAnnexDTO, hrContractAnnex);
        return hrContractAnnexRepository.save(hrContractAnnex).getId();
    }

    public void update(final Long id, final HrContractAnnexDTO hrContractAnnexDTO) {
        final HrContractAnnex hrContractAnnex = hrContractAnnexRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(hrContractAnnexDTO, hrContractAnnex);
        hrContractAnnexRepository.save(hrContractAnnex);
    }

    public void delete(final Long id) {
        hrContractAnnexRepository.deleteById(id);
    }

    private HrContractAnnexDTO mapToDTO(final HrContractAnnex hrContractAnnex,
            final HrContractAnnexDTO hrContractAnnexDTO) {
        hrContractAnnexDTO.setId(hrContractAnnex.getId());
        hrContractAnnexDTO.setName(hrContractAnnex.getName());
        hrContractAnnexDTO.setNumber(hrContractAnnex.getNumber());
        hrContractAnnexDTO.setContent(hrContractAnnex.getContent());
        hrContractAnnexDTO.setDateEfective(hrContractAnnex.getDateEfective());
        hrContractAnnexDTO.setContract(hrContractAnnex.getContract() == null ? null : hrContractAnnex.getContract().getId());
        return hrContractAnnexDTO;
    }

    private HrContractAnnex mapToEntity(final HrContractAnnexDTO hrContractAnnexDTO,
            final HrContractAnnex hrContractAnnex) {
        hrContractAnnex.setName(hrContractAnnexDTO.getName());
        hrContractAnnex.setNumber(hrContractAnnexDTO.getNumber());
        hrContractAnnex.setContent(hrContractAnnexDTO.getContent());
        hrContractAnnex.setDateEfective(hrContractAnnexDTO.getDateEfective());
        final HrContract contract = hrContractAnnexDTO.getContract() == null ? null : hrContractRepository.findById(hrContractAnnexDTO.getContract())
                .orElseThrow(() -> new NotFoundException("contract not found"));
        hrContractAnnex.setContract(contract);
        return hrContractAnnex;
    }

}
