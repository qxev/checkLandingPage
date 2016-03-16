package helper;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * 说明字段是否是货币字段，以及货币的符号，对于这些字段在出报表和导出excel时需要除以10000倍，这点需要注意
 * 
 * @author david
 * 
 */
@Target(FIELD)
@Retention(RUNTIME)
public @interface Currency {

	String value() default "";

}
