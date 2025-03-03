package io.nutchai.hrm.model;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import io.nutchai.hrm.service.ResLocationService;
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
 * Validate that the id value isn't taken yet.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = ResLocationDistricWardUnique.ResLocationDistricWardUniqueValidator.class
)
public @interface ResLocationDistricWardUnique {

    String message() default "{Exists.resLocation.distric-ward}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class ResLocationDistricWardUniqueValidator implements ConstraintValidator<ResLocationDistricWardUnique, Long> {

        private final ResLocationService resLocationService;
        private final HttpServletRequest request;

        public ResLocationDistricWardUniqueValidator(final ResLocationService resLocationService,
                final HttpServletRequest request) {
            this.resLocationService = resLocationService;
            this.request = request;
        }

        @Override
        public boolean isValid(final Long value, final ConstraintValidatorContext cvContext) {
            if (value == null) {
                // no value present
                return true;
            }
            @SuppressWarnings("unchecked") final Map<String, String> pathVariables =
                    ((Map<String, String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE));
            final String currentId = pathVariables.get("id");
            if (currentId != null && value.equals(resLocationService.get(Long.parseLong(currentId)).getDistricWard())) {
                // value hasn't changed
                return true;
            }
            return !resLocationService.districWardExists(value);
        }

    }

}
