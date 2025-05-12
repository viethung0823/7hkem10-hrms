package com.oop7hkem10.hrm.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class HrJobPositionDTO {

    private Long id;

    @Size(max = 255)
    private String name;

    @JsonProperty("isRecruiting")
    private Boolean isRecruiting;

    private Integer targetRecruitment;

    private String jobSummary;

    @NotNull
    private Long company;

    private Long department;

    private Long location;

}
