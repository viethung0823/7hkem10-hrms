package io.saugio50.hrm.service;

import io.saugio50.hrm.domain.HrJobPosition;
import io.saugio50.hrm.domain.ResDistrict;
import io.saugio50.hrm.domain.ResDistrictWard;
import io.saugio50.hrm.domain.ResLocation;
import io.saugio50.hrm.domain.ResProvince;
import io.saugio50.hrm.model.ResLocationDTO;
import io.saugio50.hrm.repos.HrJobPositionRepository;
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
public class ResLocationService {

    private final ResLocationRepository resLocationRepository;
    private final ResDistrictWardRepository resDistrictWardRepository;
    private final ResProvinceRepository resProvinceRepository;
    private final ResDistrictRepository resDistrictRepository;
    private final HrJobPositionRepository hrJobPositionRepository;

    public ResLocationService(final ResLocationRepository resLocationRepository,
            final ResDistrictWardRepository resDistrictWardRepository,
            final ResProvinceRepository resProvinceRepository,
            final ResDistrictRepository resDistrictRepository,
            final HrJobPositionRepository hrJobPositionRepository) {
        this.resLocationRepository = resLocationRepository;
        this.resDistrictWardRepository = resDistrictWardRepository;
        this.resProvinceRepository = resProvinceRepository;
        this.resDistrictRepository = resDistrictRepository;
        this.hrJobPositionRepository = hrJobPositionRepository;
    }

    public List<ResLocationDTO> findAll() {
        final List<ResLocation> resLocations = resLocationRepository.findAll(Sort.by("id"));
        return resLocations.stream()
                .map(resLocation -> mapToDTO(resLocation, new ResLocationDTO()))
                .toList();
    }

    public ResLocationDTO get(final Long id) {
        return resLocationRepository.findById(id)
                .map(resLocation -> mapToDTO(resLocation, new ResLocationDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ResLocationDTO resLocationDTO) {
        final ResLocation resLocation = new ResLocation();
        mapToEntity(resLocationDTO, resLocation);
        return resLocationRepository.save(resLocation).getId();
    }

    public void update(final Long id, final ResLocationDTO resLocationDTO) {
        final ResLocation resLocation = resLocationRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(resLocationDTO, resLocation);
        resLocationRepository.save(resLocation);
    }

    public void delete(final Long id) {
        resLocationRepository.deleteById(id);
    }

    private ResLocationDTO mapToDTO(final ResLocation resLocation,
            final ResLocationDTO resLocationDTO) {
        resLocationDTO.setId(resLocation.getId());
        resLocationDTO.setName(resLocation.getName());
        resLocationDTO.setLatitude(resLocation.getLatitude());
        resLocationDTO.setLongitude(resLocation.getLongitude());
        resLocationDTO.setStreet(resLocation.getStreet());
        resLocationDTO.setDistricWard(resLocation.getDistricWard() == null ? null : resLocation.getDistricWard().getId());
        resLocationDTO.setProvince(resLocation.getProvince() == null ? null : resLocation.getProvince().getId());
        resLocationDTO.setDistrict(resLocation.getDistrict() == null ? null : resLocation.getDistrict().getId());
        return resLocationDTO;
    }

    private ResLocation mapToEntity(final ResLocationDTO resLocationDTO,
            final ResLocation resLocation) {
        resLocation.setName(resLocationDTO.getName());
        resLocation.setLatitude(resLocationDTO.getLatitude());
        resLocation.setLongitude(resLocationDTO.getLongitude());
        resLocation.setStreet(resLocationDTO.getStreet());
        final ResDistrictWard districWard = resLocationDTO.getDistricWard() == null ? null : resDistrictWardRepository.findById(resLocationDTO.getDistricWard())
                .orElseThrow(() -> new NotFoundException("districWard not found"));
        resLocation.setDistricWard(districWard);
        final ResProvince province = resLocationDTO.getProvince() == null ? null : resProvinceRepository.findById(resLocationDTO.getProvince())
                .orElseThrow(() -> new NotFoundException("province not found"));
        resLocation.setProvince(province);
        final ResDistrict district = resLocationDTO.getDistrict() == null ? null : resDistrictRepository.findById(resLocationDTO.getDistrict())
                .orElseThrow(() -> new NotFoundException("district not found"));
        resLocation.setDistrict(district);
        return resLocation;
    }

    public boolean districWardExists(final Long id) {
        return resLocationRepository.existsByDistricWardId(id);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final ResLocation resLocation = resLocationRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final HrJobPosition locationHrJobPosition = hrJobPositionRepository.findFirstByLocation(resLocation);
        if (locationHrJobPosition != null) {
            referencedWarning.setKey("resLocation.hrJobPosition.location.referenced");
            referencedWarning.addParam(locationHrJobPosition.getId());
            return referencedWarning;
        }
        return null;
    }

}
