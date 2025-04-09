package com.oop7hkem10.hrm.service;

import com.oop7hkem10.hrm.domain.HrContract;
import com.oop7hkem10.hrm.domain.HrContractType;
import com.oop7hkem10.hrm.model.HrContractTypeDTO;
import com.oop7hkem10.hrm.repos.HrContractRepository;
import com.oop7hkem10.hrm.repos.HrContractTypeRepository;
import com.oop7hkem10.hrm.util.NotFoundException;
import com.oop7hkem10.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class HrContractTypeService {

    private final HrContractTypeRepository hrContractTypeRepository;
    private final HrContractRepository hrContractRepository;

    public HrContractTypeService(final HrContractTypeRepository hrContractTypeRepository,
            final HrContractRepository hrContractRepository) {
        this.hrContractTypeRepository = hrContractTypeRepository;
        this.hrContractRepository = hrContractRepository;
    }

    public List<HrContractTypeDTO> findAll() {
        final List<HrContractType> hrContractTypes = hrContractTypeRepository.findAll(Sort.by("id"));
        return hrContractTypes.stream()
                .map(hrContractType -> mapToDTO(hrContractType, new HrContractTypeDTO()))
                .toList();
    }

    public HrContractTypeDTO get(final Long id) {
        return hrContractTypeRepository.findById(id)
                .map(hrContractType -> mapToDTO(hrContractType, new HrContractTypeDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final HrContractTypeDTO hrContractTypeDTO) {
        final HrContractType hrContractType = new HrContractType();
        mapToEntity(hrContractTypeDTO, hrContractType);
        return hrContractTypeRepository.save(hrContractType).getId();
    }

    public void update(final Long id, final HrContractTypeDTO hrContractTypeDTO) {
        final HrContractType hrContractType = hrContractTypeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(hrContractTypeDTO, hrContractType);
        hrContractTypeRepository.save(hrContractType);
    }

    public void delete(final Long id) {
        hrContractTypeRepository.deleteById(id);
    }

    private HrContractTypeDTO mapToDTO(final HrContractType hrContractType,
            final HrContractTypeDTO hrContractTypeDTO) {
        hrContractTypeDTO.setId(hrContractType.getId());
        hrContractTypeDTO.setName(hrContractType.getName());
        hrContractTypeDTO.setCode(hrContractType.getCode());
        hrContractTypeDTO.setIsUnlimited(hrContractType.getIsUnlimited());
        hrContractTypeDTO.setIsProbationaryContract(hrContractType.getIsProbationaryContract());
        return hrContractTypeDTO;
    }

    private HrContractType mapToEntity(final HrContractTypeDTO hrContractTypeDTO,
            final HrContractType hrContractType) {
        hrContractType.setName(hrContractTypeDTO.getName());
        hrContractType.setCode(hrContractTypeDTO.getCode());
        hrContractType.setIsUnlimited(hrContractTypeDTO.getIsUnlimited());
        hrContractType.setIsProbationaryContract(hrContractTypeDTO.getIsProbationaryContract());
        return hrContractType;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final HrContractType hrContractType = hrContractTypeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final HrContract contractTypeHrContract = hrContractRepository.findFirstByContractType(hrContractType);
        if (contractTypeHrContract != null) {
            referencedWarning.setKey("hrContractType.hrContract.contractType.referenced");
            referencedWarning.addParam(contractTypeHrContract.getId());
            return referencedWarning;
        }
        return null;
    }

}
