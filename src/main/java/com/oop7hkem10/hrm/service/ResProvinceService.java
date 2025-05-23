package com.oop7hkem10.hrm.service;

import com.oop7hkem10.hrm.domain.HrEmployee;
import com.oop7hkem10.hrm.domain.ResDistrict;
import com.oop7hkem10.hrm.domain.ResLocation;
import com.oop7hkem10.hrm.domain.ResProvince;
import com.oop7hkem10.hrm.model.ResProvinceDTO;
import com.oop7hkem10.hrm.repos.HrEmployeeRepository;
import com.oop7hkem10.hrm.repos.ResDistrictRepository;
import com.oop7hkem10.hrm.repos.ResLocationRepository;
import com.oop7hkem10.hrm.repos.ResProvinceRepository;
import com.oop7hkem10.hrm.util.NotFoundException;
import com.oop7hkem10.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ResProvinceService {

    private final ResProvinceRepository resProvinceRepository;
    private final ResDistrictRepository resDistrictRepository;
    private final ResLocationRepository resLocationRepository;
    private final HrEmployeeRepository hrEmployeeRepository;

    public ResProvinceService(final ResProvinceRepository resProvinceRepository,
            final ResDistrictRepository resDistrictRepository,
            final ResLocationRepository resLocationRepository,
            final HrEmployeeRepository hrEmployeeRepository) {
        this.resProvinceRepository = resProvinceRepository;
        this.resDistrictRepository = resDistrictRepository;
        this.resLocationRepository = resLocationRepository;
        this.hrEmployeeRepository = hrEmployeeRepository;
    }

    public List<ResProvinceDTO> findAll() {
        final List<ResProvince> resProvinces = resProvinceRepository.findAll(Sort.by("id"));
        return resProvinces.stream()
                .map(resProvince -> mapToDTO(resProvince, new ResProvinceDTO()))
                .toList();
    }

    public ResProvinceDTO get(final Long id) {
        return resProvinceRepository.findById(id)
                .map(resProvince -> mapToDTO(resProvince, new ResProvinceDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ResProvinceDTO resProvinceDTO) {
        final ResProvince resProvince = new ResProvince();
        mapToEntity(resProvinceDTO, resProvince);
        return resProvinceRepository.save(resProvince).getId();
    }

    public void update(final Long id, final ResProvinceDTO resProvinceDTO) {
        final ResProvince resProvince = resProvinceRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(resProvinceDTO, resProvince);
        resProvinceRepository.save(resProvince);
    }

    public void delete(final Long id) {
        resProvinceRepository.deleteById(id);
    }

    private ResProvinceDTO mapToDTO(final ResProvince resProvince,
            final ResProvinceDTO resProvinceDTO) {
        resProvinceDTO.setId(resProvince.getId());
        resProvinceDTO.setName(resProvince.getName());
        resProvinceDTO.setCode(resProvince.getCode());
        return resProvinceDTO;
    }

    private ResProvince mapToEntity(final ResProvinceDTO resProvinceDTO,
            final ResProvince resProvince) {
        resProvince.setName(resProvinceDTO.getName());
        resProvince.setCode(resProvinceDTO.getCode());
        return resProvince;
    }

    public boolean codeExists(final String code) {
        return resProvinceRepository.existsByCodeIgnoreCase(code);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final ResProvince resProvince = resProvinceRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final ResDistrict provinceResDistrict = resDistrictRepository.findFirstByProvince(resProvince);
        if (provinceResDistrict != null) {
            referencedWarning.setKey("resProvince.resDistrict.province.referenced");
            referencedWarning.addParam(provinceResDistrict.getId());
            return referencedWarning;
        }
        final ResLocation provinceResLocation = resLocationRepository.findFirstByProvince(resProvince);
        if (provinceResLocation != null) {
            referencedWarning.setKey("resProvince.resLocation.province.referenced");
            referencedWarning.addParam(provinceResLocation.getId());
            return referencedWarning;
        }
        final HrEmployee provinceHrEmployee = hrEmployeeRepository.findFirstByProvince(resProvince);
        if (provinceHrEmployee != null) {
            referencedWarning.setKey("resProvince.hrEmployee.province.referenced");
            referencedWarning.addParam(provinceHrEmployee.getId());
            return referencedWarning;
        }
        return null;
    }

}
