package io.nutchai.hrm.service;

import io.nutchai.hrm.domain.HrEmployee;
import io.nutchai.hrm.domain.ResDistrict;
import io.nutchai.hrm.domain.ResLocation;
import io.nutchai.hrm.domain.ResProvince;
import io.nutchai.hrm.model.ResProvinceDTO;
import io.nutchai.hrm.repos.HrEmployeeRepository;
import io.nutchai.hrm.repos.ResDistrictRepository;
import io.nutchai.hrm.repos.ResLocationRepository;
import io.nutchai.hrm.repos.ResProvinceRepository;
import io.nutchai.hrm.util.NotFoundException;
import io.nutchai.hrm.util.ReferencedWarning;
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
