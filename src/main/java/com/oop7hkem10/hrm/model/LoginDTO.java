package com.oop7hkem10.hrm.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class LoginDTO {

    @NotNull
    @Size(max = 255)
    @ResUserUsernameUnique
    private String username;

    @NotNull
    @Size(max = 255)
    private String password;
}
