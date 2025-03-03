package io.saugio50.hrm.model;

import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ResLocationDTO {

    private Long id;

    @Size(max = 255)
    private String name;

    private Long latitude;

    private Long longitude;

    @Size(max = 255)
    private String street;

    @ResLocationDistricWardUnique
    private Long districWard;

    private Long province;

    private UUID district;

}
