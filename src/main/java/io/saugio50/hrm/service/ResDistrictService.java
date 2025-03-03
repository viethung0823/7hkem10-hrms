package io.saugio50.hrm.service;

import io.saugio50.hrm.domain.HrEmployee;
import io.saugio50.hrm.domain.ResDistrict;
import io.saugio50.hrm.domain.ResDistrictWard;
import io.saugio50.hrm.domain.ResLocation;
import io.saugio50.hrm.domain.ResProvince;
import io.saugio50.hrm.model.ResDistrictDTO;
import io.saugio50.hrm.repos.HrEmployeeRepository;
import io.saugio50.hrm.repos.ResDistrictRepository;
import io.saugio50.hrm.repos.ResDistrictWardRepository;
import io.saugio50.hrm.repos.ResLocationRepository;
import io.saugio50.hrm.repos.ResProvinceRepository;
import io.saugio50.hrm.util.NotFoundException;
import io.saugio50.hrm.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ResDistrictService {

    private final ResDistrictRepository resDistrictRepository;
    private final ResProvinceRepository resProvinceRepository;
    private final ResDistrictWardRepository resDistrictWardRepository;
    private final ResLocationRepository resLocationRepository;
    private final HrEmployeeRepository hrEmployeeRepository;

    public ResDistrictService(final ResDistrictRepository resDistrictRepository,
            final ResProvinceRepository resProvinceRepository,
            final ResDistrictWardRepository resDistrictWardRepository,
            final ResLocationRepository resLocationRepository,
            final HrEmployeeRepository hrEmployeeRepository) {
        this.resDistrictRepository = resDistrictRepository;
        this.resProvinceRepository = resProvinceRepository;
        this.resDistrictWardRepository = resDistrictWardRepository;
        this.resLocationRepository = resLocationRepository;
        this.hrEmployeeRepository = hrEmployeeRepository;
    }

    public List<ResDistrictDTO> findAll() {
        final List<ResDistrict> resDistricts = resDistrictRepository.findAll(Sort.by("id"));
        return resDistricts.stream()
                .map(resDistrict -> mapToDTO(resDistrict, new ResDistrictDTO()))
                .toList();
    }

    public ResDistrictDTO get(final Long id) {
        return resDistrictRepository.findById(id)
                .map(resDistrict -> mapToDTO(resDistrict, new ResDistrictDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ResDistrictDTO resDistrictDTO) {
        final ResDistrict resDistrict = new ResDistrict();
        mapToEntity(resDistrictDTO, resDistrict);
        return resDistrictRepository.save(resDistrict).getId();
    }

    public void update(final Long id, final ResDistrictDTO resDistrictDTO) {
        final ResDistrict resDistrict = resDistrictRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(resDistrictDTO, resDistrict);
        resDistrictRepository.save(resDistrict);
    }

    public void delete(final Long id) {
        resDistrictRepository.deleteById(id);
    }

    private ResDistrictDTO mapToDTO(final ResDistrict resDistrict,
            final ResDistrictDTO resDistrictDTO) {
        resDistrictDTO.setId(resDistrict.getId());
        resDistrictDTO.setName(resDistrict.getName());
        resDistrictDTO.setCode(resDistrict.getCode());
        resDistrictDTO.setProvince(resDistrict.getProvince() == null ? null : resDistrict.getProvince().getId());
        return resDistrictDTO;
    }

    private ResDistrict mapToEntity(final ResDistrictDTO resDistrictDTO,
            final ResDistrict resDistrict) {
        resDistrict.setName(resDistrictDTO.getName());
        resDistrict.setCode(resDistrictDTO.getCode());
        final ResProvince province = resDistrictDTO.getProvince() == null ? null : resProvinceRepository.findById(resDistrictDTO.getProvince())
                .orElseThrow(() -> new NotFoundException("province not found"));
        resDistrict.setProvince(province);
        return resDistrict;
    }

    public boolean codeExists(final String code) {
        return resDistrictRepository.existsByCodeIgnoreCase(code);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final ResDistrict resDistrict = resDistrictRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final ResDistrictWard districtResDistrictWard = resDistrictWardRepository.findFirstByDistrict(resDistrict);
        if (districtResDistrictWard != null) {
            referencedWarning.setKey("resDistrict.resDistrictWard.district.referenced");
            referencedWarning.addParam(districtResDistrictWard.getId());
            return referencedWarning;
        }
        final ResLocation districtResLocation = resLocationRepository.findFirstByDistrict(resDistrict);
        if (districtResLocation != null) {
            referencedWarning.setKey("resDistrict.resLocation.district.referenced");
            referencedWarning.addParam(districtResLocation.getId());
            return referencedWarning;
        }
        final HrEmployee districtHrEmployee = hrEmployeeRepository.findFirstByDistrict(resDistrict);
        if (districtHrEmployee != null) {
            referencedWarning.setKey("resDistrict.hrEmployee.district.referenced");
            referencedWarning.addParam(districtHrEmployee.getId());
            return referencedWarning;
        }
        return null;
    }

}
