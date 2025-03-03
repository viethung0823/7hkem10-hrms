package io.nutchai.hrm.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class HrContractTypeDTO {

    private Long id;

    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String code;

    @JsonProperty("isUnlimited")
    private Boolean isUnlimited;

    @JsonProperty("isProbationaryContract")
    private Boolean isProbationaryContract;

}
