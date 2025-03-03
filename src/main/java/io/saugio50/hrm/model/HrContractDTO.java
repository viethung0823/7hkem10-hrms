package io.saugio50.hrm.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class HrContractDTO {

    private Long id;

    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String code;

    private LocalDate dateFrom;

    private LocalDate dateTo;

    @Size(max = 255)
    private String salary;

    private Map<String, String> status;

    private Long employee;

    @NotNull
    private Long contractType;

    @NotNull
    private Long jobPosition;

    @NotNull
    private Long jobTitle;

    @NotNull
    private Long department;

    @NotNull
    private Long company;

}
