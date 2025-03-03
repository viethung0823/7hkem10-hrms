package io.nutchai.hrm.model;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import io.nutchai.hrm.service.ResUserService;
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
 * Validate that the username value isn't taken yet.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = ResUserUsernameUnique.ResUserUsernameUniqueValidator.class
)
public @interface ResUserUsernameUnique {

    String message() default "{exists.resUser.username}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class ResUserUsernameUniqueValidator implements ConstraintValidator<ResUserUsernameUnique, String> {

        private final ResUserService resUserService;
        private final HttpServletRequest request;

        public ResUserUsernameUniqueValidator(final ResUserService resUserService,
                final HttpServletRequest request) {
            this.resUserService = resUserService;
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
            if (currentId != null && value.equalsIgnoreCase(resUserService.get(Long.parseLong(currentId)).getUsername())) {
                // value hasn't changed
                return true;
            }
            return !resUserService.usernameExists(value);
        }

    }

}
