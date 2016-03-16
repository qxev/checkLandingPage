package helper;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * 指定表格列的内容对齐方式
 * 
 * @author david
 * 
 */
@Target(FIELD)
@Retention(RUNTIME)
public @interface Align {
	public static enum Position {
		LEFT, RIGHT, CENTER
	};

	Position value() default Position.CENTER;
}
