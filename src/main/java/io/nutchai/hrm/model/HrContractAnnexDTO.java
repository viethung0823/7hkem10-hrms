package io.nutchai.hrm.model;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class HrContractAnnexDTO {

    private Long id;

    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String number;

    @Size(max = 255)
    private String content;

    private LocalDate dateEfective;

    private Long contract;

}
