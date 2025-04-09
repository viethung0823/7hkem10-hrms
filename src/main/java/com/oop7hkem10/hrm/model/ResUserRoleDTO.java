package com.oop7hkem10.hrm.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ResUserRoleDTO {

    private Long id;

    @Size(max = 255)
    private String name;

}
