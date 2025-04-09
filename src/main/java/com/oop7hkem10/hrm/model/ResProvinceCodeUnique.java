package com.oop7hkem10.hrm.model;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import com.oop7hkem10.hrm.service.ResProvinceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Map;
import org.springframework.web.servlet.HandlerMapping;


/**
 * Validate that the code value isn't taken yet.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = ResProvinceCodeUnique.ResProvinceCodeUniqueValidator.class
)
public @interface ResProvinceCodeUnique {

    String message() default "{Exists.resProvince.code}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class ResProvinceCodeUniqueValidator implements ConstraintValidator<ResProvinceCodeUnique, String> {

        private final ResProvinceService resProvinceService;
        private final HttpServletRequest request;

        public ResProvinceCodeUniqueValidator(final ResProvinceService resProvinceService,
                final HttpServletRequest request) {
            this.resProvinceService = resProvinceService;
            this.request = request;
        }

        @Override
        public boolean isValid(final String value, final ConstraintValidatorContext cvContext) {
            if (value == null) {
                // no value present
                return true;
            }
            @SuppressWarnings("unchecked") final Map<String, String> pathVariables =
                    ((Map<String, String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE));
            final String currentId = pathVariables.get("id");
            if (currentId != null && value.equalsIgnoreCase(resProvinceService.get(Long.parseLong(currentId)).getCode())) {
                // value hasn't changed
                return true;
            }
            return !resProvinceService.codeExists(value);
        }

    }

}
