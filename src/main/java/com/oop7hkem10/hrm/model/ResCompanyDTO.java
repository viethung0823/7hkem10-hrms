package com.oop7hkem10.hrm.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ResCompanyDTO {

    private Long id;

    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String address;

    @Size(max = 255)
    private String phone;

    @Size(max = 255)
    private String email;

    @Size(max = 255)
    private String website;

    @Size(max = 255)
    private String taxCode;

}
