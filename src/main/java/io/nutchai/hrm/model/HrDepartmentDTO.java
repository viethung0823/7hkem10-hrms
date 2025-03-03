package io.nutchai.hrm.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class HrDepartmentDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    @HrDepartmentCodeUnique
    private String code;

    @NotNull
    @Size(max = 255)
    private String name;

    private Long parent;

    @NotNull
    private Long company;

}
