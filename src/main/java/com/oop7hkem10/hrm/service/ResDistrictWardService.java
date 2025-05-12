package com.oop7hkem10.hrm.service;

import com.oop7hkem10.hrm.domain.HrEmployee;
import com.oop7hkem10.hrm.domain.ResDistrict;
import com.oop7hkem10.hrm.domain.ResDistrictWard;
import com.oop7hkem10.hrm.domain.ResLocation;
import com.oop7hkem10.hrm.model.ResDistrictWardDTO;
import com.oop7hkem10.hrm.repos.HrEmployeeRepository;
import com.oop7hkem10.hrm.repos.ResDistrictRepository;
import com.oop7hkem10.hrm.repos.ResDistrictWardRepository;
import com.oop7hkem10.hrm.repos.ResLocationRepository;
import com.oop7hkem10.hrm.util.NotFoundException;
import com.oop7hkem10.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ResDistrictWardService {

    private final ResDistrictWardRepository resDistrictWardRepository;
    private final ResDistrictRepository resDistrictRepository;
    private final ResLocationRepository resLocationRepository;
    private final HrEmployeeRepository hrEmployeeRepository;

    public ResDistrictWardService(final ResDistrictWardRepository resDistrictWardRepository,
            final ResDistrictRepository resDistrictRepository,
            final ResLocationRepository resLocationRepository,
            final HrEmployeeRepository hrEmployeeRepository) {
        this.resDistrictWardRepository = resDistrictWardRepository;
        this.resDistrictRepository = resDistrictRepository;
        this.resLocationRepository = resLocationRepository;
        this.hrEmployeeRepository = hrEmployeeRepository;
    }

    public List<ResDistrictWardDTO> findAll() {
        final List<ResDistrictWard> resDistrictWards = resDistrictWardRepository.findAll(Sort.by("id"));
        return resDistrictWards.stream()
                .map(resDistrictWard -> mapToDTO(resDistrictWard, new ResDistrictWardDTO()))
                .toList();
    }

    public ResDistrictWardDTO get(final Long id) {
        return resDistrictWardRepository.findById(id)
                .map(resDistrictWard -> mapToDTO(resDistrictWard, new ResDistrictWardDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ResDistrictWardDTO resDistrictWardDTO) {
        final ResDistrictWard resDistrictWard = new ResDistrictWard();
        mapToEntity(resDistrictWardDTO, resDistrictWard);
        return resDistrictWardRepository.save(resDistrictWard).getId();
    }

    public void update(final Long id, final ResDistrictWardDTO resDistrictWardDTO) {
        final ResDistrictWard resDistrictWard = resDistrictWardRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(resDistrictWardDTO, resDistrictWard);
        resDistrictWardRepository.save(resDistrictWard);
    }

    public void delete(final Long id) {
        resDistrictWardRepository.deleteById(id);
    }

    private ResDistrictWardDTO mapToDTO(final ResDistrictWard resDistrictWard,
            final ResDistrictWardDTO resDistrictWardDTO) {
        resDistrictWardDTO.setId(resDistrictWard.getId());
        resDistrictWardDTO.setName(resDistrictWard.getName());
        resDistrictWardDTO.setCode(resDistrictWard.getCode());
        resDistrictWardDTO.setDistrict(resDistrictWard.getDistrict() == null ? null : resDistrictWard.getDistrict().getId());
        return resDistrictWardDTO;
    }

    private ResDistrictWard mapToEntity(final ResDistrictWardDTO resDistrictWardDTO,
            final ResDistrictWard resDistrictWard) {
        resDistrictWard.setName(resDistrictWardDTO.getName());
        resDistrictWard.setCode(resDistrictWardDTO.getCode());
        final ResDistrict district = resDistrictWardDTO.getDistrict() == null ? null : resDistrictRepository.findById(resDistrictWardDTO.getDistrict())
                .orElseThrow(() -> new NotFoundException("district not found"));
        resDistrictWard.setDistrict(district);
        return resDistrictWard;
    }

    public boolean codeExists(final String code) {
        return resDistrictWardRepository.existsByCodeIgnoreCase(code);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final ResDistrictWard resDistrictWard = resDistrictWardRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final ResLocation districWardResLocation = resLocationRepository.findFirstByDistricWard(resDistrictWard);
        if (districWardResLocation != null) {
            referencedWarning.setKey("resDistrictWard.resLocation.districWard.referenced");
            referencedWarning.addParam(districWardResLocation.getId());
            return referencedWarning;
        }
        final HrEmployee wardHrEmployee = hrEmployeeRepository.findFirstByWard(resDistrictWard);
        if (wardHrEmployee != null) {
            referencedWarning.setKey("resDistrictWard.hrEmployee.ward.referenced");
            referencedWarning.addParam(wardHrEmployee.getId());
            return referencedWarning;
        }
        return null;
    }

}
