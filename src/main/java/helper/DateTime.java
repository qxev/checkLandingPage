package helper;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * 指定表格列的内容为日期, 并指定日期格式
 * 
 * @author david
 * 
 */
@Target(FIELD)
@Retention(RUNTIME)
public @interface DateTime {

	String value() default "yyyy-MM-dd HH:mm:ss";

}
